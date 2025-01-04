import { AfterViewInit, Directive, ElementRef, OnDestroy } from '@angular/core';
import { MainFrameApi } from '@tl8/main-frame/webview-api';

@Directive({
  selector: '[tl8BrowserViewPlaceholder]',
})
export class BrowserViewPlaceholderDirective
  implements AfterViewInit, OnDestroy
{
  private resizeObserver = new ResizeObserver(() => {
    const bounds = this.elementRef.nativeElement.getBoundingClientRect();
    MainFrameApi().triggerResize({
      height: bounds.height,
      width: bounds.width,
      x: bounds.x,
      y: bounds.y,
    });
  });

  constructor(private elementRef: ElementRef<HTMLElement>) {}

  ngAfterViewInit(): void {
    this.resizeObserver.observe(this.elementRef.nativeElement);
  }

  ngOnDestroy(): void {
    this.resizeObserver.disconnect();
  }
}
