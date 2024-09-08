import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Task } from '../task.model';
import { MatDialog } from '@angular/material/dialog';
import { NewTaskDialogComponent } from '../new-task-dialog/new-task-dialog.component';

@Component({
  selector: 'app-task',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {
  tasks: any[] = [];
  filteredTasks: any[] = [];
  searchQuery = '';
  currentPage = 1;
  private apiUrl = 'http://localhost:3001/api/tasks';

  constructor(private http: HttpClient, private dialog: MatDialog) {}

  ngOnInit() {
    this.loadTasks();
  }

  loadTasks() {
    // Make a GET request to your API
    this.http.get<{ tasks: any[] }>('http://localhost:3001/api/tasks').subscribe((data) => {
      this.tasks = data.tasks; // Assign the tasks from the API response
      console.log(this.tasks); // For debugging, log the tasks to the console
    }, (error) => {
      console.error('Failed to load tasks:', error); // Handle error
    });
  }
  onSearchChange(query: string) {
    this.filteredTasks = this.tasks.filter(task => 
      task.assignedTo.includes(query)
    );
  }

  openNewTaskModal() {
    const dialogRef = this.dialog.open(NewTaskDialogComponent, {
      width: '600px'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // Refresh the task list after a new task is added
      this.loadTasks();
    });
  }

  toggleDropdown(task: any) { 
    task.showDropdown = !task.showDropdown;
  }

  editTask(task: any) {
    const dialogRef = this.dialog.open(NewTaskDialogComponent, {
      width: '600px',
      data: { ...task } // Pass the current task data to the dialog
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadTasks(); // Refresh tasks after editing
      }
    });
  }

  deleteTask(task: any) {
    this.http.delete(`http://localhost:3001/api/tasks/${task._id}`).subscribe(response => {
      console.log('Task deleted successfully:', response);
      this.loadTasks(); // Refresh the tasks list after deleting
    }, error => {
      console.error('Failed to delete task:', error);
    });
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage() {
    this.currentPage++;
  }
}
