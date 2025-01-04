import { Logger } from '@nestjs/common';
import { BrowserView, ipcMain, IpcMainInvokeEvent } from 'electron';

export class IPCMainByView {
  private logger = new Logger(IPCMainByView.name);

  private globalHandlers: {
    [channel: string]: (
      event: IpcMainInvokeEvent,
      ...args: any[]
    ) => Promise<void> | any;
  } = {};

  private viewHandlers: {
    channel: string;
    handler: (event: IpcMainInvokeEvent, ...args: any[]) => Promise<void> | any;
    view: BrowserView;
  }[] = [];

  handleOnce(
    targetView: BrowserView,
    channel: string,
    listener: (event: IpcMainInvokeEvent, ...args: any[]) => Promise<void> | any
  ) {
    const removeHandler = this.handle(targetView, channel, (event, ...args) => {
      removeHandler();
      listener(event, ...args);
    });
  }

  handle(
    targetView: BrowserView,
    channel: string,
    listener: (event: IpcMainInvokeEvent, ...args: any[]) => Promise<void> | any
  ) {
    const findViewHandler = () =>
      this.viewHandlers.find(
        (h) => h.channel === channel && h.view === targetView
      );
    if (findViewHandler()) {
      throw new Error('A listener is already registered for ' + channel);
    }
    this.viewHandlers.push({
      channel,
      view: targetView,
      handler: listener,
    });
    if (!this.globalHandlers[channel]) {
      this.globalHandlers[channel] = (event: IpcMainInvokeEvent, ...args) => {
        this.logger.debug(
          `IPC event [${channel}] with arguments: ${JSON.stringify(args)}`
        );
        const viewHandler = this.viewHandlers.find(
          (h) => h.channel === channel && h.view.webContents === event.sender
        );
        if (!viewHandler) {
          this.logger.error(`IPC event [${channel}] has no event registered`);
          throw new Error('No view listener registered for ' + channel);
        }
        return viewHandler.handler(event, ...args);
      };
      ipcMain.handle(channel, this.globalHandlers[channel]);
    }

    const removeHandler = () => {
      const handler = findViewHandler();
      this.viewHandlers = this.viewHandlers.filter((h) => h !== handler);
    };

    targetView.webContents.on('destroyed', () => removeHandler());
    return removeHandler;
  }
}

export const ipcMainByView = new IPCMainByView();
