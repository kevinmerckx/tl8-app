import {
  app,
  BrowserWindow,
  BrowserWindowConstructorOptions,
  screen,
} from 'electron';
import { join } from 'path';
import { PersistedObject } from './persisted-object';

export interface WindowMemory {
  x: number;
  y: number;
  width: number;
  height: number;
}

export class WindowMemorizer {
  private config: PersistedObject<WindowMemory> | undefined;

  start(options: BrowserWindowConstructorOptions): BrowserWindow {
    this.config = new PersistedObject(
      // join(cwd(), 'display.json'),
      join(app.getPath('userData'), 'display.json'),
      this.getStartingConfig()
    );
    const window = new BrowserWindow({
      ...options,
      ...this.config.get(),
    });
    window.on('resized', () => {
      this.savePositionAndSize(window);
    });
    window.on('moved', () => {
      this.savePositionAndSize(window);
    });
    return window;
  }

  private savePositionAndSize(window: BrowserWindow) {
    if (!this.config) {
      throw new Error('config is not defined');
    }
    const [width, height] = window.getSize();
    const [x, y] = window.getPosition();
    this.config.set({
      ...this.config.get(),
      width,
      height,
      x,
      y,
    });
  }

  private getStartingConfig(): WindowMemory {
    const display = screen.getPrimaryDisplay();
    const size = display.workAreaSize;
    const width = Math.min(size.width, Math.max(0.75 * size.width, 800));
    const height = size.height;
    return {
      width,
      height,
      x: (size.width - width) / 2,
      y: (size.height - height) / 2,
    };
  }
}
