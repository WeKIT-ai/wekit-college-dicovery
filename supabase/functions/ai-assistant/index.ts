import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      query, 
      userProfile, 
      collegeData, 
      contextType = 'general' 
    } = await req.json();

    console.log('AI Assistant request:', { query, contextType });

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Build context based on request type and available data
    let systemPrompt = '';
    let contextData = '';

    switch (contextType) {
      case 'college_recommendation':
        systemPrompt = `You are WeKIT's AI college advisor. Provide personalized college recommendations based on user preferences, academic background, and goals. Be specific, helpful, and consider factors like location, courses, rankings, and career prospects.`;
        
        if (userProfile) {
          contextData += `\nUser Profile:
- Interests: ${userProfile.interests?.join(', ') || 'Not specified'}
- Location: ${userProfile.location || 'Not specified'}
- Course Preference: ${userProfile.course || 'Not specified'}
- Current Position: ${userProfile.current_position || 'Student'}`;
        }

        if (collegeData?.length) {
          contextData += `\nAvailable Colleges Data:
${collegeData.map(college => `
- ${college.name} (${college.city}, ${college.state})
  Type: ${college.institution_type} | Ranking: ${college.nirf_ranking || 'Unranked'}
  Courses: ${college.courses_offered?.join(', ') || 'Various'}
  Description: ${college.description || 'Premier institution'}
`).join('')}`;
        }
        break;

      case 'forum_assistance':
        systemPrompt = `You are WeKIT's AI community assistant. Help users with college-related questions, provide guidance on academic choices, and facilitate meaningful discussions. Be encouraging, informative, and community-focused.`;
        break;

      case 'college_comparison':
        systemPrompt = `You are WeKIT's AI comparison expert. Analyze and compare colleges across various parameters like academics, campus life, placements, facilities, and help users make informed decisions.`;
        
        if (collegeData?.length) {
          contextData += `\nColleges to Compare:
${collegeData.map(college => `
- ${college.name}: 
  Location: ${college.city}, ${college.state}
  Type: ${college.institution_type} | Established: ${college.establishment_year}
  NIRF Ranking: ${college.nirf_ranking || 'Unranked'}
  Strengths: ${college.departments?.slice(0, 3).join(', ') || 'Multi-disciplinary'}
`).join('')}`;
        }
        break;

      default:
        systemPrompt = `You are WeKIT's AI assistant, helping students discover and choose the right colleges. Provide helpful, accurate, and encouraging guidance for college selection and academic planning.`;
    }

    const messages = [
      {
        role: 'system',
        content: systemPrompt + (contextData ? `\n\nContext:${contextData}` : '')
      },
      {
        role: 'user',
        content: query
      }
    ];

    console.log('Sending request to OpenAI with context type:', contextType);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages,
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    console.log('AI response generated successfully');

    // Log the interaction for analytics
    if (userProfile?.user_id) {
      await supabase.from('user_activities').insert({
        user_id: userProfile.user_id,
        activity_type: 'ai_interaction',
        description: `Asked AI: "${query.substring(0, 50)}..."`,
        metadata: { context_type: contextType }
      });
    }

    return new Response(JSON.stringify({ 
      response: aiResponse,
      contextType,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in AI assistant function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      details: 'AI assistant service temporarily unavailable'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});