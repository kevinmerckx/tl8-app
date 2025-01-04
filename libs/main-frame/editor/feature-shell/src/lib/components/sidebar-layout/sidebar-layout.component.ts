import { Component, Input } from '@angular/core';
import {
  faCaretDown,
  faCaretLeft,
  faCaretRight,
} from '@fortawesome/free-solid-svg-icons';
import {
  EditorMode,
  MainFrameDataAccessService,
} from '@tl8/main-frame/editor/data-access-api';
import { combineLatest, map } from 'rxjs';

@Component({
  selector: 'tl8-sidebar-layout',
  templateUrl: './sidebar-layout.component.html',
  styleUrls: ['./sidebar-layout.component.sass'],
})
export class SidebarLayoutComponent {
  @Input() withoutLanguageSelect = false;

  isSideMenuVisible$ = this.mainFrameDataAccessService.isSideMenuVisible$;
  isSideMenuNotVisible$ = this.isSideMenuVisible$.pipe(map((v) => !v));
  isCurrentWebsiteCompatible$ =
    this.mainFrameDataAccessService.isCurrentWebsiteCompatible$;
  currentLanguageLabel$ = this.mainFrameDataAccessService.currentLanguageLabel$;
  webviewUrl$ = this.mainFrameDataAccessService.webviewUrl$;
  icons = {
    caretLeft: faCaretLeft,
    caretRight: faCaretRight,
    caretDropdown: faCaretDown,
  };
  editorMode$ = this.mainFrameDataAccessService.editorMode$;
  displayIncompatibleMessage$ =
    this.mainFrameDataAccessService.displayIncompatibleMessage$;
  displaySelectWebsite$ = this.mainFrameDataAccessService.displaySelectWebsite$;

  state$ = combineLatest([
    this.displayIncompatibleMessage$,
    this.displaySelectWebsite$,
  ]).pipe(
    map(([displayIncompatibleMessage, displaySelectWebsite]) => {
      if (displayIncompatibleMessage) {
        return 'incompatible';
      }
      if (displaySelectWebsite) {
        return 'selectWebsite';
      }
      return 'letsdoit';
    })
  );

  constructor(private mainFrameDataAccessService: MainFrameDataAccessService) {}

  toggleMode(currentMode: EditorMode) {
    if (currentMode === 'raw-editor') {
      this.mainFrameDataAccessService.setEditorMode('wysiwyg');
      return;
    }
    this.mainFrameDataAccessService.setEditorMode('raw-editor');
  }

  toggleMenu(): void {
    this.mainFrameDataAccessService.toggleMenu();
  }

  openLanguageSelectModal(): void {
    this.mainFrameDataAccessService.openLanguageSelectModal();
  }
}
