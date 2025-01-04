import { AfterViewInit, Component, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { ExtraUIAPI } from '@tl8/extra-ui/api';
import { ModalService } from '@tl8/extra-ui/modal';

@Component({
  selector: 'tl8-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit {
  constructor(
    private router: Router,
    private zone: NgZone,
    private modal: ModalService
  ) {}

  ngAfterViewInit(): void {
    ExtraUIAPI().handleModal((modalParams) =>
      this.zone.run(() => {
        this.modal.input = modalParams.data;
        this.router.navigate(['/modal', modalParams.modalId]);
      })
    );
    ExtraUIAPI().ready();
  }
}
