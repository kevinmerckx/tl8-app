import { Injectable } from '@angular/core';
import { NgForm } from '@angular/forms';
import {
  WorkInProgressDialogInput,
  WorkInProgressDialogOutput,
} from '@tl8/api';
import { ModalService } from '@tl8/extra-ui/modal';
import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';
import { TargetApplicationConfig, WebAppOverwrittenTranslations } from 'tl8';

export type Import = SuccessfulImport | ConflictImport;

export interface SuccessfulImport {
  lang: string;
  key: string;
  importedValue: string;
  status: 'success';
}

export interface ConflictImport {
  lang: string;
  key: string;
  importedValue: string;
  localValue: string;
  status: 'conflict';
}

type Imports = Import[];

type Choices = { lang: string; key: string; choice: 'local' | 'wip' }[];

@Injectable()
export class ImportViewModel {
  modalInputData$ = new BehaviorSubject<WorkInProgressDialogInput>(
    this.modal.input
  );
  langs$ = this.modalInputData$.pipe(
    map((data) => Object.keys(data.wip.translations))
  );
  imports$: Observable<Imports> = combineLatest([
    this.modalInputData$,
    this.langs$,
  ]).pipe(
    map(([modalInputData, langs]) => {
      return langs.reduce((previous, lang) => {
        const local = Object.entries(
          modalInputData.localTranslations[lang] || {}
        );
        return [
          ...previous,
          ...Object.entries(modalInputData.wip.translations[lang] || {}).map(
            ([key, value]) => {
              const localChange = local.find((entry) => entry[0] === key);
              if (localChange && localChange[1] !== value) {
                return {
                  lang,
                  key,
                  importedValue: value,
                  localValue: localChange ? localChange[1] : undefined,
                  status: 'conflict' as const,
                } as ConflictImport;
              }
              return {
                lang,
                key,
                importedValue: value,
                status: 'success' as const,
              } as SuccessfulImport;
            }
          ),
        ];
      }, [] as Imports);
    })
  );
  conflictedLangs$ = combineLatest([this.langs$, this.imports$]).pipe(
    map(([langs, imports]) =>
      langs.filter((lang) => this.getConflictImports(imports, lang).length > 0)
    )
  );
  hasConflict$ = combineLatest([this.langs$, this.imports$]).pipe(
    map(([langs, imports]) =>
      langs.some((lang) => this.getConflictImports(imports, lang).length > 0)
    )
  );
  private choices = new BehaviorSubject<
    { lang: string; key: string; choice: 'local' | 'wip' }[]
  >([]);
  choices$ = this.choices.asObservable();
  targetApplicationConfig$ = this.modalInputData$.pipe(
    map(({ targetApplicationConfig }) => targetApplicationConfig)
  );

  constructor(
    private modal: ModalService<
      WorkInProgressDialogOutput,
      WorkInProgressDialogInput
    >
  ) {}

  getLanguageLabel(
    targetApplicationConfig: TargetApplicationConfig,
    lang: string
  ) {
    return (
      targetApplicationConfig.langs.find((item) => item.lang === lang)?.label ||
      lang
    );
  }

  getSuccessfulImports(imports: Imports, lang: string) {
    return this.getImportsOfLang(imports, lang).filter(
      ({ status }) => status === 'success'
    );
  }

  getConflictImports(imports: Imports, lang: string) {
    return this.getImportsOfLang(imports, lang).filter(
      (item): item is ConflictImport => item.status === 'conflict'
    );
  }

  getImportsOfLang(imports: Imports, lang: string) {
    return imports.filter((item) => item.lang === lang);
  }

  getChoice(choices: Choices, lang: string, key: string) {
    const item = choices.find(
      (choice) => choice.lang === lang && choice.key === key
    );
    if (!item) {
      return;
    }
    return item.choice;
  }

  setChoice(
    choices: Choices,
    lang: string,
    key: string,
    choice: 'wip' | 'local'
  ) {
    this.choices.next([
      ...choices.filter((choice) => choice.lang !== lang || choice.key !== key),
      { lang, key, choice },
    ]);
  }

  import(
    form: NgForm,
    imports: Imports,
    dialogInput: WorkInProgressDialogInput,
    choices: Choices
  ) {
    if (form.invalid) {
      throw new Error('The conflict form is not valid');
    }
    const translations = imports.reduce((previous, item) => {
      const valueToImport =
        item.status === 'success'
          ? item.importedValue
          : (() => {
              const choice = this.getChoice(choices, item.lang, item.key);
              if (choice === 'wip') {
                return item.importedValue;
              }
              return item.localValue;
            })();
      const next: WebAppOverwrittenTranslations = {
        ...previous,
        [item.lang]: {
          ...(previous[item.lang] || {}),
          [item.key]: valueToImport,
        },
      };
      return next;
    }, dialogInput.localTranslations);
    this.modal.closeWithData({
      translations,
    });
  }

  cancel() {
    this.modal.close();
  }
}
