import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('@tl8/main-frame/editor/feature-shell').then(
        (m) => m.MainFrameEditorFeatureShellModule
      ),
  },
  {
    path: 'collaboration',
    loadChildren: () =>
      import('@tl8/main-frame/collaboration').then(
        (m) => m.MainFrameCollaborationModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
