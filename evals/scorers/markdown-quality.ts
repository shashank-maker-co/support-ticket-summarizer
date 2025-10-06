/**
 * Score: Markdown Quality
 * Checks if the brief is well-formatted with proper markdown structure
 */

export function markdownQualityScorer(args: { output: string }) {
    const hasHeaders = (args.output.match(/^#{1,3}\s/gm) || []).length >= 3;
    const hasBullets = args.output.includes('- ') || args.output.includes('* ');
    const hasBold = args.output.includes('**');

    let score = 0;
    if (hasHeaders) score += 0.4;
    if (hasBullets) score += 0.3;
    if (hasBold) score += 0.3;

    return {
        name: "Markdown Quality",
        score: score,
        metadata: {
            hasHeaders,
            hasBullets,
            hasBold
        }
    };
}
