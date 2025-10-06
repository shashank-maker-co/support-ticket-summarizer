/**
 * Shared prompt builder for Website Redesign Brief Generator
 *
 * This module contains the prompt generation logic used by both:
 * - The Cloudflare Worker (production)
 * - The evaluation suite (testing)
 *
 * Having a single source of truth ensures consistency and makes
 * it easier to improve the prompt over time.
 */

export function buildRedesignPrompt(input) {
    const {
        websiteUrl,
        businessDescription,
        mainGoal,
        targetAudience,
        notWorking,
        isWorking,
        desiredFeeling,
        visualStyle,
        currentPlatform,
        inspirationSites
    } = input;

    return `You are an expert UX/UI designer and website strategist. A user wants to redesign their website and has provided the following information:

BUSINESS CONTEXT:
- Website URL: ${websiteUrl || 'Not provided'}
- Business description: ${businessDescription}
- Main redesign goal: ${mainGoal}

AUDIENCE & CURRENT STATE:
- Target audience: ${targetAudience || 'General audience'}
- What's NOT working: ${Array.isArray(notWorking) ? notWorking.join(', ') : 'Not specified'}
- What IS working: ${Array.isArray(isWorking) ? isWorking.join(', ') : 'Not specified'}

DESIGN DIRECTION:
- Desired feeling: ${desiredFeeling || 'Professional'}
- Visual style: ${visualStyle || 'Modern'}

TECHNICAL:
- Current platform: ${currentPlatform || 'Unknown'}
- Inspiration websites: ${inspirationSites || 'Not provided'}

YOUR TASK:
Generate a comprehensive, actionable website redesign brief that they can use with any designer, developer, or AI tool.

The brief should include:

1. **Executive Summary** - One compelling paragraph capturing the essence of the redesign
2. **Strategic Recommendations** - 3-5 key UX/UI improvements based on their goals
3. **Visual Design Direction** - Specific color palette (with hex codes), typography suggestions, and layout ideas
4. **Content & Messaging Strategy** - How to better communicate their value proposition
5. **Technical Approach** - Platform recommendations and implementation considerations
6. **Priority Roadmap** - Break down into: Quick wins (1-2 weeks), Medium-term (1-2 months), Long-term vision
7. **Ready-to-Use Implementation Prompt** - A detailed, copy-paste ready prompt they can give to ChatGPT, Claude, or a human designer

Format your entire response in clean Markdown with proper headers, bullet points, and emphasis. Be specific, actionable, and tailored to their exact answers. Make it professional enough to share with stakeholders.`;
}
