import { ChangeDetectionStrategy, Component } from '@angular/core';
import { faEdit } from '@fortawesome/free-regular-svg-icons';
import {
  faBars,
  faCaretDown,
  faChevronLeft,
  faMousePointer,
  faRefresh,
} from '@fortawesome/free-solid-svg-icons';
import { FEATURE_FLAGS } from '@tl8/feature-flags';
import { ConfirmationService } from '@tl8/main-frame/confirmation';
import { MainFrameDataAccessService } from '@tl8/main-frame/editor/data-access-api';
import { isCollaborationMode } from '@tl8/main-frame/webview-api';
import { combineLatest, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Component({
  selector: 'tl8-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToolbarComponent {
  featureFlags = FEATURE_FLAGS;
  isCollaborationMode$ = of(isCollaborationMode());
  activeUsers$ = this.mainFrameDataAccessService.activeUsers$;
  icons = {
    edit: faEdit,
    cursor: faMousePointer,
    back: faChevronLeft,
    menu: faBars,
    caretDropdown: faCaretDown,
    refresh: faRefresh,
  };
  confirmRevertOpen = false;
  webviewUrl$ = this.mainFrameDataAccessService.webviewUrl$;
  numberOfChanges$ = this.mainFrameDataAccessService.numberOfChanges$;
  isCurrentWebsiteCompatible$ =
    this.mainFrameDataAccessService.isCurrentWebsiteCompatible$;
  canNotGoBack$ = this.mainFrameDataAccessService.canNotGoBack$;
  canNotRefresh$ = this.mainFrameDataAccessService.canNotRefresh$;
  isSideMenuVisible$ = this.mainFrameDataAccessService.isSideMenuVisible$;
  isSideMenuNotVisible$ = this.isSideMenuVisible$.pipe(map((v) => !v));
  displayRevertButton$ = combineLatest([
    this.isCollaborationMode$,
    this.numberOfChanges$,
  ]).pipe(
    map(([isCollaborationMode, numberOfChanges]) => {
      return !isCollaborationMode && numberOfChanges > 0;
    })
  );
  displayImportButton$ = this.isCollaborationMode$.pipe(
    map((isCollaborationMode) => !isCollaborationMode)
  );

  constructor(
    private confirm: ConfirmationService,
    private mainFrameDataAccessService: MainFrameDataAccessService
  ) {}

  download(): void {
    this.mainFrameDataAccessService.download();
  }

  importWIP(): void {
    this.mainFrameDataAccessService.importWIP();
  }

  revert(): void {
    this.confirm
      .confirm({
        message:
          'Are you sure you want to revert all translations back to the original? You can not undo this action.',
        yes: 'Yes, revert',
        no: 'Cancel',
        title: 'Revert changes',
      })
      .pipe(
        tap(
          (shouldRevert) =>
            shouldRevert &&
            this.mainFrameDataAccessService.revertAllTranslations()
        )
      )
      .subscribe();
  }

  back(): void {
    this.mainFrameDataAccessService.back();
  }

  refresh(): void {
    this.mainFrameDataAccessService.refresh();
  }

  openHome() {
    this.mainFrameDataAccessService.openHome();
  }
}
