// Supabase database types
// Generate these with: npx supabase gen types typescript --project-id YOUR_PROJECT_ID

export interface Database {
  public: {
    Tables: {
      pdfs: {
        Row: {
          id: string;
          title: string;
          school: string;
          country: string;
          level: 'Undergraduate' | 'Graduate' | 'General';
          tags: string[];
          description: string;
          url: string;
          updated_at: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['pdfs']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['pdfs']['Insert']>;
      };
      user_preferences: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          email: string;
          school_year: string;
          interests: string[];
          theme: 'light' | 'dark' | 'system';
          email_notifications: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database['public']['Tables']['user_preferences']['Row'],
          'id' | 'created_at' | 'updated_at'
        >;
        Update: Partial<Database['public']['Tables']['user_preferences']['Insert']>;
      };
    };
  };
}

// Migration notes:
// 1. Create pdfs table with columns matching the Row type
// 2. Create user_preferences table for profile data
// 3. Set up Row Level Security (RLS) policies
// 4. Configure Supabase Storage bucket for PDF files

