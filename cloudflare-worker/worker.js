/**
 * Cloudflare Worker - Website Redesign Brief Generator
 *
 * This worker acts as a secure proxy between your frontend and Anthropic API.
 * It takes user answers to 10 questions and generates a comprehensive redesign brief.
 *
 * Deploy to: Cloudflare Workers (Free tier: 100k requests/day)
 */

export default {
  async fetch(request, env) {
    // Enable CORS for your GitHub Pages site
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*', // Change to your GitHub Pages URL in production
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    // Handle preflight OPTIONS request
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // Only allow POST requests
    if (request.method !== 'POST') {
      return new Response('Method not allowed', {
        status: 405,
        headers: corsHeaders
      });
    }

    try {
      // Parse the incoming request
      const body = await request.json();
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
      } = body;

      // Validate required fields
      if (!businessDescription || !mainGoal) {
        return new Response(
          JSON.stringify({
            success: false,
            error: 'Missing required fields: businessDescription, mainGoal'
          }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }

      // Build the comprehensive prompt for Claude
      const prompt = `You are an expert UX/UI designer and website strategist. A user wants to redesign their website and has provided the following information:

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

      // Call Anthropic API
      const anthropicResponse = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': env.ANTHROPIC_API_KEY, // API key stored as Cloudflare secret
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-3-haiku-20240307', // Fast and cheap for quick generation
          max_tokens: 2000, // Enough for a comprehensive brief
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
        }),
      });

      if (!anthropicResponse.ok) {
        const errorText = await anthropicResponse.text();
        console.error('Anthropic API error:', errorText);
        return new Response(
          JSON.stringify({
            success: false,
            error: 'Failed to process ticket with AI'
          }),
          {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }

      const anthropicData = await anthropicResponse.json();
      const textContent = anthropicData.content.find(block => block.type === 'text');
      const brief = textContent ? textContent.text.trim() : '';

      // Return the markdown brief
      return new Response(
        JSON.stringify({
          success: true,
          brief: brief, // Markdown-formatted comprehensive redesign brief
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );

    } catch (error) {
      console.error('Worker error:', error);
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Internal server error'
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }
  },
};
