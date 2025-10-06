/**
 * Score: Section Completeness
 * Checks if the brief includes all required sections
 */

export function sectionCompletenessScorer(args: { output: string; expected: any }) {
    const output = args.output.toLowerCase();
    const missingCount = args.expected.mustIncludeSections.filter(
        (section: string) => !output.includes(section.toLowerCase())
    ).length;

    const score = 1 - (missingCount / args.expected.mustIncludeSections.length);
    return {
        name: "Section Completeness",
        score: score,
        metadata: {
            missingSections: missingCount,
            totalRequired: args.expected.mustIncludeSections.length
        }
    };
}
