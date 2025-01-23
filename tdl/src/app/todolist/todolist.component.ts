import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-todolist',
  templateUrl: './todolist.component.html',
  styleUrls: ['./todolist.component.css']
})
export class TodolistComponent implements OnInit {
  taskArray: { id: number; taskName: string; isCompleted: boolean }[] = [];
  apiUrl = 'http://localhost:3000/tasks';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // Fetch tasks from the backend
    this.http.get(this.apiUrl).subscribe((data: any) => {
      this.taskArray = data;
    });
  }

  onSubmit(form: any): void {
    const newTask = { taskName: form.value.task };
    this.http.post(this.apiUrl, newTask).subscribe((task: any) => {
      this.taskArray.push(task);
      form.reset();
    });
  }

  onDelete(index: number): void {
    const task = this.taskArray[index];
    this.http.delete(`${this.apiUrl}/${task.id}`).subscribe(() => {
      this.taskArray.splice(index, 1);
    });
  }

  onCheck(index: number): void {
    const task = this.taskArray[index];
    task.isCompleted = !task.isCompleted;
    this.http.put(`${this.apiUrl}/${task.id}`, task).subscribe(updatedTask => {
      this.taskArray[index] = updatedTask as any;
    });
  }

  onEdit(index: number): void {
    const task = this.taskArray[index];
    const updatedTaskName = prompt('Edit task name:', task.taskName);
    if (updatedTaskName) {
      task.taskName = updatedTaskName;
      this.http.put(`${this.apiUrl}/${task.id}`, task).subscribe(updatedTask => {
        this.taskArray[index] = updatedTask as any;
      });
    }
  }
}
