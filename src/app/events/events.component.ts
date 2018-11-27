import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ConfirmationDialogComponent } from '../shared/dialogs/confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material';
import { EventEditDialogComponent } from '../events/event-edit-dialog/event-edit-dialog.component';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import { TaskService } from '../shared/services/task.service';
import { Task } from 'src/app/shared/models/task.model';
import { EventService } from '../shared/services/event.service';
import { Event } from '../shared/models/event.model';
import { UtilityService } from 'src/app/shared/services/utility.service';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent implements OnInit {
  eventStart = 0;
  eventEnd = 0;
  currentTime = 0;
  formattedTime = '00:00:00';
  isRecording = false;
  task: Task;
  events: Event[] = [];
  selectedIndex: number;
  showEmpty = true;
  currentEvent: Event;

  projectId: string;
  taskServiceSubscription: Subscription;

  constructor(private route: ActivatedRoute,
              private dialog: MatDialog,
              private taskService: TaskService,
              private eventService: EventService,
              private utilityService: UtilityService) { }

  ngOnInit() {
    this.route.params
      .subscribe(
        (params: Params) => {
          this.projectId = params['id'];
      });

    this.taskServiceSubscription = this.taskService.currentTask
      .subscribe((task: Task) => {
          if (task === null) {
            this.events = null;
            return;
          }

          this.task = task;
          this.events = this.eventService.getEvents(task);
          this.eventService.setCurrentEvent(null);
          this.currentEvent = null;
          this.selectedIndex = null;
          this.showEmpty = false;
      });
  }

  onAdd() {
    if (this.task == null) {
      return;
    }

    const event = new Event(null, Date.now(), Date.now(), this.task.projectId, this.task.id, 0);
    const dialogRef = this.dialog.open(EventEditDialogComponent, {
      width: '35rem',
      data: {event: event}
    });

    dialogRef.afterClosed().subscribe((result: Event) => {
      if (result !== undefined) {
        this.eventService.createEvent(result.projectId, result.taskId, result.eventStart, result.eventEnd, result.eventHours);
        this.currentEvent = null;
        this.selectedIndex = null;
        this.events = this.eventService.getEvents(this.task);
      }
    });
  }

  onEdit() {
    if (this.currentEvent == null) {
      return;
    }

    const dialogRef = this.dialog.open(EventEditDialogComponent, {
      width: '35rem',
      data: {event: this.currentEvent}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.eventService.updateEvent(result);
      }
    });
  }

  onDelete() {
    if (this.currentEvent == null) {
      return;
    }

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '35rem',
      data: {message: 'Are you sure you want to delete?'}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'confirm' && this.currentEvent != null) {
        this.eventService.deleteEvent(this.currentEvent);
        this.currentEvent = null;
        this.selectedIndex = null;
        this.events = this.eventService.getEvents(this.task);
      }
    });
  }

  onSelected(event: Event, index: number) {
    this.currentEvent = event;
    this.selectedIndex = index;
    this.eventService.setCurrentEvent(event);
  }

  onStart() {
    if (this.task == null) {
      return;
    }

    this.currentTime = 0;
    this.isRecording = true;
    this.eventStart = Date.now();
    const recordingTimer = setInterval(() => {
      this.currentTime++;
      const hour = this.formatTime(Math.floor(this.currentTime / 60 / 60 % 60).toString());
      const min = this.formatTime(Math.floor(this.currentTime / 60 % 60).toString());
      const sec = this.formatTime((this.currentTime % 60).toString());
      this.formattedTime = `${hour}:${min}:${sec}`;
      if (!this.isRecording) {
        clearInterval(recordingTimer);
        this.formattedTime = '00:00:00';
      }
    }, 1000);

    this.currentEvent = this.eventService.createEvent(this.task.projectId, this.task.id, Date.now(), null, 0);
    this.events = this.eventService.getEvents(this.task);
  }

  onStop() {
    let eventHours = 0;
    this.isRecording = false;
    this.currentEvent.eventEnd = Date.now();

    eventHours = +this.utilityService.calculateEventHours(new Date(this.currentEvent.eventStart),
      new Date(this.currentEvent.eventEnd));
    this.currentEvent.eventHours = eventHours;

    this.eventService.updateEvent(this.currentEvent);
    this.events = null;
    this.events = this.eventService.getEvents(this.task);
  }

  formatTime(value: string) {
    const retValue = value.toString() + '';
    if (retValue.length < 2) {
      return '0' + retValue;
    } else {
      return retValue;
    }
  }
}
