import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {

  constructor() { }

  calculateEventHours(start: Date, end: Date) {
    const totalMinutes = ((Math.floor(end.getTime() - start.getTime()) / 60000));
    const minutes = Math.floor(totalMinutes % 60) / 60;
    const hours = Math.floor(totalMinutes / 60);
    let eventHours = hours + minutes;

    if (eventHours < 0) { eventHours = 0; }

    return (eventHours).toFixed(2);
  }

  formatTime(time: number) {
    if (time < 10) {
      return '0' + time.toString();
    } else {
      return time;
    }
  }

  formatDate(date: Date) {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  }

}
