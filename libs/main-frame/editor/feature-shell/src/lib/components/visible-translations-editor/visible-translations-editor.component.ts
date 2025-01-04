import { Component, TrackByFunction } from '@angular/core';
import { MainFrameDataAccessService } from '@tl8/main-frame/editor/data-access-api';

@Component({
  selector: 'tl8-visible-translations-editor',
  templateUrl: './visible-translations-editor.component.html',
  styleUrls: ['./visible-translations-editor.component.sass'],
})
export class VisibleTranslationsEditorComponent {
  visibleKeyValues$ = this.mainFrameDataAccessService.visibleKeyValues$;
  keyValuesFilteredBySearchQuery$ =
    this.mainFrameDataAccessService.keyValuesFilteredBySearchQuery$;
  searchQuery$ = this.mainFrameDataAccessService.searchQuery$;
  lang$ = this.mainFrameDataAccessService.currentLanguage$;

  constructor(private mainFrameDataAccessService: MainFrameDataAccessService) {}

  setSearchQuery(searchQuery: string) {
    this.mainFrameDataAccessService.setSearchQuery(searchQuery);
  }

  trackBy: TrackByFunction<{ key: string }> = (_, item) => item.key;
}
