export interface Task {
  id:           number;
  title:        string;
  date:         string;
  time:         string;
  category:     string | null;
  completed:    boolean;
  priority:     'low' | 'medium' | 'high';
  description?: string;
}
