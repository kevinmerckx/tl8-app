import { Injectable, NotFoundException } from '@nestjs/common';
import { Collaboration } from '@tl8/api';
import axios, { AxiosError } from 'axios';
import { environment } from '../environments/environment';

export class UnknownError extends Error {}

@Injectable()
export class CollaborationApiClient {
  /**
   * Fetch the collaboration of given ID.
   * @param collaborationId the id of the collaboration
   * @returns the collaboration object or a `NotFoundException` if the collaboration could not be found or an `UnknownError`
   */
  async getCollaboration(
    collaborationId: Collaboration['id']
  ): Promise<Collaboration | NotFoundException | UnknownError> {
    try {
      return (
        await axios.get<Collaboration>(
          `${environment.apiUrl}/collaboration/${collaborationId}`
        )
      ).data;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 404) {
        return new NotFoundException();
      }
      return new UnknownError();
    }
  }
}
