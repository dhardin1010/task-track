import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, Observable } from 'rxjs';

import { Project } from '../../shared/models/project.model';
import { ProjectService } from './../../shared/services/project.service';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss']
})
export class ProjectListComponent implements OnInit, OnDestroy {
  project: Project;
  projects: Project[];
  projectListSubscription: Subscription;

  constructor(private router: Router,
              private projectService: ProjectService) { }

  ngOnInit() {
    this.projectListSubscription = this.projectService.projectsSubject.subscribe(value => {
      this.projects = value;
    });

    this.projectService.getProjects();
  }

  onSelect(id: string) {
    if (id === '0') {
      this.projectService.addProject()
        .then((value) => {
          id = value;
          this.router.navigate(['/project', id]);
        })
        .catch((error) => {
          // display error
        });
    } else {
      this.router.navigate(['/project', id]);
    }
  }

  ngOnDestroy() {
    this.projectListSubscription.unsubscribe();
  }
}
