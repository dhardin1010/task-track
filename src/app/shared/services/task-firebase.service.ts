import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Task } from '../models/task.model';
import { reject } from 'q';
import { resolve } from 'url';

@Injectable({
  providedIn: 'root'
})
export class TaskFirebaseService {
  tasksCollection: AngularFirestoreCollection;

  constructor(private firestoreDB: AngularFirestore) {
    this.tasksCollection = firestoreDB.collection<Task>('tasks');
  }

  getTasks(projectId: string): Observable<Task[]> {
    return this.firestoreDB.collection('tasks', ref =>
      ref.where('projectId', '==', projectId)).snapshotChanges()
      .pipe(map(data => {
        return data.map(doc => {
          const record = doc.payload.doc.data() as Task;
          return {
            id: doc.payload.doc.id,
            name: record.name,
            projectId: record.projectId,
            taskHours: record.taskHours
          };
          });
      }));
  }

  addTask(task: Task): Promise<any> {
    const record = {
      name: task.name,
      projectId: task.projectId,
      taskHours: task.taskHours
    };

    const id = this.firestoreDB.createId();
    return this.tasksCollection.doc(id).set(record)
      .then(() => {
        return id;
      })
      .catch((error) => {
        return reject(error);
      });
  }

  updateTask(task: Task): Promise<any> {
    const record = {
      name: task.name,
      taskHours: task.taskHours
    };

    return this.tasksCollection.doc(task.id).update(record)
      .then(() => {
        return;
      })
      .catch((error) => {
        return reject(error);
      });
  }

  deleteTask(id: string): Promise<any> {
    return this.tasksCollection.doc(id).delete()
    .then(() => {
      return;
    })
    .catch((error) => {
      return reject(error);
    });
  }

  deleteTasks(projectId: string): Promise<any> {
    return this.firestoreDB.collection('tasks', ref =>
      ref.where('projectId', '==', projectId)).get()
      .pipe(map(data => {
        const batch = this.firestoreDB.firestore.batch();

        data.forEach(doc => {
          batch.delete(doc.ref);
        });

        batch.commit()
        .then(() => {
          return;
        })
        .catch((error) => {
          return reject(error);
        });
      })).toPromise()
      .then(() => {
        return;
      })
      .catch((error) => {
        return reject(error);
      });
  }
}
