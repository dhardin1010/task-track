import { Component, OnInit, Input } from '@angular/core';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { Event } from '../../shared/models/event.model';

@Component({
  selector: 'app-event-list-item',
  templateUrl: './event-list-item.component.html',
  styleUrls: ['./event-list-item.component.scss']
})
export class EventListItemComponent implements OnInit {
  @Input() event: Event;
  @Input() active: boolean;
  hours = 0;

  constructor(private utilityService: UtilityService) { }

  ngOnInit() {}

}
