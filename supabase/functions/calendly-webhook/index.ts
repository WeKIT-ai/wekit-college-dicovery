import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const payload = await req.json()
    console.log('Calendly webhook received:', payload)

    // Verify webhook signature if configured
    const signature = req.headers.get('calendly-webhook-signature')
    // TODO: Implement signature verification when Calendly webhook secret is configured

    // Process different event types
    const eventType = payload.event
    const eventData = payload.payload

    // Store webhook data
    await supabaseClient
      .from('calendly_webhooks')
      .insert({
        event_type: eventType,
        event_data: eventData,
        processed: false
      })

    // Handle specific event types
    switch (eventType) {
      case 'invitee.created':
        await handleInviteeCreated(supabaseClient, eventData)
        break
      case 'invitee.canceled':
        await handleInviteeCanceled(supabaseClient, eventData)
        break
      case 'invitee.rescheduled':
        await handleInviteeRescheduled(supabaseClient, eventData)
        break
      default:
        console.log(`Unhandled event type: ${eventType}`)
    }

    return new Response(
      JSON.stringify({ status: 'success', event: eventType }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error processing Calendly webhook:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})

async function handleInviteeCreated(supabaseClient: any, eventData: any) {
  try {
    const { event, invitee } = eventData
    
    // Extract relevant information
    const eventUri = event.uri
    const eventStartTime = event.start_time
    const eventEndTime = event.end_time
    const meetingLink = event.location?.join_url || event.location?.value
    const inviteeEmail = invitee.email
    const inviteeName = invitee.name

    console.log('Processing invitee.created:', {
      eventUri,
      eventStartTime,
      inviteeEmail,
      inviteeName
    })

    // Find the mentor profile by matching Calendly event details
    // This is a simplified approach - in production, you'd want more robust matching
    const { data: mentorProfiles, error: mentorError } = await supabaseClient
      .from('mentor_profiles')
      .select('id, user_id, calendly_username, email')
      .eq('scheduling_enabled', true)

    if (mentorError) {
      console.error('Error fetching mentor profiles:', mentorError)
      return
    }

    // Try to match mentor by email or Calendly username
    const mentor = mentorProfiles?.find((mp: any) => 
      mp.email === inviteeEmail || // If the mentor's email matches
      eventUri.includes(mp.calendly_username) // Or if the event URI contains their username
    )

    if (!mentor) {
      console.log('No matching mentor found for event')
      return
    }

    // Look for pending scheduling requests from this invitee to this mentor
    const { data: pendingRequests, error: requestError } = await supabaseClient
      .from('mentoring_requests')
      .select(`
        id,
        user_profiles!mentoring_requests_mentee_id_fkey (
          user_id,
          full_name
        )
      `)
      .eq('mentor_id', mentor.id)
      .eq('is_scheduling_request', true)
      .eq('scheduling_status', 'pending')

    if (requestError) {
      console.error('Error fetching pending requests:', requestError)
      return
    }

    // Update the matching request or create a new one
    let matchingRequest = pendingRequests?.find((req: any) => 
      req.user_profiles?.full_name?.toLowerCase().includes(inviteeName.toLowerCase())
    )

    if (matchingRequest) {
      // Update existing request
      await supabaseClient
        .from('mentoring_requests')
        .update({
          scheduling_status: 'scheduled',
          scheduled_at: eventStartTime,
          meeting_link: meetingLink,
          calendly_event_id: eventUri
        })
        .eq('id', matchingRequest.id)

      console.log('Updated existing mentoring request:', matchingRequest.id)
    } else {
      // Create a new mentoring request for this scheduled session
      await supabaseClient
        .from('mentoring_requests')
        .insert({
          mentor_id: mentor.id,
          subject: 'Calendly Scheduled Session',
          description: `Session scheduled via Calendly with ${inviteeName}`,
          is_scheduling_request: true,
          scheduling_status: 'scheduled',
          scheduled_at: eventStartTime,
          meeting_link: meetingLink,
          calendly_event_id: eventUri,
          status: 'accepted'
        })

      console.log('Created new mentoring request for Calendly session')
    }

    // Update webhook record as processed
    await supabaseClient
      .from('calendly_webhooks')
      .update({ processed: true, mentor_id: mentor.id })
      .eq('event_data->payload->event->uri', eventUri)

  } catch (error) {
    console.error('Error in handleInviteeCreated:', error)
  }
}

async function handleInviteeCanceled(supabaseClient: any, eventData: any) {
  try {
    const { event } = eventData
    const eventUri = event.uri

    // Find and update the corresponding mentoring request
    await supabaseClient
      .from('mentoring_requests')
      .update({
        scheduling_status: 'cancelled',
        meeting_link: null
      })
      .eq('calendly_event_id', eventUri)

    console.log('Updated mentoring request to cancelled for event:', eventUri)

  } catch (error) {
    console.error('Error in handleInviteeCanceled:', error)
  }
}

async function handleInviteeRescheduled(supabaseClient: any, eventData: any) {
  try {
    const { event } = eventData
    const eventUri = event.uri
    const newStartTime = event.start_time
    const meetingLink = event.location?.join_url || event.location?.value

    // Find and update the corresponding mentoring request
    await supabaseClient
      .from('mentoring_requests')
      .update({
        scheduled_at: newStartTime,
        meeting_link: meetingLink
      })
      .eq('calendly_event_id', eventUri)

    console.log('Updated mentoring request with new schedule for event:', eventUri)

  } catch (error) {
    console.error('Error in handleInviteeRescheduled:', error)
  }
}