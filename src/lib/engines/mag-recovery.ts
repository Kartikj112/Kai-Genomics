import type { DecisionTree } from './types';

export const magRecoveryTree: DecisionTree = {
  sample_type: {
    id: 'sample_type', step: 1, total: 9, type: 'q',
    cat: 'SAMPLE TYPE', title: 'Metagenomic Sample Environment',
    q: 'What type of environmental sample are you working with?',
    hint: 'Community complexity directly affects which assembler and binning strategy will work best',
    opts: [
      { id: 'marine', label: 'Marine — seawater, sediment, marine invertebrate', sub: 'Moderate to high complexity; salt-adapted microbiomes', next: 'read_type' },
      { id: 'soil', label: 'Soil or terrestrial environment', sub: 'Very high complexity — the most diverse microbial community type', next: 'read_type' },
      { id: 'gut', label: 'Host-associated gut microbiome', sub: 'Moderate complexity; some dominant taxa', next: 'read_type' },
      { id: 'biofilm', label: 'Biofilm or engineered system (bioreactor, WWTP)', sub: 'Low to moderate complexity; high coverage for dominant taxa', next: 'read_type' },
      { id: 'other', label: 'Other / custom environment', sub: 'Specify complexity based on 16S diversity estimates', next: 'read_type' },
    ],
  },

  read_type: {
    id: 'read_type', step: 2, total: 9, type: 'q',
    cat: 'SEQUENCING DATA', title: 'Available Sequencing Data',
    q: 'What sequencing data do you have?',
    opts: [
      { id: 'illumina_meta', label: 'Illumina short-read metagenome', sub: 'PE150, most common for large-scale studies', next: 'data_depth' },
      { id: 'nanopore_meta', label: 'Nanopore long-read metagenome', sub: 'Better for MAG completeness; higher error rate raw', next: 'nanopore_meta_rec' },
      { id: 'hybrid_meta', label: 'Hybrid — Illumina + Nanopore', sub: 'Best MAG recovery and completeness', next: 'hybrid_meta_rec', hi: true },
      { id: 'amplicon_only', label: 'Amplicon (16S) only — no shotgun data', sub: 'Cannot recover MAGs from amplicon data', next: 'amplicon_no_mag' },
    ],
  },

  amplicon_no_mag: {
    id: 'amplicon_no_mag', type: 'block', isE: true, icon: '✗',
    cat: 'NOT POSSIBLE', title: 'MAG Recovery Requires Shotgun Sequencing',
    body: 'Amplicon (16S) sequencing does not contain genome-wide information. MAG recovery is fundamentally impossible from amplicon data — you can only describe community composition.',
    steps: [
      'For MAG recovery: perform shotgun metagenomic sequencing (Illumina PE150, minimum 10 Gb per sample)',
      'For composition-only studies: 16S amplicon data is sufficient and more cost-effective',
      'If you want both composition and MAGs: add shotgun sequencing — 16S can still be done from the same DNA',
    ],
    tools: ['Illumina PE150 (shotgun metagenomics)', 'Sequencing Strategy Advisor (this hub)'],
    act: '← Return to start', next: 'sample_type',
  },

  data_depth: {
    id: 'data_depth', step: 3, total: 9, type: 'q',
    cat: 'SEQUENCING DEPTH', title: 'Metagenome Sequencing Depth',
    q: 'What is the total sequencing output per sample?',
    hint: 'More diverse communities require greater depth for MAG recovery',
    opts: [
      { id: 'deep', label: '> 10 Gb per sample', sub: 'Suitable for MAG recovery from most environments', next: 'assembler_choice' },
      { id: 'mid', label: '5–10 Gb per sample', sub: 'Sufficient for dominant taxa; rare taxa may be missed', next: 'depth_note' },
      { id: 'shallow', label: '< 5 Gb per sample', sub: 'Insufficient for reliable MAG recovery from complex communities', next: 'shallow_depth_warn' },
    ],
  },

  shallow_depth_warn: {
    id: 'shallow_depth_warn', step: 3, total: 9, type: 'info',
    cat: 'SHALLOW DEPTH', title: 'Low Sequencing Depth — MAG Quality Warning',
    body: 'Below 5 Gb, MAG recovery from diverse environments will be poor. Only the most abundant organisms will assemble reliably. Rare and novel taxa will be missed entirely.',
    tbl: [
      { v: '<5 Gb', m: 'Top 3–5 dominant taxa only; highly fragmented MAGs', s: 'c-r' },
      { v: '5–10 Gb', m: 'Top 10–20 taxa; medium-quality MAGs', s: 'c-y' },
      { v: '10–30 Gb', m: 'Comprehensive; good for most environments', s: 'c-g' },
      { v: '>30 Gb', m: 'Deep coverage; best for rare biosphere and complex soils', s: 'c-g' },
    ],
    caution: 'For highly diverse environments (marine, soil): minimum 20 Gb per sample is recommended for publication-quality MAG recovery.',
    act: 'Proceed with shallow data →', next: 'assembler_choice',
  },

  depth_note: {
    id: 'depth_note', step: 3, total: 9, type: 'info',
    cat: 'MID DEPTH', title: 'Moderate Depth — Co-Assembly Recommended',
    body: 'At 5–10 Gb, consider co-assembly of multiple samples from the same environment to improve coverage depth for less abundant taxa. Bin co-assembled contigs against individual sample coverage profiles.',
    tbl: [
      { v: 'Co-assembly', m: 'Merge reads from 3–10 similar samples before assembly — improves rare taxon recovery', s: 'c-g' },
      { v: 'Per-sample binning', m: 'Map each individual sample back to co-assembled contigs for differential coverage binning', s: 'c-g' },
      { v: 'Individual assembly', m: 'Each sample assembled separately — simpler but lower MAG completeness at this depth', s: 'c-y' },
    ],
    act: 'Continue to assembler selection →', next: 'assembler_choice',
  },

  assembler_choice: {
    id: 'assembler_choice', step: 4, total: 9, type: 'q',
    cat: 'META-ASSEMBLER', title: 'Metagenomic Assembler Selection',
    q: 'Which metagenome assembler will you use?',
    hint: 'MEGAHIT is faster and lower-memory; MetaSPAdes produces longer contigs but needs more RAM',
    opts: [
      { id: 'metaspades', label: 'MetaSPAdes', badge: 'Higher Quality', sub: 'Better contiguity for moderate-complexity samples; needs 64–256 GB RAM', next: 'binning_prep', hi: true },
      { id: 'megahit', label: 'MEGAHIT', badge: 'Low Memory', sub: 'Fast and memory-efficient; best for very large or complex datasets', next: 'binning_prep' },
      { id: 'flye_meta', label: 'Flye (--meta mode) for Nanopore', sub: 'For long-read metagenomes', next: 'binning_prep' },
    ],
  },

  binning_prep: {
    id: 'binning_prep', step: 5, total: 9, type: 'info',
    cat: 'BINNING PREPARATION', title: 'Prepare for Differential Coverage Binning',
    body: 'Binning accuracy depends on differential coverage profiles. Map all individual sample reads back to the assembled contigs to generate coverage tables — this is essential even if you co-assembled.',
    cmd: '# Map reads back to assembly (per sample)\nbwa-mem2 index assembly.fa\nbwa-mem2 mem assembly.fa sample_R1.fastq.gz sample_R2.fastq.gz \\\n  | samtools sort -o sample.sorted.bam\nsamtools index sample.sorted.bam\n\n# Calculate coverage depth\ncoverm contig -b sample.sorted.bam -o sample_coverage.tsv',
    tools: ['BWA-MEM2', 'samtools', 'CoverM (differential coverage)', 'Minimap2 (for Nanopore reads)'],
    act: 'Coverage calculated — proceed to binning →', next: 'binning_tools',
  },

  binning_tools: {
    id: 'binning_tools', step: 6, total: 9, type: 'ms',
    cat: 'BINNING TOOLS', title: 'Select Binning Algorithms',
    q: 'Which binning algorithms will you run?',
    note: 'Run 2–3 algorithms and use DAS Tool to generate consensus bins — always better than any single binner',
    alwaysLabel: 'DAS Tool (consensus binning — always run)',
    alwaysSub: 'Aggregates bins from all selected algorithms into the highest-quality consensus set',
    opts: [
      { id: 'metabat2', label: 'MetaBAT2', tools: ['MetaBAT2'], sub: 'Most widely used; uses TNF and differential coverage' },
      { id: 'concoct', label: 'CONCOCT', tools: ['CONCOCT'], sub: 'Uses PCA + Gaussian mixture models; good for complex samples' },
      { id: 'maxbin2', label: 'MaxBin2', tools: ['MaxBin2'], sub: 'Marker gene-based binning; good complement to MetaBAT2' },
      { id: 'semibin2', label: 'SemiBin2', tools: ['SemiBin2'], sub: 'Deep learning-based; best performance on recent benchmarks (2023+)' },
      { id: 'vamb', label: 'VAMB', tools: ['VAMB'], sub: 'Variational autoencoder; excellent for large-scale multi-sample binning' },
    ],
    next: 'mag_qc',
  },

  nanopore_meta_rec: {
    id: 'nanopore_meta_rec', step: 3, total: 9, type: 'rec',
    cat: 'NANOPORE METAGENOMICS', title: 'Long-Read Metagenomics Strategy',
    tagline: 'Nanopore long reads dramatically improve MAG completeness.',
    pts: [
      'Flye --meta mode is the preferred assembler for Nanopore metagenomic data',
      'Long reads (N50 >10 kb) span repeats that fragment short-read assemblies — better MAG contiguity',
      'Metabinner or SemiBin2 outperform older binners on long-read metagenome contigs',
      'Higher raw error rate means longer contigs but more polishing — use Medaka before binning',
      'Target 30–50 Gb for a complex marine or soil metagenome with Nanopore',
    ],
    tools: ['Flye (--meta)', 'Medaka', 'MetaBAT2', 'SemiBin2', 'DAS Tool', 'CheckM2'],
    act: 'Continue to binning →', next: 'binning_tools',
  },

  hybrid_meta_rec: {
    id: 'hybrid_meta_rec', step: 3, total: 9, type: 'rec',
    cat: 'HYBRID METAGENOMICS', title: 'Hybrid Metagenomics — Best MAG Recovery',
    tagline: 'Long reads + short reads = complete MAGs with accurate sequences.',
    pts: [
      'HiCanu or Flye --meta for Nanopore-primary assembly; use Illumina reads for polishing with Medaka + Polypolish',
      'Alternatively: assemble with MetaSPAdes (Illumina) and use Nanopore reads only for scaffolding with LINKS',
      'Hybrid approaches routinely recover near-complete MAGs (>90% completeness, <5% contamination) even from complex communities',
      'Differential coverage binning still requires mapping of individual sample reads to the hybrid assembly',
    ],
    tools: ['Flye (--meta)', 'MetaSPAdes', 'Medaka', 'Polypolish', 'MetaBAT2', 'SemiBin2', 'DAS Tool', 'CheckM2'],
    act: 'Continue to binning →', next: 'binning_tools',
  },

  mag_qc: {
    id: 'mag_qc', step: 7, total: 9, type: 'q',
    cat: 'MAG QUALITY', title: 'MAG Quality Assessment',
    q: 'What does CheckM2 report for your MAG bins?',
    hint: 'MIMAG standards: High-quality = >90% completeness, <5% contamination; Medium = >50% completeness, <10% contamination',
    tools: ['CheckM2', 'QUAST', 'GUNC (contamination detection)', 'assembly-stats'],
    opts: [
      { id: 'hq_mags', label: 'High-quality MAGs present — >90% completeness, <5% contamination', sub: 'Proceed to taxonomy and annotation', next: 'mag_taxonomy', hi: true },
      { id: 'mq_mags', label: 'Medium-quality MAGs — 50–90% completeness, <10% contamination', sub: 'Publishable with transparent reporting', next: 'mag_taxonomy' },
      { id: 'lq_mags', label: 'Low-quality bins — <50% completeness or >10% contamination', sub: 'Investigate causes before proceeding', next: 'mag_improve' },
    ],
  },

  mag_improve: {
    id: 'mag_improve', step: 7, total: 9, type: 'rec',
    cat: 'MAG IMPROVEMENT', title: 'Improving Low-Quality MAG Bins',
    tagline: 'Most low-quality bins can be improved with the right strategy.',
    pts: [
      'High contamination (>10%): run GUNC to detect chimeric bins — unbinning and re-binning is required',
      'Low completeness (<50%): increase sequencing depth, add more samples to co-assembly, or try a different binner',
      'Try SemiBin2 — it consistently outperforms MetaBAT2 and CONCOCT on benchmarks since 2023',
      'Refine bins manually with mmgenome2 or anvi\'o — visual bin refinement can dramatically improve quality',
      'For contamination: use anvi\'o interactive binning to manually exclude contaminating contigs',
    ],
    tools: ['GUNC', "anvi'o (manual refinement)", 'mmgenome2', 'SemiBin2', 'CheckM2 (re-run after refinement)'],
    act: 'Re-assess MAG quality →', next: 'mag_qc',
  },

  mag_taxonomy: {
    id: 'mag_taxonomy', step: 8, total: 9, type: 'info',
    cat: 'MAG TAXONOMY', title: 'Classifying MAGs with GTDB-Tk',
    body: 'GTDB-Tk is the current standard for MAG taxonomy. It places MAGs in a curated phylogenomic tree and assigns GTDB taxonomy (which may differ from NCBI taxonomy).',
    cmd: 'gtdbtk classify_wf \\\n  --genome_dir mag_bins/ \\\n  --extension fa \\\n  --out_dir gtdbtk_output/ \\\n  --cpus 32\n\n# Summary output\ncat gtdbtk_output/gtdbtk.bac120.summary.tsv',
    tools: ['GTDB-Tk v2', 'FastANI', 'skani', 'PhyloPhlAn3 (phylogenomics)'],
    act: 'Continue to final checklist →', next: 'mag_checklist',
  },

  mag_checklist: {
    id: 'mag_checklist', step: 9, total: 9, type: 'checklist',
    cat: 'MAG PUBLICATION CHECKLIST', title: 'MIMAG Standards Checklist',
    intro: 'The Minimum Information about a Metagenome-Assembled Genome (MIMAG) standards define publication requirements.',
    items: [
      { id: 'checkm2', label: 'CheckM2 completeness and contamination reported', required: true },
      { id: 'mimag_hq', label: 'MAGs classified as HQ (>90% complete, <5% contam) or MQ (>50%, <10%) per MIMAG', required: true },
      { id: 'gtdbtk', label: 'GTDB-Tk taxonomy assigned to all MAGs', required: true },
      { id: 'trna_rrna', label: 'tRNA and rRNA genes identified (required for HQ MAGs)', required: true, tip: 'tRNAscan-SE + Barrnap — MIMAG HQ standard requires ≥18 tRNAs and 23S/16S/5S rRNAs' },
      { id: 'contig_count', label: 'Contig count and N50 reported in methods', required: true },
      { id: 'gunc', label: 'GUNC chimera detection run on all HQ MAGs', required: false },
      { id: 'deposited', label: 'MAG sequences deposited in NCBI/ENA with BioProject', required: true },
      { id: 'reads_deposited', label: 'Raw metagenome reads deposited', required: true },
      { id: 'metadata', label: 'Sample metadata (GPS, date, environment, depth) submitted', required: true },
    ],
    scoring: {
      low: 'Not publication-ready — critical MIMAG fields missing',
      mid: 'Draft stage — fill in required fields',
      high: 'Near-ready — minor items outstanding',
      top: 'MIMAG Compliant — ready for submission',
    },
    next: '__hub__',
  },
};
