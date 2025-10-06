/**
 * Score: Comprehensiveness
 * Checks if the brief has sufficient word count
 */

export function comprehensivenessScorer(args: { output: string; expected: any }) {
    const wordCount = args.output.split(/\s+/).length;
    const minWords = args.expected.minLength;

    const score = wordCount >= minWords ? 1 : Math.min(wordCount / minWords, 1);

    return {
        name: "Comprehensiveness",
        score: score,
        metadata: {
            wordCount: wordCount,
            minimumRequired: minWords,
            percentOfTarget: Math.round((wordCount / minWords) * 100)
        }
    };
}
