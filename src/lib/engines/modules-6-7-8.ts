import type { DecisionTree } from './types';

// ══════════════════════════════════════════════════
// MODULE 6 — Functional Prediction Wizard (PICRUSt2)
// ══════════════════════════════════════════════════
export const functionalPredictionTree: DecisionTree = {
  has_16s: {
    id: 'has_16s', step: 1, total: 7, type: 'q',
    cat: 'DATA INVENTORY', title: 'PICRUSt2 Readiness Check',
    q: 'Do you have a processed 16S rRNA amplicon dataset?',
    hint: 'PICRUSt2 requires a feature table and representative sequences from QIIME2 or DADA2 output',
    opts: [
      { id: 'yes_16s', label: 'Yes — 16S amplicon data processed', sub: 'QIIME2 or DADA2 output available', next: 'feature_table' },
      { id: 'raw_16s', label: 'Yes — raw amplicon reads, not yet processed', sub: 'Need to run QIIME2 first', next: 'process_first' },
      { id: 'shotgun', label: 'I have shotgun metagenomics, not 16S', sub: 'Use HUMAnN3 instead of PICRUSt2', next: 'use_humann' },
      { id: 'no_data', label: 'No amplicon data yet', sub: 'Need to generate 16S data first', next: 'no_data_block' },
    ],
  },

  no_data_block: {
    id: 'no_data_block', type: 'block', isE: false, icon: '↗',
    cat: 'NO DATA', title: 'Generate 16S Amplicon Data First',
    body: 'PICRUSt2 functional prediction requires 16S amplicon sequencing data. Use the Sequencing Strategy Advisor to plan your amplicon sequencing run.',
    steps: [
      'Extract total DNA from your samples',
      'Amplify V3-V4 or V4 region with appropriate primers (515F/806R for V4)',
      'Sequence on Illumina MiSeq PE300 (600-cycle v3 kit)',
      'Process with QIIME2 DADA2 plugin to generate feature table and representative sequences',
    ],
    tools: ['Illumina MiSeq PE300', 'QIIME2', 'DADA2', 'Sequencing Strategy Advisor (this hub)'],
    act: '← Return to planning', next: 'has_16s',
  },

  process_first: {
    id: 'process_first', step: 2, total: 7, type: 'info',
    cat: 'QIIME2 PROCESSING', title: 'Process 16S Reads with QIIME2 First',
    body: 'Before running PICRUSt2, you need to process your raw reads into a feature table (ASV/OTU counts) and representative sequences (FASTA) using QIIME2.',
    cmd: '# Import data\nqiime tools import \\\n  --type SampleData[PairedEndSequencesWithQuality] \\\n  --input-path manifest.tsv \\\n  --output-path demux.qza\n\n# Denoise with DADA2\nqiime dada2 denoise-paired \\\n  --i-demultiplexed-seqs demux.qza \\\n  --p-trim-left-f 0 --p-trim-left-r 0 \\\n  --p-trunc-len-f 240 --p-trunc-len-r 200 \\\n  --o-table feature_table.qza \\\n  --o-representative-sequences rep_seqs.qza \\\n  --o-denoising-stats stats.qza',
    tools: ['QIIME2 (2024.5+)', 'DADA2', 'Cutadapt plugin'],
    act: 'Data processed — continue →', next: 'feature_table',
  },

  use_humann: {
    id: 'use_humann', step: 2, total: 7, type: 'rec',
    cat: 'USE HUMANN3', title: 'Shotgun Metagenomics → HUMAnN3',
    tagline: 'PICRUSt2 is for 16S data only. Shotgun data uses HUMAnN3.',
    pts: [
      'HUMAnN3 (Human Microbiome Project Unified Metabolic Analysis Network) profiles pathway abundance from shotgun reads',
      'PICRUSt2 inference from 16S has inherent accuracy limitations — shotgun data + HUMAnN3 is more accurate',
      'HUMAnN3 output: pathway abundance tables, gene family tables, stratified by taxon contribution',
      'Statistical testing: MaAsLin2 for differential abundance of metabolic pathways',
    ],
    tools: ['HUMAnN3', 'MetaPhlAn4', 'MaAsLin2', 'Kraken2 + Bracken', 'Functional Annotation Wizard (this hub)'],
    act: 'Return to hub →', next: '__hub__',
  },

  feature_table: {
    id: 'feature_table', step: 3, total: 7, type: 'q',
    cat: 'FEATURE TABLE', title: 'Feature Table Check',
    q: 'Do you have a feature table (ASV or OTU counts per sample)?',
    opts: [
      { id: 'has_ft', label: 'Yes — feature table available (BIOM or TSV format)', sub: 'QIIME2 .qza artifact or raw BIOM file', next: 'rep_seqs' },
      { id: 'no_ft', label: 'No — only a taxonomy table / relative abundance', sub: 'Need raw ASV/OTU count table for PICRUSt2', next: 'ft_required_block' },
    ],
  },

  ft_required_block: {
    id: 'ft_required_block', type: 'block', isE: true, icon: '✗',
    cat: 'MISSING: FEATURE TABLE', title: 'Feature Table Required',
    body: 'PICRUSt2 requires raw feature counts (ASVs or OTUs), not relative abundances. Relative abundance tables have lost the count information needed for accurate functional prediction.',
    steps: [
      'Return to your QIIME2 pipeline and export the feature-table.qza artifact as a BIOM file',
      'Command: qiime tools export --input-path feature-table.qza --output-path feature_table_export/',
      'Convert BIOM to TSV: biom convert -i feature_table_export/feature-table.biom -o table.tsv --to-tsv',
    ],
    tools: ['QIIME2', 'biom-format Python package'],
    act: '← Return with feature table', next: 'feature_table',
  },

  rep_seqs: {
    id: 'rep_seqs', step: 4, total: 7, type: 'q',
    cat: 'REPRESENTATIVE SEQUENCES', title: 'Representative Sequences Check',
    q: 'Do you have representative sequences (FASTA) for each ASV/OTU?',
    opts: [
      { id: 'has_repseqs', label: 'Yes — rep-seqs.fasta or rep-seqs.qza available', next: 'taxonomy_check' },
      { id: 'no_repseqs', label: 'No — only OTU IDs without sequences', sub: 'PICRUSt2 requires sequences for phylogenetic placement', next: 'repseqs_required' },
    ],
  },

  repseqs_required: {
    id: 'repseqs_required', type: 'block', isE: true, icon: '✗',
    cat: 'MISSING: SEQUENCES', title: 'Representative Sequences Required',
    body: 'PICRUSt2 places your ASVs into a reference phylogenetic tree to infer functional genes. Without the actual sequences, phylogenetic placement is impossible.',
    steps: [
      'Export representative sequences from your QIIME2 artifact: qiime tools export --input-path rep-seqs.qza --output-path rep_seqs_export/',
      'The output will be a dna-sequences.fasta file',
      'If using DADA2 standalone: the seqtab output contains all ASV sequences',
    ],
    tools: ['QIIME2', 'DADA2'],
    act: '← Return with sequences', next: 'rep_seqs',
  },

  taxonomy_check: {
    id: 'taxonomy_check', step: 5, total: 7, type: 'q',
    cat: 'TAXONOMY', title: 'Taxonomy Assignment',
    q: 'Has taxonomy been assigned to your ASVs?',
    opts: [
      { id: 'has_tax', label: 'Yes — taxonomy.tsv or taxonomy.qza available', sub: 'SILVA or GTDB classifier applied', next: 'picrust_ready' },
      { id: 'no_tax', label: 'No taxonomy assigned yet', sub: 'Taxonomy is optional for PICRUSt2 but required for most downstream analyses', next: 'tax_optional_note' },
    ],
  },

  tax_optional_note: {
    id: 'tax_optional_note', step: 5, total: 7, type: 'info',
    cat: 'TAXONOMY OPTIONAL', title: 'Taxonomy Not Required for PICRUSt2',
    body: 'PICRUSt2 does not require taxonomy — it uses phylogenetic placement of sequences. However, you will need taxonomy for interpretation and for most diversity analyses.',
    tbl: [
      { v: 'PICRUSt2', m: 'Does not require taxonomy — placement is sequence-based', s: 'c-g' },
      { v: 'QIIME2 diversity', m: 'Requires taxonomy for visualisation and bar charts', s: 'c-y' },
      { v: 'Diff. abundance', m: 'Taxonomy needed to interpret which taxa drive pathway differences', s: 'c-y' },
    ],
    tools: ['QIIME2 q2-feature-classifier (SILVA)', 'DADA2 assignTaxonomy'],
    act: 'Continue without taxonomy →', next: 'picrust_ready',
  },

  picrust_ready: {
    id: 'picrust_ready', step: 6, total: 7, type: 'rec',
    cat: 'PICRUST2 READY', title: 'Ready to Run PICRUSt2',
    tagline: 'All required inputs confirmed. Your workflow is:',
    pts: [
      'Run PICRUSt2 pipeline: place ASVs in reference tree → hidden state prediction → sample pathway abundances',
      'Output: predicted MetaCyc pathway abundances, EC numbers, and KO terms per sample',
      'Normalise by 16S copy number — PICRUSt2 does this automatically, but verify the copy number database is current',
      'Statistical testing: use ALDEx2 or ANCOM-BC for differential pathway abundance (not raw PICRUSt2 output)',
      'Validate: compare PICRUSt2 predictions against shotgun metagenomics where possible for your environment',
    ],
    tools: ['PICRUSt2', 'QIIME2 q2-picrust2 plugin', 'ALDEx2', 'ANCOM-BC', 'MaAsLin2', 'KEGG Mapper'],
    act: 'View readiness summary →', next: 'picrust_checklist',
  },

  picrust_checklist: {
    id: 'picrust_checklist', step: 7, total: 7, type: 'checklist',
    cat: 'PICRUST2 CHECKLIST', title: 'PICRUSt2 Input Checklist',
    items: [
      { id: 'ft_ready', label: 'Feature table — raw ASV/OTU counts (not relative abundance)', required: true },
      { id: 'repseq_ready', label: 'Representative sequences — FASTA with one sequence per ASV', required: true },
      { id: 'tax_ready', label: 'Taxonomy assignments — SILVA or GTDB (optional for PICRUSt2)', required: false },
      { id: 'metadata_ready', label: 'Sample metadata file — matches sample IDs in feature table', required: true },
      { id: 'qiime2_env', label: 'QIIME2 environment configured (qiime info shows correct version)', required: true },
      { id: 'no_rarefaction', label: 'Rarefaction NOT applied — PICRUSt2 needs raw counts', required: true, tip: 'Rarefaction before PICRUSt2 reduces statistical power — use ALDEx2 which handles compositionality' },
    ],
    scoring: {
      low: 'Not Ready — missing critical files',
      mid: 'Almost Ready — fix red items',
      high: 'Ready to Run PICRUSt2',
      top: 'All Set — proceed with full confidence',
    },
    next: '__hub__',
  },
};

// ══════════════════════════════════════════════════
// MODULE 7 — Differential Abundance Method Selector
// ══════════════════════════════════════════════════
export const diffAbundanceTree: DecisionTree = {
  data_type: {
    id: 'data_type', step: 1, total: 6, type: 'q',
    cat: 'DATA TYPE', title: 'What Type of Count Data Do You Have?',
    q: 'What is the nature of your abundance data?',
    hint: 'The statistical properties of your data — not your preference — determine the correct method',
    opts: [
      { id: 'raw_counts', label: 'Raw count data (integer reads per feature)', sub: 'OTU table, ASV table, gene count table', next: 'sample_size' },
      { id: 'rel_abund', label: 'Relative abundance (percentages or proportions)', sub: 'Already normalized — different methods apply', next: 'relative_abund_warn' },
      { id: 'rna_counts', label: 'RNA-seq or metatranscriptome count data', sub: 'Gene expression counts from DESeq2/edgeR domain', next: 'deseq2_rec' },
    ],
  },

  relative_abund_warn: {
    id: 'relative_abund_warn', step: 1, total: 6, type: 'info',
    cat: 'DATA ISSUE', title: 'Relative Abundance — Compositional Data Warning',
    body: 'If you have relative abundance data (proportions that sum to 1 or 100%), you are working with compositional data. Standard statistical tests assume independence and are invalid for compositions.',
    tbl: [
      { v: 'Proportions sum to 1', m: 'Compositional — use ALDEx2 or ANCOM-BC', s: 'c-y' },
      { v: 'Raw counts available', m: 'Start with raw counts — let the method normalize internally', s: 'c-g' },
      { v: 'Log-ratio transforms', m: 'CLR, ALR, ILR — valid for compositional DA testing', s: 'c-g' },
    ],
    caution: 'Never apply DESeq2 or edgeR directly to pre-normalized or relative abundance data. These methods expect raw integer counts.',
    act: 'I understand — I have raw counts →', next: 'sample_size',
  },

  sample_size: {
    id: 'sample_size', step: 2, total: 6, type: 'q',
    cat: 'SAMPLE SIZE', title: 'Study Sample Size',
    q: 'How many samples per group do you have?',
    hint: 'Small sample sizes severely limit statistical power for differential abundance analysis',
    opts: [
      { id: 'large_n', label: '≥ 20 samples per group', sub: 'Good statistical power for all methods', next: 'data_nature' },
      { id: 'medium_n', label: '10–19 samples per group', sub: 'Sufficient for most methods — apply FDR correction', next: 'data_nature' },
      { id: 'small_n', label: '< 10 samples per group', sub: 'Limited power — interpret results with caution', next: 'small_sample_note' },
    ],
  },

  small_sample_note: {
    id: 'small_sample_note', step: 2, total: 6, type: 'info',
    cat: 'SMALL SAMPLE WARNING', title: 'Limited Power with < 10 Samples per Group',
    body: 'With fewer than 10 samples per group, all differential abundance tests have low power and high false discovery rates. Results should be considered exploratory, not confirmatory.',
    tbl: [
      { v: '<5 per group', m: 'Not recommended for any DA test — results unreliable', s: 'c-r' },
      { v: '5–9 per group', m: 'Exploratory only; report effect sizes, not just p-values', s: 'c-y' },
      { v: '≥10 per group', m: 'Minimum for robust DA analysis', s: 'c-g' },
    ],
    caution: 'Do not perform DESeq2 with fewer than 5 samples per group. It will produce results but they are statistically invalid.',
    act: 'Proceed with small sample (exploratory) →', next: 'data_nature',
  },

  data_nature: {
    id: 'data_nature', step: 3, total: 6, type: 'q',
    cat: 'DATA NATURE', title: 'Nature of Your Microbiome Data',
    q: 'Which best describes your count data?',
    opts: [
      { id: 'sparse', label: 'Sparse / zero-inflated — many zeros across features', sub: 'Typical for 16S amplicon or low-depth metagenomics', next: 'sparse_methods' },
      { id: 'compositional', label: 'Known compositional constraints — features are parts of a whole', sub: '16S, metagenomics, any sequencing-based data', next: 'compositional_methods' },
      { id: 'not_sure', label: 'Not sure — standard microbiome count table', sub: 'Default recommendation for typical studies', next: 'compositional_methods' },
    ],
  },

  sparse_methods: {
    id: 'sparse_methods', step: 4, total: 6, type: 'q',
    cat: 'SPARSE DATA', title: 'Recommended Methods for Sparse Data',
    q: 'What is the main purpose of your analysis?',
    opts: [
      { id: 'hypothesis', label: 'Hypothesis testing — which taxa differ between groups?', sub: 'Identify specific differentially abundant taxa', next: 'ancom_rec' },
      { id: 'discovery', label: 'Discovery — generate hypotheses from unbiased analysis', sub: 'Broad scan for potential differences', next: 'lefse_note' },
    ],
  },

  compositional_methods: {
    id: 'compositional_methods', step: 4, total: 6, type: 'q',
    cat: 'METHOD SELECTION', title: 'Compositional Data Analysis Methods',
    q: 'Have you rarefied your data?',
    hint: 'Rarefaction discards data and reduces power — modern methods handle unequal sequencing depth internally',
    opts: [
      { id: 'rarefied', label: 'Yes — data has been rarefied', sub: 'Standard for legacy workflows but not recommended for DA testing', next: 'rarefaction_warn' },
      { id: 'not_rarefied', label: 'No — raw counts, unequal library sizes', sub: 'Correct approach for modern compositional DA methods', next: 'ancom_rec', hi: true },
    ],
  },

  rarefaction_warn: {
    id: 'rarefaction_warn', step: 4, total: 6, type: 'info',
    cat: 'RAREFACTION WARNING', title: 'Rarefaction Before DA Testing Is Suboptimal',
    body: 'Rarefaction discards a large fraction of your data to equalize library sizes. Modern DA methods (ANCOM-BC2, ALDEx2) handle unequal library sizes internally through normalization — they do not require rarefaction.',
    tbl: [
      { v: 'Rarefaction + t-test', m: 'Legacy approach — data loss + invalid assumptions', s: 'c-r' },
      { v: 'Rarefaction + LEfSe', m: 'Common but discards data; exploratory use only', s: 'c-y' },
      { v: 'ANCOM-BC2 (raw counts)', m: 'Current gold standard — no rarefaction needed', s: 'c-g' },
      { v: 'ALDEx2 (raw counts)', m: 'Robust CLR-based method — handles zeros well', s: 'c-g' },
    ],
    act: 'I understand — use raw counts →', next: 'ancom_rec',
  },

  ancom_rec: {
    id: 'ancom_rec', step: 5, total: 6, type: 'rec',
    cat: 'RECOMMENDATION: ANCOM-BC2', title: 'ANCOM-BC2 — Current Gold Standard',
    tagline: 'Best-in-class method for compositional microbiome differential abundance.',
    pts: [
      'ANCOM-BC2 (Analysis of Compositions of Microbiomes with Bias Correction 2) is the current best-practice method for 16S and metagenomics DA analysis (2024)',
      'Handles compositional bias, unequal library sizes, and zero-inflation natively — no pre-normalization required',
      'Provides valid FDR-corrected p-values and effect size estimates (W-statistic)',
      'Available as an R/Bioconductor package: library(ANCOMBC)',
      'For complex designs (longitudinal, mixed effects): use ANCOM-BC2 with appropriate model formula',
    ],
    tools: ['ANCOMBC (R/Bioconductor)', 'ALDEx2 (R/Bioconductor)', 'MaAsLin2 (multi-variable)', 'qiime2-composition plugin'],
    act: 'See method comparison →', next: 'method_comparison',
  },

  deseq2_rec: {
    id: 'deseq2_rec', step: 4, total: 6, type: 'rec',
    cat: 'RECOMMENDATION: DESEQ2', title: 'DESeq2 for RNA-seq and Transcriptomics',
    tagline: 'The standard for RNA-seq differential expression — not appropriate for raw 16S counts.',
    pts: [
      'DESeq2 uses negative binomial distribution which is appropriate for RNA-seq count data',
      'For metatranscriptomics: DESeq2 is valid on gene/transcript counts from HUMAnN3 output',
      'Warning: Do not apply DESeq2 directly to 16S OTU/ASV tables — it is not designed for compositional data',
      'If you have both 16S and metatranscriptomics: use ANCOM-BC2 for 16S, DESeq2 for gene expression',
    ],
    tools: ['DESeq2 (R/Bioconductor)', 'edgeR (R/Bioconductor)', 'limma-voom', 'featureCounts'],
    act: 'See method comparison →', next: 'method_comparison',
  },

  lefse_note: {
    id: 'lefse_note', step: 5, total: 6, type: 'info',
    cat: 'LEfSe NOTES', title: 'LEfSe — Exploratory Use Only',
    body: 'LEfSe (Linear discriminant analysis Effect Size) is widely used but has known statistical limitations. It is suitable for hypothesis generation but not for confirmatory testing.',
    tbl: [
      { v: 'FDR control', m: 'LEfSe does not properly control FDR — high false positives with >100 features', s: 'c-r' },
      { v: 'Use case', m: 'Exploratory discovery in study groups with clear biological signal', s: 'c-y' },
      { v: 'Better alternative', m: 'ANCOM-BC2 or ALDEx2 for confirmatory analysis', s: 'c-g' },
    ],
    caution: 'A 2023 benchmarking study found LEfSe had the highest false discovery rate of all tested DA methods. Use for discovery only.',
    act: 'Continue to method summary →', next: 'method_comparison',
  },

  method_comparison: {
    id: 'method_comparison', step: 6, total: 6, type: 'info',
    cat: 'METHOD COMPARISON', title: 'Differential Abundance Method Summary',
    body: 'Select the method that matches your data type, sample size, and analytical goal. Methods are listed from most to least recommended for standard microbiome compositional data.',
    tbl: [
      { v: 'ANCOM-BC2', m: 'Best FDR control; handles compositionality; ≥10 samples/group; 16S and metagenomics', s: 'c-g' },
      { v: 'ALDEx2', m: 'CLR-based; robust for small samples; any compositional data; Bayesian approach', s: 'c-g' },
      { v: 'MaAsLin2', m: 'Multi-variable regression; best for complex designs with confounders', s: 'c-y' },
      { v: 'DESeq2', m: 'RNA-seq standard; valid for metatranscriptomics; not for raw 16S OTU tables', s: 'c-y' },
      { v: 'LEfSe', m: 'Exploratory only; no FDR control; do not use for confirmatory analysis', s: 'c-o' },
      { v: 'Wilcoxon + FDR', m: 'Non-parametric fallback; only when all other methods fail', s: 'c-o' },
    ],
    act: 'Return to hub →', next: '__hub__',
  },
};

// ══════════════════════════════════════════════════
// MODULE 8 — Genome Mining Wizard
// ══════════════════════════════════════════════════
export const genomeMiningTree: DecisionTree = {
  input_type: {
    id: 'input_type', step: 1, total: 8, type: 'q',
    cat: 'INPUT DATA', title: 'Genome Mining Input',
    q: 'What is your starting material?',
    opts: [
      { id: 'isolate_genome', label: 'Isolated bacterial genome (WGS assembly)', sub: 'Single organism, high-quality assembly', next: 'genome_quality' },
      { id: 'mag', label: 'Metagenome-assembled genome (MAG)', sub: 'Binned from environmental metagenome', next: 'mag_quality_check' },
      { id: 'metagenome', label: 'Raw metagenome assembly (all contigs)', sub: 'Mine BGCs directly from assembled metagenome', next: 'meta_mining_rec' },
    ],
  },

  mag_quality_check: {
    id: 'mag_quality_check', step: 2, total: 8, type: 'q',
    cat: 'MAG QUALITY', title: 'MAG Quality for Genome Mining',
    q: 'What is the CheckM2 quality of your MAG?',
    hint: 'BGC mining from incomplete MAGs will miss entire clusters and produce truncated predictions',
    opts: [
      { id: 'hq_mag', label: 'High-quality MAG — >90% complete, <5% contamination', sub: 'Suitable for genome mining', next: 'discovery_goal', hi: true },
      { id: 'mq_mag', label: 'Medium-quality MAG — 50–90% complete', sub: 'Mining possible but clusters may be fragmented', next: 'partial_mag_note', w: true },
      { id: 'lq_mag', label: 'Low-quality MAG — <50% complete', sub: 'Not recommended for BGC analysis', next: 'lq_mag_block', e: true },
    ],
  },

  lq_mag_block: {
    id: 'lq_mag_block', type: 'block', isE: true, icon: '✗',
    cat: 'QUALITY TOO LOW', title: 'MAG Too Incomplete for Reliable BGC Mining',
    body: 'A MAG with <50% completeness is missing most of its genome. BGC predictions will be heavily truncated, and most biosynthetic modules will be absent or fragmented.',
    steps: [
      'Improve MAG quality using the MAG Recovery module — try SemiBin2 or manual refinement with anvi\'o',
      'Increase sequencing depth to recover more contigs for this organism',
      'Alternatively: mine the full metagenome assembly and filter for contigs belonging to this organism',
    ],
    tools: ['MAG Recovery Module (this hub)', "anvi'o", 'SemiBin2', 'antiSMASH web (full metagenome input)'],
    act: '← Return to start', next: 'input_type',
  },

  partial_mag_note: {
    id: 'partial_mag_note', step: 2, total: 8, type: 'info',
    cat: 'PARTIAL MAG WARNING', title: 'Mining a Medium-Quality MAG',
    body: 'BGC mining from medium-quality MAGs will identify BGCs on available contigs but will miss clusters in the missing genome fraction. Report incompleteness in your methods.',
    tbl: [
      { v: 'Complete BGCs', m: 'Will be detected if their contigs are present in the MAG', s: 'c-y' },
      { v: 'Truncated BGCs', m: 'BGCs split across contig edges — common at 50–90% completeness', s: 'c-y' },
      { v: 'Missing BGCs', m: 'Entirely absent BGCs in the missing fraction — not detectable', s: 'c-r' },
    ],
    act: 'Proceed with MAG mining (with caveats) →', next: 'discovery_goal',
  },

  genome_quality: {
    id: 'genome_quality', step: 2, total: 8, type: 'q',
    cat: 'GENOME QUALITY', title: 'Assembly Quality for BGC Mining',
    q: 'What is your genome assembly quality?',
    opts: [
      { id: 'closed', label: 'Complete / closed genome — single circular chromosome', sub: 'No BGC fragmentation possible — best results', next: 'discovery_goal', hi: true },
      { id: 'good_draft', label: 'Good draft — N50 >100 kb, completeness >95%', sub: 'Most BGCs will be intact — minor fragmentation at contig edges', next: 'discovery_goal' },
      { id: 'fragmented', label: 'Fragmented — N50 <50 kb, many contigs', sub: 'PKS/NRPS clusters will be split — long reads needed', next: 'fragment_warning', w: true },
    ],
  },

  fragment_warning: {
    id: 'fragment_warning', step: 2, total: 8, type: 'info',
    cat: 'FRAGMENTATION WARNING', title: 'Fragmented Assembly Will Split BGCs',
    body: 'PKS and NRPS biosynthetic gene clusters span 20–150 kb. A fragmented assembly with N50 <50 kb will split most large clusters across multiple contigs, making reconstruction impossible.',
    tbl: [
      { v: 'RiPP clusters', m: '1–10 kb — survive in fragmented assemblies', s: 'c-g' },
      { v: 'Terpene clusters', m: '5–30 kb — mostly intact in good drafts', s: 'c-y' },
      { v: 'NRPS clusters', m: '30–100+ kb — require contiguous assembly', s: 'c-r' },
      { v: 'Hybrid PKS/NRPS', m: 'Up to 150 kb — require closed genome for complete detection', s: 'c-r' },
    ],
    caution: 'Use the Genome Assembly Strategy Selector to upgrade to hybrid assembly before genome mining if NRPS/PKS BGCs are your target.',
    act: 'Proceed with fragmented assembly (RiPP/terpene focus) →', next: 'discovery_goal',
  },

  meta_mining_rec: {
    id: 'meta_mining_rec', step: 2, total: 8, type: 'rec',
    cat: 'METAGENOME MINING', title: 'BGC Mining from Raw Metagenome',
    tagline: 'Mine all organisms at once — without binning first.',
    pts: [
      'antiSMASH and GECCO both support direct input of metagenome assemblies without prior binning',
      'This approach discovers BGCs from unculturable organisms but loses taxonomic context',
      'Use BiG-SCAPE to cluster metagenome BGCs with reference BGCs from MIBiG',
      'Follow up: bin contigs containing BGCs of interest to recover the producing organism',
    ],
    tools: ['antiSMASH 7 (--metagenome flag)', 'GECCO', 'BiG-SCAPE', 'MIBiG 3.1', 'ARTS2'],
    act: 'Continue to discovery goals →', next: 'discovery_goal',
  },

  discovery_goal: {
    id: 'discovery_goal', step: 3, total: 8, type: 'ms',
    cat: 'DISCOVERY TARGETS', title: 'What Are You Mining For?',
    q: 'Select all target compound classes:',
    note: 'antiSMASH detects all BGC types — selected targets get additional focused analysis',
    alwaysLabel: 'antiSMASH 7 (detects all BGC types)',
    alwaysSub: 'GECCO · BiG-SCAPE / BiG-SLICE · MIBiG comparison',
    opts: [
      { id: 'nrps', label: 'NRPS — non-ribosomal peptides', tools: ['antiSMASH 7', 'PRISM 4', 'NRPSpredictor2', 'NORINE database'], badge: 'Drug Discovery' },
      { id: 'pks', label: 'PKS — polyketides', tools: ['antiSMASH 7', 'PRISM 4', 'PKS Predictor', 'ClusterCAD'] },
      { id: 'ripp', label: 'RiPPs — ribosomally synthesised peptides', tools: ['antiSMASH 7', 'BAGEL4', 'RiPPER', 'RODEO 2'] },
      { id: 'amp', label: 'AMPs — antimicrobial peptides', tools: ['AMPSphere', 'AMPlify', 'macrel', 'ampir (R)', 'DRAMP database'] },
      { id: 'terpene', label: 'Terpenes and terpenoids', tools: ['antiSMASH 7', 'TerpeneMiner', 'MIBiG database'] },
    ],
    next: 'mining_workflow',
  },

  mining_workflow: {
    id: 'mining_workflow', step: 4, total: 8, type: 'rec',
    cat: 'MINING PIPELINE', title: 'Your Genome Mining Workflow',
    tagline: 'Run this pipeline in sequence for comprehensive BGC discovery.',
    pts: [
      'Step 1 — antiSMASH 7: Submit genome to antiSMASH web server or local install. Produces annotated BGC regions with cluster type, completeness, and MIBiG hits',
      'Step 2 — GECCO: Complements antiSMASH with a machine-learning approach; detects novel BGC types missed by rule-based methods',
      'Step 3 — BiG-SCAPE / BiG-SLICE: Cluster your BGCs with all known BGCs in MIBiG — identifies novelty (distance from known clusters)',
      'Step 4 — ARTS2: Identify biosynthetic genes near resistance genes — a strong predictor of bioactivity',
      'Step 5 — Structure prediction: For RiPPs/AMPs use AlphaFold2 + GNPS Molecular Networking for dereplication',
    ],
    tools: ['antiSMASH 7 (web)', 'GECCO', 'BiG-SCAPE', 'BiG-SLICE', 'ARTS2', 'MIBiG 3.1', 'AlphaFold2', 'GNPS'],
    act: 'Continue to experimental validation →', next: 'validation_guidance',
  },

  validation_guidance: {
    id: 'validation_guidance', step: 5, total: 8, type: 'rec',
    cat: 'EXPERIMENTAL VALIDATION', title: 'From Prediction to Validated Compound',
    tagline: 'Genome mining gives candidates — wet-lab work gives confirmation.',
    pts: [
      'Prioritise BGCs with: high MIBiG distance (novelty), resistance genes nearby (ARTS2), complete cluster structure',
      'Confirm expression: RT-qPCR of key biosynthetic genes in inducing vs. non-inducing conditions',
      'Bioactivity screening: disk diffusion / MIC assays against indicator organisms for antibacterial/antifungal activity',
      'LC-MS/MS: compare extracts from wild-type vs. BGC knockout or heterologous expression strain',
      'Molecular networking (GNPS/FBMN): dereplication and compound family identification from LC-MS data',
    ],
    tools: ['RT-qPCR', 'LC-MS/MS', 'GNPS / FBMN (Molecular Networking)', 'MZmine 3', 'sirius (structure elucidation)', 'AlphaFold2'],
    act: 'Return to hub →', next: '__hub__',
  },
};
