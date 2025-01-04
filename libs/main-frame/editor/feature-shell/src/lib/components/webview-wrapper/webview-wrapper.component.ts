import { Component, Inject } from '@angular/core';
import { MAIN_FRAME_CONFIG, MainFrameConfig } from '@tl8/main-frame/config';
import { MainFrameDataAccessService } from '@tl8/main-frame/editor/data-access-api';
import { MainFrameApi } from '@tl8/main-frame/webview-api';
import { map } from 'rxjs/operators';

@Component({
  selector: 'tl8-webview-wrapper',
  templateUrl: './webview-wrapper.component.html',
  styleUrls: ['./webview-wrapper.component.sass'],
})
export class WebviewWrapperComponent {
  webviewUrl$ = this.mainFrameDataAccessService.webviewUrl$;
  hasNoUrl$ = this.webviewUrl$.pipe(map((url) => !url));
  state$ = this.mainFrameDataAccessService.state$;

  constructor(
    private mainFrameDataAccessService: MainFrameDataAccessService,
    @Inject(MAIN_FRAME_CONFIG) private config: MainFrameConfig
  ) {}

  get displayWebview(): boolean {
    return !!MainFrameApi;
  }

  openDemoUrl(): void {
    this.mainFrameDataAccessService.navigateTo(this.config.demoAppUrl);
  }
}
