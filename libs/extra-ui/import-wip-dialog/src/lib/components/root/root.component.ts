import { Component } from '@angular/core';
import {
  WorkInProgressDialogInput,
  WorkInProgressDialogOutput,
} from '@tl8/api';
import { ModalService } from '@tl8/extra-ui/modal';
import { BehaviorSubject, map } from 'rxjs';
import { ImportViewModel } from '../../services/import.view-model';

@Component({
  selector: 'tl8-root',
  templateUrl: './root.component.html',
  styleUrls: ['./root.component.sass'],
  providers: [ImportViewModel],
})
export class ImportWIPDialogRootComponent {
  modalInputData$ = new BehaviorSubject<WorkInProgressDialogInput>(
    this.modal.input
  );
  areHostsMatching$ = this.modalInputData$.pipe(
    map((inputData) => inputData.currentTargetHost === inputData.wip.targetHost)
  );
  currentTargetHost$ = this.modalInputData$.pipe(
    map((inputData) => inputData.currentTargetHost)
  );
  wipTargetHost$ = this.modalInputData$.pipe(
    map((inputData) => inputData.wip.targetHost)
  );

  constructor(
    private modal: ModalService<
      WorkInProgressDialogOutput,
      WorkInProgressDialogInput
    >
  ) {}

  navigateToWIPTargetHost(host: string) {
    this.modal.closeWithData(host);
  }
}
