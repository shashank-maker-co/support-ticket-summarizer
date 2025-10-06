/**
 * Score: Actionability
 * Checks if the brief includes implementation guidance
 */

export function actionabilityScorer(args: { output: string }) {
    const keywords = ['implement', 'use this prompt', 'copy', 'designer', 'developer', 'chatgpt', 'claude'];
    const output = args.output.toLowerCase();
    const hasPromptSection = keywords.some(keyword => output.includes(keyword));

    return {
        name: "Actionability",
        score: hasPromptSection ? 1 : 0,
        metadata: {
            hasImplementationGuidance: hasPromptSection
        }
    };
}
