import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { Project } from '../../shared/models/project.model';
import { ProjectService } from './../../shared/services/project.service';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss']
})
export class ProjectListComponent implements OnInit, OnDestroy {
  project: Project;
  projects: Project[] = [];
  projectListSubscription: Subscription;

  constructor(private router: Router,
              private projectService: ProjectService) { }

  ngOnInit() {
    this.projectListSubscription = this.projectService.getProjects()
      .subscribe(value => { this.projects = value; });
  }

  onSelect(id: string) {
    if (id === '0') {
      this.projectService.addProject()
        .subscribe(value => {
          this.project = value;
          id = this.project.id;
        });
    }

    this.router.navigate(['/project', id]);
  }

  ngOnDestroy() {
    this.projectListSubscription.unsubscribe();
  }
}
