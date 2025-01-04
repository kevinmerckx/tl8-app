import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Collaboration } from '@tl8/api';
import { CreateCollaborationPayload } from '@tl8/collaboration/interfaces';

@Injectable({
  providedIn: 'root',
})
export class CollaborationApiClient {
  constructor(private httpClient: HttpClient) {}

  createCollaborationUser(name: string) {
    return this.httpClient.post<{ name: string; id: string }>(
      '/collaboration/user',
      { name }
    );
  }

  getOne(collaborationId: Collaboration['id']) {
    return this.httpClient.get<Collaboration>(
      '/collaboration/' + collaborationId
    );
  }

  createCollaborationProject(payload: CreateCollaborationPayload) {
    return this.httpClient.post<Collaboration>('/collaboration', payload);
  }
}
