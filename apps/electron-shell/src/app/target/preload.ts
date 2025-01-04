import { contextBridge, ipcRenderer } from 'electron';
import {
  TargetApiGateway,
  TargetApplicationConfig,
  WebAppOverwrittenTranslations,
} from 'tl8';

const gateway: TargetApiGateway = {
  sendToHost: (channel: string, ...args: any[]) =>
    ipcRenderer.invoke('fromTarget:sendToHost', { channel, args }),
  on: (channel: string, cb: (data: any) => void) =>
    ipcRenderer.on('toTarget:' + channel, (_, data) => cb(data)),
  openContextMenu: (params) =>
    ipcRenderer.invoke('fromTarget:openContextMenu', params),
  declareReady: (config: TargetApplicationConfig) =>
    ipcRenderer.invoke('fromTarget:declareReady', config),
  onSetOverwrittenTranslations: (
    cb: (overwrittenTranslations: WebAppOverwrittenTranslations) => void
  ) => ipcRenderer.on('setOverwrittenTranslations', (_, params) => cb(params)),
};

contextBridge.exposeInMainWorld('TL8_TARGET_API', gateway);
