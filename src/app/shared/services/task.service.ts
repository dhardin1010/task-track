
import { Injectable } from '@angular/core';
import { Task } from '../models/task.model';
import { Guid } from 'guid-typescript';
import { Subject } from 'rxjs';
import { EventService } from './event.service';
import { TaskFirebaseService } from './task-firebase.service';
import { UtilityService } from './utility.service';
import { reject } from 'q';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private tasks: Task[] = [];
  selectedTask: Task;
  totalProjectHours = 0;
  currentTask = new Subject<Task>();
  projectHours = new Subject<number>();
  tasksSubject = new Subject<Task[]>();

  constructor(private eventService: EventService,
              private utilityService: UtilityService,
              private taskFirebaseService: TaskFirebaseService) {
    this.eventService.taskHours.subscribe((hours: number) => {
      this.selectedTask.taskHours = hours;
      this.updateTask(this.selectedTask);
    });
  }

  getTasks(projectId: string) {
    switch (this.utilityService.getDataStore()) {
      case 'local':
        const filteredTasks = this.tasks.filter((tasks) => {
          return tasks.projectId === projectId;
        });

        this.tasksSubject.next(filteredTasks);
      break;

      case 'firebase':
        this.taskFirebaseService.getTasks(projectId).subscribe((data) => {
          this.tasks = data;
          this.tasksSubject.next(this.tasks);
        });
      break;
    }
  }

  addTask(projectId: string, taskName: string): Promise<any> {
    const task = new Task(null, taskName, projectId, 0);

    switch (this.utilityService.getDataStore()) {
      case 'local':
        return new Promise((resolve, reject) => {
          task.id = Guid.create().toString();
          this.tasks.push(task);
          this.selectedTask = task;
          this.currentTask.next(this.selectedTask);

          const filteredTasks = this.tasks.filter((tasks) => {
            return tasks.projectId === projectId;
          });
          this.tasksSubject.next(filteredTasks);
          resolve(task.id);
        });

      case 'firebase':
        return this.taskFirebaseService.addTask(task)
          .then((id) => {
            return id;
          })
          .catch((error) => {
            return reject(error);
          });
    }
  }

  updateTask(task: Task): Promise<any> {
    switch (this.utilityService.getDataStore()) {
      case 'local':
        return new Promise((resolve, reject) => {
          this.tasks.map((data) => {
            if (data.id === task.id) {
              data = Object.assign(data, task);
            }
          });

          this.totalProjectHours = this.getProjectEventHours(task.projectId);
          this.projectHours.next(this.totalProjectHours);
          resolve();
        });

      case 'firebase':
        return this.taskFirebaseService.updateTask(task)
          .then(() => {
            return;
          })
          .catch((error) => {
            return reject(error);
          });
    }
  }

  deleteTask(task: Task): Promise<any> {
    switch (this.utilityService.getDataStore()) {
      case 'local':
        return new Promise((resolve, reject) => {
          this.eventService.deleteEvents(task.id);

          this.tasks.map((data, index) => {
            if (data.id === task.id) {
              this.tasks.splice(index, 1);
            }
          });

          const filteredTasks = this.tasks.filter((tasks) => {
            return tasks.projectId === task.projectId;
          });

          this.selectedTask = null;
          this.currentTask.next(this.selectedTask);
          this.totalProjectHours = this.getProjectEventHours(task.projectId);
          this.projectHours.next(this.totalProjectHours);
          this.tasksSubject.next(filteredTasks);
          resolve();
        });

      case 'firebase':
        // this.eventService.deleteEvents(task.id);
        return this.taskFirebaseService.deleteTask(task.id)
          .then(() => {
            this.selectedTask = null;
            this.currentTask.next(this.selectedTask);
            this.totalProjectHours = this.getProjectEventHours(task.projectId);
            this.projectHours.next(this.totalProjectHours);
            return;
          })
          .catch((error) => {
            return reject(error);
          });
    }
  }

  deleteTasks(projectId: string): Promise<any> {
    switch (this.utilityService.getDataStore()) {
      case 'local':
        return new Promise((resolve, reject) => {

          for (let i = this.tasks.length - 1; i >= 0; i--) {
            if (this.tasks[i].projectId === projectId) {
              this.eventService.deleteEvents(this.tasks[i].id);
              this.tasks.splice(i, 1);
            }
          }
          resolve();
        });

      case 'firebase':
        return this.taskFirebaseService.deleteTasks(projectId)
          .then(() => {
            return;
          })
          .catch((error) => {
            return reject(error);
          });
    }

    // for (let i = this.tasks.length - 1; i >= 0; i--) {
    //   if (this.tasks[i].projectId === projectId) {
    //     this.eventService.deleteEvents(this.tasks[i].id);
    //     this.tasks.splice(i, 1);
    //   }
    // }
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
