import { APP_BASE_HREF, Location, LocationChangeListener, LocationStrategy, PlatformLocation } from '@angular/common';
import { Inject, Injectable, Optional } from '@angular/core';

@Injectable()
export class FileLocationStrategy extends LocationStrategy {

  private _baseHref = '';

  constructor(
    private _platformLocation: PlatformLocation,
    @Optional() @Inject(APP_BASE_HREF) _baseHref?: string
  ) {
    super();
    if (_baseHref != null) {
      this._baseHref = _baseHref;
    }
  }

  onPopState(fn: LocationChangeListener): void {
    this._platformLocation.onPopState(fn);
    this._platformLocation.onHashChange(fn);
  }

  getBaseHref(): string {
    return this._baseHref;
  }

  path(_includeHash: boolean = false): string {
    const state: any = this._platformLocation.getState() || {};
    return state.url || '';
  }

  prepareExternalUrl(internal: string): string {
    return Location.joinWithSlash(this._baseHref, internal);
  }

  pushState(_state: any, title: string, path: string, queryParams: string) {
    const url = this.prepareExternalUrl(path + Location.normalizeQueryParams(queryParams));
    this._platformLocation.pushState({ url }, title, this._platformLocation.href);
  }

  replaceState(_state: any, title: string, path: string, queryParams: string) {
    const url = this.prepareExternalUrl(path + Location.normalizeQueryParams(queryParams));
    this._platformLocation.replaceState({ url }, title, this._platformLocation.href);
  }

  getState(): unknown {
    return this._platformLocation.getState();
  }

  forward(): void {
    this._platformLocation.forward();
  }

  back(): void {
    this._platformLocation.back();
  }
}
