import { Logger } from '@nestjs/common';
import { BrowserView } from 'electron';

const LEVELS = ['VERBOSE', 'INFO', 'WARNING', 'ERROR'];

export function forwardBrowserLogs(logger: Logger, browserView: BrowserView) {
  browserView.webContents.on(
    'console-message',
    (_, level, message, line, sourceId) => {
      logger.debug(
        `browser-console-log [${LEVELS[level]}@${sourceId}:${line}]: ${message}`
      );
    }
  );
}
