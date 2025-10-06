/**
 * Score: Color Specificity
 * Checks if the brief provides specific color recommendations with hex codes
 */

export function colorSpecificityScorer(args: { output: string; expected: any }) {
    if (!args.expected.shouldHaveColors) return { name: "Color Codes", score: 1 };

    const hexCodeRegex = /#[0-9A-Fa-f]{6}/g;
    const colorCodes = args.output.match(hexCodeRegex);
    const score = colorCodes && colorCodes.length >= 3 ? 1 : (colorCodes && colorCodes.length > 0 ? 0.5 : 0);

    return {
        name: "Color Specificity",
        score: score,
        metadata: {
            hexCodesFound: colorCodes ? colorCodes.length : 0,
            examples: colorCodes ? colorCodes.slice(0, 3) : []
        }
    };
}
