import {
  ChangeDetectionStrategy,
  Component,
  TrackByFunction,
} from '@angular/core';
import {
  faCheckDouble,
  faExclamationCircle,
  faWarning,
} from '@fortawesome/free-solid-svg-icons';
import {
  WorkInProgressDialogInput,
  WorkInProgressDialogOutput,
} from '@tl8/api';
import { ModalService } from '@tl8/extra-ui/modal';
import {
  ConflictImport,
  ImportViewModel,
} from '../../services/import.view-model';

@Component({
  selector: 'tl8-import-wip-dialog',
  templateUrl: './import-wip-dialog.component.html',
  styleUrls: ['./import-wip-dialog.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImportWipDialogComponent {
  icons = {
    check: faCheckDouble,
    warning: faWarning,
    danger: faExclamationCircle,
  };

  trackByConflictImport: TrackByFunction<ConflictImport> = (_, item) =>
    item.key;
  trackByLang: TrackByFunction<string> = (_, item) => item;

  constructor(
    public readonly vm: ImportViewModel,
    private modal: ModalService<
      WorkInProgressDialogOutput,
      WorkInProgressDialogInput
    >
  ) {}
}
