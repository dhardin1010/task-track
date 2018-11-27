import { Injectable } from '@angular/core';
import { Project } from '../models/project.model';
import { Guid } from 'guid-typescript';
import { Observable } from 'rxjs';
import { TaskService } from './task.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private projects: Project[] = [];
  selectedProject: Project;


  constructor(private taskService: TaskService) {
    this.taskService.projectHours.subscribe((hours: number) => {
      this.selectedProject.projectHours = hours;
      this.updateProject(this.selectedProject);
    });
  }

  getProjects() {
    return new Observable<Project[]>(observer => {
      observer.next(this.projects);
    });
  }

  getProject(id: string) {
    this.selectedProject = this.projects.find((data) => {
      return data.id === id;
    });

    return new Observable<Project>(observer => {
      const project = Object.assign({}, this.selectedProject);
      observer.next(project);
    });
  }

  addProject() {
    const id = Guid.create().toString();
    const project = new Project(id, 'Untitled Project', 0);
    this.projects.push(project);

    return new Observable<Project>(observer => {
      observer.next(project);
    });
  }

  updateProject(project: Project) {
    return new Observable<Project>(observer => {
      this.projects.map((data) => {
        if (data.id === project.id) {
          data = Object.assign(data, project);
        }
        observer.next(project);
      });
    });
  }

  deleteProject(id: string) {
    return new Observable<Project[]>(observer => {

      this.projects.map((data, index) => {
        if (data.id === id) {
          this.taskService.deleteTasks(id);
          this.projects.splice(index, 1);
        }
      });

      observer.next(this.projects);

    });
  }

  setSelectedProject(project: Project) {
    this.selectedProject = project;
  }
}
