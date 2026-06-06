import type { DecisionTree } from './types';

export const assemblyStrategyTree: DecisionTree = {
  data_type: {
    id: 'data_type', step: 1, total: 6, type: 'q',
    cat: 'INPUT DATA', title: 'What Sequencing Data Do You Have?',
    q: 'Which sequencing data are you assembling?',
    hint: 'Select the data type you actually have in hand — not what you plan to generate',
    opts: [
      { id: 'illumina_only', label: 'Illumina short reads only', badge: 'PE150', sub: 'Paired-end 150 bp reads, high accuracy', next: 'illumina_coverage' },
      { id: 'nanopore_only', label: 'Nanopore long reads only', badge: 'R10.4', sub: 'Long reads from MinION, GridION, or PromethION', next: 'nanopore_quality' },
      { id: 'pacbio_only', label: 'PacBio HiFi (CCS) reads only', badge: 'HiFi', sub: 'High-accuracy long reads from Sequel II / Revio', next: 'pacbio_rec' },
      { id: 'hybrid', label: 'Hybrid — Illumina + Nanopore', badge: 'Recommended', sub: 'Both short and long reads available', next: 'hybrid_coverage', hi: true },
      { id: 'hybrid_pacbio', label: 'Hybrid — Illumina + PacBio HiFi', badge: 'Premium', sub: 'Best accuracy and length combination', next: 'hybrid_pacbio_rec' },
    ],
  },

  illumina_coverage: {
    id: 'illumina_coverage', step: 2, total: 6, type: 'q',
    cat: 'ILLUMINA COVERAGE', title: 'Illumina Sequencing Depth',
    q: 'What is your approximate Illumina coverage depth?',
    hint: 'Calculate: total bases sequenced ÷ estimated genome size',
    opts: [
      { id: 'il_deep', label: '>= 80× coverage', sub: 'Sufficient for reliable de novo assembly', next: 'illumina_assembler' },
      { id: 'il_mid', label: '30–80× coverage', sub: 'Assembly possible but may be fragmented', next: 'illumina_low_cov' },
      { id: 'il_low', label: '< 30× coverage', sub: 'Insufficient for reliable assembly', next: 'illumina_insufficient' },
    ],
  },

  illumina_insufficient: {
    id: 'illumina_insufficient', step: 2, total: 6, type: 'block',
    isE: true, icon: '✗', cat: 'INSUFFICIENT COVERAGE', title: 'Coverage Too Low for Assembly',
    body: 'Below 30× coverage, de novo assembly will produce highly fragmented results with many gaps, misassemblies, and poor N50. Do not assemble until you have sufficient data.',
    steps: [
      'Calculate exact coverage: samtools flagstat aligned reads × read length ÷ genome size',
      'Pool additional sequencing lanes or re-sequence the sample',
      'Alternatively: use reference-based mapping if an appropriate reference exists (ANI >95%)',
      'SPAdes minimum recommended: 50× for reliable contigs; 80× for good N50',
    ],
    tools: ['mosdepth', 'samtools flagstat', 'FastQC (read count)', 'Coverage calculator (WGS module)'],
    act: '← Return with more data', next: 'data_type',
  },

  illumina_low_cov: {
    id: 'illumina_low_cov', step: 2, total: 6, type: 'info',
    cat: 'LOW COVERAGE ASSEMBLY', title: 'Assembly at 30–80× Coverage',
    body: 'Assembly is possible at 30–80× but expect more fragmentation than at ≥80×. Adjust SPAdes k-mer ranges and use careful mode. Validate with QUAST + CheckM2.',
    tbl: [
      { v: '30–50×', m: 'Use SPAdes --careful; expect N50 <50 kb; suitable for gene prediction only', s: 'c-y' },
      { v: '50–80×', m: 'SPAdes assembles well; N50 typically 50–150 kb; suitable for most analyses', s: 'c-y' },
      { v: '>80×', m: 'Optimal — reliable assembly, good N50, suitable for publication', s: 'c-g' },
    ],
    act: 'Proceed to assembler selection →', next: 'illumina_assembler',
  },

  illumina_assembler: {
    id: 'illumina_assembler', step: 3, total: 6, type: 'q',
    cat: 'USE CASE', title: 'Assembly Use Case',
    q: 'What will you do with this assembly?',
    opts: [
      { id: 'research', label: 'Research — annotation, BGC mining, comparative genomics', sub: 'Maximise contiguity and completeness', next: 'spades_rec', hi: true },
      { id: 'clinical', label: 'Clinical — AMR typing, outbreak surveillance, pathogen ID', sub: 'Speed and standardization matter more than contiguity', next: 'skesa_rec' },
      { id: 'metagenome', label: 'Metagenomic assembly', sub: 'Multiple organisms mixed in the sample', next: 'meta_assembler' },
    ],
  },

  spades_rec: {
    id: 'spades_rec', step: 4, total: 6, type: 'rec',
    cat: 'ASSEMBLER: SPADES', title: 'SPAdes — Recommended for Research Assemblies',
    tagline: 'The most widely used and best-validated bacterial genome assembler.',
    pts: [
      'SPAdes 4.0 with --careful mode is the gold standard for bacterial genome assembly from Illumina reads',
      'Use isolate mode (--isolate) for single bacterial genomes — faster and cleaner than default mode',
      'Typical performance: 50–200 contigs, N50 50–300 kb for a 4–6 Mb genome at 100× coverage',
      'Memory requirement: 16–32 GB RAM for standard bacterial genomes; 64 GB for Streptomyces/large genomes',
      'Post-assembly: always polish with Polypolish and assess with QUAST + CheckM2',
    ],
    tools: ['SPAdes 4.0 (--isolate --careful)', 'Polypolish', 'QUAST', 'CheckM2', 'Bakta (annotation)'],
    act: 'Continue to QC →', next: 'assembly_qc',
  },

  skesa_rec: {
    id: 'skesa_rec', step: 4, total: 6, type: 'rec',
    cat: 'ASSEMBLER: SKESA', title: 'SKESA — Recommended for Clinical WGS',
    tagline: 'Designed for clinical microbiology: fast, low-memory, standardized output.',
    pts: [
      'SKESA (Strategic K-mer Extension for Scrupulous Assemblies) is optimised for clinical bacterial WGS',
      'Faster than SPAdes, lower RAM usage — runs on standard lab workstations',
      'Highly conservative: avoids misassemblies at the cost of some contiguity',
      'Output is suitable for: MLST, AMRFinderPlus, CARD/RGI, PlasmidFinder, Kleborate',
      'Maintained by NCBI — used in PD (Pathogen Detection) pipeline',
    ],
    tools: ['SKESA', 'AMRFinderPlus', 'CARD / RGI', 'Kleborate', 'MLST (tseemann)', 'PlasmidFinder'],
    act: 'Continue to QC →', next: 'assembly_qc',
  },

  meta_assembler: {
    id: 'meta_assembler', step: 4, total: 6, type: 'rec',
    cat: 'ASSEMBLER: METAGENOMIC', title: 'MetaSPAdes or MEGAHIT for Metagenomes',
    tagline: 'Different organisms need different assembler strategies.',
    pts: [
      'MetaSPAdes: best for medium-complexity metagenomes (gut, soil with moderate diversity) — needs 64–128 GB RAM',
      'MEGAHIT: better for large or low-coverage metagenomes — much lower memory requirement than MetaSPAdes',
      'For highly complex samples (ocean, soil): MEGAHIT is often faster and produces comparable results',
      'After assembly: bin with MetaBAT2 + CONCOCT + MaxBin2 → DAS Tool consensus → CheckM2 QC',
      'Use the MAG Recovery module for full binning guidance',
    ],
    tools: ['MetaSPAdes', 'MEGAHIT', 'MetaBAT2', 'DAS Tool', 'CheckM2', 'GTDB-Tk'],
    act: 'Continue to QC →', next: 'assembly_qc',
  },

  nanopore_quality: {
    id: 'nanopore_quality', step: 2, total: 6, type: 'q',
    cat: 'NANOPORE DATA QUALITY', title: 'Nanopore Basecalling & Chemistry',
    q: 'What Nanopore chemistry and basecalling model did you use?',
    hint: 'R10.4 + sup basecalling achieves Q20+ accuracy and is the current standard',
    opts: [
      { id: 'r10_sup', label: 'R10.4 (or R10.4.1) with sup or hac basecalling', sub: 'Q20+ accuracy — the current ONT standard', next: 'flye_rec', hi: true },
      { id: 'r10_fast', label: 'R10.4 with fast basecalling', sub: 'Lower accuracy — re-basecall with sup before assembly if possible', next: 'nanopore_rebasecall' },
      { id: 'r9_legacy', label: 'Older chemistry (R9.4 or earlier)', sub: 'Higher error rate — more polishing rounds needed', next: 'r9_warn' },
    ],
  },

  nanopore_rebasecall: {
    id: 'nanopore_rebasecall', step: 2, total: 6, type: 'info',
    cat: 'REBASECALLING', title: 'Re-basecall with Dorado sup Before Assembly',
    body: 'Fast basecalling is 3–4× less accurate than sup. Before assembling, re-basecall your raw POD5/FAST5 files with Dorado sup for significantly better assembly quality.',
    cmd: 'dorado basecaller sup pod5_dir/ \\\n  --recursive \\\n  --emit-fastq \\\n  > basecalled_sup.fastq\n\ndorado summary basecalled_sup.fastq > sequencing_summary.tsv',
    tools: ['Dorado (ONT, replaces Guppy)', 'NanoStat (QC)', 'NanoPlot (visualisation)'],
    act: 'Re-basecalled with sup — continue →', next: 'flye_rec',
  },

  r9_warn: {
    id: 'r9_warn', step: 2, total: 6, type: 'info',
    cat: 'LEGACY CHEMISTRY', title: 'R9.4 Assembly — Extra Polishing Required',
    body: 'R9.4 data has a raw error rate of 5–15%, particularly in homopolymer runs. Assembly is possible but requires more aggressive polishing.',
    tbl: [
      { v: 'Raw error rate', m: 'R9.4: ~5%; R10.4 fast: ~2%; R10.4 sup: ~0.5%', s: 'c-y' },
      { v: 'Medaka rounds', m: 'R9.4: 3–5 rounds; R10.4 sup: 1–2 rounds', s: 'c-y' },
      { v: 'Homopolymers', m: 'R9.4 particularly error-prone in homopolymer runs >6 bp', s: 'c-o' },
    ],
    caution: 'R9.4 long-read-only assemblies without short-read polishing may have QV30–35 consensus quality. Add Illumina reads if possible.',
    act: 'Continue with R9.4 data →', next: 'flye_rec',
  },

  flye_rec: {
    id: 'flye_rec', step: 3, total: 6, type: 'rec',
    cat: 'ASSEMBLER: FLYE', title: 'Flye — Recommended for Nanopore-Only Assembly',
    tagline: 'The most reliable and widely benchmarked long-read bacterial assembler.',
    pts: [
      'Flye 2.9 with --nano-hq flag for R10.4 sup data — consistently achieves chromosome closure for bacterial genomes',
      'Target 50–100× coverage; below 30× can result in incomplete assembly or misassembled repeats',
      'Polish with Medaka (1–2 rounds with R10.4 model) — use the correct model for your chemistry',
      'Inspect assembly graph in Bandage — a single circular contig = closed chromosome',
      'If genome is fragmented: increase coverage, improve N50 (longer reads are more valuable than more reads)',
    ],
    tools: ['Flye 2.9 (--nano-hq)', 'Medaka', 'Bandage (graph visualisation)', 'QUAST', 'CheckM2'],
    act: 'Continue to QC →', next: 'assembly_qc',
  },

  pacbio_rec: {
    id: 'pacbio_rec', step: 3, total: 6, type: 'rec',
    cat: 'ASSEMBLER: HIFIASM / HICANU', title: 'hifiasm or HiCanu for PacBio HiFi',
    tagline: 'PacBio HiFi achieves Q30+ accuracy — the most accurate long-read platform.',
    pts: [
      'hifiasm is the fastest and most accurate assembler for PacBio HiFi CCS reads',
      'HiCanu (Canu for HiFi) is more conservative — better for highly repetitive genomes like Streptomyces',
      'PacBio HiFi achieves Q30+ (>99.9% accuracy) — polishing is often unnecessary for bacterial genomes',
      '30–40× HiFi coverage typically produces complete bacterial genome closures',
      'Workflow: hifiasm → assembly graph inspection (Bandage) → QUAST + CheckM2 validation',
    ],
    tools: ['hifiasm', 'HiCanu', 'Bandage', 'QUAST', 'CheckM2', 'Bakta'],
    act: 'Continue to QC →', next: 'assembly_qc',
  },

  hybrid_coverage: {
    id: 'hybrid_coverage', step: 2, total: 6, type: 'q',
    cat: 'HYBRID COVERAGE', title: 'Hybrid Assembly Coverage',
    q: 'What coverage do you have for each platform?',
    opts: [
      { id: 'both_good', label: 'Illumina ≥80× and Nanopore ≥30×', sub: 'Optimal hybrid assembly conditions', next: 'unicycler_rec', hi: true },
      { id: 'low_nano', label: 'Illumina ≥80× but Nanopore <30×', sub: 'Insufficient long reads for spanning all repeats', next: 'hybrid_low_nano' },
      { id: 'low_illumina', label: 'Nanopore ≥50× but Illumina <50×', sub: 'Use Flye + Polypolish rather than Unicycler', next: 'flye_polish_rec' },
    ],
  },

  unicycler_rec: {
    id: 'unicycler_rec', step: 3, total: 6, type: 'rec',
    cat: 'ASSEMBLER: UNICYCLER', title: 'Unicycler Hybrid — The Standard for Bacterial Closure',
    tagline: 'Illumina accuracy + Nanopore length = closed, high-quality genomes.',
    pts: [
      'Unicycler hybrid mode builds on SPAdes short-read graph and uses Nanopore reads to resolve repeats',
      'Achieves complete chromosome closure for >90% of standard bacterial genomes (2–6 Mb)',
      'Recommended workflow: Unicycler → Medaka (Nanopore polish) → Polypolish (Illumina polish)',
      'For large genomes (>8 Mb): try Flye hybrid mode as an alternative — may produce more contiguous results',
      'Always visualise the assembly graph in Bandage to confirm closure (circular = closed)',
    ],
    tools: ['Unicycler (hybrid mode)', 'Medaka', 'Polypolish', 'Bandage', 'QUAST', 'CheckM2'],
    act: 'Continue to QC →', next: 'assembly_qc',
  },

  hybrid_low_nano: {
    id: 'hybrid_low_nano', step: 3, total: 6, type: 'info',
    cat: 'LOW NANOPORE COVERAGE', title: 'Insufficient Nanopore Coverage for Hybrid',
    body: 'Below 30× Nanopore coverage, many repeats will remain unspanned. Unicycler may still bridge some repeats, but expect a semi-draft rather than a fully closed genome.',
    tbl: [
      { v: '10–20× Nanopore', m: 'Unicycler bridges short repeats only; expect gaps at rRNA operons', s: 'c-y' },
      { v: '20–30× Nanopore', m: 'Most repeats bridged; some plasmids may close; rRNA operons may still fragment', s: 'c-y' },
      { v: '>30× Nanopore', m: 'Reliable closure for standard genomes', s: 'c-g' },
    ],
    caution: 'Sequencing more Nanopore data is almost always the right answer. The marginal cost of one extra MinION flow cell typically exceeds the cost of publication delays from a fragmented assembly.',
    tools: ['Unicycler (--mode normal)', 'Bandage', 'QUAST'],
    act: 'Proceed with available data →', next: 'unicycler_rec',
  },

  flye_polish_rec: {
    id: 'flye_polish_rec', step: 3, total: 6, type: 'rec',
    cat: 'ASSEMBLER: FLYE + POLYPOLISH', title: 'Flye + Polypolish for Long-Read-Primary Assembly',
    tagline: 'When Nanopore depth exceeds Illumina depth, build on long reads.',
    pts: [
      'Use Flye as the primary assembler with Nanopore reads — high N50 long-read contigs are the foundation',
      'Apply 1–2 rounds of Medaka polishing with the correct Nanopore chemistry model',
      'Apply Polypolish using your available Illumina reads for short-read accuracy correction',
      'This approach is also best for field sequencing where Illumina is only for polishing (30×)',
    ],
    tools: ['Flye 2.9', 'Medaka', 'Polypolish', 'QUAST', 'CheckM2'],
    act: 'Continue to QC →', next: 'assembly_qc',
  },

  hybrid_pacbio_rec: {
    id: 'hybrid_pacbio_rec', step: 3, total: 6, type: 'rec',
    cat: 'ASSEMBLER: HIFIASM HYBRID', title: 'hifiasm Hybrid — Highest Quality Option',
    tagline: 'PacBio HiFi + Illumina gives the most accurate and contiguous bacterial genome possible.',
    pts: [
      'hifiasm natively supports HiFi + Illumina hybrid assembly via --ul flag',
      'Alternatively: hifiasm primary assembly → Polypolish with Illumina reads',
      'PacBio HiFi reads at Q30+ accuracy often require zero polishing rounds — validate with Merqury',
      'This approach routinely achieves QV40–50 genome accuracy — the current best practice',
    ],
    tools: ['hifiasm', 'Polypolish', 'Merqury (polishing QV)', 'QUAST', 'CheckM2'],
    act: 'Continue to QC →', next: 'assembly_qc',
  },

  assembly_qc: {
    id: 'assembly_qc', step: 5, total: 6, type: 'info',
    cat: 'ASSEMBLY QC', title: 'Assembly Quality Control Targets',
    body: 'Every assembly must pass QUAST + CheckM2 quality metrics before annotation or downstream analysis. These are the community-accepted thresholds.',
    tbl: [
      { v: 'Completeness', m: '>95% (CheckM2) — strict requirement for publication', s: 'c-g' },
      { v: 'Contamination', m: '<5% (CheckM2) — contamination above 10% is not publishable', s: 'c-g' },
      { v: 'N50', m: '>100 kb preferred; <10 kb requires justification', s: 'c-y' },
      { v: 'Contig count', m: '<100 for 2–6 Mb genomes at 100×; fewer is better', s: 'c-y' },
      { v: 'Longest contig', m: 'Should approach genome size if closed', s: 'c-g' },
    ],
    tools: ['QUAST', 'CheckM2', 'BUSCO v5 (eukaryotic QC)', 'assembly-stats', 'Bandage'],
    act: 'View assembly decision summary →', next: 'assembler_summary',
  },

  assembler_summary: {
    id: 'assembler_summary', step: 6, total: 6, type: 'rec',
    cat: 'NEXT STEPS', title: 'Assembly Complete — Proceed to Annotation',
    tagline: 'Your assembler is selected. Follow the post-assembly checklist.',
    pts: [
      'Polish your assembly: Medaka (Nanopore) → Polypolish (Illumina) — in that order',
      'Validate: QUAST (contiguity) + CheckM2 (completeness) + Bandage (graph closure) + BUSCO v5',
      'Annotate with Bakta — best standalone annotation tool for bacterial genomes as of 2025',
      'For taxonomy: run FastANI or skani against NCBI type strains, then GTDB-Tk classify_wf',
      'Continue to the WGS Decision Engine for the full annotation and analysis workflow',
    ],
    tools: ['Bakta', 'FastANI', 'GTDB-Tk', 'antiSMASH 7', 'AMRFinderPlus'],
    act: 'Return to Decision Engine Hub →', next: '__hub__',
  },
};
