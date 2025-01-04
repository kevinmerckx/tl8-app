import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { EventEmitter } from 'node:events';
import { AppModule } from './app/app.module';

// we rise that up because we register a lot of listeners and Node prints a warning:
// (node:97147) MaxListenersExceededWarning: Possible EventEmitter memory leak detected. 11 destroyed listeners added to [EventEmitter]. Use emitter.setMaxListeners() to increase limit
EventEmitter.setMaxListeners(100);

async function bootstrap() {
  await NestFactory.createApplicationContext(AppModule);
  Logger.log(`🚀 Application is running`);
}

bootstrap();
