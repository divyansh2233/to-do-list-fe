import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-new-task-dialog',
  templateUrl: './new-task-dialog.component.html',
  styleUrls: ['./new-task-dialog.component.css']
})
export class NewTaskDialogComponent {
  task: any = {
    assignedTo: '',
    status: '',
    dueDate: '',
    priority: '',
    description: ''
  };
  isEditMode: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<NewTaskDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private http: HttpClient
  ) {
    if (data && data._id) {
      this.task = { ...data }; // Copy existing task data
      this.isEditMode = true; // Set edit mode
    }
  }

  saveTask() {
    if (this.isEditMode) {
      // If editing, update the existing task
      this.http.put(`http://localhost:3001/api/tasks/${this.task._id}`, this.task).subscribe(response => {
        console.log('Task updated successfully:', response);
        this.dialogRef.close(true); // Close dialog and return success
      }, error => {
        console.error('Failed to update task:', error);
      });
    } else {
      // If creating a new task
      this.http.post('http://localhost:3001/api/tasks', this.task).subscribe(response => {
        console.log('Task created successfully:', response);
        this.dialogRef.close(true); // Close dialog and return success
      }, error => {
        console.error('Failed to create task:', error);
      });
    }
  }

  cancel() {
    this.dialogRef.close(); // Close the dialog without saving
  }
}
