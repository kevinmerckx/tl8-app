import { Component, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { MainFrameApi } from '@tl8/main-frame/webview-api';

@Component({
  selector: 'tl8-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
})
export class AppComponent {
  constructor(private router: Router, private zone: NgZone) {
    MainFrameApi().onCreateCollaborativeProject((params) =>
      this.zone.run(() => {
        this.router.navigate(['/collaboration', 'create'], {
          queryParams: params,
        });
      })
    );
  }
}
