import { Component, OnInit } from '@angular/core';
import { faArrowRight, faTimes } from '@fortawesome/free-solid-svg-icons';
import {
  MarkdownDialogInput,
  MarkdownDialogOutput,
} from '@tl8/extra-ui-interfaces';
import { ExtraUIAPI } from '@tl8/extra-ui/api';
import { BeforeCloseFn, ModalService } from '@tl8/extra-ui/modal';

@Component({
  selector: 'tl8-markdown-dialog',
  templateUrl: './markdown-dialog.component.html',
  styleUrls: ['./markdown-dialog.component.sass'],
})
export class MarkdownDialogComponent implements OnInit {
  key = '';
  value = '';
  preview: 'none' | 'markdown' = 'markdown';
  icons = {
    preview: faArrowRight,
    closePreview: faTimes,
  };
  get title(): string {
    return `Edit key "${this.key}"`;
  }

  beforeClose: BeforeCloseFn = (delegate) => {
    if (this.value === this.modal.input.value) {
      return;
    }
    if (
      window.confirm(
        'Closing this dialog would not save your changes. Are you sure you want to proceed?'
      )
    ) {
      return;
    }
    delegate.prevent();
  };

  constructor(
    private modal: ModalService<MarkdownDialogOutput, MarkdownDialogInput>
  ) {}

  ngOnInit(): void {
    this.key = this.modal.input.key;
    this.value = this.modal.input.value;
  }

  openExternal(link: string) {
    ExtraUIAPI().openExternalLink(link);
  }

  onSave() {
    this.modal.closeWithData({
      key: this.modal.input.key,
      lang: this.modal.input.lang,
      value: this.value,
    });
  }
}
