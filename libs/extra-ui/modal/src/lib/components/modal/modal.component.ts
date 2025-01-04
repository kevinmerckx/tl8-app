import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  Input,
  OnDestroy,
} from '@angular/core';
import { ModalService } from '../../services/modal.service';

export type BeforeCloseFn = (delegate: BeforeCloseDelegate) => void;
export type BeforeCloseDelegate = {
  prevent: () => void;
};

@Component({
  selector: 'tl8-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalComponent implements OnDestroy, AfterViewInit {
  @Input() title = '';
  @Input() fullHeight = false;
  @Input() escToClose = true;
  @Input() closeOnBackdropClick = true;
  @Input() beforeClose: BeforeCloseFn | undefined;

  private closed = false;

  constructor(
    private elementRef: ElementRef,
    private modalService: ModalService
  ) {}

  ngAfterViewInit() {
    this.modalService.declareReady();
  }

  @HostListener('window:keydown.escape', [])
  onEsc(): void {
    if (!this.escToClose) {
      return;
    }
    this.close();
  }

  @HostListener('click', ['$event'])
  onClick($event: MouseEvent): void {
    if ($event.target !== this.elementRef.nativeElement) {
      return;
    }
    if (!this.closeOnBackdropClick) {
      return;
    }
    this.close();
    $event.stopPropagation();
    return;
  }

  ngOnDestroy(): void {
    this.close(true);
  }

  close(forced = false): void {
    if (this.closed) {
      return;
    }
    if (this.beforeClose && !forced) {
      let isPrevented = false;
      this.beforeClose({
        prevent: () => (isPrevented = true),
      });
      if (isPrevented) {
        return;
      }
    }
    this.closed = true;
    this.modalService.close();
  }
}
