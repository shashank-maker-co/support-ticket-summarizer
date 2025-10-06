/**
 * Scorers for Website Redesign Brief Generator evaluation
 *
 * Each scorer evaluates a different aspect of the generated brief:
 * - Section Completeness: Does it include all required sections?
 * - Keyword Relevance: Does it mention relevant keywords?
 * - Color Specificity: Does it provide specific hex codes?
 * - Typography: Does it suggest specific fonts?
 * - Comprehensiveness: Is it long enough?
 * - Markdown Quality: Is it well-formatted?
 * - Actionability: Does it include implementation guidance?
 */

export { sectionCompletenessScorer } from './section-completeness';
export { keywordRelevanceScorer } from './keyword-relevance';
export { colorSpecificityScorer } from './color-specificity';
export { typographyScorer } from './typography';
export { comprehensivenessScorer } from './comprehensiveness';
export { markdownQualityScorer } from './markdown-quality';
export { actionabilityScorer } from './actionability';
