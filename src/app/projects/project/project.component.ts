import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormGroup, FormBuilder, NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import { ConfirmationDialogComponent } from '../../shared/dialogs/confirmation-dialog/confirmation-dialog.component';
import { Project } from '../../shared/models/project.model';
import { ProjectService } from './../../shared/services/project.service';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit {
  @ViewChild('projectName') projectName: ElementRef;

  isEditing = false;
  projectForm: FormGroup;
  project: Project;
  projectId: string;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private formBuilder: FormBuilder,
              private projectService: ProjectService,
              private dialog: MatDialog) { }

  ngOnInit() {
    this.route.params
      .subscribe(
        (params: Params) => {
          this.projectId = params['id'];
          this.projectService.getProject(this.projectId)
            .subscribe(value => {
              this.project = value;
              this.projectService.setSelectedProject(this.project);
              this.projectForm = this.formBuilder.group({
                projectName: [this.project.name]
              });
            });
        }
      );
  }

  onEdit() {
    this.isEditing = true;
    setTimeout(() => {
      this.projectName.nativeElement.focus();
      this.projectName.nativeElement.select();
    }, 0);
  }

  onEditCancel() {
    this.isEditing = false;
  }

  onBack() {
    this.router.navigate(['/']);
  }

  onProjectFormSubmit(form: NgForm) {
    this.isEditing = false;
    this.project.name = this.projectForm.get('projectName').value;
    this.projectService.updateProject(this.project)
      .subscribe(() => {});
  }

  onDelete() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '35rem',
      data: {message: 'Are you sure you want to delete?  Deleting a project will remove all associated tasks and events.'}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'confirm') {
        this.projectService.deleteProject(this.projectId)
          .subscribe(() => {
            this.router.navigate(['']);
          });
      }
    });
  }
}
