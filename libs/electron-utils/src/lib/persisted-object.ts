import { Logger } from '@nestjs/common';
import { readFileSync, writeFileSync } from 'node:fs';

export class PersistedObject<SavedObjectType> {
  private logger = new Logger(`${PersistedObject.name}:${this.path}`);
  private _currentValue: SavedObjectType = this.tryRead(this.defaultValue);

  private get currentValue() {
    return this._currentValue;
  }

  private set currentValue(value: SavedObjectType) {
    this._currentValue = value;
  }

  constructor(private path: string, private defaultValue: SavedObjectType) {}

  set(value: SavedObjectType) {
    this.currentValue = value;
    this.tryWrite();
  }

  get(): SavedObjectType {
    return this.currentValue;
  }

  private tryRead(defaultValue: SavedObjectType) {
    try {
      return JSON.parse(readFileSync(this.path).toString());
    } catch (error) {
      return defaultValue;
    }
  }

  private tryWrite() {
    try {
      writeFileSync(this.path, JSON.stringify(this.currentValue, null, 4));
    } catch (error) {
      this.logger.error(error);
      this.logger.error('Could not write object');
    }
  }
}
