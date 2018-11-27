
export class Event {
  constructor(public id: string,
              public eventStart: number,
              public eventEnd: number,
              public projectId: string,
              public taskId: string,
              public eventHours: number) {}
}
