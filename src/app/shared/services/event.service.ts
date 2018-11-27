import { Injectable } from '@angular/core';
import { Task } from '../models/task.model';
import { Event } from '../models/event.model';
import { Guid } from 'guid-typescript';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private events: Event[] = [];
  private totalTaskHours = 0;
  currentEvent = new Subject<Event>();
  taskHours = new Subject<number>();

  constructor() {}

  getEvents(task: Task) {
    const filteredEvents = this.events
      .filter((event) => {
        return event.projectId === task.projectId && event.taskId === task.id;
      });

    return filteredEvents.sort((event1, event2) => {
      return event2.eventStart - event1.eventStart;
    });
  }

  createEvent(projectId: string, taskId: string, eventStart: number, eventEnd: number, eventHours: number) {
    const id = Guid.create().toString();
    const event = new Event(id, eventStart, eventEnd, projectId, taskId, eventHours);
    this.events.push(event);
    this.totalTaskHours = this.getTaskEventHours(taskId);
    this.currentEvent.next(event);
    this.taskHours.next(this.totalTaskHours);
    return event;
  }

  updateEvent(event: Event) {
    this.events.map((data) => {
      if (data.id === event.id) {
        data = Object.assign(data, event);
      }
    });

    this.totalTaskHours = this.getTaskEventHours(event.taskId);
    this.taskHours.next(this.totalTaskHours);
  }

  deleteEvent(event: Event) {
    let indexFound = 0;

    this.events.map((data, index) => {
      if (data.id === event.id) {
        indexFound = index;
      }
    });

    this.events.splice(indexFound, 1);
    this.currentEvent.next(null);
    this.totalTaskHours = this.getTaskEventHours(event.taskId);
    this.taskHours.next(this.totalTaskHours);
  }

  deleteEvents(taskId: string) {
    for (let i = this.events.length - 1; i >= 0; i--) {
      if (this.events[i].taskId === taskId) {
          this.events.splice(i, 1);
      }
    }
    this.currentEvent.next(null);
  }

  getTaskEventHours(taskId: string) {
      return this.events.filter((event) => {
        return event.taskId === taskId;
      }).reduce((total, event) => {
        return total += event.eventHours;
      }, 0);
  }

  setCurrentEvent(event: Event) {
    this.currentEvent.next(event);
  }
}
