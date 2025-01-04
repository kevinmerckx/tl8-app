import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
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
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ExtraUiFeedbackDialogModule } from '@tl8/extra-ui/feedback-dialog';
import { ExtraUiLanguageSelectDialogModule } from '@tl8/extra-ui/language-select-dialog';
import { MarkdownModule } from 'ngx-markdown';
import { environment } from '../environments/environment';
import { ApiHttpInterceptor } from './api-http.interceptor';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

ClarityIcons.addIcons(
  cursorArrowIcon,
  noteIcon,
  exclamationCircleIcon,
  exclamationTriangleIcon,
  infoCircleIcon,
  checkCircleIcon
);

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ClarityModule,
    AppRoutingModule,
    FontAwesomeModule,
    MarkdownModule.forRoot(),
    ExtraUiLanguageSelectDialogModule,
    ExtraUiFeedbackDialogModule.forRoot({
      paypalDonationUrl: environment.paypalDonationUrl,
      feedbackFormUrl: environment.feedbackFormUrl,
    }),
    HttpClientModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiHttpInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
