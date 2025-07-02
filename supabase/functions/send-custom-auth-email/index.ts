import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Webhook } from 'https://esm.sh/standardwebhooks@1.0.0';
import { Resend } from 'npm:resend@4.0.0';

const resend = new Resend(Deno.env.get('RESEND_API_KEY') as string);
const hookSecret = Deno.env.get('SEND_EMAIL_HOOK_SECRET') as string;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response('not allowed', { status: 400 });
  }

  try {
    const payload = await req.text();
    const headers = Object.fromEntries(req.headers);
    const wh = new Webhook(hookSecret);
    
    const {
      user,
      email_data: { token, token_hash, redirect_to, email_action_type, site_url }
    } = wh.verify(payload, headers) as {
      user: { email: string };
      email_data: {
        token: string;
        token_hash: string;
        redirect_to: string;
        email_action_type: string;
        site_url: string;
      };
    };

    const confirmationUrl = `${site_url}/auth/v1/verify?token=${token_hash}&type=${email_action_type}&redirect_to=${redirect_to}`;

    const isSignUp = email_action_type === 'signup';
    const subject = isSignUp ? "Welcome to WeKIT College Discovery!" : "Sign in to WeKIT";
    const actionText = isSignUp ? "Confirm your email" : "Sign in";
    const welcomeText = isSignUp 
      ? "Thanks for joining WeKIT College Discovery! Please confirm your email address to get started." 
      : "Click the link below to sign in to your WeKIT account.";

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
  <style>
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; 
      margin: 0; 
      padding: 0; 
      background-color: #f8fafc;
    }
    .container { 
      max-width: 600px; 
      margin: 0 auto; 
      background: white; 
      border-radius: 8px; 
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    }
    .header { 
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
      padding: 40px 30px; 
      text-align: center; 
      border-radius: 8px 8px 0 0;
    }
    .logo { 
      color: white; 
      font-size: 32px; 
      font-weight: bold; 
      margin-bottom: 8px;
    }
    .tagline { 
      color: rgba(255, 255, 255, 0.9); 
      font-size: 16px; 
      margin: 0;
    }
    .content { 
      padding: 40px 30px; 
    }
    .welcome { 
      font-size: 18px; 
      color: #374151; 
      margin-bottom: 30px; 
      line-height: 1.5;
    }
    .button { 
      display: inline-block; 
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
      color: white; 
      padding: 16px 32px; 
      text-decoration: none; 
      border-radius: 8px; 
      font-weight: 600; 
      margin: 20px 0;
    }
    .code-section { 
      background: #f9fafb; 
      padding: 20px; 
      border-radius: 8px; 
      margin: 30px 0; 
      text-align: center;
    }
    .code { 
      font-family: 'Monaco', 'Consolas', monospace; 
      font-size: 24px; 
      font-weight: bold; 
      color: #667eea; 
      letter-spacing: 2px;
    }
    .footer { 
      padding: 30px; 
      text-align: center; 
      color: #6b7280; 
      font-size: 14px; 
      border-top: 1px solid #e5e7eb;
    }
    .signature { 
      margin-top: 30px; 
      color: #374151; 
      font-style: italic;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">WeKIT</div>
      <p class="tagline">College Discovery Platform</p>
    </div>
    
    <div class="content">
      <h1 style="color: #374151; margin-bottom: 20px;">${isSignUp ? 'Welcome to WeKIT!' : 'Sign in to WeKIT'}</h1>
      
      <p class="welcome">${welcomeText}</p>
      
      <div style="text-align: center;">
        <a href="${confirmationUrl}" class="button">${actionText}</a>
      </div>
      
      <div class="code-section">
        <p style="margin-bottom: 10px; color: #6b7280;">Or enter this verification code:</p>
        <div class="code">${token}</div>
      </div>
      
      <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
        If you didn't ${isSignUp ? 'create an account' : 'request to sign in'} with WeKIT, you can safely ignore this email.
      </p>
      
      <div class="signature">
        <p>Best regards,<br>
        <strong>Yoma from WeKIT</strong><br>
        College Discovery Team</p>
      </div>
    </div>
    
    <div class="footer">
      <p>© 2024 WeKIT College Discovery. Helping students find their perfect college match.</p>
      <p style="margin-top: 10px;">
        <a href="${site_url}" style="color: #667eea; text-decoration: none;">Visit WeKIT</a>
      </p>
    </div>
  </div>
</body>
</html>`;

    const { error } = await resend.emails.send({
      from: 'Yoma from WeKIT <noreply@wekit.college>',
      to: [user.email],
      subject,
      html,
    });

    if (error) {
      console.error('Email send error:', error);
      throw error;
    }

    console.log('Custom auth email sent successfully');
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });

  } catch (error: any) {
    console.error('Function error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
});