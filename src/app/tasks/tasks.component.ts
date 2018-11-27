import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Params } from '@angular/router';

import { Task } from '../shared/models/task.model';
import { TaskService } from '../shared/services/task.service';
import { TaskEditDialogComponent } from './task-edit-dialog/task-edit-dialog.component';
import { ConfirmationDialogComponent } from '../shared/dialogs/confirmation-dialog/confirmation-dialog.component';
import { EventService } from '../shared/services/event.service';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss']
})
export class TasksComponent implements OnInit {
  tasks: Task[];
  projectId: string;
  selectedIndex: number;
  currentTask: Task;

  constructor(private route: ActivatedRoute,
              private taskService: TaskService,
              private eventService: EventService,
              private dialog: MatDialog) { }

  ngOnInit() {
    this.route.params
    .subscribe(
      (params: Params) => {
        this.projectId = params['id'];
        this.tasks = this.taskService.getTasks(this.projectId);
    });
  }

  onAdd() {
    const dialogRef = this.dialog.open(TaskEditDialogComponent, {
      width: '35rem',
      data: {taskName: ''}
    });

    dialogRef.afterClosed().subscribe(result => {
        if (result !== undefined) {
          this.taskService.createTask(this.projectId, result);
          this.tasks = this.taskService.getTasks(this.projectId);
        }
    });
  }

  onEdit() {
    if (this.currentTask == null) {
      return;
    }

    const dialogRef = this.dialog.open(TaskEditDialogComponent, {
      width: '35rem',
      data: {taskName: this.currentTask.name}
    });

    dialogRef.afterClosed().subscribe(result => {
        if (result !== undefined) {
          this.currentTask.name = result;
          this.taskService.updateTask(this.currentTask);
        }
    });
  }

  onDelete() {
    if (this.currentTask == null) {
      return;
    }

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '35rem',
      data: {message: 'Are you sure you want to delete?  Deleting a task will remove all associated events.'}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'confirm' && this.currentTask != null) {
        this.taskService.deleteTask(this.currentTask);
        this.currentTask = null;
        this.selectedIndex = null;
        this.tasks = this.taskService.getTasks(this.projectId);
      }
    });
  }

  onSelected(task: Task, index: number) {
    this.currentTask = task;
    this.selectedIndex = index;
    this.taskService.setCurrentTask(task);
  }

}
