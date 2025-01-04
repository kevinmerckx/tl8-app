import { ProjectAPIGateway, UserAPIGateway } from '@tl8/api';
import { ModalParams } from './modal-params';

export interface ExtraUIApiGateway {
  openExternalLink(url: string): void;
  ready(): void;
  modalReady(): void;
  handleModal(cb: (modalParams: ModalParams) => void): void;
  closeModal<T>(data?: T): void;
  projectApi: ProjectAPIGateway;
  userApi: UserAPIGateway;
}
