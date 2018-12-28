import { Injectable } from '@angular/core';
import { Project } from '../models/project.model';
import { Guid } from 'guid-typescript';
import { Subject } from 'rxjs';
import { TaskService } from './task.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { ProjectFirebaseService } from './project-firebase.service';
import { reject } from 'q';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private projects: Project[] = [];
  selectedProject: Project;
  selectedProjectSubject = new Subject<Project>();
  projectsSubject = new Subject<Project[]>();
  projectsCollection: AngularFirestoreCollection;

  constructor(private taskService: TaskService,
              private utilityService: UtilityService,
              private firestoreDB: AngularFirestore,
              private projectFirebaseService: ProjectFirebaseService) {

    this.projectsCollection = firestoreDB.collection<Project>('projects');
    this.taskService.projectHours.subscribe((hours: number) => {
      this.selectedProject.projectHours = hours;
      this.updateProject(this.selectedProject);
    });
  }

  getProjects() {
    switch (this.utilityService.getDataStore()) {
      case 'local':
        this.projectsSubject.next(this.projects);
      break;

      case 'firebase':
         this.projectFirebaseService.getProjects().subscribe(data => {
          this.projects = data;
          this.projectsSubject.next(this.projects);
         });
      break;
    }
  }

  getProject(id: string) {
    switch (this.utilityService.getDataStore()) {
      case 'local':
        this.selectedProject = this.projects.find((data) => {
          return data.id === id;
        });

        this.selectedProjectSubject.next(this.selectedProject);
      break;

      case 'firebase':
        this.projectFirebaseService.getProject(id).subscribe(data => {
          this.selectedProject = data;
          this.selectedProjectSubject.next(this.selectedProject);
        });
    }
  }

  addProject(): Promise<string> {
    const project = new Project(null, 'Untitled Project', 0);

    switch (this.utilityService.getDataStore()) {
      case 'local':
        return new Promise((resolve, reject) => {
          project.id = Guid.create().toString();
          this.projects.push(project);
          resolve(project.id);
        });

      case 'firebase':
        return this.projectFirebaseService.addProject(project)
          .then((id) => {
            return id;
          })
          .catch((error) => {
            return reject(error);
          })
        ;
    }
  }

  updateProject(project: Project): Promise<any> {
    switch (this.utilityService.getDataStore()) {
      case 'local':
        return new Promise((resolve, reject) => {
          this.projects.map((data) => {
            if (data.id === project.id) {
              data = Object.assign(data, project);
            }
          });
          resolve();
        });

      case 'firebase':
        return this.projectFirebaseService.updateProject(project)
          .then((value) => {
            return value;
          })
          .catch((error) => {
            return reject(error);
          });
    }
  }

  deleteProject(id: string) {
    switch (this.utilityService.getDataStore()) {
      case 'local':
        return new Promise((resolve, reject) => {
          this.projects.map((data, index) => {
            if (data.id === id) {
              this.taskService.deleteTasks(id);
              this.projects.splice(index, 1);
            }
          });
          resolve();
        });

      case 'firebase':
        return this.projectFirebaseService.deleteProject(id)
          .then(() => {
            // todo: delete tasks
            return;
          })
          .catch((error) => {
            return reject(error);
          });

    }
  }
}
