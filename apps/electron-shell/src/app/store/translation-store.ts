import { Injectable } from '@nestjs/common';
import {
  changeTranslation,
  ChangeTranslationParams,
  revertAllTranslations,
  revertTranslation,
  RevertTranslationParams,
} from '@tl8/api';
import * as Store from 'electron-store';
import { OverwrittenTranslations, WebAppOverwrittenTranslations } from 'tl8';

@Injectable()
export class TranslationStore {
  private electronStore = new Store<OverwrittenTranslations>();

  getOverwrittenTranslationsForLocation(
    location: string
  ): WebAppOverwrittenTranslations {
    return this.electronStore.get(this.getStoreKeyFromLocation(location), {});
  }

  setOverwrittenTranslationsForLocation(
    location: string,
    overwrittenTranslations: WebAppOverwrittenTranslations
  ) {
    this.electronStore.set(
      this.getStoreKeyFromLocation(location),
      overwrittenTranslations
    );
  }

  changeTranslationForLocation(
    location: string,
    params: ChangeTranslationParams
  ) {
    this.setOverwrittenTranslationsForLocation(
      location,
      changeTranslation(
        this.getOverwrittenTranslationsForLocation(location) || {},
        params
      )
    );
  }

  revertTranslationForLocation(
    location: string,
    params: RevertTranslationParams
  ) {
    this.setOverwrittenTranslationsForLocation(
      location,
      revertTranslation(
        this.getOverwrittenTranslationsForLocation(location) || {},
        params
      )
    );
  }

  revertAllTranslationsForLocation(location: string) {
    this.setOverwrittenTranslationsForLocation(
      location,
      revertAllTranslations(
        this.getOverwrittenTranslationsForLocation(location) || {}
      )
    );
  }

  private getStoreKeyFromLocation(location: string) {
    return 'translations:' + this.escapeLocation(location);
  }

  private escapeLocation(location: string) {
    return location.split('.').join('/');
  }
}
