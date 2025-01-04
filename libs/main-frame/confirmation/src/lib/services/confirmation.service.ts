import { Injectable, NgZone } from '@angular/core';
import { ConfirmParams } from '@tl8/extra-ui-interfaces';
import { MainFrameApi } from '@tl8/main-frame/webview-api';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ConfirmationService {
  constructor(private zone: NgZone) {}

  confirm(data: ConfirmParams): Observable<boolean> {
    return from(MainFrameApi().confirm(data)).pipe(
      map((response) => this.zone.run(() => response))
    );
  }
}
