import { Component } from '@angular/core';
import { UtilityService } from 'src/app/shared/services/utility.service';

enum DataStorage {
  local,
  firebase
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'task-track';

  constructor(private utilityService: UtilityService) {
    this.utilityService.setDataStore();
  }
}
