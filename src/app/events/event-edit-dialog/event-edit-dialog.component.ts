import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { Event } from 'src/app/shared/models/event.model';

@Component({
  selector: 'app-event-edit-dialog',
  templateUrl: './event-edit-dialog.component.html',
  styleUrls: ['./event-edit-dialog.component.scss']
})
export class EventEditDialogComponent implements OnInit {
  eventHours: number;
  eventStartTime: any;
  eventStartDate: Date;
  eventEndDate: Date;
  eventEndTime: any;
  endTime: Date;
  eventEdit: Event;
  title = 'Add Event';

  constructor(public dialogRef: MatDialogRef<EventEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public utilityService: UtilityService) {}

  ngOnInit() {
    this.eventEdit = this.data.event;

    if (this.eventEdit.id !== null) {
      this.title = 'Edit Event';
    }

    this.eventStartDate = new Date(this.data.event.eventStart);
    this.eventEndDate = new Date(this.data.event.eventEnd);
    this.eventStartTime = this.utilityService.formatTime(this.eventStartDate.getHours()) + ':' +
      this.utilityService.formatTime(this.eventStartDate.getMinutes());
    this.eventEndTime = this.utilityService.formatTime(this.eventEndDate.getHours()) + ':' +
      this.utilityService.formatTime(this.eventEndDate.getMinutes());
    this.eventHours = this.data.event.eventHours;
  }

  dateTimeChanged() {
    this.eventHours = +this.utilityService.calculateEventHours(
      new Date(this.utilityService.formatDate(this.eventStartDate) + ' ' + this.eventStartTime),
      new Date(this.utilityService.formatDate(this.eventEndDate) + ' ' + this.eventEndTime)
    );
  }

  onCancel() {
  this.dialogRef.close();
  }

  onOk() {
    const startDate = new Date(this.utilityService.formatDate(this.eventStartDate) + ' ' + this.eventStartTime);
    const endDate = new Date(this.utilityService.formatDate(this.eventEndDate) + ' ' + this.eventEndTime);
    this.eventEdit.eventStart = startDate.getTime();
    this.eventEdit.eventEnd = endDate.getTime();
    this.eventEdit.eventHours = this.eventHours;
    this.dialogRef.close(this.eventEdit);
  }
}
