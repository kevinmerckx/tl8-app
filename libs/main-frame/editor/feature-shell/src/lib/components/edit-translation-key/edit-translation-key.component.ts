import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  ViewChild,
} from '@angular/core';
import {
  faArrowUpRightFromSquare,
  faExclamationCircle,
  faUndo,
} from '@fortawesome/free-solid-svg-icons';
import { MainFrameDataAccessService } from '@tl8/main-frame/editor/data-access-api';
import { BehaviorSubject, filter } from 'rxjs';
import {
  map,
  shareReplay,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs/operators';

@Component({
  selector: 'tl8-edit-translation-key',
  templateUrl: './edit-translation-key.component.html',
  styleUrls: ['./edit-translation-key.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditTranslationKeyComponent {
  @Input() set key(key: string) {
    this.keyLangSubject.next({ ...this.keyLangSubject.value, key });
  }
  get key() {
    return this.keyLangSubject.value.key;
  }
  @Input() set lang(lang: string | null) {
    this.keyLangSubject.next({ ...this.keyLangSubject.value, lang });
  }

  icons = {
    error: faExclamationCircle,
    revert: faUndo,
    externalLink: faArrowUpRightFromSquare,
  };
  private keyLangSubject = new BehaviorSubject<{
    key: string;
    lang: string | null;
  }>({ key: '', lang: null });
  definedKeyValue$ = this.keyLangSubject.pipe(
    filter(
      (params): params is { key: string; lang: string } =>
        !!params.lang && !!params.key
    )
  );
  keyValue$ = this.definedKeyValue$.pipe(
    switchMap((params) =>
      this.mainFrameDataAccessService.observeTranslation(params)
    )
  );
  value$ = this.keyValue$.pipe(map((kv) => kv?.value));
  originalValue$ = this.keyValue$.pipe(map((kv) => kv?.originalValue));
  stateOfEntry$ = this.keyValue$.pipe(
    map((keyValue) => {
      if (!keyValue) {
        return;
      }
      if (!keyValue.value) {
        return 'empty';
      }
      if (keyValue.value !== keyValue.originalValue) {
        return 'modified';
      }
      return 'unchanged';
    })
  );
  @ViewChild('input') input!: ElementRef<HTMLInputElement>;
  actions$ = this.keyValue$.pipe(
    map(({ key, lang }) => {
      return {
        revert: () =>
          this.mainFrameDataAccessService.revertTranslation({ key, lang }),
        onTranslationChange: (value: string) =>
          this.mainFrameDataAccessService.changeTranslation({
            value,
            key,
            lang,
          }),
        openMarkdownEditorModal: () =>
          this.mainFrameDataAccessService.openMarkdownEditorModal({
            key,
            lang,
          }),
        onFocus: () => {
          this.mainFrameDataAccessService.onUserFocusedOnTranslation({
            key,
            lang,
          });
        },
        onBlur: () => {
          this.mainFrameDataAccessService.onUserBlurredOfTranslation({
            key,
            lang,
          });
        },
      };
    })
  );

  focusOnTranslationEffect$ =
    this.mainFrameDataAccessService.focusOnTranslationAction$.pipe(
      withLatestFrom(this.keyLangSubject),
      filter(([action, { key }]) => action.key === key),
      tap(() => {
        this.input.nativeElement.focus();
        this.input.nativeElement.setSelectionRange(
          0,
          this.input.nativeElement.value.length
        );
        this.elementRef.nativeElement.scrollIntoView();
      }),
      shareReplay(1)
    );

  activeUsersOnTranslation$ = this.keyLangSubject.pipe(
    filter(
      (params): params is { key: string; lang: string } =>
        !!params.key && !!params.lang
    ),
    switchMap(({ key, lang }) => {
      return this.mainFrameDataAccessService.activeUsersOnTranslation$(
        { key, lang },
        { excludeSelf: true }
      );
    })
  );
  otherAuthorEditing$ = this.activeUsersOnTranslation$.pipe(
    map((users) => users[0])
  );
  isDisabled$ = this.otherAuthorEditing$.pipe(map((user) => !!user));
  windowMode$ = this.mainFrameDataAccessService.windowMode$;
  lastAuthor$ = this.definedKeyValue$.pipe(
    switchMap((params) =>
      this.mainFrameDataAccessService.lastAuthorOfTranslation$(params)
    )
  );

  constructor(
    private mainFrameDataAccessService: MainFrameDataAccessService,
    private elementRef: ElementRef<HTMLElement>
  ) {}
}
