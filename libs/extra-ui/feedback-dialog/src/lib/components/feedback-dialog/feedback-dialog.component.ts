import { Component, Inject } from '@angular/core';
import { faPaypal } from '@fortawesome/free-brands-svg-icons';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { ExtraUIAPI } from '@tl8/extra-ui/api';
import { FeedbackDialogConfiguration } from '../../feedback-dialog-configuration';
import { FEEDBACK_DIALOG_CONFIGURATION } from '../../feedback-dialog-configuration.token';

@Component({
  selector: 'tl8-feedback-dialog',
  templateUrl: './feedback-dialog.component.html',
  styleUrls: ['./feedback-dialog.component.sass'],
})
export class FeedbackDialogComponent {
  icons = {
    paypal: faPaypal,
    star: faStar,
  };

  constructor(
    @Inject(FEEDBACK_DIALOG_CONFIGURATION)
    private configuration: FeedbackDialogConfiguration
  ) {}
  donate(): void {
    ExtraUIAPI().openExternalLink(this.configuration.paypalDonationUrl);
  }

  feedback(): void {
    ExtraUIAPI().openExternalLink(this.configuration.feedbackFormUrl);
  }
}
