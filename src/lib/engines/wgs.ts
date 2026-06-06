import type { DecisionTree } from './types';

export const wgsTree: DecisionTree = {
  culture_purity: {
    id: 'culture_purity', step: 1, total: 11, type: 'q',
    cat: 'PRE-SEQUENCING', title: 'Culture Integrity Check',
    q: 'Is your bacterial isolate a pure culture?',
    hint: 'Check: single colony morphology on non-selective agar, consistent Gram stain, single 16S amplicon',
    opts: [
      { id: 'pure', label: 'Yes — pure culture confirmed', sub: 'Single colony, consistent morphology and staining results', next: 'project_goal' },
      { id: 'mixed', label: 'No / Uncertain — mixed culture suspected', sub: 'Multiple morphologies, inconsistent staining, or uncertain purity', next: 'restreak', w: true },
    ],
  },

  restreak: {
    id: 'restreak', type: 'block', isE: false,
    cat: 'ACTION REQUIRED', title: 'Re-streak Required', icon: '⚠',
    body: 'Do not proceed to WGS with a mixed culture. Sequencing a mixed culture produces chimeric assemblies, inflated genome sizes, false BGC predictions, and incorrect ANI results.',
    steps: [
      'Re-streak on non-selective agar for 3–4 serial passes',
      'Pick a well-isolated single colony each time',
      'Verify purity via Gram stain and colony morphology',
      'Consider Sanger 16S sequencing to confirm single-organism identity',
    ],
    tools: ['Sanger 16S sequencing', 'EzBioCloud BLAST', 'NCBI 16S BLAST', 'BHI / R2A / MacConkey agar'],
    act: '← Return — start with a pure culture', next: 'culture_purity',
  },

  project_goal: {
    id: 'project_goal', step: 2, total: 11, type: 'q',
    cat: 'PROJECT OBJECTIVE', title: 'Primary Sequencing Goal',
    q: 'What is your primary scientific objective?',
    hint: 'This determines technology choice, sequencing depth, and downstream analysis pipeline',
    opts: [
      { id: 'species_id', label: 'Species Identification', badge: 'Taxonomy', sub: 'Confirm organism identity at species and strain level', next: 'prescreening' },
      { id: 'bgc', label: 'BGC / Secondary Metabolite Discovery', badge: 'Drug Discovery', sub: 'Mine biosynthetic gene clusters for bioactive compounds', next: 'bgc_rec', hi: true },
      { id: 'draft', label: 'Draft Genome Assembly', badge: 'Genomics', sub: 'Annotated draft genome as the primary deliverable', next: 'tech_select' },
      { id: 'complete', label: 'Complete / Closed Genome', badge: 'Publication', sub: 'Closed chromosome and plasmid resolution for publication', next: 'complete_rec' },
      { id: 'amr', label: 'AMR / Virulence Profiling', badge: 'Clinical', sub: 'Comprehensive resistance and virulence gene characterization', next: 'amr_rec' },
      { id: 'comparative', label: 'Comparative Genomics / Phylogenomics', badge: 'Evolution', sub: 'Population structure, pangenome, and SNP-level analysis', next: 'tech_select' },
    ],
  },

  prescreening: {
    id: 'prescreening', step: 3, total: 11, type: 'q',
    cat: '16S PRE-SCREENING', title: '16S rRNA Pre-Screening',
    q: 'Do you need a preliminary taxonomy screen before committing to WGS?',
    hint: '16S is rapid (<48 h) and inexpensive — ideal for large collections or budget-limited early-phase work',
    opts: [
      { id: 'yes16s', label: 'Yes — 16S first, WGS if warranted', sub: 'Large collection, limited budget, or initial screening phase', next: 'sixteen_s' },
      { id: 'direct', label: 'No — proceed directly to WGS', sub: 'Funding available, strain-level resolution required', next: 'tech_select' },
    ],
  },

  sixteen_s: {
    id: 'sixteen_s', step: 3, total: 11, type: 'info',
    cat: '16S INTERPRETATION', title: 'Interpreting 16S Identity',
    tbl: [
      { v: '>99%', m: 'Likely same species — confirmed', s: 'c-g' },
      { v: '97–99%', m: 'Same genus, species uncertain', s: 'c-y' },
      { v: '<97%', m: 'Potential novel species candidate', s: 'c-o' },
      { v: '<95%', m: 'Potential novel genus', s: 'c-r' },
    ],
    caution: '16S cannot distinguish E. coli from Shigella, many Bacillus spp., or closely related Streptomyces. WGS is always the gold standard for final taxonomy.',
    tools: ['SILVA (v138.1)', 'EzBioCloud BLAST', 'NCBI BLAST 16S', 'MAFFT (alignment)', 'ARB database', 'LPSN'],
    act: 'Proceed to WGS planning →', next: 'tech_select',
  },

  bgc_rec: {
    id: 'bgc_rec', step: 3, total: 11, type: 'rec',
    cat: 'BGC DISCOVERY', title: 'Hybrid Sequencing Recommended',
    tagline: 'Short reads alone will fragment your PKS / NRPS clusters.',
    pts: [
      'PKS and NRPS biosynthetic modules contain long tandem repeats that short-read assemblers cannot span',
      'Begin with Illumina PE150 (100×) — run antiSMASH immediately to assess BGC fragmentation across contigs',
      'If BGCs are split or PKS/NRPS modules are incomplete, add Nanopore R10.4 (30–60×) for hybrid assembly',
      'Unicycler hybrid mode significantly improves BGC continuity and completeness in marine isolates',
    ],
    tools: ['Illumina PE150 (100×)', 'Nanopore R10.4 (30–60×)', 'SPAdes / Unicycler', 'antiSMASH 7', 'GECCO', 'BiG-SCAPE / BiG-SLICE', 'ARTS2', 'MIBiG Database', 'PRISM 4'],
    act: 'Configure sequencing →', next: 'tech_select',
  },

  complete_rec: {
    id: 'complete_rec', step: 3, total: 11, type: 'rec',
    cat: 'GENOME CLOSURE', title: 'Long Reads Required for Closed Genomes',
    tagline: 'Short reads cannot resolve repeats, rRNA operons, or large plasmids.',
    pts: [
      'Nanopore R10.4 or PacBio HiFi routinely achieves full chromosome closure in a single run',
      'Combine with Illumina short reads for accuracy polishing — Polypolish then Medaka',
      'Large plasmids and IS element arrays require long reads for correct topological assembly',
      'Closed genomes are increasingly required for valid novel species descriptions',
    ],
    tools: ['Nanopore R10.4 / PacBio HiFi', 'Illumina PE150 (polish)', 'Flye / Canu', 'hifiasm', 'Verkko', 'Medaka', 'Polypolish', 'MOB-suite'],
    act: 'Configure sequencing →', next: 'tech_select',
  },

  amr_rec: {
    id: 'amr_rec', step: 3, total: 11, type: 'rec',
    cat: 'AMR PROFILING', title: 'Short Reads Sufficient for AMR Analysis',
    tagline: 'Illumina is the clinical standard for AMR surveillance.',
    pts: [
      'AMR genes are rarely in highly repetitive regions — short reads assemble them reliably',
      '50–100× Illumina PE150 is sufficient for comprehensive AMR and virulence gene profiling',
      'Add long reads only if plasmid-mediated resistance is suspected (e.g. carbapenem resistance)',
      'Always include MOB-suite and PlasmidFinder for mobile element genetic context',
    ],
    tools: ['Illumina PE150 (50–100×)', 'AMRFinderPlus', 'CARD / RGI', 'ResFinder 4', 'Kleborate', 'PointFinder', 'VFDB', 'MOB-suite', 'PlasmidFinder'],
    act: 'Configure sequencing →', next: 'tech_select',
  },

  tech_select: {
    id: 'tech_select', step: 4, total: 11, type: 'q',
    cat: 'SEQUENCING TECHNOLOGY', title: 'Sequencing Technology',
    q: 'Which sequencing approach will you use?',
    hint: 'Technology selection is guided by your objective. Hybrid is recommended for complete genomes and BGC discovery.',
    opts: [
      { id: 'illumina', label: 'Illumina PE150 — short reads only', badge: 'Cost-effective', sub: 'High accuracy, Q30+, cost-effective. Best for: draft genomes, AMR profiling, taxonomy, comparative genomics', next: 'genome_size' },
      { id: 'hybrid', label: 'Hybrid: Illumina + Nanopore / PacBio', badge: 'Recommended', sub: 'Best for: complete genomes, BGC discovery, plasmid resolution, chromosome closure', next: 'genome_size', hi: true },
      { id: 'long_only', label: 'Long reads only — Nanopore / PacBio', badge: 'Long-read', sub: 'Best for: rapid turnaround, remote field settings, real-time analysis, genome closure', next: 'genome_size' },
    ],
  },

  genome_size: {
    id: 'genome_size', step: 5, total: 11, type: 'q',
    cat: 'COVERAGE ESTIMATION', title: 'Genome Size & Coverage Target',
    q: 'What is your estimated genome size?',
    hint: 'Use k-mer analysis (Jellyfish + GenomeScope2) or check closely related reference genomes in NCBI for a rapid size estimate before committing to a sequencing run.',
    tools: ['Jellyfish 2 (k-mer counting)', 'GenomeScope2 (size estimate)', 'Mash sketch (MinHash)', 'KAT (k-mer analysis toolkit)', 'NCBI Genome Browser'],
    opts: [
      { id: 'small', label: 'Small — < 2 Mb', sub: 'e.g. Mycoplasma, Rickettsia, Spiroplasma', extra: 'Target: 200×+ Illumina (~400+ Mb total)', next: 'coverage_plan' },
      { id: 'standard', label: 'Standard — 2–6 Mb', sub: 'e.g. E. coli, Bacillus, Vibrio, most marine sponge-associated bacteria', extra: 'Target: 80–100× Illumina + 30–50× Nanopore', next: 'coverage_plan' },
      { id: 'large', label: 'Large — > 6 Mb', sub: 'e.g. Streptomyces (8–12 Mb), Burkholderia, large Pseudomonas', extra: 'Target: 80–100× Illumina + 50–60× Nanopore', next: 'coverage_plan' },
    ],
  },

  coverage_plan: {
    id: 'coverage_plan', step: 6, total: 11, type: 'calc',
    cat: 'COVERAGE PLANNING', title: 'How Much Sequencing Do You Need?',
    next: 'qc_gate',
  },

  qc_gate: {
    id: 'qc_gate', step: 7, total: 11, type: 'q',
    cat: 'QC GATEWAY', title: 'Post-Sequencing Quality Control',
    q: 'How do your raw sequencing reads look?',
    hint: 'Run FastQC, Falco, or fastp. Target Q30+ for Illumina. Inspect GC distribution and adapter content.',
    tools: ['FastQC', 'Falco', 'fastp', 'MultiQC', 'NanoStat (Nanopore)', 'NanoPlot (Nanopore)'],
    opts: [
      { id: 'pass', label: 'Good — Q30+, clean adapters, normal GC distribution', sub: 'Proceed to assembly planning', next: 'assembly_choice' },
      { id: 'poor', label: 'Poor quality — low Q scores or adapter contamination', sub: 'Apply quality trimming before assembly', next: 'qc_remedy', w: true },
      { id: 'contam', label: 'Contamination suspected — abnormal GC or multi-modal k-mer spectrum', sub: 'Run Kraken2 immediately — do not assemble', next: 'contam_block', e: true },
    ],
  },

  qc_remedy: {
    id: 'qc_remedy', step: 7, total: 11, type: 'info',
    cat: 'QC REMEDIATION', title: 'Quality Trimming & Adapter Removal',
    body: 'Apply quality filtering with fastp. Target Q20+ per base after trimming. Recheck with FastQC post-trimming before proceeding to assembly.',
    cmd: 'fastp --in1 R1.fastq.gz --in2 R2.fastq.gz \\\n  --out1 R1_clean.fastq.gz \\\n  --out2 R2_clean.fastq.gz \\\n  --cut_front --cut_tail \\\n  --qualified_quality_phred 20 \\\n  --length_required 50 \\\n  --json fastp_report.json \\\n  --html fastp_report.html',
    tools: ['fastp', 'Trimmomatic', 'Cutadapt', 'MultiQC', 'NanoStat', 'NanoPlot', 'Porechop (Nanopore adapters)'],
    act: 'Reads trimmed — continue →', next: 'assembly_choice',
  },

  contam_block: {
    id: 'contam_block', type: 'block', isE: true,
    cat: 'CONTAMINATION DETECTED', title: 'Do Not Proceed to Assembly', icon: '✗',
    body: 'Contaminated reads produce chimeric assemblies, false taxonomic assignments, and invalid biological conclusions. Identify and remove all contaminating taxa before downstream analysis.',
    steps: [
      'Run Kraken2 against standard database to identify contaminating taxa',
      'Use FastQ-Screen for common lab contaminants — PhiX, human, E. coli K-12',
      'If contamination >5%: re-isolate culture from a single colony and re-sequence',
      'If contamination <5%: use Kraken2 + KrakenTools to extract target-organism reads only',
    ],
    tools: ['Kraken2', 'Bracken (abundance)', 'Kaiju', 'FastQ-Screen', 'KrakenTools', 'Decontam (R package)'],
    act: '← Return — re-isolate and re-sequence', next: 'culture_purity',
  },

  assembly_choice: {
    id: 'assembly_choice', step: 8, total: 11, type: 'q',
    cat: 'ASSEMBLY STRATEGY', title: 'Assembly Approach',
    q: 'De novo or reference-based assembly?',
    hint: 'Always attempt de novo first. Reference-based assembly is only appropriate for SNP calling and clinical surveillance.',
    tools: ['SPAdes', 'SKESA', 'Flye (long-read)', 'Unicycler (hybrid)', 'BWA-MEM2 (ref)', 'Bowtie2 (ref)', 'Minimap2 (long-read ref)'],
    opts: [
      { id: 'denovo', label: 'De novo assembly', sub: 'Novel isolates, environmental samples, BGC discovery, taxonomic novelty, publication-quality genomes', next: 'asm_qc', hi: true },
      { id: 'ref_map', label: 'Reference-based mapping', sub: 'SNP calling, outbreak tracking, clinical surveillance, population genomics of known pathogens', next: 'ref_select' },
    ],
  },

  ref_select: {
    id: 'ref_select', step: 8, total: 11, type: 'info',
    cat: 'REFERENCE SELECTION', title: 'Choosing a Reference Genome',
    tbl: [
      { v: 'ANI > 99%', m: 'Excellent reference', s: 'c-g' },
      { v: 'ANI 95–99%', m: 'Acceptable reference', s: 'c-y' },
      { v: 'ANI < 95%', m: 'Poor — switch to de novo', s: 'c-r' },
    ],
    body: 'Prefer RefSeq Complete Genomes and type strain assemblies. Avoid fragmented or unverified environmental references — they introduce systematic mapping errors.',
    tools: ['GTDB-Tk', 'Mash / Sourmash', 'FastANI', 'skani', 'BWA-MEM2', 'Bowtie2', 'Minimap2', 'Snippy (variant calling)'],
    act: 'Reference selected — continue →', next: 'ani_result',
  },

  asm_qc: {
    id: 'asm_qc', step: 9, total: 11, type: 'q',
    cat: 'ASSEMBLY QUALITY', title: 'Assembly Quality Assessment',
    q: 'How does your de novo assembly perform in QUAST + CheckM?',
    hint: 'Target: Completeness >95%, Contamination <5%, high N50, minimal contigs. All assemblies must be polished.',
    tools: ['QUAST', 'CheckM / CheckM2', 'BUSCO v5', 'Bandage (graph viz)', 'assembly-stats'],
    opts: [
      { id: 'good', label: 'High quality — few contigs, N50 >100 kb, completeness >95%', sub: 'Proceed to taxonomic confirmation', next: 'ani_result' },
      { id: 'frag', label: 'Fragmented — many contigs, low N50, BGCs split across contigs', sub: 'Long reads needed — hybrid assembly required', next: 'hybrid_upgrade', w: true },
      { id: 'bad', label: 'Low completeness or high contamination in CheckM', sub: 'Diagnose root cause before proceeding', next: 'asm_diag', e: true },
    ],
  },

  hybrid_upgrade: {
    id: 'hybrid_upgrade', step: 9, total: 11, type: 'rec',
    cat: 'HYBRID UPGRADE', title: 'Add Long Reads for Hybrid Assembly',
    tagline: 'Repetitive regions are fragmenting your contigs.',
    pts: [
      'Target 30–60× Nanopore R10.4 coverage for effective hybrid assembly',
      'Unicycler hybrid mode combines Illumina accuracy with Nanopore spanning capacity',
      'Polish: Medaka (Nanopore error correction) → Polypolish (Illumina short-read polishing)',
      'Re-run antiSMASH post-hybrid — BGC recovery and cluster completeness improves significantly',
    ],
    tools: ['Nanopore R10.4 (30–60×)', 'Unicycler (hybrid)', 'Flye', 'hifiasm', 'Medaka', 'Polypolish', 'Bandage'],
    act: 'Long reads added — continue →', next: 'ani_result',
  },

  asm_diag: {
    id: 'asm_diag', step: 9, total: 11, type: 'q',
    cat: 'ASSEMBLY DIAGNOSIS', title: 'Diagnose Assembly Failure',
    q: 'What appears to be the root cause of the assembly problem?',
    tools: ['QUAST', 'CheckM2', 'Bandage (graph visualization)', 'mosdepth (coverage check)'],
    opts: [
      { id: 'low_cov', label: 'Coverage below 30×', sub: 'Sequence more deeply or add long reads', next: 'hybrid_upgrade' },
      { id: 'contam_a', label: 'Contamination signal in CheckM (>5%)', sub: 'Re-screen reads with Kraken2, re-isolate culture if needed', next: 'contam_block', e: true },
      { id: 'repeat', label: 'Highly repetitive genome structure', sub: 'Long reads are essential — cannot be resolved with short reads alone', next: 'hybrid_upgrade' },
    ],
  },

  ani_result: {
    id: 'ani_result', step: 10, total: 11, type: 'q',
    cat: 'TAXONOMIC CONFIRMATION', title: 'ANI-Based Taxonomic Confirmation',
    q: 'What is your FastANI result against the closest type strain?',
    hint: 'Species boundary ≈ 95–96% ANI (equivalent to ~70% dDDH). Run FastANI or pyANI against the type strain.',
    tools: ['FastANI', 'skani', 'pyANI', 'GTDB-Tk (classify_wf)', 'OAT (Orthologous ANI Tool)'],
    opts: [
      { id: 'same', label: 'ANI > 96% — Same species confirmed', sub: 'Taxonomy confirmed — proceed to annotation', next: 'annot_select' },
      { id: 'gray', label: 'ANI 94–96% — Gray zone', sub: 'Resolve with dDDH and core genome phylogeny', next: 'gray_zone', w: true },
      { id: 'novel', label: 'ANI < 94% — Potential novel species', sub: 'Novel species description may be warranted!', next: 'novel_sp', hi: true },
    ],
  },

  gray_zone: {
    id: 'gray_zone', step: 10, total: 11, type: 'info',
    cat: 'SPECIES BOUNDARY', title: 'Resolving the ANI Gray Zone',
    tbl: [
      { v: 'dDDH > 70%', m: 'Same species — no novel description', s: 'c-g' },
      { v: 'dDDH < 70%', m: 'Novel species candidate', s: 'c-r' },
    ],
    body: 'Apply digital DNA-DNA hybridization (GBDP/TYGS) and core genome phylogeny (Roary + IQ-TREE2) to resolve the species boundary. Phenotypic characterization is required for any formal species description.',
    tools: ['GBDP / TYGS (web server)', 'Roary', 'IQ-TREE2', 'PhyloPhlAn3', 'skani', 'LPSN'],
    act: 'Continue to annotation →', next: 'annot_select',
  },

  novel_sp: {
    id: 'novel_sp', step: 10, total: 11, type: 'rec',
    cat: 'NOVEL SPECIES', title: 'Potential Novel Species Candidate',
    tagline: 'A closed genome is required for valid formal species description.',
    pts: [
      'Confirm ANI <95% against multiple reference genomes from the same genus',
      'Calculate dDDH <70% using GBDP/TYGS web server against type strains',
      'Generate a complete closed genome — required for formal novel species descriptions',
      'Phenotypic characterization (growth, morphology, biochemistry) is mandatory',
      'Validate proposed name via LPSN before submitting the manuscript',
    ],
    tools: ['FastANI', 'skani', 'GBDP/TYGS', 'IQ-TREE2', 'PhyloPhlAn3', 'LPSN'],
    act: 'Continue to annotation →', next: 'annot_select',
  },

  annot_select: {
    id: 'annot_select', step: 11, total: 11, type: 'ms',
    cat: 'ANNOTATION & ANALYSIS', title: 'Downstream Analysis Selection',
    q: 'Select all analyses relevant to your project:',
    note: 'General annotation (Bakta) is always included',
    alwaysLabel: 'General Annotation (always included)',
    alwaysSub: 'Bakta · Prokka · NCBI PGAP',
    opts: [
      { id: 'bgc_a', label: 'BGC / Secondary Metabolite Mining', badge: 'Drug Discovery', tools: ['antiSMASH 7', 'GECCO', 'BiG-SCAPE / BiG-SLICE', 'ARTS2', 'MIBiG', 'PRISM 4'] },
      { id: 'amr_a', label: 'AMR & Virulence Gene Detection', tools: ['AMRFinderPlus', 'CARD / RGI', 'ResFinder 4', 'Kleborate', 'PointFinder', 'VFDB'] },
      { id: 'plasmid_a', label: 'Plasmid & Mobile Element Analysis', tools: ['MOB-suite', 'PlasmidFinder', 'pMLST', 'MobileElementFinder', 'ISfinder'] },
      { id: 'phage_a', label: 'Prophage Detection', tools: ['PHASTER', 'PhiSpy', 'VirSorter2', 'VIBRANT'] },
      { id: 'pan_a', label: 'Comparative / Pan-genomics', tools: ['Roary', 'PGGB', 'Panaroo', 'IQ-TREE2', 'GET_HOMOLOGUES'] },
    ],
    next: 'summary',
  },

  summary: { id: 'summary', type: 'summary', cat: 'COMPLETE', title: 'Your WGS Workflow' },
};
