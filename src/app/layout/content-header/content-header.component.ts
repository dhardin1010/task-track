import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-content-header',
  templateUrl: './content-header.component.html',
  styleUrls: ['./content-header.component.scss']
})
export class ContentHeaderComponent implements OnInit {
  @Input() svg = 'view-compact';
  @Input() headerName = 'test';

  constructor() { }

  ngOnInit() {
  }

}
