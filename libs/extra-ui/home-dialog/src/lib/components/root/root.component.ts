import { Component, NgZone, OnInit } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import {
  Author,
  Collaboration,
  CollaborativeProject,
  LocalProject,
  Project,
} from '@tl8/api';
import { CollaborationApiClient } from '@tl8/collaboration/api-client';
import { HomeDialogInput, HomeDialogOutput } from '@tl8/extra-ui-interfaces';
import { ExtraUIAPI } from '@tl8/extra-ui/api';
import { ModalService } from '@tl8/extra-ui/modal';
import { combineLatest, firstValueFrom, from } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'tl8-root',
  templateUrl: './root.component.html',
  styleUrls: ['./root.component.sass'],
})
export class RootComponent
  extends ComponentStore<{
    currentUser: Author | undefined;
    currentHost: string;
    projects: Project[];
  }>
  implements OnInit
{
  projects$ = this.select((s) => s.projects);
  currentHost$ = this.select((s) => s.currentHost);
  name = '';
  collaborationId = '';
  currentUser$ = this.select(({ currentUser }) => currentUser);
  collaborativeProjectOfHost$ = combineLatest([
    this.currentHost$,
    this.projects$,
  ]).pipe(
    map(([host, projects]) =>
      projects
        .filter(isProjectCollaborative)
        .find((project) => project.host === host)
    )
  );

  private loadProjects = this.effect((origin$) =>
    origin$.pipe(
      switchMap(() => from(ExtraUIAPI().projectApi.getAll())),
      tap((projects) => this.zone.run(() => this.patchState({ projects })))
    )
  );

  private loadUser = this.effect((origin$) =>
    origin$.pipe(
      switchMap(() => from(ExtraUIAPI().userApi.getUser())),
      tap((currentUser) =>
        this.zone.run(() => this.patchState({ currentUser }))
      )
    )
  );

  asCollaborativeProject(project: Project) {
    if (isProjectCollaborative(project)) {
      return project;
    }
    return;
  }

  openProject(project: Project, getNameDialog: HTMLDialogElement) {
    if (isProjectCollaborative(project)) {
      return this.joinExistingCollaborativeProject(project.id, getNameDialog);
    }
    return ExtraUIAPI().projectApi.openLocalProject(project);
  }

  async clearUser() {
    await ExtraUIAPI().userApi.clearUser();
    this.loadUser();
  }

  async joinExistingCollaborativeProject(
    collaborationId: Collaboration['id'],
    getNameDialog: HTMLDialogElement
  ) {
    const asUser = await this.getOrCreateUser(getNameDialog);
    if (!asUser) {
      return;
    }
    ExtraUIAPI().projectApi.joinCollaborativeProject({
      collaborationId,
      asUser,
    });
  }

  async joinCollaborativeProject(modals: {
    getNameDialog: HTMLDialogElement;
    getCollaborationDialog: HTMLDialogElement;
  }) {
    const asUser = await this.getOrCreateUser(modals.getNameDialog);
    if (!asUser) {
      return;
    }
    const collaborationId: Collaboration['id'] | null =
      await this.getCollaborationId(modals.getCollaborationDialog);
    if (!collaborationId) {
      return;
    }
    ExtraUIAPI().projectApi.joinCollaborativeProject({
      collaborationId,
      asUser,
    });
  }

  async createLocalProject(host: string) {
    ExtraUIAPI().projectApi.openLocalProject({ host });
  }

  async transformLocalProjectIntoCollaborativeProject(
    project: LocalProject,
    getNameDialog: HTMLDialogElement
  ) {
    const asUser = await this.getOrCreateUser(getNameDialog);
    if (!asUser) {
      return;
    }
    const webAppOverwrittenTranslations =
      await ExtraUIAPI().projectApi.getLocalProjectOverwrittenTranslations(
        project
      );
    const collaboration = await firstValueFrom(
      this.collaborationApiClient.createCollaborationProject({
        host: project.host,
        webAppOverwrittenTranslations,
      })
    );
    ExtraUIAPI().projectApi.joinCollaborativeProject({
      collaborationId: collaboration.id,
      asUser,
    });
  }

  async createCollaborativeProject(
    host: string,
    modals: {
      getNameDialog: HTMLDialogElement;
      getCollaborationDialog: HTMLDialogElement;
    }
  ) {
    const asUser = await this.getOrCreateUser(modals.getNameDialog);
    if (!asUser) {
      return;
    }
    const collaboration = await firstValueFrom(
      this.collaborationApiClient.createCollaborationProject({
        host,
        webAppOverwrittenTranslations: {},
      })
    );
    ExtraUIAPI().projectApi.joinCollaborativeProject({
      collaborationId: collaboration.id,
      asUser,
    });
  }

  constructor(
    public modalService: ModalService<HomeDialogOutput, HomeDialogInput>,
    private collaborationApiClient: CollaborationApiClient,
    private zone: NgZone
  ) {
    super({
      projects: [],
      currentHost: modalService.input.currentHost,
      currentUser: undefined,
    });
  }

  ngOnInit() {
    this.loadProjects();
    this.loadUser();
  }

  private getCollaborationId(modal: HTMLDialogElement) {
    return this.promptCollaborationId(modal, '');
  }

  private async getOrCreateUser(
    modal: HTMLDialogElement
  ): Promise<undefined | Author> {
    const existing = await ExtraUIAPI().userApi.getUser();
    if (existing) {
      return existing;
    }
    const name = await this.promptName(modal, '');
    if (name === null) {
      return;
    }
    try {
      const user = await firstValueFrom(
        this.collaborationApiClient.createCollaborationUser(name)
      );
      return {
        name: user.name,
        userId: user.id,
      };
    } catch (error) {
      window.alert(
        'An error occurred while creating your credentials. Please try again.'
      );
      return;
    }
  }

  private async promptName(
    modal: HTMLDialogElement,
    presetValue: string
  ): Promise<string | null> {
    return new Promise((resolve) => {
      this.name = presetValue;
      modal.showModal();
      modal.addEventListener(
        'close',
        () => {
          if (modal.returnValue === 'yes') {
            resolve(this.name);
            return;
          }
          resolve(null);
        },
        { once: true }
      );
    });
  }

  private async promptCollaborationId(
    modal: HTMLDialogElement,
    presetValue: string
  ): Promise<string | null> {
    return new Promise((resolve) => {
      this.collaborationId = presetValue;
      modal.showModal();
      modal.addEventListener(
        'close',
        () => {
          if (modal.returnValue === 'yes') {
            resolve(this.collaborationId);
            return;
          }
          resolve(null);
        },
        { once: true }
      );
    });
  }
}

function isProjectCollaborative(
  project: Project
): project is CollaborativeProject {
  return !!(project as CollaborativeProject).id;
}
