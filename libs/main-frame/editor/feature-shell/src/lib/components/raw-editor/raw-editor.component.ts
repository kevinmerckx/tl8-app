import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  TrackByFunction,
} from '@angular/core';
import { MainFrameDataAccessService } from '@tl8/main-frame/editor/data-access-api';
import { ModifiedTranslations } from '@tl8/private/interfaces';
import { getTranslationsAtPath, uniqueStrings } from '@tl8/private/utils';
import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';
import { Node } from '../translation-tree/translation-tree.component';

@Component({
  selector: 'tl8-raw-editor',
  templateUrl: './raw-editor.component.html',
  styleUrls: ['./raw-editor.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RawEditorComponent implements OnInit {
  isSideMenuVisible$ = this.mainFrameDataAccessService.isSideMenuVisible$;
  modifiedTranslations$ = this.mainFrameDataAccessService.modifiedTranslations$;
  langs$ = this.mainFrameDataAccessService.availableLanguages$;

  roots$: Observable<Node[]> = this.modifiedTranslations$.pipe(
    map((modifiedTranslations) => {
      return modifiedTranslations
        .reduce((prev, { translations }) => {
          return uniqueStrings([...prev, ...Object.keys(translations)]);
        }, [] as string[])
        .map((key) => ({
          chunk: key,
          path: key,
        }));
    })
  );

  private searchQuerySubject = new BehaviorSubject('');
  searchQuery$ = this.searchQuerySubject.asObservable();

  flattenedTranslations$ = this.modifiedTranslations$.pipe(
    map((modifiedTranslations) => {
      return getTranslationsAtPath(modifiedTranslations, '');
    })
  );
  translationsFilteredByQuery$ = combineLatest([
    this.searchQuery$.pipe(map((query) => query.toLowerCase())),
    this.flattenedTranslations$,
    this.modifiedTranslations$.pipe(map(flattenModifiedTranslations)),
  ]).pipe(
    map(([query, flattenedTranslations, modifiedTranslations]) => {
      return uniqueStrings([
        ...searchInFlattenedModifiedTranslations(query, modifiedTranslations),
        ...flattenedTranslations.filter((key) =>
          key.toLowerCase().includes(query)
        ),
      ]);
    })
  );
  flatRoots$: Observable<Node[]> = this.translationsFilteredByQuery$.pipe(
    map((keys) =>
      keys.map((key) => ({
        chunk: key,
        path: key,
      }))
    )
  );
  selectedNode: string | undefined;
  trackByTranslation: TrackByFunction<string> = (_, item) => item;

  constructor(private mainFrameDataAccessService: MainFrameDataAccessService) {}

  ngOnInit() {
    this.mainFrameDataAccessService.showMenu();
  }

  setSearchQuery(query: string) {
    this.searchQuerySubject.next(query);
  }

  getTranslationsInsideNode(
    modifiedTranslations: ModifiedTranslations,
    selectedPath = ''
  ) {
    const result = getTranslationsAtPath(modifiedTranslations, selectedPath);
    result.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
    return result;
  }
}

function searchInFlattenedModifiedTranslations(
  search: string,
  modifiedTranslations: { key: string; value: string; lang: string }[]
): string[] {
  return uniqueStrings(
    modifiedTranslations.reduce((prev, { key, value }) => {
      if (value.toLowerCase().includes(search)) {
        return [...prev, key];
      }
      return prev;
    }, [] as string[])
  );
}

function flattenModifiedTranslations(
  modifiedTranslations: ModifiedTranslations
): { key: string; value: string; lang: string }[] {
  return modifiedTranslations.reduce(
    (prev, { lang, translations }) => [
      ...prev,
      ...flattenTree(translations).map(({ key, value }) => ({
        key,
        value,
        lang,
      })),
    ],
    [] as { key: string; value: string; lang: string }[]
  );
}

function flattenTree(
  tree: any,
  currentPath = ''
): { key: string; value: string }[] {
  if (!tree) {
    return [];
  }
  if (typeof tree === 'string') {
    return [{ key: currentPath, value: tree }];
  }
  return Object.entries(tree).reduce((prev, [key, nextObject]) => {
    return [
      ...prev,
      ...flattenTree(nextObject, currentPath ? currentPath + '.' + key : key),
    ];
  }, [] as { key: string; value: string }[]);
}
