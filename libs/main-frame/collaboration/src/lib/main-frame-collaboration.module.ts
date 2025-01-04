import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CreateComponent } from './components/create/create.component';
import { JoinComponent } from './components/join/join.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild([
      {
        path: 'create',
        component: CreateComponent,
      },
      {
        path: 'join/:collaborationId',
        component: JoinComponent,
      },
    ]),
  ],
  declarations: [CreateComponent, JoinComponent],
})
export class MainFrameCollaborationModule {}
