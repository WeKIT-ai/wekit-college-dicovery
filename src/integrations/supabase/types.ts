export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      assessment_results: {
        Row: {
          career_recommendations: Json | null
          created_at: string
          id: string
          personality_scores: Json
          skills_data: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          career_recommendations?: Json | null
          created_at?: string
          id?: string
          personality_scores: Json
          skills_data: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          career_recommendations?: Json | null
          created_at?: string
          id?: string
          personality_scores?: Json
          skills_data?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      career_roadmaps: {
        Row: {
          career_family: string
          created_at: string
          id: string
          mentor_matches: Json | null
          milestones: Json | null
          progress_tracking: Json | null
          recommended_paths: Json
          resources: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          career_family: string
          created_at?: string
          id?: string
          mentor_matches?: Json | null
          milestones?: Json | null
          progress_tracking?: Json | null
          recommended_paths: Json
          resources?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          career_family?: string
          created_at?: string
          id?: string
          mentor_matches?: Json | null
          milestones?: Json | null
          progress_tracking?: Json | null
          recommended_paths?: Json
          resources?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      communication_logs: {
        Row: {
          attachments: Json | null
          communication_type: string
          connection_id: string | null
          content: string | null
          created_at: string | null
          id: string
          platform: string | null
          read_at: string | null
          recipient_id: string
          response_time_minutes: number | null
          sender_id: string
          subject: string | null
        }
        Insert: {
          attachments?: Json | null
          communication_type: string
          connection_id?: string | null
          content?: string | null
          created_at?: string | null
          id?: string
          platform?: string | null
          read_at?: string | null
          recipient_id: string
          response_time_minutes?: number | null
          sender_id: string
          subject?: string | null
        }
        Update: {
          attachments?: Json | null
          communication_type?: string
          connection_id?: string | null
          content?: string | null
          created_at?: string | null
          id?: string
          platform?: string | null
          read_at?: string | null
          recipient_id?: string
          response_time_minutes?: number | null
          sender_id?: string
          subject?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "communication_logs_connection_id_fkey"
            columns: ["connection_id"]
            isOneToOne: false
            referencedRelation: "mentorship_connections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "communication_logs_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "communication_logs_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_submissions: {
        Row: {
          company: string | null
          email: string
          id: string
          message: string
          name: string
          source_page: string | null
          status: string | null
          submitted_at: string
        }
        Insert: {
          company?: string | null
          email: string
          id?: string
          message: string
          name: string
          source_page?: string | null
          status?: string | null
          submitted_at?: string
        }
        Update: {
          company?: string | null
          email?: string
          id?: string
          message?: string
          name?: string
          source_page?: string | null
          status?: string | null
          submitted_at?: string
        }
        Relationships: []
      }
      diversity_metrics: {
        Row: {
          connection_id: string | null
          created_at: string | null
          demographic_category: string | null
          id: string
          measurement_date: string | null
          metric_type: string
          metric_value: number | null
          notes: string | null
          program_id: string | null
          target_value: number | null
        }
        Insert: {
          connection_id?: string | null
          created_at?: string | null
          demographic_category?: string | null
          id?: string
          measurement_date?: string | null
          metric_type: string
          metric_value?: number | null
          notes?: string | null
          program_id?: string | null
          target_value?: number | null
        }
        Update: {
          connection_id?: string | null
          created_at?: string | null
          demographic_category?: string | null
          id?: string
          measurement_date?: string | null
          metric_type?: string
          metric_value?: number | null
          notes?: string | null
          program_id?: string | null
          target_value?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "diversity_metrics_connection_id_fkey"
            columns: ["connection_id"]
            isOneToOne: false
            referencedRelation: "mentorship_connections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "diversity_metrics_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "mentoring_programs"
            referencedColumns: ["id"]
          },
        ]
      }
      mentor_profiles: {
        Row: {
          availability: Json | null
          bio: string | null
          communication_style:
            | Database["public"]["Enums"]["communication_style"]
            | null
          company: string | null
          created_at: string
          cultural_background: string | null
          current_mentees: number | null
          diversity_attributes: Json | null
          email: string
          experience_years: number | null
          first_name: string
          id: string
          industry: string | null
          is_active: boolean | null
          is_verified: boolean | null
          languages_spoken: string[] | null
          last_name: string
          learning_style: Database["public"]["Enums"]["learning_style"] | null
          matching_preferences: Json | null
          mentoring_capacity: number | null
          mentoring_philosophy: string | null
          personality_scores: Json | null
          position: string | null
          preferred_meeting_times: Json | null
          skill_assessments: Json | null
          specialties: string[] | null
          time_zone: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          availability?: Json | null
          bio?: string | null
          communication_style?:
            | Database["public"]["Enums"]["communication_style"]
            | null
          company?: string | null
          created_at?: string
          cultural_background?: string | null
          current_mentees?: number | null
          diversity_attributes?: Json | null
          email: string
          experience_years?: number | null
          first_name: string
          id?: string
          industry?: string | null
          is_active?: boolean | null
          is_verified?: boolean | null
          languages_spoken?: string[] | null
          last_name: string
          learning_style?: Database["public"]["Enums"]["learning_style"] | null
          matching_preferences?: Json | null
          mentoring_capacity?: number | null
          mentoring_philosophy?: string | null
          personality_scores?: Json | null
          position?: string | null
          preferred_meeting_times?: Json | null
          skill_assessments?: Json | null
          specialties?: string[] | null
          time_zone?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          availability?: Json | null
          bio?: string | null
          communication_style?:
            | Database["public"]["Enums"]["communication_style"]
            | null
          company?: string | null
          created_at?: string
          cultural_background?: string | null
          current_mentees?: number | null
          diversity_attributes?: Json | null
          email?: string
          experience_years?: number | null
          first_name?: string
          id?: string
          industry?: string | null
          is_active?: boolean | null
          is_verified?: boolean | null
          languages_spoken?: string[] | null
          last_name?: string
          learning_style?: Database["public"]["Enums"]["learning_style"] | null
          matching_preferences?: Json | null
          mentoring_capacity?: number | null
          mentoring_philosophy?: string | null
          personality_scores?: Json | null
          position?: string | null
          preferred_meeting_times?: Json | null
          skill_assessments?: Json | null
          specialties?: string[] | null
          time_zone?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      mentoring_analytics: {
        Row: {
          baseline_value: number | null
          connection_id: string | null
          created_at: string | null
          data_source: string | null
          id: string
          measurement_date: string | null
          measurement_period: string | null
          metric_category: string | null
          metric_name: string
          metric_value: number | null
          notes: string | null
          program_id: string | null
          target_value: number | null
        }
        Insert: {
          baseline_value?: number | null
          connection_id?: string | null
          created_at?: string | null
          data_source?: string | null
          id?: string
          measurement_date?: string | null
          measurement_period?: string | null
          metric_category?: string | null
          metric_name: string
          metric_value?: number | null
          notes?: string | null
          program_id?: string | null
          target_value?: number | null
        }
        Update: {
          baseline_value?: number | null
          connection_id?: string | null
          created_at?: string | null
          data_source?: string | null
          id?: string
          measurement_date?: string | null
          measurement_period?: string | null
          metric_category?: string | null
          metric_name?: string
          metric_value?: number | null
          notes?: string | null
          program_id?: string | null
          target_value?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "mentoring_analytics_connection_id_fkey"
            columns: ["connection_id"]
            isOneToOne: false
            referencedRelation: "mentorship_connections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mentoring_analytics_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "mentoring_programs"
            referencedColumns: ["id"]
          },
        ]
      }
      mentoring_feedback: {
        Row: {
          additional_support_needed: string | null
          challenges_faced: string | null
          communication_rating: number | null
          connection_id: string | null
          created_at: string | null
          engagement_level: number | null
          feedback_type: Database["public"]["Enums"]["feedback_type"]
          goal_id: string | null
          goal_progress_rating: number | null
          highlights: string | null
          id: string
          improvement_suggestions: string | null
          is_anonymous: boolean | null
          overall_rating: number | null
          preparation_rating: number | null
          provider_id: string
          qualitative_feedback: string | null
          recipient_id: string | null
          recommend_continuation: boolean | null
          relationship_quality_rating: number | null
          response_data: Json | null
          sentiment_score: number | null
          session_id: string | null
          tags: string[] | null
          value_rating: number | null
        }
        Insert: {
          additional_support_needed?: string | null
          challenges_faced?: string | null
          communication_rating?: number | null
          connection_id?: string | null
          created_at?: string | null
          engagement_level?: number | null
          feedback_type: Database["public"]["Enums"]["feedback_type"]
          goal_id?: string | null
          goal_progress_rating?: number | null
          highlights?: string | null
          id?: string
          improvement_suggestions?: string | null
          is_anonymous?: boolean | null
          overall_rating?: number | null
          preparation_rating?: number | null
          provider_id: string
          qualitative_feedback?: string | null
          recipient_id?: string | null
          recommend_continuation?: boolean | null
          relationship_quality_rating?: number | null
          response_data?: Json | null
          sentiment_score?: number | null
          session_id?: string | null
          tags?: string[] | null
          value_rating?: number | null
        }
        Update: {
          additional_support_needed?: string | null
          challenges_faced?: string | null
          communication_rating?: number | null
          connection_id?: string | null
          created_at?: string | null
          engagement_level?: number | null
          feedback_type?: Database["public"]["Enums"]["feedback_type"]
          goal_id?: string | null
          goal_progress_rating?: number | null
          highlights?: string | null
          id?: string
          improvement_suggestions?: string | null
          is_anonymous?: boolean | null
          overall_rating?: number | null
          preparation_rating?: number | null
          provider_id?: string
          qualitative_feedback?: string | null
          recipient_id?: string | null
          recommend_continuation?: boolean | null
          relationship_quality_rating?: number | null
          response_data?: Json | null
          sentiment_score?: number | null
          session_id?: string | null
          tags?: string[] | null
          value_rating?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "mentoring_feedback_connection_id_fkey"
            columns: ["connection_id"]
            isOneToOne: false
            referencedRelation: "mentorship_connections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mentoring_feedback_goal_id_fkey"
            columns: ["goal_id"]
            isOneToOne: false
            referencedRelation: "mentoring_goals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mentoring_feedback_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mentoring_feedback_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mentoring_feedback_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "mentoring_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      mentoring_goals: {
        Row: {
          achievable_criteria: string | null
          category: string | null
          completed_at: string | null
          connection_id: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          is_smart_goal: boolean | null
          measurable_criteria: string | null
          milestones: Json | null
          priority_level: number | null
          progress_percentage: number | null
          relevant_criteria: string | null
          resources_needed: string[] | null
          specific_criteria: string | null
          status: string | null
          success_metrics: Json | null
          target_date: string | null
          time_bound_criteria: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          achievable_criteria?: string | null
          category?: string | null
          completed_at?: string | null
          connection_id?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_smart_goal?: boolean | null
          measurable_criteria?: string | null
          milestones?: Json | null
          priority_level?: number | null
          progress_percentage?: number | null
          relevant_criteria?: string | null
          resources_needed?: string[] | null
          specific_criteria?: string | null
          status?: string | null
          success_metrics?: Json | null
          target_date?: string | null
          time_bound_criteria?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          achievable_criteria?: string | null
          category?: string | null
          completed_at?: string | null
          connection_id?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_smart_goal?: boolean | null
          measurable_criteria?: string | null
          milestones?: Json | null
          priority_level?: number | null
          progress_percentage?: number | null
          relevant_criteria?: string | null
          resources_needed?: string[] | null
          specific_criteria?: string | null
          status?: string | null
          success_metrics?: Json | null
          target_date?: string | null
          time_bound_criteria?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mentoring_goals_connection_id_fkey"
            columns: ["connection_id"]
            isOneToOne: false
            referencedRelation: "mentorship_connections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mentoring_goals_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      mentoring_programs: {
        Row: {
          application_deadline: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          diversity_goals: Json | null
          duration_weeks: number | null
          end_date: string | null
          id: string
          is_active: boolean | null
          matching_criteria: Json | null
          max_participants: number | null
          name: string
          objectives: Json | null
          program_type: Database["public"]["Enums"]["program_type"]
          start_date: string | null
          updated_at: string | null
        }
        Insert: {
          application_deadline?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          diversity_goals?: Json | null
          duration_weeks?: number | null
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          matching_criteria?: Json | null
          max_participants?: number | null
          name: string
          objectives?: Json | null
          program_type: Database["public"]["Enums"]["program_type"]
          start_date?: string | null
          updated_at?: string | null
        }
        Update: {
          application_deadline?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          diversity_goals?: Json | null
          duration_weeks?: number | null
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          matching_criteria?: Json | null
          max_participants?: number | null
          name?: string
          objectives?: Json | null
          program_type?: Database["public"]["Enums"]["program_type"]
          start_date?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mentoring_programs_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      mentoring_sessions: {
        Row: {
          actual_end_time: string | null
          actual_start_time: string | null
          agenda: Json | null
          attendance_status: string | null
          connection_id: string | null
          created_at: string | null
          duration_minutes: number | null
          follow_up_actions: Json | null
          goals_addressed: string[] | null
          id: string
          meeting_format: string | null
          meeting_link: string | null
          mentee_preparation_time: number | null
          mentor_preparation_time: number | null
          outcomes: Json | null
          scheduled_at: string
          session_notes: string | null
          session_type: Database["public"]["Enums"]["session_type"] | null
          topics_discussed: string[] | null
          updated_at: string | null
        }
        Insert: {
          actual_end_time?: string | null
          actual_start_time?: string | null
          agenda?: Json | null
          attendance_status?: string | null
          connection_id?: string | null
          created_at?: string | null
          duration_minutes?: number | null
          follow_up_actions?: Json | null
          goals_addressed?: string[] | null
          id?: string
          meeting_format?: string | null
          meeting_link?: string | null
          mentee_preparation_time?: number | null
          mentor_preparation_time?: number | null
          outcomes?: Json | null
          scheduled_at: string
          session_notes?: string | null
          session_type?: Database["public"]["Enums"]["session_type"] | null
          topics_discussed?: string[] | null
          updated_at?: string | null
        }
        Update: {
          actual_end_time?: string | null
          actual_start_time?: string | null
          agenda?: Json | null
          attendance_status?: string | null
          connection_id?: string | null
          created_at?: string | null
          duration_minutes?: number | null
          follow_up_actions?: Json | null
          goals_addressed?: string[] | null
          id?: string
          meeting_format?: string | null
          meeting_link?: string | null
          mentee_preparation_time?: number | null
          mentor_preparation_time?: number | null
          outcomes?: Json | null
          scheduled_at?: string
          session_notes?: string | null
          session_type?: Database["public"]["Enums"]["session_type"] | null
          topics_discussed?: string[] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mentoring_sessions_connection_id_fkey"
            columns: ["connection_id"]
            isOneToOne: false
            referencedRelation: "mentorship_connections"
            referencedColumns: ["id"]
          },
        ]
      }
      mentorship_connections: {
        Row: {
          communication_frequency: string | null
          compatibility_score: number | null
          completion_date: string | null
          connection_date: string | null
          created_at: string
          diversity_score: number | null
          effectiveness_metrics: Json | null
          goals: Json | null
          id: string
          match_score: number | null
          matching_method: Database["public"]["Enums"]["matching_method"] | null
          meeting_format: string | null
          mentee_id: string
          mentor_id: string
          mutual_rating: number | null
          notes: string | null
          program_id: string | null
          progress_milestones: Json | null
          relationship_quality_score: number | null
          status: string | null
          updated_at: string
        }
        Insert: {
          communication_frequency?: string | null
          compatibility_score?: number | null
          completion_date?: string | null
          connection_date?: string | null
          created_at?: string
          diversity_score?: number | null
          effectiveness_metrics?: Json | null
          goals?: Json | null
          id?: string
          match_score?: number | null
          matching_method?:
            | Database["public"]["Enums"]["matching_method"]
            | null
          meeting_format?: string | null
          mentee_id: string
          mentor_id: string
          mutual_rating?: number | null
          notes?: string | null
          program_id?: string | null
          progress_milestones?: Json | null
          relationship_quality_score?: number | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          communication_frequency?: string | null
          compatibility_score?: number | null
          completion_date?: string | null
          connection_date?: string | null
          created_at?: string
          diversity_score?: number | null
          effectiveness_metrics?: Json | null
          goals?: Json | null
          id?: string
          match_score?: number | null
          matching_method?:
            | Database["public"]["Enums"]["matching_method"]
            | null
          meeting_format?: string | null
          mentee_id?: string
          mentor_id?: string
          mutual_rating?: number | null
          notes?: string | null
          program_id?: string | null
          progress_milestones?: Json | null
          relationship_quality_score?: number | null
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "mentorship_connections_mentee_id_fkey"
            columns: ["mentee_id"]
            isOneToOne: false
            referencedRelation: "youth_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mentorship_connections_mentor_id_fkey"
            columns: ["mentor_id"]
            isOneToOne: false
            referencedRelation: "mentor_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mentorship_connections_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "mentoring_programs"
            referencedColumns: ["id"]
          },
        ]
      }
      newsletter_subscriptions: {
        Row: {
          email: string
          id: string
          is_active: boolean
          source_page: string | null
          subscribed_at: string
        }
        Insert: {
          email: string
          id?: string
          is_active?: boolean
          source_page?: string | null
          subscribed_at?: string
        }
        Update: {
          email?: string
          id?: string
          is_active?: boolean
          source_page?: string | null
          subscribed_at?: string
        }
        Relationships: []
      }
      page_interactions: {
        Row: {
          created_at: string
          id: string
          interaction_data: Json | null
          interaction_type: string
          page_name: string
          session_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          interaction_data?: Json | null
          interaction_type: string
          page_name: string
          session_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          interaction_data?: Json | null
          interaction_type?: string
          page_name?: string
          session_id?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      psychometric_test_leads: {
        Row: {
          created_at: string
          email: string | null
          id: string
          referral_source: string | null
          test_completed_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          referral_source?: string | null
          test_completed_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          referral_source?: string | null
          test_completed_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      system_integrations: {
        Row: {
          connection_id: string | null
          created_at: string | null
          error_message: string | null
          external_system: string
          id: string
          integration_type: string
          last_sync_at: string | null
          sync_data: Json | null
          sync_status: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          connection_id?: string | null
          created_at?: string | null
          error_message?: string | null
          external_system: string
          id?: string
          integration_type: string
          last_sync_at?: string | null
          sync_data?: Json | null
          sync_status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          connection_id?: string | null
          created_at?: string | null
          error_message?: string | null
          external_system?: string
          id?: string
          integration_type?: string
          last_sync_at?: string | null
          sync_data?: Json | null
          sync_status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "system_integrations_connection_id_fkey"
            columns: ["connection_id"]
            isOneToOne: false
            referencedRelation: "mentorship_connections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "system_integrations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          assigned_at: string | null
          assigned_by: string | null
          id: string
          is_active: boolean | null
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          assigned_at?: string | null
          assigned_by?: string | null
          id?: string
          is_active?: boolean | null
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          assigned_at?: string | null
          assigned_by?: string | null
          id?: string
          is_active?: boolean | null
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      white_paper_leads: {
        Row: {
          created_at: string
          downloaded_at: string
          email: string
          id: string
          name: string
          phone: string
          user_type: string
        }
        Insert: {
          created_at?: string
          downloaded_at?: string
          email: string
          id?: string
          name: string
          phone: string
          user_type: string
        }
        Update: {
          created_at?: string
          downloaded_at?: string
          email?: string
          id?: string
          name?: string
          phone?: string
          user_type?: string
        }
        Relationships: []
      }
      youth_profiles: {
        Row: {
          barriers_to_success: string[] | null
          career_aspirations: Json | null
          career_goals: string | null
          challenges: string | null
          communication_consent: boolean | null
          communication_style:
            | Database["public"]["Enums"]["communication_style"]
            | null
          created_at: string
          cultural_background: string | null
          data_consent: boolean | null
          date_of_birth: string | null
          diversity_attributes: Json | null
          education: string | null
          email: string
          first_name: string
          gender: string | null
          grade: string | null
          id: string
          interests: string[] | null
          languages: string[] | null
          languages_spoken: string[] | null
          last_name: string
          learning_objectives: Json | null
          learning_style: Database["public"]["Enums"]["learning_style"] | null
          location: string | null
          onboarding_completed: boolean | null
          parental_consent: boolean | null
          personality_scores: Json | null
          phone: string | null
          preferred_meeting_times: Json | null
          school: string | null
          skill_levels: Json | null
          subjects: string[] | null
          time_commitment: string | null
          time_zone: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          barriers_to_success?: string[] | null
          career_aspirations?: Json | null
          career_goals?: string | null
          challenges?: string | null
          communication_consent?: boolean | null
          communication_style?:
            | Database["public"]["Enums"]["communication_style"]
            | null
          created_at?: string
          cultural_background?: string | null
          data_consent?: boolean | null
          date_of_birth?: string | null
          diversity_attributes?: Json | null
          education?: string | null
          email: string
          first_name: string
          gender?: string | null
          grade?: string | null
          id?: string
          interests?: string[] | null
          languages?: string[] | null
          languages_spoken?: string[] | null
          last_name: string
          learning_objectives?: Json | null
          learning_style?: Database["public"]["Enums"]["learning_style"] | null
          location?: string | null
          onboarding_completed?: boolean | null
          parental_consent?: boolean | null
          personality_scores?: Json | null
          phone?: string | null
          preferred_meeting_times?: Json | null
          school?: string | null
          skill_levels?: Json | null
          subjects?: string[] | null
          time_commitment?: string | null
          time_zone?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          barriers_to_success?: string[] | null
          career_aspirations?: Json | null
          career_goals?: string | null
          challenges?: string | null
          communication_consent?: boolean | null
          communication_style?:
            | Database["public"]["Enums"]["communication_style"]
            | null
          created_at?: string
          cultural_background?: string | null
          data_consent?: boolean | null
          date_of_birth?: string | null
          diversity_attributes?: Json | null
          education?: string | null
          email?: string
          first_name?: string
          gender?: string | null
          grade?: string | null
          id?: string
          interests?: string[] | null
          languages?: string[] | null
          languages_spoken?: string[] | null
          last_name?: string
          learning_objectives?: Json | null
          learning_style?: Database["public"]["Enums"]["learning_style"] | null
          location?: string | null
          onboarding_completed?: boolean | null
          parental_consent?: boolean | null
          personality_scores?: Json | null
          phone?: string | null
          preferred_meeting_times?: Json | null
          school?: string | null
          skill_levels?: Json | null
          subjects?: string[] | null
          time_commitment?: string | null
          time_zone?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "mentor" | "youth" | "institution" | "corporate"
      communication_style: "formal" | "casual" | "structured" | "flexible"
      feedback_type: "session" | "milestone" | "program_completion" | "exit"
      learning_style: "visual" | "auditory" | "kinesthetic" | "reading_writing"
      matching_method: "algorithmic" | "manual" | "self_selected" | "bulk"
      mentoring_status:
        | "pending"
        | "active"
        | "paused"
        | "completed"
        | "cancelled"
      program_type: "one_on_one" | "group" | "peer" | "reverse" | "situational"
      session_type:
        | "onboarding"
        | "regular"
        | "goal_setting"
        | "progress_review"
        | "closing"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "mentor", "youth", "institution", "corporate"],
      communication_style: ["formal", "casual", "structured", "flexible"],
      feedback_type: ["session", "milestone", "program_completion", "exit"],
      learning_style: ["visual", "auditory", "kinesthetic", "reading_writing"],
      matching_method: ["algorithmic", "manual", "self_selected", "bulk"],
      mentoring_status: [
        "pending",
        "active",
        "paused",
        "completed",
        "cancelled",
      ],
      program_type: ["one_on_one", "group", "peer", "reverse", "situational"],
      session_type: [
        "onboarding",
        "regular",
        "goal_setting",
        "progress_review",
        "closing",
      ],
    },
  },
} as const
