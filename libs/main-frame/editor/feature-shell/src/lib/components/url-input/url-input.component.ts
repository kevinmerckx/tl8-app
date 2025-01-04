import { Component } from '@angular/core';
import { MainFrameDataAccessService } from '@tl8/main-frame/editor/data-access-api';

@Component({
  selector: 'tl8-url-input',
  templateUrl: './url-input.component.html',
  styleUrls: ['./url-input.component.sass'],
})
export class UrlInputComponent {
  webviewUrl$ = this.mainFrameDataAccessService.webviewUrl$;

  constructor(private mainFrameDataAccessService: MainFrameDataAccessService) {}

  navigateTo($event: Event): void {
    const input = $event.target as HTMLInputElement;
    this.mainFrameDataAccessService.navigateTo(makeUrl(input.value));
    input.blur();
  }
}

function makeUrl(url: string) {
  if (!url) {
    return '';
  }
  try {
    const urlObject = new URL(url);
    if (urlObject.protocol === 'http:' || urlObject.protocol === 'https:') {
      return url;
    }
  } catch (error) {
    console.warn('not a valid URL, therefore prefixing with https://');
  }
  return 'https://' + url;
}
