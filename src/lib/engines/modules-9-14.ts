import type { DecisionTree } from './types';

// ══════════════════════════════════════════════════
// MODULE 9 — Publication Readiness Checker
// ══════════════════════════════════════════════════
export const pubReadinessTree: DecisionTree = {
  project_type: {
    id: 'project_type', step: 1, total: 5, type: 'q',
    cat: 'PROJECT TYPE', title: 'Publication Readiness Checker',
    q: 'What type of genomics study are you preparing for publication?',
    opts: [
      { id: 'isolate_genome', label: 'Single isolate genome — novel species or strain', sub: 'WGS assembly, annotation, taxonomy', next: 'genome_qc_check' },
      { id: 'mag_study', label: 'Metagenomics / MAG recovery study', sub: 'Environmental metagenome, binning, MAG analysis', next: 'mag_pub_check' },
      { id: 'comparative', label: 'Comparative genomics or pan-genome study', sub: 'Multiple genomes, phylogeny, pangenome analysis', next: 'comparative_check' },
      { id: 'bgc_paper', label: 'Genome mining / BGC discovery paper', sub: 'Natural product discovery from genome analysis', next: 'bgc_pub_check' },
    ],
  },

  genome_qc_check: {
    id: 'genome_qc_check', step: 2, total: 5, type: 'checklist',
    cat: 'GENOME QUALITY CHECKLIST', title: 'Genome Assembly & QC Checklist',
    intro: 'Complete all required items before submitting a genome-based paper.',
    items: [
      { id: 'fastqc', label: 'FastQC / Falco run on raw reads — quality report included in supplementary', required: true },
      { id: 'assembly_stats', label: 'Assembly statistics reported: N50, total length, contig count, largest contig', required: true },
      { id: 'checkm2', label: 'CheckM2 completeness >95% and contamination <5%', required: true, tip: 'CheckM2 is preferred over CheckM for 2025 submissions — uses ML rather than marker gene sets' },
      { id: 'busco', label: 'BUSCO v5 run with appropriate lineage dataset', required: true },
      { id: 'polished', label: 'Assembly polished (Medaka + Polypolish for hybrid; Polypolish for Illumina-only)', required: true },
      { id: 'fastani', label: 'FastANI or skani run against closest type strains', required: true },
      { id: 'gtdbtk', label: 'GTDB-Tk classify_wf taxonomy assigned', required: true },
      { id: 'bakta', label: 'Genome annotated with Bakta (or Prokka / NCBI PGAP)', required: true },
      { id: 'deposited', label: 'Genome deposited in NCBI GenBank or ENA — accession number obtained', required: true },
      { id: 'reads_deposited', label: 'Raw reads deposited in SRA / ENA with BioProject', required: true },
      { id: 'metadata', label: 'Metadata complete: isolation date, GPS, source organism, isolation method', required: true },
      { id: 'ddh', label: 'dDDH calculated via GBDP/TYGS (for novel species descriptions)', required: false, tip: 'Required only if ANI <96% and claiming novel species status' },
      { id: 'phenotype', label: 'Phenotypic characterization included (morphology, biochemistry, growth)', required: false, tip: 'Mandatory for novel species description in IJSEM' },
    ],
    scoring: {
      low: 'Needs Work — not ready for submission',
      mid: 'Draft Stage — fill critical gaps',
      high: 'Nearly Ready — minor items outstanding',
      top: 'Strong Submission Candidate',
    },
    next: 'pub_score_display',
  },

  mag_pub_check: {
    id: 'mag_pub_check', step: 2, total: 5, type: 'checklist',
    cat: 'MAG STUDY CHECKLIST', title: 'Metagenomics & MAG Publication Checklist',
    intro: 'MIMAG and MIMAGs standards must be met for any MAG-based publication.',
    items: [
      { id: 'reads_qc', label: 'FastQC / fastp QC report for all raw read files', required: true },
      { id: 'assembly_reported', label: 'Assembly statistics reported (N50, total length, number of contigs)', required: true },
      { id: 'binning_reported', label: 'Binning algorithm(s) and DAS Tool parameters documented', required: true },
      { id: 'checkm2_all', label: 'CheckM2 run on all bins — completeness and contamination in supplementary table', required: true },
      { id: 'mimag_hq', label: 'HQ MAGs: >90% complete, <5% contamination, 18+ tRNAs, 5S/16S/23S rRNAs present', required: true },
      { id: 'gtdbtk_all', label: 'GTDB-Tk classify_wf run on all MAGs', required: true },
      { id: 'gunc', label: 'GUNC chimera detection run on all HQ MAGs', required: false },
      { id: 'mag_deposited', label: 'All MAGs deposited in NCBI / ENA with accession numbers', required: true },
      { id: 'raw_reads_deposited', label: 'Raw metagenome reads deposited in SRA / ENA', required: true },
      { id: 'sample_metadata', label: 'Full sample metadata: environment, GPS, date, sequencing depth', required: true },
      { id: 'bin_figs', label: 'Bin quality scatter plot (completeness vs contamination) included', required: false },
    ],
    scoring: {
      low: 'Not MIMAG compliant — cannot be published as-is',
      mid: 'Partial compliance — address red items',
      high: 'MIMAG compliant — ready to draft',
      top: 'Comprehensive — model metagenomics paper',
    },
    next: 'pub_score_display',
  },

  comparative_check: {
    id: 'comparative_check', step: 2, total: 5, type: 'checklist',
    cat: 'COMPARATIVE GENOMICS CHECKLIST', title: 'Comparative Genomics Publication Checklist',
    items: [
      { id: 'all_genomes_qc', label: 'CheckM2 quality metrics for all included genomes', required: true },
      { id: 'ani_matrix', label: 'ANI matrix generated for all pairwise combinations', required: true },
      { id: 'phylogeny', label: 'Core genome phylogeny built (IQ-TREE2 or FastTree) with bootstrap support', required: true },
      { id: 'pangenome', label: 'Pangenome analysis completed (Roary, Panaroo, or PGGB)', required: true },
      { id: 'pan_stats', label: 'Pangenome openness tested (Heap\'s law) and core/accessory/unique genome defined', required: true },
      { id: 'all_deposited', label: 'All genomes deposited with NCBI/ENA accession numbers', required: true },
      { id: 'alignment_method', label: 'Multiple sequence alignment method documented (MAFFT, MUSCLE)', required: true },
      { id: 'model_selection', label: 'Evolutionary model selection documented (ModelTest-NG, IQ-TREE automatic)', required: false },
    ],
    scoring: {
      low: 'Not ready — core analyses missing',
      mid: 'Partial — complete pangenome + phylogeny first',
      high: 'Ready to draft',
      top: 'Comprehensive comparative study',
    },
    next: 'pub_score_display',
  },

  bgc_pub_check: {
    id: 'bgc_pub_check', step: 2, total: 5, type: 'checklist',
    cat: 'BGC PAPER CHECKLIST', title: 'Genome Mining Paper Checklist',
    items: [
      { id: 'antismash_ver', label: 'antiSMASH version documented and complete output in supplementary', required: true },
      { id: 'mibig_comparison', label: 'BiG-SCAPE similarity scores against MIBiG reported', required: true },
      { id: 'cluster_completeness', label: 'BGC completeness (complete vs. fragmented) reported for all clusters', required: true },
      { id: 'genome_quality', label: 'Genome quality (completeness, contamination, N50) reported', required: true },
      { id: 'genome_deposited', label: 'Genome deposited in NCBI GenBank with accession', required: true },
      { id: 'bioactivity', label: 'Bioactivity confirmed experimentally (MIC, disk diffusion, LC-MS)', required: false, tip: 'Required for journals claiming biological activity — not for pure bioinformatics papers' },
      { id: 'mibig_submission', label: 'Novel BGCs submitted to MIBiG if experimentally characterized', required: false },
      { id: 'arts2', label: 'ARTS2 run to identify resistance genes near BGCs', required: false },
    ],
    scoring: {
      low: 'Missing core BGC reporting requirements',
      mid: 'Basic BGC paper — add MIBiG comparison',
      high: 'Solid BGC paper',
      top: 'High-impact genome mining study',
    },
    next: 'pub_score_display',
  },

  pub_score_display: {
    id: 'pub_score_display', step: 3, total: 5, type: 'rec',
    cat: 'JOURNAL TARGETING', title: 'Journal Selection by Readiness Level',
    tagline: 'Match your submission to the right journal tier.',
    pts: [
      'Strong Submission Candidate: Aim for Nature Microbiology, ISME J, mSystems, Microbiome, Genome Biology',
      'Publication Ready: Microbiology Spectrum, Frontiers in Microbiology, BMC Genomics, PeerJ',
      'Draft Stage: Strengthen the study design before submission — consult with your supervisor',
      'Novel species papers: IJSEM (International Journal of Systematic and Evolutionary Microbiology) is the required venue for formal novel species descriptions',
      'Data papers (genomes only): Microbiology Resource Announcements (MRA) — low threshold, fast turnaround',
    ],
    tools: ['IJSEM (novel species)', 'Microbiology Resource Announcements (MRA)', 'mSystems', 'ISME J', 'Microbiome'],
    act: 'View data deposition guide →', next: 'data_deposition',
  },

  data_deposition: {
    id: 'data_deposition', step: 4, total: 5, type: 'info',
    cat: 'DATA DEPOSITION', title: 'Data Deposition Requirements',
    body: 'All major journals require raw data and assembled sequences to be publicly deposited before acceptance. Obtain accession numbers before submission.',
    tbl: [
      { v: 'Raw reads', m: 'NCBI SRA or ENA — always required; create BioProject first', s: 'c-g' },
      { v: 'Assembled genome', m: 'NCBI GenBank or ENA — annotated FASTA + GFF submission', s: 'c-g' },
      { v: 'MAG bins', m: 'NCBI GenBank under same BioProject as raw reads', s: 'c-g' },
      { v: 'Novel species', m: 'NCBI GenBank (required before IJSEM submission)', s: 'c-g' },
      { v: 'BGC sequences', m: 'MIBiG database (if experimentally characterized)', s: 'c-y' },
    ],
    tools: ['NCBI BioProject', 'NCBI SRA Submit', 'ENA Webin', 'MIBiG submission portal'],
    act: 'Return to hub →', next: '__hub__',
  },
};

// ══════════════════════════════════════════════════
// MODULE 10 — Bioinformatics Method Recommender
// ══════════════════════════════════════════════════
export const methodRecommenderTree: DecisionTree = {
  research_area: {
    id: 'research_area', step: 1, total: 5, type: 'q',
    cat: 'RESEARCH AREA', title: 'What Is Your Research Focus?',
    q: 'Which area best describes your research question?',
    opts: [
      { id: 'drug_discovery', label: 'Natural product / antibiotic discovery', sub: 'BGC mining, AMP discovery, novel compounds', next: 'drug_discovery_depth' },
      { id: 'microbiome', label: 'Microbiome ecology and diversity', sub: 'Community structure, host-microbe interactions', next: 'microbiome_depth' },
      { id: 'pathogen', label: 'Pathogen genomics and AMR', sub: 'Virulence, resistance, outbreak analysis', next: 'pathogen_depth' },
      { id: 'evolution', label: 'Microbial evolution and phylogenomics', sub: 'Comparative genomics, pangenomes, speciation', next: 'evolution_depth' },
      { id: 'marine', label: 'Marine microbiology and biotechnology', sub: 'Marine isolates, sponge microbiomes, ocean metagenomics', next: 'marine_depth', hi: true },
    ],
  },

  drug_discovery_depth: {
    id: 'drug_discovery_depth', step: 2, total: 5, type: 'q',
    cat: 'DRUG DISCOVERY', title: 'Drug Discovery Focus',
    q: 'What compounds or classes are you targeting?',
    opts: [
      { id: 'bgc_general', label: 'Broad BGC mining — all compound types', sub: 'No specific target, maximum discovery scope', next: 'drug_matrix' },
      { id: 'amp_focus', label: 'Antimicrobial peptides (AMPs)', sub: 'Ribosomally synthesized antimicrobial peptides', next: 'amp_matrix' },
      { id: 'nrps_pks', label: 'NRPS / PKS natural products', sub: 'Non-ribosomal peptides and polyketides', next: 'drug_matrix' },
    ],
  },

  microbiome_depth: {
    id: 'microbiome_depth', step: 2, total: 5, type: 'q',
    cat: 'MICROBIOME', title: 'Microbiome Study Focus',
    q: 'What is the primary question in your microbiome study?',
    opts: [
      { id: 'diversity', label: 'Community composition and diversity', sub: 'Who is there and in what proportion?', next: 'microbiome_matrix' },
      { id: 'function', label: 'Functional prediction and metabolic potential', sub: 'What can this community do?', next: 'microbiome_matrix' },
      { id: 'disease', label: 'Disease associations and biomarkers', sub: 'Dysbiosis, clinical correlations', next: 'microbiome_matrix' },
    ],
  },

  pathogen_depth: {
    id: 'pathogen_depth', step: 2, total: 5, type: 'q',
    cat: 'PATHOGEN GENOMICS', title: 'Pathogen Study Focus',
    q: 'What aspect of pathogen biology are you studying?',
    opts: [
      { id: 'amr_genomics', label: 'Antimicrobial resistance mechanisms', sub: 'AMR genes, mobile elements, plasmid analysis', next: 'pathogen_matrix' },
      { id: 'outbreak', label: 'Outbreak investigation and epidemiology', sub: 'SNP-based clustering, transmission', next: 'pathogen_matrix' },
      { id: 'virulence', label: 'Virulence factors and host interaction', sub: 'Pathogenicity islands, toxins, invasion factors', next: 'pathogen_matrix' },
    ],
  },

  evolution_depth: {
    id: 'evolution_depth', step: 2, total: 5, type: 'q',
    cat: 'EVOLUTION', title: 'Evolutionary Study Focus',
    q: 'What evolutionary questions are you addressing?',
    opts: [
      { id: 'phylogenomics', label: 'Phylogenomics and species-level evolution', sub: 'Multi-genome phylogeny, speciation events', next: 'evolution_matrix' },
      { id: 'pangenome', label: 'Pangenome and gene gain/loss', sub: 'Accessory genome, horizontal gene transfer', next: 'evolution_matrix' },
      { id: 'adaptation', label: 'Adaptive evolution and selection', sub: 'Positive selection, convergent evolution', next: 'evolution_matrix' },
    ],
  },

  marine_depth: {
    id: 'marine_depth', step: 2, total: 5, type: 'q',
    cat: 'MARINE MICROBIOLOGY', title: 'Marine Research Focus',
    q: 'What is your marine microbiology research focus?',
    opts: [
      { id: 'sponge_bgc', label: 'Marine sponge-associated bacteria — drug discovery', sub: 'BGC mining, novel compound discovery', next: 'drug_matrix' },
      { id: 'ocean_meta', label: 'Ocean metagenomics and ecology', sub: 'Seawater, sediment, deep sea communities', next: 'microbiome_matrix' },
      { id: 'marine_isolate', label: 'Marine isolate genomics', sub: 'Novel species, unique metabolic capabilities', next: 'drug_matrix' },
    ],
  },

  drug_matrix: {
    id: 'drug_matrix', step: 3, total: 5, type: 'matrix',
    cat: 'ANALYSIS RECOMMENDATIONS', title: 'Ranked Analysis Opportunities — Drug Discovery',
    intro: 'Ranked by publication potential and feasibility for your research context.',
    rows: [
      { label: 'antiSMASH + BiG-SCAPE BGC analysis', novelty: 4, difficulty: 2, compute: 2, pubPotential: 5, tools: ['antiSMASH 7', 'BiG-SCAPE', 'MIBiG 3.1'], rationale: 'Core analysis for any natural product paper — high publication potential, manageable difficulty' },
      { label: 'Hybrid WGS + complete genome assembly', novelty: 3, difficulty: 3, compute: 3, pubPotential: 5, tools: ['Unicycler', 'Flye', 'Medaka'], rationale: 'Complete genome dramatically increases BGC recovery — required for novel species + high-impact journals' },
      { label: 'ARTS2 resistance gene mining', novelty: 4, difficulty: 2, compute: 1, pubPotential: 4, tools: ['ARTS2', 'antiSMASH'], rationale: 'Identifies BGCs with self-resistance — strong predictor of bioactivity; quick to run' },
      { label: 'LC-MS/MS + GNPS Molecular Networking', novelty: 5, difficulty: 4, compute: 2, pubPotential: 5, tools: ['GNPS', 'MZmine 3', 'SIRIUS'], rationale: 'Moves from prediction to chemistry — major impact increase when combined with genomics' },
      { label: 'AlphaFold2 structure prediction', novelty: 5, difficulty: 3, compute: 4, pubPotential: 4, tools: ['AlphaFold2', 'ColabFold', 'PyMOL'], rationale: 'Adds structural biology dimension — increasingly expected in high-impact natural products papers' },
      { label: 'Heterologous expression & bioassay', novelty: 5, difficulty: 5, compute: 1, pubPotential: 5, tools: ['Streptomyces expression systems', 'MIC assays', 'disk diffusion'], rationale: 'Experimental validation is the gold standard — required for top-tier journals' },
    ],
    next: 'recommendations_summary',
  },

  amp_matrix: {
    id: 'amp_matrix', step: 3, total: 5, type: 'matrix',
    cat: 'ANALYSIS RECOMMENDATIONS', title: 'Ranked Analysis Opportunities — AMP Discovery',
    intro: 'Pipeline for antimicrobial peptide discovery from genomic data.',
    rows: [
      { label: 'Genome mining with AMPSphere / macrel', novelty: 4, difficulty: 2, compute: 2, pubPotential: 4, tools: ['AMPSphere', 'macrel', 'AMPlify'], rationale: 'Systematic AMP prediction from genome / metagenome — high coverage, low compute cost' },
      { label: 'RiPP cluster detection with BAGEL4', novelty: 4, difficulty: 2, compute: 1, pubPotential: 4, tools: ['BAGEL4', 'antiSMASH 7', 'RODEO 2'], rationale: 'Detects ribosomally synthesised peptides missed by AMPSphere — complementary approach' },
      { label: 'AlphaFold2 + molecular docking', novelty: 5, difficulty: 4, compute: 4, pubPotential: 5, tools: ['AlphaFold2', 'AutoDock Vina', 'PyMOL'], rationale: 'Structural prediction adds mechanistic insight to AMP papers' },
      { label: 'Bioactivity screening (MIC / HCI)', novelty: 3, difficulty: 4, compute: 1, pubPotential: 5, tools: ['MIC assay', 'disk diffusion', 'HCI imaging'], rationale: 'Experimental validation transforms a computational paper into a discovery paper' },
    ],
    next: 'recommendations_summary',
  },

  microbiome_matrix: {
    id: 'microbiome_matrix', step: 3, total: 5, type: 'matrix',
    cat: 'ANALYSIS RECOMMENDATIONS', title: 'Ranked Analysis Opportunities — Microbiome',
    intro: 'Ranked by novelty, feasibility, and publication potential for microbiome studies.',
    rows: [
      { label: '16S amplicon + QIIME2 diversity analysis', novelty: 2, difficulty: 2, compute: 2, pubPotential: 3, tools: ['QIIME2', 'DADA2', 'phyloseq'], rationale: 'Foundation of any microbiome paper — necessary but no longer sufficient alone for top journals' },
      { label: 'Shotgun metagenomics + HUMAnN3 function', novelty: 3, difficulty: 3, compute: 3, pubPotential: 4, tools: ['MetaSPAdes', 'HUMAnN3', 'MetaPhlAn4'], rationale: 'Functional profiling + taxonomy in one workflow — now standard for high-impact microbiome papers' },
      { label: 'MAG recovery + novel organism discovery', novelty: 5, difficulty: 4, compute: 4, pubPotential: 5, tools: ['MetaBAT2', 'DAS Tool', 'CheckM2', 'GTDB-Tk'], rationale: 'High novelty — novel MAGs from unique environments are publishable discoveries in their own right' },
      { label: 'ANCOM-BC2 differential abundance', novelty: 3, difficulty: 2, compute: 1, pubPotential: 4, tools: ['ANCOM-BC2', 'ALDEx2', 'MaAsLin2'], rationale: 'Correct statistical approach is now expected — use ANCOM-BC2 not LEfSe for 2025 submissions' },
      { label: 'PICRUSt2 functional prediction', novelty: 2, difficulty: 2, compute: 2, pubPotential: 3, tools: ['PICRUSt2', 'QIIME2 q2-picrust2'], rationale: 'Adds functional dimension to 16S data — acknowledge PICRUSt2 limitations in methods' },
    ],
    next: 'recommendations_summary',
  },

  pathogen_matrix: {
    id: 'pathogen_matrix', step: 3, total: 5, type: 'matrix',
    cat: 'ANALYSIS RECOMMENDATIONS', title: 'Ranked Analysis Opportunities — Pathogen Genomics',
    rows: [
      { label: 'AMRFinderPlus + CARD/RGI AMR typing', novelty: 2, difficulty: 1, compute: 1, pubPotential: 4, tools: ['AMRFinderPlus', 'CARD/RGI', 'ResFinder 4'], rationale: 'Standard for any clinical pathogen paper — must be included' },
      { label: 'Snippy SNP calling + phylogeny', novelty: 3, difficulty: 2, compute: 2, pubPotential: 4, tools: ['Snippy', 'IQ-TREE2', 'BEAST2'], rationale: 'Outbreak investigation and transmission analysis — high clinical relevance' },
      { label: 'MOB-suite + PlasmidFinder mobile element analysis', novelty: 3, difficulty: 2, compute: 1, pubPotential: 4, tools: ['MOB-suite', 'PlasmidFinder', 'ISfinder'], rationale: 'Plasmid-mediated AMR context is essential for clinical relevance' },
      { label: 'VFDB virulence factor analysis', novelty: 3, difficulty: 1, compute: 1, pubPotential: 3, tools: ['VFDB', 'Kleborate', 'PathogenFinder'], rationale: 'Virulence profiling strengthens clinical pathogen papers' },
    ],
    next: 'recommendations_summary',
  },

  evolution_matrix: {
    id: 'evolution_matrix', step: 3, total: 5, type: 'matrix',
    cat: 'ANALYSIS RECOMMENDATIONS', title: 'Ranked Analysis Opportunities — Evolution',
    rows: [
      { label: 'FastANI matrix + GTDB-Tk phylogeny', novelty: 3, difficulty: 2, compute: 2, pubPotential: 4, tools: ['FastANI', 'skani', 'GTDB-Tk'], rationale: 'Foundation of any comparative paper — quick to run, always required' },
      { label: 'Roary / Panaroo pangenome analysis', novelty: 3, difficulty: 2, compute: 3, pubPotential: 4, tools: ['Roary', 'Panaroo', 'Scoary', 'PGGB'], rationale: 'Pangenome reveals accessory gene content and evolutionary flexibility' },
      { label: 'IQ-TREE2 core genome phylogeny', novelty: 3, difficulty: 3, compute: 3, pubPotential: 5, tools: ['IQ-TREE2', 'MAFFT', 'ModelTest-NG'], rationale: 'Publication-quality phylogeny — required for novel species descriptions and evolution papers' },
      { label: 'HGT detection + genomic island analysis', novelty: 4, difficulty: 3, compute: 2, pubPotential: 4, tools: ['IslandViewer 4', 'PAML', 'HGTector2'], rationale: 'Horizontal gene transfer analysis adds evolutionary depth and novelty' },
      { label: 'dN/dS selection analysis', novelty: 4, difficulty: 4, compute: 3, pubPotential: 4, tools: ['PAML', 'HyPhy', 'FUBAR'], rationale: 'Adaptive evolution detection — high novelty but requires careful interpretation' },
    ],
    next: 'recommendations_summary',
  },

  recommendations_summary: {
    id: 'recommendations_summary', step: 4, total: 5, type: 'rec',
    cat: 'NEXT STEPS', title: 'Building Your Analysis Plan',
    tagline: 'Execute the ranked list from top to bottom — each builds on the last.',
    pts: [
      'Start with computational analyses (low difficulty, high ROI) to establish the core dataset',
      'Use the individual Decision Engine modules to guide each analysis step',
      'Experimental validation (bioassays, LC-MS, expression) transforms a data paper into a discovery paper',
      'Write your methods section as you go — document software versions, parameters, and databases used',
      'Check the Publication Readiness Checker before submitting to confirm all required elements are present',
    ],
    tools: ['Publication Readiness Checker (this hub)', 'WGS Decision Engine (this hub)', 'Genome Mining Wizard (this hub)'],
    act: 'Return to hub →', next: '__hub__',
  },
};

// ══════════════════════════════════════════════════
// MODULE 11 — Experimental Design Advisor
// ══════════════════════════════════════════════════
export const experimentalDesignTree: DecisionTree = {
  study_type: {
    id: 'study_type', step: 1, total: 7, type: 'q',
    cat: 'STUDY TYPE', title: 'Experimental Design Advisor',
    q: 'What type of microbiome or genomics study are you designing?',
    opts: [
      { id: 'comparative_micro', label: 'Comparative microbiome study', sub: 'Two or more groups (treatment/control, healthy/diseased, environments)', next: 'comparison_groups' },
      { id: 'longitudinal', label: 'Longitudinal / time-series study', sub: 'Samples from the same source across multiple time points', next: 'longitudinal_design' },
      { id: 'wgs_collection', label: 'Bacterial isolate WGS collection', sub: 'Sequencing a collection of isolates for genomic analysis', next: 'wgs_collection_design' },
      { id: 'single_organism', label: 'Single organism — genome + phenotype', sub: 'One novel organism, full characterization', next: 'single_org_design' },
    ],
  },

  comparison_groups: {
    id: 'comparison_groups', step: 2, total: 7, type: 'q',
    cat: 'STUDY GROUPS', title: 'Number of Comparison Groups',
    q: 'How many groups are you comparing?',
    opts: [
      { id: 'two_groups', label: 'Two groups (binary comparison)', sub: 'Treatment vs. control, case vs. healthy, environment A vs. B', next: 'sample_size_calc' },
      { id: 'multi_groups', label: 'Three or more groups', sub: 'Multiple treatments, time points as groups, or environments', next: 'multi_group_design' },
    ],
  },

  sample_size_calc: {
    id: 'sample_size_calc', step: 3, total: 7, type: 'rec',
    cat: 'SAMPLE SIZE', title: 'Sample Size Guidance for Microbiome Studies',
    tagline: 'The most common design flaw in microbiome research is insufficient sample size.',
    pts: [
      'Minimum: 10 samples per group for exploratory studies (publication possible with appropriate caveats)',
      'Recommended: 20–30 samples per group for robust differential abundance testing with FDR control',
      'Power analysis: use the MicrobiomeStat or pwr package in R — requires an effect size estimate',
      'Pilot study: 5–10 samples per group to estimate within-group variability before full study launch',
      'Biological replicates must be independent — technical replicates do not count toward power',
    ],
    tools: ['MicrobiomeStat (R)', 'pwr (R)', 'G*Power', 'HMP Power Calculator (web)'],
    act: 'Continue to controls →', next: 'controls_design',
  },

  multi_group_design: {
    id: 'multi_group_design', step: 3, total: 7, type: 'info',
    cat: 'MULTI-GROUP DESIGN', title: 'Multi-Group Study Design Considerations',
    body: 'Multi-group studies require ANOVA-equivalent approaches and correction for multiple comparisons. Pre-register your hypotheses to avoid p-hacking.',
    tbl: [
      { v: 'Statistical method', m: 'Kruskal-Wallis + Dunn post-hoc, or PERMANOVA for beta diversity', s: 'c-g' },
      { v: 'DA testing', m: 'MaAsLin2 handles multi-group and confounder correction simultaneously', s: 'c-g' },
      { v: 'Sample size', m: 'Increase by 30–50% vs. two-group — more groups = more multiple testing burden', s: 'c-y' },
    ],
    tools: ['MaAsLin2', 'vegan (PERMANOVA)', 'phyloseq', 'ggplot2'],
    act: 'Continue to controls →', next: 'controls_design',
  },

  longitudinal_design: {
    id: 'longitudinal_design', step: 2, total: 7, type: 'rec',
    cat: 'LONGITUDINAL DESIGN', title: 'Longitudinal Microbiome Study Design',
    tagline: 'Repeated measures require different statistical approaches than cross-sectional data.',
    pts: [
      'Minimum: 3 time points for trajectory analysis; 5+ time points for robust longitudinal modelling',
      'Use mixed-effects models (MaAsLin2 with subject as random effect) to account for individual variation over time',
      'Sample at consistent intervals — variability in sampling interval confounds temporal interpretation',
      'Account for technical variation: freeze samples immediately, process all time points together when possible',
      'PERMANOVA with strata argument accounts for repeated measures in beta diversity analysis',
    ],
    tools: ['MaAsLin2 (mixed effects)', 'MMVEC', 'vegan + strata', 'phyloseq', 'ggplot2'],
    act: 'Continue to controls →', next: 'controls_design',
  },

  wgs_collection_design: {
    id: 'wgs_collection_design', step: 2, total: 7, type: 'rec',
    cat: 'WGS COLLECTION DESIGN', title: 'Designing a Bacterial WGS Collection Study',
    tagline: 'Collection size and diversity drive statistical power for comparative genomics.',
    pts: [
      'Minimum collection size for pangenome analysis: 20 genomes; 50+ for robust open/closed pangenome inference',
      'Include type strains and reference genomes from NCBI alongside your novel isolates',
      'Ensure geographic and temporal diversity if environmental or epidemiological comparisons are planned',
      'Pre-screen with 16S Sanger to estimate diversity before committing to WGS for all isolates',
      'Document isolation source metadata for every isolate — essential for comparative analysis and NCBI submission',
    ],
    tools: ['16S Sanger pre-screening', 'NCBI Assembly (reference genomes)', 'Roary', 'GTDB-Tk'],
    act: 'Continue to controls →', next: 'controls_design',
  },

  single_org_design: {
    id: 'single_org_design', step: 2, total: 7, type: 'info',
    cat: 'SINGLE ORGANISM DESIGN', title: 'Single Organism Characterization Design',
    body: 'For a single novel organism, the "experiment" is the sequencing and characterization workflow itself. No group comparison, but controls are still required.',
    tbl: [
      { v: 'DNA extraction', m: '3 independent extractions — use mean or best quality for sequencing', s: 'c-g' },
      { v: 'Growth conditions', m: 'Test multiple media/temps/salinities if characterizing physiology', s: 'c-g' },
      { v: 'Reference comparison', m: 'Always compare against type strain and at least 10 close relatives', s: 'c-g' },
    ],
    act: 'Continue to controls →', next: 'controls_design',
  },

  controls_design: {
    id: 'controls_design', step: 4, total: 7, type: 'rec',
    cat: 'CONTROLS', title: 'Essential Controls for Reproducibility',
    tagline: 'Reviewers will ask about these. Design them in from the start.',
    pts: [
      'Negative extraction controls: extract from blank (no sample) in every batch — detects reagent contamination',
      'Positive controls: include a mock community (e.g. ZymoBIOMICS) in every sequencing run for batch effect detection',
      'Technical replicates: sequence the same DNA twice to measure library prep variability (minimum 5% of samples)',
      'Field / collection blanks: blank filters or collection tubes processed alongside real samples — detects field contamination',
      'For AMR studies: include known-susceptible and known-resistant reference strains as internal controls',
    ],
    tools: ['ZymoBIOMICS Mock Community', 'PhiX (sequencing spike-in)', 'decontam (R)'],
    act: 'Continue to sequencing depth →', next: 'depth_guidance',
  },

  depth_guidance: {
    id: 'depth_guidance', step: 5, total: 7, type: 'info',
    cat: 'SEQUENCING DEPTH', title: 'Recommended Sequencing Depth by Study Type',
    body: 'Sequencing depth affects sensitivity for rare taxa and statistical power for differential abundance analysis. More depth is better, but cost must be balanced against sample number.',
    tbl: [
      { v: '16S amplicon', m: '10,000–50,000 reads/sample; 100,000+ for rare biosphere studies', s: 'c-g' },
      { v: 'Shotgun metagenomics', m: '5–10 Gb/sample (diversity); 10–30 Gb (MAG recovery)', s: 'c-g' },
      { v: 'Isolate WGS', m: '80–100× coverage; calculator in WGS module', s: 'c-g' },
      { v: 'Metatranscriptomics', m: '10–20 Gb post-rRNA depletion per sample', s: 'c-y' },
    ],
    act: 'Continue to cost overview →', next: 'cost_overview',
  },

  cost_overview: {
    id: 'cost_overview', step: 6, total: 7, type: 'rec',
    cat: 'BUDGET PLANNING', title: 'Sequencing Cost Considerations',
    tagline: 'Underestimating cost is the most common reason studies get underpowered.',
    pts: [
      'DNA extraction + library prep is often 30–50% of total costs — budget for both',
      '16S amplicon: ~$20–50 per sample at scale; WGS Illumina: $50–150; Nanopore (MinION): $100–250 per flow cell for 1–6 samples',
      'Computational costs: HPC cluster time, cloud computing, or commercial bioinformatics services — often overlooked',
      'Storage: 1 TB raw Illumina data for 100 metagenomes — factor in long-term storage costs',
      'Build in 15–20% contingency for failed extractions, failed library preps, and re-sequencing requirements',
    ],
    tools: ['Illumina sequencing cost calculator', 'Oxford Nanopore pricing page', 'AWS cost estimator'],
    act: 'View design summary →', next: 'design_summary',
  },

  design_summary: {
    id: 'design_summary', step: 7, total: 7, type: 'checklist',
    cat: 'DESIGN CHECKLIST', title: 'Pre-Sequencing Design Checklist',
    items: [
      { id: 'sample_size_final', label: 'Sample size justified by power analysis or literature precedent', required: true },
      { id: 'controls_planned', label: 'Negative and positive controls included in extraction and sequencing', required: true },
      { id: 'metadata_form', label: 'Metadata collection form created — all required fields for NCBI/ENA submission', required: true },
      { id: 'dna_qc_plan', label: 'DNA QC criteria defined (minimum concentration, A260/280, integrity)', required: true },
      { id: 'storage_plan', label: 'Sample storage protocol defined (-80°C, glycerol stocks, RNA protection)', required: true },
      { id: 'ethics', label: 'Ethics approval obtained (if human samples or protected environments)', required: false },
      { id: 'preregistered', label: 'Study pre-registered or analysis plan documented before data collection', required: false },
    ],
    scoring: {
      low: 'Design incomplete — do not begin sampling',
      mid: 'Nearly ready — address required items',
      high: 'Ready to begin sampling',
      top: 'Well-designed study — proceed with confidence',
    },
    next: '__hub__',
  },
};

// ══════════════════════════════════════════════════
// MODULE 12 — PhD Project Planner
// ══════════════════════════════════════════════════
export const phdPlannerTree: DecisionTree = {
  degree_level: {
    id: 'degree_level', step: 1, total: 5, type: 'q',
    cat: 'DEGREE LEVEL', title: 'PhD Project Planner',
    q: 'What is your degree level and duration?',
    opts: [
      { id: 'phd_3yr', label: 'PhD — 3 years (UK / European model)', sub: 'Tight timeline; streamlined project scope essential', next: 'research_area_phd' },
      { id: 'phd_4yr', label: 'PhD — 4 years (UK integrated / US model)', sub: 'More time for course work and broader project scope', next: 'research_area_phd' },
      { id: 'msc', label: 'MSc by Research — 1–2 years', sub: 'Focused, single-theme project', next: 'research_area_phd' },
    ],
  },

  research_area_phd: {
    id: 'research_area_phd', step: 2, total: 5, type: 'q',
    cat: 'RESEARCH AREA', title: 'Primary Research Area',
    q: 'What is your primary PhD research focus?',
    opts: [
      { id: 'marine_genomics', label: 'Marine microbiology / metagenomics', next: 'marine_timeline' },
      { id: 'drug_discovery_phd', label: 'Natural product / drug discovery', next: 'drug_timeline' },
      { id: 'clinical_genomics', label: 'Clinical / AMR genomics', next: 'clinical_timeline' },
      { id: 'microbiome_phd', label: 'Microbiome ecology', next: 'microbiome_timeline' },
    ],
  },

  marine_timeline: {
    id: 'marine_timeline', step: 3, total: 5, type: 'timeline',
    cat: 'RESEARCH TIMELINE', title: 'Marine Microbiology PhD Timeline',
    intro: 'A 3–4 year roadmap for a marine microbiology / genomics PhD. Adjust based on your degree length and supervisory guidance.',
    phases: [
      {
        period: 'Year 1 — Foundations',
        tasks: [
          'Systematic literature review — marine microbiome, sequencing methods, target organisms',
          'Sample collection design and ethics/permits if required',
          'Lab training: culture techniques, DNA extraction, sterile technique, Gram staining',
          'Bioinformatics setup: Linux, conda, QIIME2, command-line proficiency',
          '16S pre-screening of isolate collection — culture-based diversity survey',
          'First-year report / upgrade proposal — submit at month 9–12',
        ],
      },
      {
        period: 'Year 2 — Data Generation',
        tasks: [
          'Illumina WGS of priority isolates (80–100× PE150)',
          'Metagenomics sequencing of environmental samples if included',
          'De novo assembly, QC, and annotation pipeline (SPAdes / Unicycler → Bakta)',
          'antiSMASH + GECCO BGC discovery — initial results',
          'Nanopore R10.4 for hybrid assembly of priority strains (BGC-rich or novel species candidates)',
          'Poster presentation at a national conference (Year 2)',
        ],
      },
      {
        period: 'Year 3 — Analysis & Writing',
        tasks: [
          'Comparative genomics, pan-genome, phylogenomics (IQ-TREE2, FastANI, GTDB-Tk)',
          'BGC novelty analysis — BiG-SCAPE, BiG-SLICE against MIBiG',
          'Bioactivity screening if included in scope',
          'First manuscript: novel species description or BGC-focused paper — submit by month 30',
          'Conference presentation (international) — Year 3',
          'Second manuscript: metagenomics or comparative genomics paper',
        ],
      },
      {
        period: 'Year 4 / Completion',
        tasks: [
          'Third manuscript if applicable (review, method paper, or additional dataset)',
          'Data deposition: NCBI GenBank, SRA/ENA, all accession numbers obtained',
          'Thesis writing: aim to complete draft by month 42',
          'Internal mock viva (thesis defence practice) with supervisory team',
          'Thesis submission and viva voce examination',
          'Post-viva corrections and final submission',
        ],
      },
    ],
    next: 'publication_targets',
  },

  drug_timeline: {
    id: 'drug_timeline', step: 3, total: 5, type: 'timeline',
    cat: 'RESEARCH TIMELINE', title: 'Drug Discovery PhD Timeline',
    phases: [
      {
        period: 'Year 1 — Literature & Setup',
        tasks: [
          'Review: natural product databases, BGC types, mining tools, target organisms',
          'Culture collection assembly — isolate 50–100 candidates from target environment',
          '16S screening of collection (Sanger or MiSeq amplicon)',
          'Genome sequencing plan: Illumina PE150 + Nanopore R10.4 for top candidates',
          'Set up bioinformatics pipeline: antiSMASH, GECCO, BiG-SCAPE',
        ],
      },
      {
        period: 'Year 2 — Genome Mining',
        tasks: [
          'WGS of top 20–50 isolates (Illumina ± Nanopore hybrid)',
          'antiSMASH + GECCO — catalogue all BGCs across collection',
          'BiG-SCAPE clustering — identify novel BGC families vs. MIBiG',
          'ARTS2 — prioritise BGCs with self-resistance genes',
          'Fermentation optimization for top candidates',
          'LC-MS/MS profiling of crude extracts + GNPS Molecular Networking',
        ],
      },
      {
        period: 'Year 3 — Bioactivity & Characterization',
        tasks: [
          'Bioactivity screening: MIC, disk diffusion, cytotoxicity',
          'Compound isolation and structural elucidation (NMR, HRMS)',
          'AlphaFold2 structural prediction of biosynthetic enzymes',
          'Mechanism of action investigations (if time permits)',
          'First manuscript: genomic survey + BGC landscape paper',
          'Second manuscript: novel compound characterization (if isolated)',
        ],
      },
      {
        period: 'Year 4 / Completion',
        tasks: [
          'Final bioassays and SAR studies if applicable',
          'Thesis writing — chemical biology chapters require extra time',
          'Data deposition: genomes to GenBank; spectra to GNPS; BGCs to MIBiG',
          'Patent application consideration (consult technology transfer office before publishing)',
          'Thesis submission and viva',
        ],
      },
    ],
    next: 'publication_targets',
  },

  clinical_timeline: {
    id: 'clinical_timeline', step: 3, total: 5, type: 'timeline',
    cat: 'RESEARCH TIMELINE', title: 'Clinical / AMR Genomics PhD Timeline',
    phases: [
      {
        period: 'Year 1 — Foundations',
        tasks: [
          'Review: AMR surveillance, clinical WGS workflows, relevant pathogens',
          'Clinical isolate collection (via hospital/clinical partner — requires ethics)',
          'Bioinformatics: MLST, AMRFinderPlus, Kleborate, SNP calling pipelines',
          'Illumina WGS of initial cohort — establish core pipeline',
        ],
      },
      {
        period: 'Year 2 — Large-Scale WGS',
        tasks: [
          'WGS of full isolate cohort (100–500 isolates)',
          'AMR gene profiling: AMRFinderPlus, CARD/RGI, ResFinder',
          'Plasmid and mobile element analysis: MOB-suite, PlasmidFinder',
          'Phylogenomic analysis: Snippy + IQ-TREE2 core genome phylogeny',
          'Outbreak investigation if applicable',
        ],
      },
      {
        period: 'Year 3 — Analysis & Publication',
        tasks: [
          'Epidemiological analysis: spatial, temporal AMR transmission patterns',
          'One-Health analysis if applicable (human + animal + environmental)',
          'First manuscript: AMR surveillance genomics paper',
          'Second manuscript: novel resistance mechanism or outbreak investigation',
          'Present at clinical genomics conference (ECCMID, ASM Microbe)',
        ],
      },
      {
        period: 'Year 4 / Completion',
        tasks: [
          'Translational outputs: clinical guidelines, infection control policy input',
          'Data deposition: NCBI PathogenDB submission for all genomes',
          'Thesis writing and submission',
        ],
      },
    ],
    next: 'publication_targets',
  },

  microbiome_timeline: {
    id: 'microbiome_timeline', step: 3, total: 5, type: 'timeline',
    cat: 'RESEARCH TIMELINE', title: 'Microbiome Ecology PhD Timeline',
    phases: [
      {
        period: 'Year 1 — Study Design & Sampling',
        tasks: [
          'Literature review: target environment, relevant diversity patterns, key analytical tools',
          'Study design: sample size, controls, metadata collection form, ethics/permits',
          'Field sampling — collect representative environmental samples with proper metadata',
          'DNA extraction optimisation for your matrix (soil / seawater / tissue)',
          '16S amplicon profiling of pilot set for preliminary diversity assessment',
        ],
      },
      {
        period: 'Year 2 — Full Dataset Generation',
        tasks: [
          'Full 16S amplicon sequencing of complete sample set (MiSeq PE300)',
          'Shotgun metagenomics of subset (10–20 Gb per sample)',
          'QIIME2 / DADA2 processing; diversity analysis (alpha, beta)',
          'MAG recovery from metagenomes — CheckM2, GTDB-Tk',
          'PICRUSt2 functional prediction from 16S data',
        ],
      },
      {
        period: 'Year 3 — Analysis & Writing',
        tasks: [
          'Differential abundance analysis (ANCOM-BC2, MaAsLin2)',
          'Metabolomics integration if applicable (LC-MS, NMR)',
          'Ecological modelling: environmental drivers, co-occurrence networks',
          'First manuscript: community composition + environmental driver paper',
          'Second manuscript: MAG recovery or functional potential paper',
        ],
      },
      {
        period: 'Year 4 / Completion',
        tasks: [
          'Third manuscript (review, methods, or additional dataset)',
          'Data deposition: reads + MAGs to NCBI/ENA with full metadata',
          'Thesis writing, submission, and viva',
        ],
      },
    ],
    next: 'publication_targets',
  },

  publication_targets: {
    id: 'publication_targets', step: 4, total: 5, type: 'rec',
    cat: 'PUBLICATION STRATEGY', title: 'PhD Publication Targets',
    tagline: 'Three first-author papers is the informal gold standard for a competitive PhD.',
    pts: [
      'Paper 1 (target: months 24–30): Methods/genomics paper — your core dataset, assembly pipeline, BGC catalogue, or community profiling',
      'Paper 2 (target: months 30–36): Biology paper — the major scientific finding (novel compound, novel species, key ecological pattern)',
      'Paper 3 (target: months 36–42): Review, methods development, or additional discovery using the same dataset',
      'Conference papers do not substitute for peer-reviewed journal publications in most PhD assessments',
      'Preprints (bioRxiv) allow you to claim priority and share results before peer review completes',
    ],
    tools: ['bioRxiv (preprint server)', 'ORCID (researcher ID)', 'Zotero (reference management)', 'Overleaf (LaTeX)'],
    act: 'View milestones checklist →', next: 'phd_checklist',
  },

  phd_checklist: {
    id: 'phd_checklist', step: 5, total: 5, type: 'checklist',
    cat: 'PHD MILESTONES', title: 'PhD Milestones Checklist',
    items: [
      { id: 'lit_review', label: 'Systematic literature review completed and documented', required: true },
      { id: 'upgrade', label: 'First-year report / upgrade completed and passed', required: true },
      { id: 'ethics', label: 'Ethics approval obtained (if applicable)', required: false },
      { id: 'data_generated', label: 'All primary data generated (sequencing complete)', required: true },
      { id: 'pipeline_docs', label: 'Analysis pipeline fully documented (Snakemake / Nextflow preferred)', required: true },
      { id: 'paper1_submitted', label: 'First manuscript submitted to journal', required: true },
      { id: 'conference', label: 'Presented at a national or international conference', required: false },
      { id: 'data_deposited', label: 'All datasets deposited with public accession numbers', required: true },
      { id: 'thesis_draft', label: 'Full thesis draft completed and reviewed by supervisors', required: true },
      { id: 'viva_prep', label: 'Mock viva (internal) completed', required: false },
    ],
    scoring: {
      low: 'Early stage — focus on foundations',
      mid: 'Mid-PhD — on track',
      high: 'Late-stage — approaching submission',
      top: 'Thesis ready — proceed to examination',
    },
    next: '__hub__',
  },
};

// ══════════════════════════════════════════════════
// MODULE 13 — Conference Recommender
// ══════════════════════════════════════════════════
export const conferenceTree: DecisionTree = {
  research_keywords: {
    id: 'research_keywords', step: 1, total: 4, type: 'q',
    cat: 'RESEARCH FOCUS', title: 'Conference Recommender',
    q: 'What best describes your primary research area?',
    opts: [
      { id: 'bioinformatics', label: 'Bioinformatics, computational biology, algorithms', next: 'bioinformatics_conferences' },
      { id: 'microbial_ecology', label: 'Microbial ecology, metagenomics, microbiome', next: 'ecology_conferences' },
      { id: 'drug_disc_conf', label: 'Natural products, drug discovery, antimicrobials', next: 'drug_conferences' },
      { id: 'clinical_micro', label: 'Clinical microbiology, AMR, infectious disease', next: 'clinical_conferences' },
      { id: 'marine_conf', label: 'Marine biology, ocean science, marine biotechnology', next: 'marine_conferences' },
    ],
  },

  bioinformatics_conferences: {
    id: 'bioinformatics_conferences', step: 2, total: 4, type: 'rec',
    cat: 'BIOINFORMATICS CONFERENCES', title: 'Top Bioinformatics & Computational Biology Conferences',
    tagline: 'Where computational genomics is presented and careers are made.',
    pts: [
      'ISMB/ECCB (Intelligent Systems for Molecular Biology) — the flagship bioinformatics conference; alternates ISMB-only and ISMB/ECCB years; July; abstract deadline March',
      'RECOMB (Research in Computational Molecular Biology) — algorithms-focused; April; competitive abstract review',
      'AGBT (Advances in Genome Biology & Technology) — sequencing technology focus; February; Marco Island FL',
      'PSB (Pacific Symposium on Biocomputing) — interdisciplinary computational biology; January; Hawaii',
      'GCC (Galaxy Community Conference) — open-source bioinformatics tools and workflows; annual; July',
    ],
    tools: ['ISMB abstract portal', 'RECOMB submission system', 'bioRxiv (preprint before conference)'],
    act: 'See career stage guidance →', next: 'career_stage_conf',
  },

  ecology_conferences: {
    id: 'ecology_conferences', step: 2, total: 4, type: 'rec',
    cat: 'MICROBIAL ECOLOGY CONFERENCES', title: 'Top Microbial Ecology & Microbiome Conferences',
    tagline: 'The venues where microbiome science happens.',
    pts: [
      'ISME (International Symposium on Microbial Ecology) — the leading microbial ecology conference; biennial; August; 2,500+ attendees',
      'Microbiome Connect — commercial / clinical microbiome focus; annual',
      'ASM Microbe — American Society for Microbiology flagship meeting; June; 5,000+ attendees',
      'EMBO | EMBL Symposia (Heidelberg) — invitation/application-based; high prestige; many microbiome-relevant topics annually',
      'Gordon Research Conferences — small, intensive, unpublished results only; very high networking value',
    ],
    act: 'See career stage guidance →', next: 'career_stage_conf',
  },

  drug_conferences: {
    id: 'drug_conferences', step: 2, total: 4, type: 'rec',
    cat: 'DRUG DISCOVERY CONFERENCES', title: 'Natural Products & Drug Discovery Conferences',
    tagline: 'Where natural product chemistry meets genomics.',
    pts: [
      'IUMS (International Union of Microbiological Societies) — major international microbiology congress; triennial',
      'SIM Annual Meeting (Society for Industrial Microbiology and Biotechnology) — natural products and biotechnology focus',
      'ICNPG (International Conference on Natural Products from Genomics) — genome mining focus; excellent for early career researchers',
      'AACR Annual Meeting — cancer drug discovery; relevant for AMPs and anti-cancer natural products',
      'ESCMID (European) / ASM (US) — antimicrobial resistance and new antibiotic discovery sessions',
    ],
    act: 'See career stage guidance →', next: 'career_stage_conf',
  },

  clinical_conferences: {
    id: 'clinical_conferences', step: 2, total: 4, type: 'rec',
    cat: 'CLINICAL CONFERENCES', title: 'Clinical Microbiology & AMR Conferences',
    tagline: 'Where genomics meets clinical practice.',
    pts: [
      'ECCMID (European Congress of Clinical Microbiology & Infectious Diseases) — 30,000+ attendees; the largest clinical microbiology conference globally; April',
      'ASM Microbe — combines basic science and clinical microbiology; June; US-based',
      'IDWeek (Infectious Diseases Society of America) — clinical infectious diseases; October; US',
      'ESCMID Study Groups — smaller focused meetings on specific pathogens (EUCAST, ESCMID SIGs)',
      'ABCD Annual Meeting (UK) — focused on antimicrobial resistance; good for UK-based PhD students',
    ],
    act: 'See career stage guidance →', next: 'career_stage_conf',
  },

  marine_conferences: {
    id: 'marine_conferences', step: 2, total: 4, type: 'rec',
    cat: 'MARINE CONFERENCES', title: 'Marine Microbiology & Biotechnology Conferences',
    tagline: 'Where ocean science meets genomics and biotechnology.',
    pts: [
      'SAME (Symposium on Aquatic Microbial Ecology) — marine and freshwater microbial ecology; biennial; ASM-affiliated',
      'Marine Biotechnology Conference (IUMS Section) — marine bioactive compounds and biotechnology',
      'ASLO (Association for the Sciences of Limnology and Oceanography) — aquatic sciences flagship meeting; February/June',
      'EcoMar and European Marine Biology Symposia — regional marine biology meetings; good for PhD networking',
      'Blue Biotechnology conferences (EU COST actions) — marine biotechnology; strong European networking',
    ],
    act: 'See career stage guidance →', next: 'career_stage_conf',
  },

  career_stage_conf: {
    id: 'career_stage_conf', step: 3, total: 4, type: 'q',
    cat: 'CAREER STAGE', title: 'Conference Strategy by Career Stage',
    q: 'What is your current career stage?',
    opts: [
      { id: 'early_phd', label: 'Early PhD (Year 1–2)', sub: 'Building network, presenting preliminary work', next: 'early_conf_advice' },
      { id: 'late_phd', label: 'Late PhD (Year 3–4) or PostDoc', sub: 'Presenting full findings, job market visibility', next: 'late_conf_advice' },
    ],
  },

  early_conf_advice: {
    id: 'early_conf_advice', step: 4, total: 4, type: 'rec',
    cat: 'EARLY CAREER STRATEGY', title: 'Conference Strategy for Early PhD',
    tagline: 'Start local, build confidence, then go international.',
    pts: [
      'Year 1: Present a poster at a national meeting — low pressure, good practice, essential networking',
      'Year 2: Present a poster at one international conference — ISME, ASM, or domain-specific',
      'Apply for student travel bursaries early — most major conferences have them, and they cover registration + travel',
      'Register as a student volunteer — free conference registration in exchange for duties',
      'Follow conference hashtags on academic social media before attending — identify who you want to meet',
      'Gordon Research Conferences: apply in Year 2–3 — small, prestigious, no published results required to attend',
    ],
    tools: ['Google Scholar (conference papers)', 'ResearchGate', 'LinkedIn (academic networking)'],
    act: 'Return to hub →', next: '__hub__',
  },

  late_conf_advice: {
    id: 'late_conf_advice', step: 4, total: 4, type: 'rec',
    cat: 'LATE CAREER STRATEGY', title: 'Conference Strategy for Late PhD / PostDoc',
    tagline: 'Oral presentations, job market visibility, and strategic networking.',
    pts: [
      'Submit for oral presentations, not just posters — a 15-minute talk has 10× the visibility of a poster',
      'Attend the conference social events — many collaborations and job opportunities start informally',
      'Arrange in-person meetings with potential postdoc / faculty supervisors before the conference',
      'Consider chairing a session — great CV line and builds relationships with session organizers',
      'ISMB/ECCB and RECOMB workshops are excellent for computational biology job market visibility',
    ],
    act: 'Return to hub →', next: '__hub__',
  },
};

// ══════════════════════════════════════════════════
// MODULE 14 — Bioinformatics Career Pathway Explorer
// ══════════════════════════════════════════════════
export const careerPathwayTree: DecisionTree = {
  current_stage: {
    id: 'current_stage', step: 1, total: 6, type: 'q',
    cat: 'CURRENT STAGE', title: 'Bioinformatics Career Pathway Explorer',
    q: 'What is your current academic / career stage?',
    opts: [
      { id: 'bsc', label: 'BSc student or recent graduate', sub: 'Building foundational skills', next: 'career_goal' },
      { id: 'msc', label: 'MSc student or graduate', sub: 'Deepening specialization', next: 'career_goal' },
      { id: 'phd', label: 'PhD student or candidate', sub: 'Developing independent research skills', next: 'career_goal' },
      { id: 'postdoc', label: 'PostDoc or early career researcher', sub: 'Positioning for academic or industry transition', next: 'career_goal' },
    ],
  },

  career_goal: {
    id: 'career_goal', step: 2, total: 6, type: 'q',
    cat: 'CAREER GOAL', title: 'Target Career Path',
    q: 'What is your target career destination?',
    opts: [
      { id: 'academia', label: 'Academic research — PI / faculty position', sub: 'Independent research group, teaching, grant funding', next: 'academia_skills' },
      { id: 'industry_biotech', label: 'Industry — biotech / pharma bioinformatics', sub: 'Drug discovery, genomics, data science in commercial sector', next: 'industry_skills' },
      { id: 'clinical_bioinformatics', label: 'Clinical bioinformatics / NHS / hospital', sub: 'Diagnostic genomics, variant interpretation, patient data', next: 'clinical_career_skills' },
      { id: 'ai_ml', label: 'AI / Machine Learning in biology', sub: 'AlphaFold, large biological language models, ML drug discovery', next: 'ai_skills' },
      { id: 'freelance', label: 'Freelance / consulting bioinformatics', sub: 'Independent consultant or CRO bioinformatics services', next: 'freelance_skills' },
    ],
  },

  academia_skills: {
    id: 'academia_skills', step: 3, total: 6, type: 'rec',
    cat: 'ACADEMIA PATHWAY', title: 'Skills Roadmap — Academic Research Career',
    tagline: 'Publications, grants, and a clear research identity are the currency of academia.',
    pts: [
      'Core bioinformatics: Python or R (proficient), Linux/bash, Snakemake or Nextflow for reproducible pipelines',
      'Domain expertise: deep mastery of 2–3 tools in your niche (e.g. antiSMASH + GTDB-Tk + IQ-TREE2)',
      'Writing: first-author publications are the single most important career indicator — aim for 3 during PhD',
      'Grant writing: apply for small travel grants and studentship top-ups early — practice before fellowship applications',
      'Teaching: demonstrate pedagogical breadth through demonstrating, supervision of undergrads, online tutorials',
      'International visibility: conference presentations, preprints, GitHub portfolio, Google Scholar profile',
    ],
    tools: ['GitHub (portfolio)', 'Google Scholar (profile)', 'ORCID', 'bioRxiv', 'Overleaf (LaTeX manuscripts)'],
    act: 'See skill gap analysis →', next: 'skill_gap',
  },

  industry_skills: {
    id: 'industry_skills', step: 3, total: 6, type: 'rec',
    cat: 'INDUSTRY PATHWAY', title: 'Skills Roadmap — Biotech / Pharma Industry',
    tagline: 'Industry values speed, reproducibility, and software engineering skills alongside domain knowledge.',
    pts: [
      'Programming: Python proficiency is essential — focus on pandas, scikit-learn, biopython, matplotlib',
      'Cloud: AWS or Azure for genomics — learn S3, EC2, and managed bioinformatics services (AWS HealthOmics)',
      'Software engineering practices: version control (Git), unit testing, containerisation (Docker/Singularity)',
      'Database skills: SQL for genomics databases; experience with relational data is valued',
      'Industry vocabulary: clinical trials, regulatory science (ICH guidelines), IP basics — take short online courses',
      'Internship: a 3–6 month industry placement during PhD is the single highest-ROI career investment',
    ],
    tools: ['AWS HealthOmics', 'Docker / Singularity', 'Git + GitHub', 'Python + pandas', 'Nextflow + nf-core'],
    act: 'See skill gap analysis →', next: 'skill_gap',
  },

  clinical_career_skills: {
    id: 'clinical_career_skills', step: 3, total: 6, type: 'rec',
    cat: 'CLINICAL PATHWAY', title: 'Skills Roadmap — Clinical Bioinformatics',
    tagline: 'Clinical bioinformatics bridges genomics research and patient care.',
    pts: [
      'ACMG/AMP variant classification guidelines — core clinical genomics competency',
      'Clinical WGS pipelines: DRAGEN, BWA-GATK, SKESA — learn the clinical-grade tools used in labs',
      'UK-specific: Health Education England Bioinformatics training, NHSE Genomics pathway',
      'Data governance: GDPR, patient data handling, NHS information governance — required for clinical roles',
      'Communication: translating variant reports for clinicians and patients — essential soft skill',
      'HCPC registration pathway (UK): Certificate of Competence in Clinical Genomics Sciences',
    ],
    tools: ['GATK', 'DRAGEN (Illumina)', 'Ensembl VEP', 'ClinVar', 'OMIM', 'Alamut Visual Plus'],
    act: 'See skill gap analysis →', next: 'skill_gap',
  },

  ai_skills: {
    id: 'ai_skills', step: 3, total: 6, type: 'rec',
    cat: 'AI/ML PATHWAY', title: 'Skills Roadmap — AI & Machine Learning in Biology',
    tagline: 'The intersection of deep learning and biology is the fastest-growing area in bioinformatics.',
    pts: [
      'Python: NumPy, pandas, matplotlib — proficiency is non-negotiable; aim for fluency not just familiarity',
      'PyTorch or TensorFlow: PyTorch is preferred in academic/research settings; TensorFlow for industry deployment',
      'Biological language models: ESM-2, ProtTrans, NT (Nucleotide Transformer) — understanding transformer architecture',
      'AlphaFold2 / ESMFold: protein structure prediction is now standard — ColabFold makes it accessible',
      'Graph neural networks: GNNs are increasingly used for drug-target interaction prediction',
      'GPU computing: basic CUDA understanding and cloud GPU access (Colab, Vast.ai, Lambda Labs)',
    ],
    tools: ['PyTorch', 'Hugging Face', 'ColabFold (AlphaFold2)', 'ESM-2', 'RDKit (cheminformatics)', 'AWS / Google Colab'],
    act: 'See skill gap analysis →', next: 'skill_gap',
  },

  freelance_skills: {
    id: 'freelance_skills', step: 3, total: 6, type: 'rec',
    cat: 'FREELANCE PATHWAY', title: 'Skills Roadmap — Freelance Bioinformatics',
    tagline: 'Freelance bioinformaticians need breadth, reliability, and business skills.',
    pts: [
      'Broad competency: cover at least 3 domains (e.g. WGS + metagenomics + transcriptomics) to maximize client base',
      'Pipeline development: Snakemake + Nextflow proficiency is essential for CRO/client work',
      'Reporting: learn RMarkdown or Quarto for reproducible, publication-ready client reports',
      'Communication: writing clear non-technical summaries for biologists and PIs — underrated key skill',
      'Business basics: invoicing, contracts, IR35 (UK), scope of work documents — use AccountingBee or equivalent',
      'Portfolio: GitHub portfolio with real analysis pipelines and example reports is your CV',
    ],
    tools: ['Nextflow + nf-core', 'Snakemake', 'Quarto / RMarkdown', 'GitHub Pages (portfolio)', 'Toptal / Upwork (freelance platforms)'],
    act: 'See skill gap analysis →', next: 'skill_gap',
  },

  skill_gap: {
    id: 'skill_gap', step: 4, total: 6, type: 'q',
    cat: 'SKILL ASSESSMENT', title: 'Self-Assessed Current Skill Level',
    q: 'How would you describe your current bioinformatics proficiency?',
    opts: [
      { id: 'beginner', label: 'Beginner — mostly GUI tools; limited command-line', next: 'beginner_roadmap' },
      { id: 'intermediate', label: 'Intermediate — comfortable with command-line; have run some pipelines', next: 'intermediate_roadmap' },
      { id: 'advanced', label: 'Advanced — write scripts; build pipelines; comfortable with HPC', next: 'advanced_roadmap' },
    ],
  },

  beginner_roadmap: {
    id: 'beginner_roadmap', step: 5, total: 6, type: 'timeline',
    cat: 'LEARNING ROADMAP', title: 'Beginner to Publication-Ready Bioinformatician',
    phases: [
      {
        period: 'Months 1–3 — Command-Line Foundations',
        tasks: [
          'Linux/bash fundamentals: file navigation, grep, awk, pipes, redirections',
          'The Unix Data Science Toolkit (free book): read and complete exercises',
          'Conda: install miniconda, create environments, install bioinformatics tools',
          'Git: learn add, commit, push, pull, branching — use GitHub for all work from now on',
        ],
      },
      {
        period: 'Months 3–6 — Core Bioinformatics Tools',
        tasks: [
          'FastQC, fastp: learn QC interpretation; what does a bad quality report look like?',
          'Run your first assembly: SPAdes on a test dataset (NCBI SRA — use SRAtoolkit to download)',
          'QUAST + CheckM2: understand assembly quality metrics',
          'Bakta: annotate your first assembly',
        ],
      },
      {
        period: 'Months 6–12 — Scripting & Pipelines',
        tasks: [
          'Python basics: variables, functions, loops, pandas, biopython (Codecademy or Rosalind.info)',
          'Run antiSMASH on your assembly — interpret BGC outputs',
          'Run QIIME2 tutorial end-to-end (official QIIME2 tutorial is excellent)',
          'Begin using HPC: submit your first SLURM job',
        ],
      },
    ],
    next: 'resources_list',
  },

  intermediate_roadmap: {
    id: 'intermediate_roadmap', step: 5, total: 6, type: 'timeline',
    cat: 'LEARNING ROADMAP', title: 'Intermediate to Advanced Bioinformatician',
    phases: [
      {
        period: 'Months 1–3 — Pipeline Engineering',
        tasks: [
          'Learn Snakemake: reproduce your current ad-hoc workflow as a proper pipeline',
          'Docker / Singularity: containerise your pipelines for reproducibility',
          'nf-core: explore existing Nextflow pipelines (nf-core/mag, nf-core/ampliseq)',
          'Advanced bash: functions, arrays, parallel processing',
        ],
      },
      {
        period: 'Months 3–6 — Statistical & Visual Analysis',
        tasks: [
          'R: ggplot2, phyloseq, vegan — visualisation and diversity statistics',
          'ANCOM-BC2, ALDEx2 in R: proper differential abundance testing',
          'R Markdown / Quarto: reproducible reports',
          'Apply new skills to your own dataset — produce publication-quality figures',
        ],
      },
      {
        period: 'Months 6–12 — Specialisation',
        tasks: [
          'Pick one advanced domain: machine learning (PyTorch), pangenomics (PGGB), or structural biology (AlphaFold2)',
          'Complete a relevant online course: Coursera Genomic Data Science, EMBL-EBI training, Bioconductor courses',
          'Submit a methods-focused manuscript or GitHub pipeline as a citable resource',
        ],
      },
    ],
    next: 'resources_list',
  },

  advanced_roadmap: {
    id: 'advanced_roadmap', step: 5, total: 6, type: 'timeline',
    cat: 'LEARNING ROADMAP', title: 'Advanced Bioinformatician — Leadership & Specialisation',
    phases: [
      {
        period: 'Months 1–3 — Research Leadership Skills',
        tasks: [
          'Write a methods paper or software tool — submitting to Bioinformatics, GigaScience, or JOSS',
          'Contribute to an open-source bioinformatics tool (GitHub issues, PRs) — builds profile and network',
          'Mentor a junior student through a bioinformatics analysis — consolidates your own understanding',
        ],
      },
      {
        period: 'Months 3–6 — Grant Writing & Independence',
        tasks: [
          'Apply for a fellowship: EMBO short-term fellowship, BBSRC DTP top-up, RSB travel grants',
          'Write an independent project proposal — practice for postdoc fellowship applications',
          'Attend a high-prestige conference: ISMB, RECOMB, Gordon Research Conference',
        ],
      },
      {
        period: 'Months 6–12 — Frontier Skills',
        tasks: [
          'Learn Nextflow + nf-core: build a shareable community pipeline',
          'Explore biological large language models (ESM-2, Nucleotide Transformer)',
          'Cloud genomics: AWS HealthOmics, Terra/Cromwell, Google Life Sciences',
        ],
      },
    ],
    next: 'resources_list',
  },

  resources_list: {
    id: 'resources_list', step: 6, total: 6, type: 'rec',
    cat: 'LEARNING RESOURCES', title: 'Recommended Free Learning Resources',
    tagline: 'All free. All actively maintained. All used by working bioinformaticians.',
    pts: [
      'Rosalind.info — bioinformatics programming problems in Python; excellent for building skills through problem-solving',
      'EMBL-EBI Training (embl.org/training) — free online courses: Linux, NGS, metagenomics, structural biology',
      'nf-core / Nextflow training (training.nextflow.io) — official free Nextflow training course',
      'QIIME2 Docs & Tutorials (docs.qiime2.org) — comprehensive, actively maintained with real datasets',
      'Happy Belly Bioinformatics (astrobiomike.github.io) — excellent beginner-to-intermediate tutorials',
      'Bioconductor courses (bioconductor.org/help/course-materials) — R and Bioconductor for genomics',
    ],
    tools: ['Rosalind.info', 'EMBL-EBI Training', 'nf-core training', 'QIIME2 tutorials', 'Happy Belly Bioinformatics', 'Bioconductor'],
    act: 'Return to hub →', next: '__hub__',
  },
};
