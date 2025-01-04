import { Author, LocalProject } from '@tl8/api';
import { ExtraUIApiGateway, ModalParams } from '@tl8/extra-ui-interfaces';
import { contextBridge, ipcRenderer } from 'electron';

const gateway: ExtraUIApiGateway = {
  closeModal: (data) => ipcRenderer.invoke('fromModal:close', data),
  handleModal: (cb) =>
    ipcRenderer.on('toModal:openModal', (_, modalParams: ModalParams) =>
      cb(modalParams)
    ),
  openExternalLink: (url: string) =>
    ipcRenderer.invoke('openExternalLink', url),
  ready: () => ipcRenderer.invoke('fromExtraUI:ready'),
  modalReady: () => ipcRenderer.invoke('fromModal:ready'),
  projectApi: {
    getAll: () => ipcRenderer.invoke('project:getAll'),
    openLocalProject: (project: LocalProject) =>
      ipcRenderer.invoke('project:openLocal', project),
    joinCollaborativeProject: (params) =>
      ipcRenderer.invoke('project:joinCollaborativeProject', params),
    getLocalProjectOverwrittenTranslations: (project: LocalProject) =>
      ipcRenderer.invoke(
        'project:getLocalProjectOverwrittenTranslations',
        project
      ),
  },
  userApi: {
    getUser: () => ipcRenderer.invoke('user:get'),
    setUser: (user: Author) => ipcRenderer.invoke('user:get', user),
    clearUser: () => ipcRenderer.invoke('user:clear'),
  },
};

contextBridge.exposeInMainWorld('EXTRA_UI_API', gateway);
