import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  checkCircleIcon,
  ClarityIcons,
  cursorArrowIcon,
  exclamationCircleIcon,
  exclamationTriangleIcon,
  infoCircleIcon,
  noteIcon,
} from '@cds/core/icon';
import '@cds/core/icon/register.js';
import { ClarityModule } from '@clr/angular';
import { EffectsModule } from '@ngrx/effects';
import { ActionReducer, MetaReducer, StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import * as Sentry from '@sentry/angular';
import { environment } from '../environments/environment';
import { ApiHttpInterceptor } from './api-http.interceptor';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MAIN_FRAME_CONFIG } from '@tl8/main-frame/config';

ClarityIcons.addIcons(
  cursorArrowIcon,
  noteIcon,
  exclamationCircleIcon,
  exclamationTriangleIcon,
  infoCircleIcon,
  checkCircleIcon
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function debug(reducer: ActionReducer<any>): ActionReducer<any> {
  return function (state, action) {
    console.groupCollapsed('NGRX ' + action.type);
    console.log('action', action);
    console.log('state', state);
    console.groupEnd();
    return reducer(state, action);
  };
}

const metaReducers: MetaReducer<any>[] = environment.production ? [] : [debug];

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    CommonModule,
    ClarityModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    StoreModule.forRoot(
      {},
      {
        metaReducers,
      }
    ),
    EffectsModule.forRoot(),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: environment.production,
    }),
    HttpClientModule,
  ],
  bootstrap: [AppComponent],
  providers: [
    {
      provide: MAIN_FRAME_CONFIG,
      useValue: environment,
    },
    {
      provide: ErrorHandler,
      useValue: Sentry.createErrorHandler({
        showDialog: false,
        logErrors: true,
      }),
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiHttpInterceptor,
      multi: true,
    },
  ],
})
export class AppModule {}
