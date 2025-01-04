import { Component } from '@angular/core';
import { MainFrameDataAccessService } from '@tl8/main-frame/editor/data-access-api';

@Component({
  selector: 'tl8-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.sass'],
})
export class EditorComponent {
  editorMode$ = this.mainFrameDataAccessService.editorMode$;

  constructor(private mainFrameDataAccessService: MainFrameDataAccessService) {}
}
