/**
 * Score: Typography Recommendations
 * Checks if the brief suggests specific fonts
 */

export function typographyScorer(args: { output: string; expected: any }) {
    if (!args.expected.shouldHaveFonts) return { name: "Typography", score: 1 };

    const commonFonts = ['inter', 'roboto', 'helvetica', 'arial', 'georgia', 'times', 'playfair', 'lato', 'montserrat', 'open sans', 'poppins', 'raleway'];
    const output = args.output.toLowerCase();

    const fontsMentioned = commonFonts.filter(font => output.includes(font));
    const score = fontsMentioned.length >= 2 ? 1 : (fontsMentioned.length === 1 ? 0.5 : 0);

    return {
        name: "Typography Recommendations",
        score: score,
        metadata: {
            fontsFound: fontsMentioned.length,
            examples: fontsMentioned.slice(0, 3)
        }
    };
}
