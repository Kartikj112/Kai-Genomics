import type { DecisionTree } from './types';

export const sequencingAdvisorTree: DecisionTree = {
  organism_type: {
    id: 'organism_type', step: 1, total: 8, type: 'q',
    cat: 'ORGANISM', title: 'What Are You Sequencing?',
    q: 'What is your sample type?',
    hint: 'This is the single most important factor in sequencing strategy selection',
    opts: [
      { id: 'isolate', label: 'Single bacterial or fungal isolate', sub: 'Pure culture from a known organism', next: 'isolate_goal' },
      { id: 'community', label: 'Microbial community / environmental sample', sub: 'Soil, water, host tissue, biofilm — multiple organisms', next: 'community_goal' },
      { id: 'host', label: 'Host-associated microbiome', sub: 'Gut, oral, skin, marine invertebrate microbiome', next: 'community_goal' },
      { id: 'amplified', label: 'Already amplified — 16S / ITS amplicons in hand', sub: 'You have PCR products ready for sequencing', next: 'amplicon_depth' },
    ],
  },

  isolate_goal: {
    id: 'isolate_goal', step: 2, total: 8, type: 'q',
    cat: 'RESEARCH GOAL', title: 'Isolate Sequencing Goal',
    q: 'What do you need to achieve with this isolate?',
    opts: [
      { id: 'id_only', label: 'Identify the species only', sub: 'No downstream genomic analysis needed', next: 'id_strategy' },
      { id: 'genome_draft', label: 'Draft genome + annotation', sub: 'Annotated assembly as the primary deliverable', next: 'budget_q' },
      { id: 'genome_complete', label: 'Complete closed genome', sub: 'Publication, novel species, plasmid resolution', next: 'recommend_hybrid', hi: true },
      { id: 'drug_discovery', label: 'Natural product / drug discovery', sub: 'BGC mining, AMP discovery, secondary metabolites', next: 'recommend_hybrid', hi: true },
      { id: 'amr_virulence', label: 'AMR / virulence profiling', sub: 'Clinical or epidemiological characterization', next: 'recommend_illumina' },
    ],
  },

  community_goal: {
    id: 'community_goal', step: 2, total: 8, type: 'q',
    cat: 'RESEARCH GOAL', title: 'Community Study Goal',
    q: 'What do you need from this microbial community sample?',
    opts: [
      { id: 'diversity', label: 'Community composition and diversity', sub: 'Who is there? Alpha and beta diversity metrics', next: 'amplicon_or_wgs' },
      { id: 'function', label: 'Functional potential — what can this community do?', sub: 'Gene prediction, pathway reconstruction, metabolic profiling', next: 'recommend_meta_wgs' },
      { id: 'mags', label: 'Recover individual genomes (MAGs)', sub: 'Binning metagenomes to retrieve genome-resolved taxonomy', next: 'recommend_meta_wgs' },
      { id: 'expression', label: 'Active gene expression', sub: 'What is this community doing right now?', next: 'recommend_metatranscriptome' },
      { id: 'both_div_func', label: 'Both composition and function', sub: 'Comprehensive multi-omics characterization', next: 'recommend_meta_wgs', hi: true },
    ],
  },

  id_strategy: {
    id: 'id_strategy', step: 3, total: 8, type: 'q',
    cat: 'IDENTIFICATION STRATEGY', title: 'Species Identification Approach',
    q: 'How many isolates do you need to identify?',
    opts: [
      { id: 'few', label: 'A few isolates (1–20)', sub: 'Quick turnaround, lowest cost', next: 'recommend_sanger' },
      { id: 'medium', label: 'A collection (20–200)', sub: 'Medium throughput, moderate budget', next: 'recommend_16s_illumina' },
      { id: 'large', label: 'A large collection (>200)', sub: 'High-throughput, need strain-level resolution for some', next: 'recommend_16s_illumina' },
    ],
  },

  amplicon_or_wgs: {
    id: 'amplicon_or_wgs', step: 3, total: 8, type: 'q',
    cat: 'RESOLUTION DECISION', title: 'Taxonomic Resolution Required',
    q: 'What level of taxonomic resolution do you need?',
    hint: '16S gives genus-level data; WGS shotgun metagenomics gives species and strain level',
    opts: [
      { id: 'genus', label: 'Genus-level is sufficient', sub: 'Ecological patterns, diversity indices, community comparisons', next: 'recommend_amplicon' },
      { id: 'species', label: 'Species or strain level required', sub: 'Clinical context, novel taxa discovery, functional assignment', next: 'recommend_meta_wgs' },
    ],
  },

  amplicon_depth: {
    id: 'amplicon_depth', step: 3, total: 8, type: 'q',
    cat: 'AMPLICON SEQUENCING', title: 'Amplicon Sequencing Depth',
    q: 'Which sequencing platform matches your amplicon type?',
    opts: [
      { id: 'short_amp', label: 'V3-V4 (16S) or ITS1/ITS2 amplicons', sub: '~550 bp — ideal for MiSeq PE300 or DADA2 denoising', next: 'recommend_miseq_amplicon' },
      { id: 'full_16s', label: 'Near-full-length 16S (V1-V9)', sub: '~1500 bp — Nanopore or PacBio for greater species resolution', next: 'recommend_nanopore_amplicon' },
    ],
  },

  budget_q: {
    id: 'budget_q', step: 3, total: 8, type: 'q',
    cat: 'BUDGET', title: 'Sequencing Budget',
    q: 'What is your approximate per-sample sequencing budget?',
    hint: 'Rough guide only — costs vary significantly by region and provider',
    opts: [
      { id: 'low_budget', label: 'Low — < $100 USD per sample', sub: 'Illumina PE150 draft only', next: 'recommend_illumina' },
      { id: 'mid_budget', label: 'Mid — $100–400 USD per sample', sub: 'Good hybrid assembly possible', next: 'recommend_hybrid' },
      { id: 'high_budget', label: 'High — > $400 USD per sample', sub: 'Best platform for the goal', next: 'recommend_hybrid', hi: true },
    ],
  },

  recommend_sanger: {
    id: 'recommend_sanger', step: 4, total: 8, type: 'rec',
    cat: 'RECOMMENDATION', title: 'Sanger 16S Sequencing',
    tagline: 'Fast, cheap, and sufficient for species identification of small collections.',
    pts: [
      'Sanger sequencing of the 16S rRNA gene (V1-V9) gives reliable species-level identification for most cultured bacteria',
      'Typical turnaround: 24–48 hours; cost: $5–15 per sample',
      'Limitations: Cannot distinguish closely related species (E. coli / Shigella, many Bacillus spp.) — use WGS for final confirmation',
      'Primer choice: 27F / 1492R gives near-full-length amplicon for best database matching',
      'Analyse with EzBioCloud BLAST or NCBI 16S BLAST — aim for >99% identity to type strains',
    ],
    tools: ['EzBioCloud BLAST', 'NCBI 16S BLAST', 'SILVA 138.1', 'Chromas (trace viewing)', 'MEGA (phylogeny)'],
    act: 'Continue →', next: 'platform_summary',
  },

  recommend_16s_illumina: {
    id: 'recommend_16s_illumina', step: 4, total: 8, type: 'rec',
    cat: 'RECOMMENDATION', title: '16S Amplicon Sequencing (Illumina)',
    tagline: 'High-throughput identification of large isolate collections at low cost.',
    pts: [
      'V3-V4 amplicon sequencing on MiSeq PE300 gives genus/species-level ID for hundreds of isolates per run',
      'Use DADA2 (ASV approach) over OTU clustering for better species resolution in isolate collections',
      'Follow up with WGS on the most interesting isolates for strain-level resolution and genome analysis',
      'Typical cost: $5–20 per sample at scale; turnaround: 1–2 weeks',
    ],
    tools: ['Illumina MiSeq PE300', 'DADA2', 'QIIME2', 'EzBioCloud BLAST', 'SILVA 138.1'],
    act: 'Continue →', next: 'platform_summary',
  },

  recommend_illumina: {
    id: 'recommend_illumina', step: 4, total: 8, type: 'rec',
    cat: 'RECOMMENDATION', title: 'Illumina PE150 — Short-Read WGS',
    tagline: 'Cost-effective, high-accuracy genome sequencing for most bacterial applications.',
    pts: [
      'Illumina PE150 at 80–100× coverage produces reliable draft assemblies for most bacterial genomes',
      'Best for: AMR profiling, virulence gene detection, draft annotation, taxonomy, comparative genomics',
      'Key limitation: cannot close chromosomes with repetitive elements or resolve large plasmids confidently',
      'Typical cost: $50–150 per sample; turnaround: 5–14 days',
      'Assemblers: SPAdes (recommended) or SKESA for clinical WGS',
    ],
    tools: ['Illumina PE150', 'SPAdes', 'SKESA', 'Bakta', 'FastANI', 'AMRFinderPlus'],
    act: 'Continue →', next: 'platform_summary',
  },

  recommend_hybrid: {
    id: 'recommend_hybrid', step: 4, total: 8, type: 'rec',
    cat: 'RECOMMENDATION', title: 'Hybrid Sequencing — Illumina + Nanopore',
    tagline: 'The gold standard for complete, closed bacterial genomes.',
    pts: [
      'Illumina PE150 (100×) provides high-accuracy short reads; Nanopore R10.4 (30–60×) provides long reads for repeat resolution',
      'Unicycler hybrid assembly achieves chromosome closure for most bacterial genomes',
      'Essential for: complete genome publications, novel species descriptions, BGC discovery, plasmid characterization',
      'Nanopore R10.4 with "sup" basecalling achieves >Q20 accuracy — significantly better than older R9.4 chemistry',
      'Read N50 ≥ 20 kb is more valuable than raw depth — prioritize library quality over total yield',
    ],
    tools: ['Illumina PE150 (100×)', 'Nanopore R10.4 (30–60×)', 'Unicycler', 'Flye', 'Medaka', 'Polypolish'],
    act: 'Continue →', next: 'platform_summary',
  },

  recommend_amplicon: {
    id: 'recommend_amplicon', step: 4, total: 8, type: 'rec',
    cat: 'RECOMMENDATION', title: '16S / ITS Amplicon Metagenomics',
    tagline: 'Cost-effective community profiling at genus-level resolution.',
    pts: [
      '16S V3-V4 amplicon sequencing on MiSeq PE300 is the workhorse of microbial ecology',
      'Denoising with DADA2 or Deblur gives ASV-level resolution — more accurate than traditional OTU clustering',
      'Downstream analysis in QIIME2: alpha diversity, beta diversity, differential abundance, taxonomic assignment',
      'Limitation: 16S cannot reliably distinguish closely related species and misses eukaryotes and viruses',
      'For fungi: ITS1 (fungi-biased) or ITS2 (broader eukaryotes) amplification with similar workflow',
    ],
    tools: ['Illumina MiSeq PE300', 'DADA2', 'QIIME2', 'SILVA 138.1', 'UNITE (fungi ITS)', 'phyloseq (R)'],
    act: 'Continue →', next: 'platform_summary',
  },

  recommend_meta_wgs: {
    id: 'recommend_meta_wgs', step: 4, total: 8, type: 'rec',
    cat: 'RECOMMENDATION', title: 'Shotgun Metagenomics',
    tagline: 'Species-level resolution, functional potential, and MAG recovery from a single run.',
    pts: [
      'Illumina PE150 shotgun metagenomics gives comprehensive community profiling at species level',
      'Target 10–20 Gb per sample for MAG recovery; 5 Gb is sufficient for diversity and functional analysis',
      'Assembly: MetaSPAdes (moderate complexity) or MEGAHIT (large or low-coverage samples)',
      'MAG recovery: MetaBAT2 + CONCOCT + MaxBin2 → DAS Tool (consensus binning) → CheckM quality',
      'Add Nanopore long reads for better MAG completeness and plasmid recovery in complex communities',
    ],
    tools: ['Illumina PE150 (10–30 Gb)', 'MetaSPAdes / MEGAHIT', 'MetaBAT2', 'DAS Tool', 'CheckM2', 'GTDB-Tk', 'HUMAnN3'],
    act: 'Continue →', next: 'platform_summary',
  },

  recommend_metatranscriptome: {
    id: 'recommend_metatranscriptome', step: 4, total: 8, type: 'rec',
    cat: 'RECOMMENDATION', title: 'Metatranscriptomics',
    tagline: 'Capture active gene expression across the entire community.',
    pts: [
      'Total RNA extraction with rRNA depletion (not poly-A selection — bacteria lack poly-A tails)',
      'Paired with DNA shotgun metagenomics for reference-based mapping and functional annotation',
      'Illumina PE150 at 10–20 Gb per sample after rRNA depletion is typical',
      'Critical: flash-freeze samples immediately at point of collection to preserve RNA integrity',
      'RIN (RNA Integrity Number) ≥ 7.0 is required before library preparation',
    ],
    tools: ['Illumina PE150 (rRNA depleted)', 'Trinity', 'HUMAnN3', 'featureCounts', 'DESeq2', 'Rfam (rRNA filtering)'],
    act: 'Continue →', next: 'platform_summary',
  },

  recommend_miseq_amplicon: {
    id: 'recommend_miseq_amplicon', step: 4, total: 8, type: 'rec',
    cat: 'RECOMMENDATION', title: 'MiSeq PE300 for Short Amplicons',
    tagline: 'The standard for 16S V3-V4 and ITS amplicon community profiling.',
    pts: [
      'MiSeq PE300 (600-cycle v3 kit) is optimized for 550 bp amplicons with paired-end overlap',
      'Aim for 10,000–50,000 reads per sample for robust diversity analysis; 100,000+ for rare biosphere',
      'DADA2 ASV denoising outperforms QIIME2 OTU clustering — use DADA2 as your default pipeline',
      'Multiplexing: 96–384 samples per run is typical with dual-index barcoding',
    ],
    tools: ['Illumina MiSeq PE300', 'DADA2', 'QIIME2', 'SILVA 138.1', 'UNITE (ITS)', 'phyloseq'],
    act: 'Continue →', next: 'platform_summary',
  },

  recommend_nanopore_amplicon: {
    id: 'recommend_nanopore_amplicon', step: 4, total: 8, type: 'rec',
    cat: 'RECOMMENDATION', title: 'Nanopore Full-Length 16S',
    tagline: 'Near-complete 16S rRNA gives species resolution impossible with short amplicons.',
    pts: [
      'Nanopore sequencing of V1-V9 16S (1500 bp) gives species-level resolution in most genera',
      'MinION R10.4 flow cell with "sup" basecalling achieves Q20+ accuracy — adequate for 16S taxonomy',
      'ONT 16S Barcoding Kit enables multiplexing of up to 96 samples per flow cell',
      'Particularly valuable for genera where V3-V4 is insufficient (Streptomyces, Bacillus, Vibrio)',
      'Analyse with NanoCLUST or QIIME2 with ONT-specific plugins',
    ],
    tools: ['Nanopore R10.4', 'NanoCLUST', 'QIIME2 (ONT)', 'SILVA 138.1', 'EzBioCloud'],
    act: 'Continue →', next: 'platform_summary',
  },

  platform_summary: {
    id: 'platform_summary', step: 5, total: 8, type: 'q',
    cat: 'SAMPLE QUALITY', title: 'Sample & DNA Quality',
    q: 'What is the condition of your starting material?',
    opts: [
      { id: 'fresh', label: 'Fresh / high-quality — DNA/RNA intact', sub: 'Standard library prep applies', next: 'data_analysis_q' },
      { id: 'degraded', label: 'Degraded — old FFPE, museum specimens, ancient DNA', sub: 'Special low-input or ancient DNA protocols required', next: 'degraded_note' },
      { id: 'low_biomass', label: 'Low biomass — environmental samples, single cells', sub: 'Amplification or specialized kit needed', next: 'low_biomass_note' },
    ],
  },

  degraded_note: {
    id: 'degraded_note', step: 5, total: 8, type: 'info',
    cat: 'DEGRADED DNA', title: 'Strategies for Degraded or Ancient DNA',
    body: 'Degraded DNA requires modified library preparation. Short insert sizes, high adapter-dimer rates, and deamination artifacts are common challenges.',
    tbl: [
      { v: 'DNA fragment size', m: 'Target: >500 bp for standard WGS; <200 bp = ancient aDNA protocols', s: 'c-y' },
      { v: 'Input amount', m: 'Minimum: 1 ng for Illumina FS DNA; REPLI-g for <100 pg', s: 'c-y' },
      { v: 'Deamination', m: 'UDG treatment required for aDNA before sequencing', s: 'c-o' },
    ],
    tools: ['Covaris (fragmentation)', 'NEBNext Ultra II FS', 'REPLI-g (WGA)', 'mapDamage2 (aDNA QC)', 'Paleomix'],
    act: 'Continue →', next: 'data_analysis_q',
  },

  low_biomass_note: {
    id: 'low_biomass_note', step: 5, total: 8, type: 'info',
    cat: 'LOW BIOMASS', title: 'Low-Biomass Sequencing Strategies',
    body: 'Low biomass samples require careful host depletion, amplification, or single-cell approaches to avoid host DNA contamination overwhelming microbial signal.',
    tbl: [
      { v: 'Host depletion', m: 'MolYsis (blood), NEBNext Microbiome (tissue) — remove host before extraction', s: 'c-g' },
      { v: 'Whole genome amplification', m: 'REPLI-g or MDA — for <1 ng input; introduces amplification bias', s: 'c-y' },
      { v: 'Single-cell WGS', m: 'MALBAC or 10X Chromium — for single bacterial cells', s: 'c-o' },
    ],
    tools: ['MolYsis Complete5', 'NEBNext Microbiome DNA Enrichment', 'REPLI-g', 'Propel (single-cell)', 'Bowtie2 (host depletion)'],
    act: 'Continue →', next: 'data_analysis_q',
  },

  data_analysis_q: {
    id: 'data_analysis_q', step: 6, total: 8, type: 'q',
    cat: 'BIOINFORMATICS', title: 'Bioinformatics Capacity',
    q: 'What computational resources do you have access to?',
    hint: 'This affects which assemblers and pipelines are practical for your situation',
    opts: [
      { id: 'local_only', label: 'Local laptop / workstation only', sub: 'Limited RAM (<32 GB), no HPC', next: 'resource_note' },
      { id: 'hpc', label: 'HPC cluster access (SLURM / PBS)', sub: 'Can run memory-intensive assemblies and parallel jobs', next: 'workflow_final' },
      { id: 'cloud', label: 'Cloud computing (AWS, Google Cloud, Azure)', sub: 'Pay-per-use, scalable, flexible', next: 'workflow_final' },
    ],
  },

  resource_note: {
    id: 'resource_note', step: 6, total: 8, type: 'info',
    cat: 'RESOURCE PLANNING', title: 'Running WGS Analysis on a Local Machine',
    body: 'Most assembly and annotation steps require 16–64 GB RAM. On a standard laptop, use cloud-hosted tools or lightweight alternatives.',
    tbl: [
      { v: 'SKESA', m: 'Low-memory assembler — works on <8 GB RAM', s: 'c-g' },
      { v: 'Galaxy Europe', m: 'Free browser-based bioinformatics — no local install', s: 'c-g' },
      { v: 'SPAdes', m: 'Needs 16–32 GB RAM for bacterial genomes', s: 'c-y' },
      { v: 'Flye / Unicycler', m: 'Needs 32–64 GB RAM for long-read hybrid assembly', s: 'c-o' },
    ],
    tools: ['Galaxy Europe (free cloud)', 'SKESA (low-memory)', 'Bakta web', 'antiSMASH web', 'NCBI PGAP (cloud submission)'],
    act: 'Continue →', next: 'workflow_final',
  },

  workflow_final: {
    id: 'workflow_final', step: 7, total: 8, type: 'rec',
    cat: 'NEXT STEPS', title: 'Your Sequencing Strategy is Defined',
    tagline: 'Continue to the appropriate decision engine for your chosen approach.',
    pts: [
      'Use the Bacterial WGS Decision Engine for single-isolate genome sequencing and assembly planning',
      'Use the MAG Recovery Decision Tree for metagenome binning and genome-resolved metagenomics',
      'Use the Genome Assembly Strategy Selector to choose the right assembler for your data type',
      'Use the Publication Readiness Checker before submitting to a journal',
    ],
    tools: ['WGS Decision Engine (this hub)', 'MAG Recovery Module', 'Assembly Strategy Module', 'Publication Readiness Module'],
    act: 'Return to Decision Engine Hub →', next: '__hub__',
  },
};
