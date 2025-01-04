import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
// import { Integrations } from '@sentry/tracing';
import * as Sentry from '@sentry/angular';

Sentry.init({
  dsn: 'https://5a61b3d3efd54bd093b1b10a3de3d839@o562904.ingest.sentry.io/5702092',
  enabled: environment.production
});

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));

console.log('Welcome to MAIN FRAME');
