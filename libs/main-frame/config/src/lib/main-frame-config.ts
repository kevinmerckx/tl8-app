import { InjectionToken } from '@angular/core';

export interface MainFrameConfig {
  production: boolean;
  feedbackFormUrl: string;
  paypalDonationUrl: string;
  demoAppUrl: string;
  apiUrl: string;
}

export const MAIN_FRAME_CONFIG = new InjectionToken('MAIN_FRAME_CONFIG');
