import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CollaborationApiClient } from '@tl8/collaboration/api-client';
import { Collaboration } from '@tl8/api';
import { MainFrameApi } from '@tl8/main-frame/webview-api';
import { from, map, of, Subject, switchMap, tap } from 'rxjs';

@Component({
  selector: 'tl8-join',
  templateUrl: './join.component.html',
  styleUrls: ['./join.component.sass'],
})
export class JoinComponent {
  connectAsUserProcedure: Subject<string> | undefined;
  name = '';

  joinSequence$ = this.route.params.pipe(
    map((params) => params['collaborationId'] as Collaboration['id']),
    switchMap((id) => this.collaborationApiClient.getOne(id)),
    switchMap((collaboration) => {
      return this.connectAsUser()
        .pipe
        // tap(() => WebviewAPI().joinCollaboration(collaboration))
        ();
    })
  );

  constructor(
    private route: ActivatedRoute,
    private collaborationApiClient: CollaborationApiClient
  ) {}

  private connectAsUser() {
    return from(
      MainFrameApi()
        .getUser()
        .then((user) => (user ? { name: user.name, id: user.userId } : user))
    ).pipe(
      switchMap((user) => {
        if (user) {
          return of(user);
        }
        this.connectAsUserProcedure = new Subject();
        return this.connectAsUserProcedure.pipe(
          switchMap((name) =>
            this.collaborationApiClient.createCollaborationUser(name)
          ),
          tap((user) => {
            MainFrameApi().setUser({
              name: user.name,
              id: user.id,
            });
          })
        );
      })
    );
  }

  connect(connectAsUserProcedure: Subject<string>) {
    connectAsUserProcedure.next(this.name);
  }
}
