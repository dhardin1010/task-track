
import { Injectable } from '@angular/core';
import { Task } from '../models/task.model';
import { Guid } from 'guid-typescript';
import { Subject } from 'rxjs';
import { EventService } from './event.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private tasks: Task[] = [];
  selectedTask: Task;
  currentTask = new Subject<Task>();
  totalProjectHours = 0;
  projectHours = new Subject<number>();

  constructor(private eventService: EventService) {
    this.eventService.taskHours.subscribe((hours: number) => {
      this.selectedTask.taskHours = hours;
      this.updateTask(this.selectedTask);
    });
  }

  getTasks(projectId: string) {
    return this.tasks
      .filter((tasks) => {
        return tasks.projectId === projectId;
      });
  }

  createTask(projectId: string, taskName: string) {
    const id = Guid.create().toString();
    const task = new Task(id, taskName, projectId, 0);
    this.tasks.push(task);
    this.selectedTask = task;
    this.currentTask.next(this.selectedTask);
    return id;
  }

  updateTask(task: Task) {
    this.tasks.map((data) => {
      if (data.id === task.id) {
        data = Object.assign(data, task);
      }
    });

    this.totalProjectHours = this.getProjectEventHours(task.projectId);
    this.projectHours.next(this.totalProjectHours);
  }

  deleteTask(task: Task) {
    this.eventService.deleteEvents(task.id);

    this.tasks.map((data, index) => {
      if (data.id === task.id) {
        this.tasks.splice(index, 1);
      }
    });

    this.selectedTask = null;
    this.currentTask.next(this.selectedTask);
    this.totalProjectHours = this.getProjectEventHours(task.projectId);
    this.projectHours.next(this.totalProjectHours);
  }

  deleteTasks(projectId: string) {
    for (let i = this.tasks.length - 1; i >= 0; i--) {
      if (this.tasks[i].projectId === projectId) {
        this.eventService.deleteEvents(this.tasks[i].id);
        this.tasks.splice(i, 1);
      }
    }
  }

  getProjectEventHours(projectId: string) {
    return this.tasks.filter((task) => {
      return task.projectId === projectId;
    }).reduce((total, task) => {
      return total += task.taskHours;
    }, 0);
  }

  setCurrentTask(task: Task) {
    this.selectedTask = task;
    this.currentTask.next(this.selectedTask);
  }
}
