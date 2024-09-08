export interface Task {
    id: number;
    assignedTo: string;
    status: string;
    dueDate: string;
    priority: string;
    comments: string;
    showDropdown?: boolean; // Optional property for dropdown visibility
  }
  