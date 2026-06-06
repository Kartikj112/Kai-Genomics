import type { DecisionTree } from './types';
import { wgsTree } from './wgs';
import { sequencingAdvisorTree } from './sequencing-advisor';
import { referenceGenomeTree } from './reference-genome';
import { assemblyStrategyTree } from './assembly-strategy';
import { magRecoveryTree } from './mag-recovery';
import {
  functionalPredictionTree,
  diffAbundanceTree,
  genomeMiningTree,
} from './modules-6-7-8';
import {
  pubReadinessTree,
  methodRecommenderTree,
  experimentalDesignTree,
  phdPlannerTree,
  conferenceTree,
  careerPathwayTree,
} from './modules-9-14';

const TREES: Record<string, DecisionTree> = {
  'wgs':                  wgsTree,
  'sequencing-advisor':   sequencingAdvisorTree,
  'reference-genome':     referenceGenomeTree,
  'assembly-strategy':    assemblyStrategyTree,
  'mag-recovery':         magRecoveryTree,
  'functional-prediction': functionalPredictionTree,
  'diff-abundance':       diffAbundanceTree,
  'genome-mining':        genomeMiningTree,
  'pub-readiness':        pubReadinessTree,
  'method-recommender':   methodRecommenderTree,
  'experimental-design':  experimentalDesignTree,
  'phd-planner':          phdPlannerTree,
  'conference':           conferenceTree,
  'career-pathway':       careerPathwayTree,
};

export function getTree(moduleId: string): DecisionTree | null {
  return TREES[moduleId] ?? null;
}

export function getStartNode(moduleId: string): string | null {
  const tree = TREES[moduleId];
  if (!tree) return null;
  // Start node is always the first key defined in the tree
  return Object.keys(tree)[0];
}
