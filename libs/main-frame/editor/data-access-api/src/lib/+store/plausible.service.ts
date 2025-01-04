import { Inject, Injectable } from '@angular/core';
import { MAIN_FRAME_CONFIG, MainFrameConfig } from '@tl8/main-frame/config';

@Injectable({
  providedIn: 'root',
})
export class PlausibleService {
  constructor(@Inject(MAIN_FRAME_CONFIG) private config: MainFrameConfig) {}

  sendCustomGoal(goal: string, props: unknown) {
    fetch(`${this.config.plausibleUrl}/api/event`, {
      body: JSON.stringify({
        name: goal,
        url: 'https://tl8.io',
        domain: 'tl8.io',
        props,
      }),
      method: 'post',
    }).catch((er) => console.error(er));
  }
}
