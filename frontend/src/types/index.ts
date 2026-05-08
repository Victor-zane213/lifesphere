export interface Quote {
  id: number;
  content: string;
  author: string;
  created_at: string;
  updated_at: string;
}

export interface DailyLog {
  id: number;
  content: string;
  date: string;
  year: number;
  created_at: string;
  updated_at: string;
}

export interface DailyReflection {
  id: number;
  content: string;
  date: string;
  year: number;
  created_at: string;
  updated_at: string;
}

export interface Todo {
  id: number;
  content: string;
  done: boolean;
  date: string;
  year: number;
  created_at: string;
  updated_at: string;
}

export interface ContentItem {
  id: number;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}
