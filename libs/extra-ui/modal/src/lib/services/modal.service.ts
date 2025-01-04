import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ExtraUIAPI } from '@tl8/extra-ui/api';

@Injectable({
  providedIn: 'root',
})
export class ModalService<OutputType = unknown, InputType = unknown> {
  input!: InputType;

  constructor(private router: Router) {}

  closeWithData(output: OutputType): void {
    ExtraUIAPI().closeModal(output);
    this.router.navigate(['/']);
  }

  close() {
    ExtraUIAPI().closeModal();
    this.router.navigate(['/']);
  }

  declareReady() {
    ExtraUIAPI().modalReady();
  }
}
