import { Injectable, NgZone } from '@angular/core';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import {
  ActiveTranslations,
  ActiveUsers,
  Collaboration,
  NavigationStateMessage,
} from '@tl8/api';
import {
  ChangeTranslationMessage,
  UserFocusedOnTranslationParams,
} from '@tl8/collaboration/interfaces';
import {
  CollaborationApiGateway,
  MainFrameApi,
  isCollaborationMode,
} from '@tl8/main-frame/webview-api';
import { combineLatest, from, map, of, tap } from 'rxjs';
import { TargetApplicationConfig, WebAppOverwrittenTranslations } from 'tl8';
import { EditorMode } from '../editor-mode';
import {
  openDownloadModal,
  startImportWIPProcess,
} from './actions/app.actions';
import {
  setActiveTranslations,
  setActiveUsers,
  setCollaboration,
} from './actions/collaboration.actions';
import {
  back,
  changeTranslation,
  focusOnTranslation,
  navigateTo,
  refresh,
  revertAllTranslations,
  revertTranslation,
  selectLanguage,
  setCurrentAppTranslations,
  setCurrentLanguage,
  setCurrentVisibleKeys,
  setEditorMode,
  setNavigationState,
  setOverwrittenTranslations,
  setSearchQuery,
  setTargetApplicationConfig,
  showSideMenu,
  toggleSideMenu,
} from './actions/editor.actions';
import {
  openHome,
  openLanguageSelect,
  openMarkdownEditor,
} from './actions/extra-ui.actions';
import { PlausibleService } from './plausible.service';
import {
  selectActiveUsers,
  selectActiveUsersOnTranslations,
  selectLastAuthorOfTranslation,
} from './selectors/collaboration.selectors';
import {
  canNotGoBack,
  canRefresh,
  currentLanguageLabel,
  currentTargetOverwrittenTranslations,
  currentVisibleKeyValues,
  isCurrentWebsiteCompatible,
  numberOfChanges,
  selectAllTranslationKeysUnderNode,
  selectCurrentLanguage,
  selectCurrentUrl,
  selectEditorMode,
  selectHost,
  selectIsSideMenuVisible,
  selectKeyValuesFilteredBySearchQuery,
  selectLangs,
  selectModifiedTranslations,
  selectNavigationState,
  selectNumberOfEmptyTranslationsUnderNode,
  selectSearchQuery,
  selectTargetApplicationConfig,
  selectTranslation,
} from './selectors/index';

@Injectable({
  providedIn: 'root',
})
export class MainFrameDataAccessService {
  visibleKeyValues$ = this.store.select(currentVisibleKeyValues).pipe(
    map((entries) => {
      const result = entries.slice(0);
      result.sort((a, b) =>
        a.key.toLowerCase().localeCompare(b.key.toLowerCase())
      );
      return result;
    })
  );
  displayIncompatibleMessage$ = combineLatest([
    this.store.select(isCurrentWebsiteCompatible),
    this.store.select(selectCurrentUrl),
  ]).pipe(map(([compatible, url]) => !compatible && url));
  displaySelectWebsite$ = this.store
    .select(selectCurrentUrl)
    .pipe(map((url) => !url));
  webviewUrl$ = this.store.select(selectCurrentUrl);
  host$ = this.store.select(selectHost);
  numberOfChanges$ = this.store.select(numberOfChanges);
  currentLanguage$ = this.store.select(selectCurrentLanguage);
  currentLanguageLabel$ = this.store.select(currentLanguageLabel);
  availableLanguages$ = this.store.select(selectLangs);
  isCurrentWebsiteCompatible$ = this.store.select(isCurrentWebsiteCompatible);
  canNotGoBack$ = this.store.select(canNotGoBack);
  canRefresh$ = this.store.select(canRefresh);
  canNotRefresh$ = this.store.select(canRefresh).pipe(map((v) => !v));
  isSideMenuVisible$ = this.store.select(selectIsSideMenuVisible);
  currentTargetOverwrittenTranslations$ = this.store.select(
    currentTargetOverwrittenTranslations
  );
  modifiedTranslations$ = this.store.select(selectModifiedTranslations);
  onLanguageSelected$ = this.actions$.pipe(ofType(selectLanguage));
  searchQuery$ = this.store.select(selectSearchQuery);
  keyValuesFilteredBySearchQuery$ = this.store.select(
    selectKeyValuesFilteredBySearchQuery
  );
  targetApplicationConfig$ = this.store.select(selectTargetApplicationConfig);
  editorMode$ = this.store.select(selectEditorMode);
  windowMode$ = of(isCollaborationMode()).pipe(
    map((v) => (v ? ('collaboration' as const) : ('local' as const)))
  );
  activeUsers$ = this.store.select(selectActiveUsers);
  focusOnTranslationAction$ = this.actions$.pipe(ofType(focusOnTranslation));
  user$ = from(MainFrameApi().getUser());
  state$ = this.store.select(selectNavigationState).pipe(
    map(({ state }) => {
      return state;
    })
  );
  constructor(
    private zone: NgZone,
    private actions$: Actions,
    private store: Store,
    private plausibleService: PlausibleService
  ) {
    MainFrameApi().onSetNavigationState(
      (navigationStateMessage: NavigationStateMessage) =>
        this.zone.run(() => this.setNavigationState(navigationStateMessage))
    );
    MainFrameApi().onFocusOnTranslation((key) => {
      this.focusOnTranslation(key);
    });
    MainFrameApi().onSetOverwrittenTranslations(
      (overwrittenTranslations: WebAppOverwrittenTranslations) => {
        this.zone.run(() => {
          this.setOverwrittenTranslations(overwrittenTranslations);
        });
      }
    );
    MainFrameApi().onMessageFromTarget((channel, ...args) => {
      this.zone.run(() => {
        switch (channel) {
          case 'state:ready':
            this.plausibleService.sendCustomGoal('Ready', {});
            this.setTargetApplicationConfig(args[0]);
            this.startSendingUpdates();
            break;
          case 'state:currentAppTranslations':
            this.setCurrentAppTranslations(args[0]);
            break;
          case 'state:currentLanguage':
            this.setCurrentLanguage(args[0]);
            break;
          case 'state:currentVisibleKeys':
            this.setCurrentVisibleKeys(args[0]);
            break;
        }
      });
    });
    this.activateCollaborationFeatures();
  }

  private activateCollaborationFeatures() {
    const collaborationGateway = CollaborationApiGateway();
    if (!collaborationGateway) {
      return;
    }
    collaborationGateway.onSetActiveUsers((activeUsers) => {
      this.zone.run(() => {
        this.setActiveUsers(activeUsers);
      });
    });
    collaborationGateway.onSetActiveTranslations((activeTranslations) => {
      this.zone.run(() => {
        this.setActiveTranslations(activeTranslations);
      });
    });
    collaborationGateway.onSetCollaboration((collaboration) => {
      this.zone.run(() => {
        this.setCollaboration(collaboration);
      });
    });
    collaborationGateway.onSetTranslation((change) => {
      this.zone.run(() => {
        this.setTranslation(change);
      });
    });
  }

  private startSendingUpdates(): void {
    this.onLanguageSelected$
      .pipe(
        tap(({ value }) =>
          MainFrameApi().postMessageToTarget('selectLanguage', { value })
        )
      )
      .subscribe();
  }

  lastAuthorOfTranslation$(params: { key: string; lang: string }) {
    return this.store.select(selectLastAuthorOfTranslation(params));
  }

  activeUsersOnTranslation$(
    params: { key: string; lang: string },
    options: { excludeSelf: boolean } = { excludeSelf: false }
  ) {
    return combineLatest([
      this.store.select(selectActiveUsersOnTranslations(params)),
      this.user$,
    ]).pipe(
      map(([users, self]) =>
        options.excludeSelf
          ? users.filter(({ userId }) => userId !== self?.userId)
          : users
      )
    );
  }

  numberOfEmptyTranslationsUnderNode$(path: string) {
    return this.store.select(selectNumberOfEmptyTranslationsUnderNode(path));
  }

  allTranslationKeysUnderNode$(path: string) {
    return this.store.select(selectAllTranslationKeysUnderNode(path));
  }

  setSearchQuery(searchQuery: string) {
    this.store.dispatch(setSearchQuery({ searchQuery }));
  }

  download(): void {
    this.store.dispatch(openDownloadModal());
  }

  setEditorMode(editorMode: EditorMode): void {
    this.store.dispatch(setEditorMode({ editorMode }));
  }

  importWIP(): void {
    this.store.dispatch(startImportWIPProcess());
  }

  revertAllTranslations() {
    this.store.dispatch(revertAllTranslations());
  }

  selectLanguage(value: string): void {
    this.store.dispatch(selectLanguage({ value }));
  }

  toggleMenu(): void {
    this.store.dispatch(toggleSideMenu());
  }

  showMenu(): void {
    this.store.dispatch(showSideMenu());
  }

  openLanguageSelectModal(): void {
    this.store.dispatch(openLanguageSelect());
  }

  openHome(): void {
    this.store.dispatch(openHome());
  }

  openMarkdownEditorModal(params: { key: string; lang: string }) {
    this.store.dispatch(openMarkdownEditor(params));
  }

  back(): void {
    this.store.dispatch(back());
  }

  refresh(): void {
    this.store.dispatch(refresh());
  }

  navigateTo(url: string): void {
    this.store.dispatch(navigateTo({ url }));
  }

  openTargetView() {
    MainFrameApi().openTargetView();
  }

  closeTargetView() {
    MainFrameApi().closeTargetView();
  }

  changeTranslation(params: { key: string; lang: string; value: string }) {
    this.store.dispatch(
      changeTranslation({
        lang: params.lang,
        key: params.key,
        value: params.value,
      })
    );
  }

  setTargetApplicationConfig(config: TargetApplicationConfig) {
    this.store.dispatch(setTargetApplicationConfig({ config }));
  }

  setCurrentAppTranslations(translations: any) {
    this.store.dispatch(setCurrentAppTranslations({ translations }));
  }

  setCurrentLanguage(lang: string) {
    this.store.dispatch(setCurrentLanguage({ value: lang }));
  }

  setCurrentVisibleKeys(keys: string[]) {
    this.store.dispatch(setCurrentVisibleKeys({ keys }));
  }

  revertTranslation(params: { key: string; lang: string }) {
    this.store.dispatch(revertTranslation(params));
  }

  observeTranslation(params: { key: string; lang: string }) {
    return this.store.select(selectTranslation(params));
  }

  setNavigationState(navigationStateMessage: NavigationStateMessage) {
    return this.store.dispatch(setNavigationState({ navigationStateMessage }));
  }

  focusOnTranslation(key: string) {
    this.store.dispatch(focusOnTranslation({ key }));
  }

  setActiveUsers(activeUsers: ActiveUsers) {
    this.store.dispatch(setActiveUsers({ activeUsers }));
  }

  setActiveTranslations(activeTranslations: ActiveTranslations) {
    this.store.dispatch(setActiveTranslations({ activeTranslations }));
  }

  setCollaboration(collaboration: Collaboration) {
    this.store.dispatch(setCollaboration({ collaboration }));
  }

  setTranslation(change: ChangeTranslationMessage) {
    this.store.dispatch(
      changeTranslation({
        ...change.params,
        withoutEffect: true,
      })
    );
  }

  onUserFocusedOnTranslation(params: UserFocusedOnTranslationParams) {
    CollaborationApiGateway()?.declareUserFocusedOnTranslation(params);
  }

  onUserBlurredOfTranslation(params: UserFocusedOnTranslationParams) {
    CollaborationApiGateway()?.declareUserBlurredOfTranslation(params);
  }

  setOverwrittenTranslations(
    overwrittenTranslations: WebAppOverwrittenTranslations
  ) {
    this.store.dispatch(
      setOverwrittenTranslations({ overwrittenTranslations })
    );
  }
}
