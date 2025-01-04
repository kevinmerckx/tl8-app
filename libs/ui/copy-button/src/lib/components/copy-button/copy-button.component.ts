import { Component, HostListener, Input } from '@angular/core';
import { map, startWith, Subject, switchMap, timer } from 'rxjs';

@Component({
  selector: 'tl8-copy-button',
  templateUrl: './copy-button.component.html',
  styleUrls: ['./copy-button.component.sass'],
})
export class CopyButtonComponent {
  @Input() contentToCopy = '';
  copyEvent$ = new Subject();

  state$ = this.copyEvent$.pipe(
    switchMap(() => {
      return timer(2000).pipe(
        map(() => 'idle' as const),
        startWith('done' as const)
      );
    }),
    startWith('idle' as const)
  );

  @HostListener('click', [])
  copy() {
    navigator.clipboard.writeText(this.contentToCopy);
    this.copyEvent$.next(0);
  }
}
