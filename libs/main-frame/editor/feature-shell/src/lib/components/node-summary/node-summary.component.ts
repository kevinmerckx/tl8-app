import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MainFrameDataAccessService } from '@tl8/main-frame/editor/data-access-api';
import { ModifiedTranslations } from '@tl8/private/interfaces';
import { getTranslationsAtPath } from '@tl8/private/utils';
import {
  BehaviorSubject,
  combineLatest,
  map,
  shareReplay,
  switchMap,
} from 'rxjs';

@Component({
  selector: 'tl8-node-summary',
  templateUrl: './node-summary.component.html',
  styleUrls: ['./node-summary.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NodeSummaryComponent {
  @Input() set selectedNode(value: string | undefined) {
    this.selectedNodeSubject.next(value);
  }

  private selectedNodeSubject = new BehaviorSubject<string | undefined>(
    undefined
  );
  @Input() languages: {
    lang: string;
    label: string;
  }[] = [];

  translationsUnderNode$ = this.selectedNodeSubject.pipe(
    switchMap((path) =>
      this.mainFrameDataAccessService.allTranslationKeysUnderNode$(path || '')
    )
  );
  translationsUnderNodeByKey$ = this.translationsUnderNode$.pipe(
    map((translations) => {
      const result = new Map<
        string,
        { key: string; lang: string; value: string; originalValue: string }[]
      >();
      translations.forEach((translation) => {
        if (!result.has(translation.key)) {
          result.set(translation.key, []);
        }
        result.set(
          translation.key,
          (result.get(translation.key) || []).concat(translation)
        );
      });
      return result;
    })
  );
  totalNumberOfTranslations$ = this.translationsUnderNodeByKey$.pipe(
    map((translations) => translations.size)
  );
  numberOfEmptyTranslations$ = this.selectedNodeSubject.pipe(
    switchMap((path) =>
      this.mainFrameDataAccessService.numberOfEmptyTranslationsUnderNode$(
        path || ''
      )
    )
  );
  numberOfChanges$ = this.translationsUnderNode$.pipe(
    map(
      (translations) =>
        translations.filter(
          ({ value, originalValue }) => value !== originalValue
        ).length
    )
  );

  constructor(private mainFrameDataAccessService: MainFrameDataAccessService) {}
}
