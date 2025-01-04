import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { MainFrameDataAccessService } from '@tl8/main-frame/editor/data-access-api';

@Component({
  selector: 'tl8-wysiwyg',
  templateUrl: './wysiwyg.component.html',
  styleUrls: ['./wysiwyg.component.sass'],
})
export class WysiwygComponent implements OnDestroy, AfterViewInit {
  isSideMenuVisible$ = this.mainFrameDataAccessService.isSideMenuVisible$;

  constructor(private mainFrameDataAccessService: MainFrameDataAccessService) {}

  ngAfterViewInit() {
    this.mainFrameDataAccessService.openTargetView();
  }

  ngOnDestroy() {
    this.mainFrameDataAccessService.closeTargetView();
  }
}
