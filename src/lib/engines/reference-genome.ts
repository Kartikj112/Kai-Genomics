import type { DecisionTree } from './types';

export const referenceGenomeTree: DecisionTree = {
  organism_known: {
    id: 'organism_known', step: 1, total: 7, type: 'q',
    cat: 'ORGANISM IDENTITY', title: 'Is Your Organism Characterized?',
    q: 'How well characterized is the organism you are working with?',
    hint: 'The quality and availability of a reference genome depends entirely on how well-known the organism is',
    opts: [
      { id: 'well_known', label: 'Well-characterized model organism or common pathogen', sub: 'E. coli, Staphylococcus aureus, Pseudomonas aeruginosa, Bacillus subtilis', next: 'reference_availability' },
      { id: 'known_genus', label: 'Genus is known, but strain is novel', sub: 'Isolated from environment, not previously sequenced', next: 'reference_availability' },
      { id: 'novel', label: 'Potentially novel species — low 16S identity to known taxa', sub: 'ANI or 16S below species threshold vs. known relatives', next: 'novel_no_ref' },
      { id: 'unknown', label: 'Identity completely unknown', sub: 'No 16S, no culture data, no prior characterization', next: 'identify_first' },
    ],
  },

  reference_availability: {
    id: 'reference_availability', step: 2, total: 7, type: 'q',
    cat: 'REFERENCE AVAILABILITY', title: 'Reference Genome Availability',
    q: 'Is a complete or high-quality reference genome available in NCBI/GTDB for this organism?',
    hint: 'Search NCBI Assembly database with your organism name. Filter for "Complete Genome" status.',
    tools: ['NCBI Assembly Database', 'GTDB-Tk', 'Mash / Sourmash', 'FastANI'],
    opts: [
      { id: 'complete_ref', label: 'Yes — complete genome(s) available for same or closely related strain', sub: 'RefSeq Complete or Chromosome-level assemblies found', next: 'ani_check' },
      { id: 'draft_only', label: 'Only draft genomes available (scaffold or contig level)', sub: 'No complete/closed assemblies for this organism', next: 'draft_ref_eval' },
      { id: 'no_ref', label: 'No reference genome available for this genus', sub: 'Genus is absent from NCBI RefSeq', next: 'novel_no_ref' },
    ],
  },

  ani_check: {
    id: 'ani_check', step: 3, total: 7, type: 'q',
    cat: 'ANI ASSESSMENT', title: 'ANI Against Reference',
    q: 'What is the ANI between your assembly and the closest available reference?',
    hint: 'Run FastANI or skani. Species threshold is ~95–96%. Below 95% = reference is too distant for reliable mapping.',
    tools: ['FastANI', 'skani', 'Mash (rapid pre-screening)', 'pyANI'],
    opts: [
      { id: 'ani_high', label: 'ANI > 99% — same strain or very closely related', sub: 'Excellent reference quality', next: 'recommend_reference_based', hi: true },
      { id: 'ani_mid', label: 'ANI 95–99% — same species, different strain', sub: 'Acceptable — reference biases possible in variable regions', next: 'reference_bias_warn' },
      { id: 'ani_low', label: 'ANI 90–95% — different species, same genus', sub: 'Risky — consider de novo assembly instead', next: 'recommend_denovo', w: true },
      { id: 'ani_very_low', label: 'ANI < 90% — distantly related', sub: 'Reference is unsuitable — must use de novo assembly', next: 'recommend_denovo', e: true },
    ],
  },

  draft_ref_eval: {
    id: 'draft_ref_eval', step: 3, total: 7, type: 'q',
    cat: 'DRAFT REFERENCE QUALITY', title: 'Evaluating Draft Reference Quality',
    q: 'What is the quality of the best available draft reference genome?',
    hint: 'Check NCBI Assembly stats: N50, contig count, completeness. CheckM score if available.',
    opts: [
      { id: 'good_draft', label: 'Good draft — N50 >100 kb, <50 contigs, completeness >95%', sub: 'Usable for mapping but may miss some regions', next: 'ani_check' },
      { id: 'poor_draft', label: 'Fragmented draft — N50 <10 kb, >200 contigs', sub: 'Too fragmented to serve as a reliable reference', next: 'recommend_denovo' },
    ],
  },

  identify_first: {
    id: 'identify_first', step: 2, total: 7, type: 'block',
    isE: false, icon: '↗',
    cat: 'IDENTIFY FIRST', title: 'Characterize Before Selecting a Reference',
    body: 'You cannot select an appropriate reference genome without first knowing the organism\'s identity. Run 16S Sanger sequencing or Kraken2 on your raw reads before proceeding.',
    steps: [
      'Extract DNA and amplify 16S rRNA gene with universal primers (27F / 1492R)',
      'Sanger sequence and BLAST against NCBI 16S database or EzBioCloud',
      'Alternatively: run Kraken2 on raw Illumina reads for rapid genus/species assignment',
      'Once genus is known, return to this module to select a reference strategy',
    ],
    tools: ['EzBioCloud BLAST', 'NCBI 16S BLAST', 'Kraken2', 'Bracken'],
    act: '← Return with organism identity', next: 'organism_known',
  },

  novel_no_ref: {
    id: 'novel_no_ref', step: 3, total: 7, type: 'rec',
    cat: 'DE NOVO REQUIRED', title: 'No Suitable Reference — De Novo Assembly Required',
    tagline: 'You cannot map to something that does not exist.',
    pts: [
      'Novel species with no close relatives in databases have no valid reference genome — de novo is the only option',
      'Use SPAdes (Illumina), Flye (Nanopore), or Unicycler (hybrid) for de novo assembly',
      'After assembly, your genome becomes the reference — annotate with Bakta and deposit in GenBank',
      'Run GTDB-Tk classify_wf to assign the best possible taxonomy from your de novo assembly',
      'This is also an opportunity — a novel species with a high-quality genome is a publishable discovery',
    ],
    tools: ['SPAdes', 'Flye', 'Unicycler', 'Bakta', 'GTDB-Tk', 'FastANI', 'GBDP/TYGS'],
    act: 'Continue to assembly guidance →', next: 'assembly_approach',
  },

  recommend_reference_based: {
    id: 'recommend_reference_based', step: 4, total: 7, type: 'rec',
    cat: 'RECOMMENDATION', title: 'Reference-Based Assembly — High Confidence',
    tagline: 'An excellent reference exists. Mapping is appropriate.',
    pts: [
      'Map with BWA-MEM2 (short reads) or Minimap2 (long reads) against the selected reference',
      'Call variants with Snippy (for clinical/epidemiological applications) or GATK HaplotypeCaller',
      'Always generate a de novo assembly in parallel — it may reveal large insertions, novel plasmids, or IS elements absent from the reference',
      'Validate reference suitability by checking breadth of coverage — aim for >95% reference covered at >10×',
    ],
    tools: ['BWA-MEM2', 'Minimap2', 'Snippy', 'GATK HaplotypeCaller', 'mosdepth (coverage)', 'samtools', 'Bandage'],
    act: 'Continue →', next: 'reference_checklist',
  },

  reference_bias_warn: {
    id: 'reference_bias_warn', step: 4, total: 7, type: 'info',
    cat: 'REFERENCE BIAS WARNING', title: 'Mapping Bias at 95–99% ANI',
    body: 'At 95–99% ANI, reference mapping will systematically fail in strain-variable regions: prophages, genomic islands, plasmids, and accessory genes. These regions are biologically important.',
    tbl: [
      { v: 'Core genome', m: 'Maps reliably — SNP calling valid in conserved regions', s: 'c-g' },
      { v: 'Accessory genome', m: 'May be absent or misaligned — islands, prophages, plasmids', s: 'c-y' },
      { v: 'Novel regions', m: 'Invisible to reference mapping — always assemble de novo in parallel', s: 'c-r' },
    ],
    caution: 'Never use reference-only mapping for novel species descriptions, BGC discovery, or publication-quality genomics. Always do de novo assembly.',
    tools: ['BWA-MEM2', 'SPAdes (parallel de novo)', 'Snippy', 'Roary (pangenome)', 'Bandage'],
    act: 'Proceed with caution →', next: 'reference_checklist',
  },

  recommend_denovo: {
    id: 'recommend_denovo', step: 4, total: 7, type: 'rec',
    cat: 'RECOMMENDATION', title: 'De Novo Assembly — Reference Too Distant',
    tagline: 'Reference mapping at low ANI introduces more errors than it prevents.',
    pts: [
      'At ANI <95%, reference-guided assembly introduces systematic errors in accessory genome regions',
      'De novo assembly is the correct approach and produces a valid, unbiased genome',
      'SPAdes for Illumina-only; Flye or Unicycler for hybrid — both work well for 80–100× coverage',
      'Your de novo assembly can then be used as a within-study reference for comparative analyses',
    ],
    tools: ['SPAdes', 'Flye', 'Unicycler', 'QUAST', 'CheckM2', 'Bakta'],
    act: 'Continue →', next: 'assembly_approach',
  },

  assembly_approach: {
    id: 'assembly_approach', step: 5, total: 7, type: 'q',
    cat: 'ASSEMBLY DATA', title: 'Available Sequencing Data',
    q: 'What sequencing data do you have for de novo assembly?',
    opts: [
      { id: 'illumina_only', label: 'Illumina short reads only', sub: 'PE150, high accuracy, limited repeat resolution', next: 'illumina_asm_rec' },
      { id: 'nanopore_only', label: 'Nanopore long reads only', sub: 'High N50, good repeat resolution, higher raw error rate', next: 'nanopore_asm_rec' },
      { id: 'hybrid_data', label: 'Both Illumina and Nanopore / PacBio', sub: 'Best of both — accuracy + length', next: 'hybrid_asm_rec', hi: true },
    ],
  },

  illumina_asm_rec: {
    id: 'illumina_asm_rec', step: 6, total: 7, type: 'rec',
    cat: 'ASSEMBLER RECOMMENDATION', title: 'SPAdes for Illumina-Only Assembly',
    tagline: 'SPAdes is the gold standard for bacterial short-read assembly.',
    pts: [
      'SPAdes 4.0 with --careful mode gives accurate draft assemblies for most bacteria at 80–100× coverage',
      'Expect 50–200 contigs for a 4–6 Mb genome — acceptable for most annotation and AMR analysis',
      'N50 typically 50–300 kb for standard 2–6 Mb bacterial genomes at 100× Illumina PE150',
      'Polish with Polypolish to correct systematic Illumina errors in homopolymer regions',
    ],
    tools: ['SPAdes 4.0 (--careful)', 'QUAST', 'CheckM2', 'Polypolish', 'Bakta'],
    act: 'Finish →', next: 'reference_checklist',
  },

  nanopore_asm_rec: {
    id: 'nanopore_asm_rec', step: 6, total: 7, type: 'rec',
    cat: 'ASSEMBLER RECOMMENDATION', title: 'Flye for Nanopore-Only Assembly',
    tagline: 'Flye is the most reliable long-read-only assembler for bacteria.',
    pts: [
      'Flye 2.9 consistently closes bacterial chromosomes with 30–100× Nanopore R10.4 data',
      'Use --nano-hq flag with R10.4 sup-basecalled reads; --nano-raw for older R9.4 data',
      'Polish with Medaka (Nanopore model) — 2 rounds is typical; diminishing returns after round 3',
      'R10.4 "sup" basecalling achieves Q20+ accuracy — significantly fewer polishing iterations needed',
    ],
    tools: ['Flye 2.9', 'Medaka', 'Bandage (assembly graph)', 'QUAST', 'CheckM2'],
    act: 'Finish →', next: 'reference_checklist',
  },

  hybrid_asm_rec: {
    id: 'hybrid_asm_rec', step: 6, total: 7, type: 'rec',
    cat: 'ASSEMBLER RECOMMENDATION', title: 'Unicycler Hybrid for Best Results',
    tagline: 'Unicycler combines Illumina accuracy with Nanopore spanning power.',
    pts: [
      'Unicycler hybrid mode uses Illumina reads as the backbone and Nanopore reads to bridge repeats',
      'Achieves complete genome closure for most bacteria with 30–50× Nanopore + 80–100× Illumina',
      'Polish: Medaka first (Nanopore error correction), then Polypolish (Illumina short-read polishing)',
      'For very large genomes (Streptomyces, >8 Mb): Flye → Polypolish → Medaka may outperform Unicycler',
    ],
    tools: ['Unicycler (hybrid)', 'Flye', 'Medaka', 'Polypolish', 'QUAST', 'CheckM2', 'Bandage'],
    act: 'Finish →', next: 'reference_checklist',
  },

  reference_checklist: {
    id: 'reference_checklist', step: 7, total: 7, type: 'checklist',
    cat: 'REFERENCE QC CHECKLIST', title: 'Reference Selection Checklist',
    intro: 'Check these criteria before proceeding with reference-based analysis or publishing a de novo genome.',
    items: [
      { id: 'ani_checked', label: 'ANI calculated against nearest type strain', required: true, tip: 'Use FastANI or skani — must be >95% for same-species claims' },
      { id: 'ref_complete', label: 'Reference genome is Complete or Chromosome-level (not scaffold)', required: true, tip: 'Check NCBI Assembly level — scaffolds introduce systematic gaps' },
      { id: 'breadth_cov', label: 'Reference coverage breadth >95% at >10×', required: true, tip: 'Use mosdepth to verify — low breadth means reference is unsuitable' },
      { id: 'denovo_parallel', label: 'De novo assembly generated in parallel (even when mapping)', required: false, tip: 'Captures novel regions absent from reference — highly recommended' },
      { id: 'type_strain', label: 'Reference is from a type strain (not environmental or clinical anonymous)', required: false, tip: 'Type strain references are the taxonomic gold standard' },
      { id: 'gtdbtk_run', label: 'GTDB-Tk classify_wf run on de novo assembly', required: false, tip: 'GTDB taxonomy is preferred over NCBI for publication in 2025+' },
    ],
    scoring: {
      low: 'Needs Work — critical checks failed',
      mid: 'Acceptable Draft — proceed with caution',
      high: 'Good Quality — suitable for analysis',
      top: 'Publication Ready — reference strategy is sound',
    },
    next: '__hub__',
  },
};
