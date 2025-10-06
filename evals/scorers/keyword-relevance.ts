/**
 * Score: Keyword Relevance
 * Checks if the brief mentions relevant domain-specific keywords
 */

export function keywordRelevanceScorer(args: { output: string; expected: any }) {
    const output = args.output.toLowerCase();
    const mentionedCount = args.expected.shouldMentionKeywords.filter(
        (keyword: string) => output.includes(keyword.toLowerCase())
    ).length;

    const score = mentionedCount / args.expected.shouldMentionKeywords.length;
    return {
        name: "Keyword Relevance",
        score: score,
        metadata: {
            mentioned: mentionedCount,
            total: args.expected.shouldMentionKeywords.length,
            keywords: args.expected.shouldMentionKeywords
        }
    };
}
