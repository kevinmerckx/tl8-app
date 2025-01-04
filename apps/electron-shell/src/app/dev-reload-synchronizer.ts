import { Injectable } from '@nestjs/common';
import { writeFileSync } from 'fs';

@Injectable()
export class DevReloadSynchronizer {
  triggerFullreload() {
    writeFileSync('trigger.livereload', new Date().toISOString());
  }
}
