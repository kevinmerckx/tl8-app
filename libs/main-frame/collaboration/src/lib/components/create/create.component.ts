import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CreateCollaborativeProjectParams } from '@tl8/api';
import { CollaborationApiClient } from '@tl8/collaboration/api-client';
import { switchMap, tap } from 'rxjs';

@Component({
  selector: 'tl8-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.sass'],
})
export class CreateComponent {
  creationSequence$ = this.route.queryParams.pipe(
    switchMap((params) => {
      return this.collaborationApiClient.createCollaborationProject({
        host: (params as CreateCollaborativeProjectParams).host,
        webAppOverwrittenTranslations: {},
      });
    }),
    tap(({ id }) => this.router.navigate(['/collaboration', 'join', id]))
  );

  constructor(
    private collaborationApiClient: CollaborationApiClient,
    private route: ActivatedRoute,
    private router: Router
  ) {}
}
