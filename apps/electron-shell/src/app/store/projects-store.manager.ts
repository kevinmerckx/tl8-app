import { Injectable } from '@nestjs/common';
import { CollaborativeProject, LocalProject, Project } from '@tl8/api';
import * as ElectronStore from 'electron-store';
import { Collaboration } from '@tl8/api';

@Injectable()
export class ProjectsStoreManager {
  private electronStore = new ElectronStore();

  private projects = (this.electronStore.get('projects') || []) as Project[];

  async getAllProjects(): Promise<Project[]> {
    return this.projects;
  }

  addLocalProject(host: string) {
    const existing = this.projects
      .filter((p): p is LocalProject => !(p as CollaborativeProject).id)
      .find((p) => p.host === host);
    if (existing) {
      return;
    }
    this.projects = [...this.projects, { host }];
    this.saveToElectronStore();
  }

  addCollaborativeProject(collaboration: Collaboration) {
    const existing = this.projects
      .filter(
        (p): p is CollaborativeProject => !!(p as CollaborativeProject).id
      )
      .find((p) => collaboration.id === p.id);
    if (existing) {
      return;
    }
    this.projects = [
      ...this.projects,
      {
        host: collaboration.host,
        id: collaboration.id,
      } as CollaborativeProject,
    ];
    this.saveToElectronStore();
  }

  private saveToElectronStore() {
    this.electronStore.set('projects', this.projects);
  }
}
