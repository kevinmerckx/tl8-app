import { LocationStrategy } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DownloadDialogComponent } from '@tl8/extra-ui/download-dialog';
import { FeedbackDialogComponent } from '@tl8/extra-ui/feedback-dialog';
import { ImportWIPDialogRootComponent } from '@tl8/extra-ui/import-wip-dialog';
import { LanguageSelectDialogComponent } from '@tl8/extra-ui/language-select-dialog';
import { MarkdownDialogComponent } from '@tl8/extra-ui/markdown-dialog';
import { FileLocationStrategy } from '@tl8/ng/file-location-strategy';

const routes: Routes = [
  {
    path: 'modal',
    children: [
      {
        path: 'home',
        loadChildren: () =>
          import('@tl8/extra-ui/home-dialog').then(
            (m) => m.ExtraUiHomeDialogModule
          ),
      },
      {
        path: 'feedback',
        component: FeedbackDialogComponent,
      },
      {
        path: 'language-select',
        component: LanguageSelectDialogComponent,
      },
      {
        path: 'markdown',
        component: MarkdownDialogComponent,
      },
      {
        path: 'download',
        component: DownloadDialogComponent,
      },
      {
        path: 'importWIP',
        component: ImportWIPDialogRootComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [
    {
      provide: LocationStrategy,
      useClass: FileLocationStrategy,
    },
  ],
})
export class AppRoutingModule {}
