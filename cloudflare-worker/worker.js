/**
 * Cloudflare Worker - API Proxy for Anthropic Claude
 *
 * This worker acts as a secure proxy between your frontend and Anthropic API.
 * It keeps your API key hidden from the browser.
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
      const { title, description, customerEmail } = body;

      // Validate input
      if (!title || !description || !customerEmail) {
        return new Response(
          JSON.stringify({
            success: false,
            error: 'Missing required fields: title, description, customerEmail'
          }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }

      // Build the prompt
      const prompt = `
Title: ${title}
Customer: ${customerEmail}
Description: ${description}

Please provide:
1. A brief summary (1-2 sentences)
2. Priority level (low/medium/high)
3. Suggested action for the support team

Format your response as JSON.
`;

      // Call Anthropic API
      const anthropicResponse = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': env.ANTHROPIC_API_KEY, // API key stored as Cloudflare secret
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-3-haiku-20240307',
          max_tokens: 500,
          system: 'You are a helpful customer support assistant. Summarize support tickets concisely, highlighting the main issue and any action items.',
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
      const responseText = textContent ? textContent.text.trim() : '';

      // Parse the JSON response from Claude
      let result;
      try {
        const parsed = JSON.parse(responseText);
        result = {
          summary: parsed.summary || parsed.Summary || '',
          priority: parsed.priority || parsed.Priority || 'medium',
          suggestedAction: parsed.suggestedAction || parsed.suggested_action || parsed.action || '',
        };
      } catch (e) {
        // Fallback if JSON parsing fails
        result = {
          summary: responseText,
          priority: 'medium',
          suggestedAction: 'Review ticket manually',
        };
      }

      // Return the result
      return new Response(
        JSON.stringify({
          success: true,
          data: result,
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
