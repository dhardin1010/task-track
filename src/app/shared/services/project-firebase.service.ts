import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Project } from '../models/project.model';
import { reject } from 'q';

@Injectable({
  providedIn: 'root'
})
export class ProjectFirebaseService {
  projectsCollection: AngularFirestoreCollection;

  constructor(private firestoreDB: AngularFirestore) {
    this.projectsCollection = firestoreDB.collection<Project>('projects');
  }

  getProjects(): Observable<Project[]> {
    return this.projectsCollection.snapshotChanges()
      .pipe(map(data => {
        return data.map(doc => {
          const record = doc.payload.doc.data() as Project;
          return {
            id: doc.payload.doc.id,
            name: record.name,
            projectHours: record.projectHours
          };
          });
      }));
  }

  getProject(id: string) {
    return this.projectsCollection.doc(id).snapshotChanges()
      .pipe(map(doc => {
          if (doc.payload.exists) {
            const record = doc.payload.data() as Project;
            return {
              id: doc.payload.id,
              name: record.name,
              projectHours: record.projectHours
            };
          } else {
            return {
              id: '',
              name: '',
              projectHours: 0
            };
          }
      }));
  }

  addProject(project: Project): Promise<any> {
    const record = {
      name: project.name,
      projectHours: project.projectHours
    };

    const id = this.firestoreDB.createId();
    return this.projectsCollection.doc(id).set(record)
      .then(() => {
        return id;
      })
      .catch((error) => {
        return reject(error);
      });
  }

  updateProject(project: Project): Promise<any> {
    const record = {
      name: project.name,
      projectHours: project.projectHours
    };

    return this.projectsCollection.doc(project.id).set(record)
      .then(() => {
        return;
      })
      .catch((error) => {
        return reject(error);
      });
  }

  deleteProject(id: string): Promise<any> {
    return this.projectsCollection.doc(id).delete()
      .then(() => {
        return;
      })
      .catch((error) => {
        return reject(error);
      });
  }
}
