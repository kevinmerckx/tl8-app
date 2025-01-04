import { NavigationStateMessage } from '@tl8/api';
import { MainFrameApiGateway } from '@tl8/main-frame-interfaces';
import { contextBridge, ipcRenderer } from 'electron';
import { WebAppOverwrittenTranslations } from 'tl8';

const gateway: MainFrameApiGateway = {
  navigate: (url) => ipcRenderer.invoke('fromTl8App:navigate', url),
  goBack: () => ipcRenderer.invoke('fromTl8App:navigate:back'),
  refresh: () => ipcRenderer.invoke('fromTl8App:navigate:refresh'),
  triggerResize: (bounds) =>
    ipcRenderer.invoke('fromTl8App:triggerResize', bounds),
  postMessageToTarget: (channel, data) =>
    ipcRenderer.invoke('fromTl8App:postMessageToTarget', { channel, data }),
  onSetNavigationState: (cb) => {
    ipcRenderer.on(
      'setNavigationState',
      (_, navigationStateMessage: NavigationStateMessage) =>
        cb(navigationStateMessage)
    );
  },
  onMessageFromTarget: (cb) => {
    ipcRenderer.on(
      'fromTarget:message',
      (_, channel: string, ...args: any[]) => {
        cb(channel, ...args);
      }
    );
  },
  confirm: (params) => ipcRenderer.invoke('fromTl8App:confirm', params),
  openModal: (params) => ipcRenderer.invoke('fromTl8App:modal', params),
  importWIP: (config) => ipcRenderer.invoke('fromTl8App:importWIP', config),
  changeTranslation: (params) =>
    ipcRenderer.invoke('changeTranslation', params),
  revertTranslation: (params) =>
    ipcRenderer.invoke('revertTranslation', params),
  revertAllTranslations: () => ipcRenderer.invoke('revertAllTranslations'),
  onSetOverwrittenTranslations: (cb) => {
    ipcRenderer.on(
      'setOverwrittenTranslations',
      (_, overwrittenTranslations: WebAppOverwrittenTranslations) => {
        cb(overwrittenTranslations);
      }
    );
  },
  onFocusOnTranslation: (cb) => {
    ipcRenderer.on('focusOnTranslation', (_, key: string) => {
      cb(key);
    });
  },
  onCreateCollaborativeProject: (cb) => {
    ipcRenderer.on('createCollaborativeProject', (_, params) => {
      cb(params);
    });
  },
  openTargetView: () => ipcRenderer.invoke('fromTl8App:openTargetView'),
  closeTargetView: () => ipcRenderer.invoke('fromTl8App:closeTargetView'),
  getUser: () => ipcRenderer.invoke('getUser'),
  setUser: (user) => ipcRenderer.invoke('setUser', user),
  openHome: () => ipcRenderer.invoke('openHome'),
};

contextBridge.exposeInMainWorld('MAIN_FRAME_API', gateway);
