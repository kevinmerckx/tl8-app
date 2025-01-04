import {
  ActiveTranslations,
  ActiveUsers,
  Collaboration,
  ConnectionStatus,
} from '@tl8/api';
import { ChangeTranslationMessage } from '@tl8/collaboration/interfaces';
import { CollaborationApiGateway } from '@tl8/main-frame-interfaces';
import { contextBridge, ipcRenderer } from 'electron';
import '../main-frame/preload';

const gateway: CollaborationApiGateway = {
  onSetConnectionStatus(cb: (connectionStatus: ConnectionStatus) => void) {
    ipcRenderer.on(
      'setConnectionStatus',
      (_, connectionStatus: ConnectionStatus) => {
        cb(connectionStatus);
      }
    );
  },
  onSetActiveUsers(cb: (activeUsers: ActiveUsers) => void) {
    ipcRenderer.on('setActiveUsers', (_, activeUsers: ActiveUsers) => {
      cb(activeUsers);
    });
  },
  onSetActiveTranslations(
    cb: (activeTranslations: ActiveTranslations) => void
  ) {
    ipcRenderer.on(
      'setActiveTranslations',
      (_, activeTranslations: ActiveTranslations) => {
        cb(activeTranslations);
      }
    );
  },
  onSetCollaboration: (cb) => {
    ipcRenderer.on('setCollaboration', (_, collaboration: Collaboration) => {
      cb(collaboration);
    });
  },
  onSetTranslation: (cb) => {
    ipcRenderer.on('setTranslation', (_, change: ChangeTranslationMessage) => {
      cb(change);
    });
  },
  declareUserBlurredOfTranslation: (params) =>
    ipcRenderer.invoke('userBlurredOfTranslation', params),
  declareUserFocusedOnTranslation: (params) =>
    ipcRenderer.invoke('userFocusedOnTranslation', params),
};

contextBridge.exposeInMainWorld('TL8_COLLABORATION_MODE', true);
contextBridge.exposeInMainWorld('COLLABORATION_API', gateway);
