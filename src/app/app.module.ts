import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule, MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { environment } from '../environments/environment';

import { AppComponent } from './app.component';
import { ProjectListComponent } from './projects/project-list/project-list.component';
import { ContentHeaderComponent } from './layout/content-header/content-header.component';
import { HeaderComponent } from './layout/header/header.component';
import { ProjectComponent } from './projects/project/project.component';
import { TasksComponent } from './tasks/tasks.component';
import { ConfirmationDialogComponent } from './shared/dialogs/confirmation-dialog/confirmation-dialog.component';
import { MatProgressSpinnerModule, MatRippleModule, MatListModule, MatFormFieldModule, MatInputModule,
         MatNativeDateModule } from '@angular/material';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { EventsComponent } from './events/events.component';
import { TaskEditDialogComponent } from './tasks/task-edit-dialog/task-edit-dialog.component';
import { EventEditDialogComponent } from './events/event-edit-dialog/event-edit-dialog.component';
import { TaskListItemComponent } from './tasks/task-list-item/task-list-item.component';
import { EventListItemComponent } from './events/event-list-item/event-list-item.component';

const appRoutes: Routes = [
  { path: '', component: ProjectListComponent },
  { path: 'project/:id', component: ProjectComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    ProjectListComponent,
    ContentHeaderComponent,
    HeaderComponent,
    ProjectComponent,
    TasksComponent,
    ConfirmationDialogComponent,
    EventsComponent,
    TaskEditDialogComponent,
    EventEditDialogComponent,
    TaskListItemComponent,
    EventListItemComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(appRoutes),
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatMenuModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatRippleModule,
    MatListModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
  ],
  exports: [
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatMenuModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatRippleModule,
    MatListModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule
  ],
  entryComponents: [
    ConfirmationDialogComponent, TaskEditDialogComponent, EventEditDialogComponent
  ],
  providers: [{provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: {hasBackdrop: true}}],
  bootstrap: [AppComponent]
})
export class AppModule { }
