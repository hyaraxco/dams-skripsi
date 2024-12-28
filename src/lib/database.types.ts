export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          full_name: string;
          role: 'admin' | 'manager' | 'employee';
          department: string;
          join_date: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name: string;
          role?: 'admin' | 'manager' | 'employee';
          department?: string;
          join_date?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          role?: 'admin' | 'manager' | 'employee';
          department?: string;
          join_date?: string;
          updated_at?: string;
        };
      };
      tasks: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          assigned_to: string;
          created_by: string;
          status: 'todo' | 'in_progress' | 'review' | 'completed';
          priority: 'low' | 'medium' | 'high';
          deadline: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          assigned_to: string;
          created_by: string;
          status?: 'todo' | 'in_progress' | 'review' | 'completed';
          priority?: 'low' | 'medium' | 'high';
          deadline?: string <boltAction type="file" filePath="src/lib/database.types.ts"> | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          assigned_to?: string;
          created_by?: string;
          status?: 'todo' | 'in_progress' | 'review' | 'completed';
          priority?: 'low' | 'medium' | 'high';
          deadline?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      attendance: {
        Row: {
          id: string;
          user_id: string;
          date: string;
          check_in: string;
          check_out: string | null;
          photo_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          date?: string;
          check_in: string;
          check_out?: string | null;
          photo_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          date?: string;
          check_in?: string;
          check_out?: string | null;
          photo_url?: string | null;
          created_at?: string;
        };
      };
      payroll: {
        Row: {
          id: string;
          user_id: string;
          month: string;
          completed_tasks: number;
          bonuses: number;
          total_pay: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          month: string;
          completed_tasks?: number;
          bonuses?: number;
          total_pay: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          month?: string;
          completed_tasks?: number;
          bonuses?: number;
          total_pay?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}