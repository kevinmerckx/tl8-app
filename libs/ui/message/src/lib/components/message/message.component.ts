import {
  ChangeDetectionStrategy,
  Component,
  Input,
  TemplateRef,
} from '@angular/core';
import {
  faCheckCircle,
  faExclamationCircle,
  faExclamationTriangle,
  faInfoCircle,
  IconDefinition,
} from '@fortawesome/free-solid-svg-icons';

export type MessageType = 'info' | 'warning' | 'success' | 'danger';

type SwitchMessageType<T> = Record<MessageType, T>;

@Component({
  selector: 'tl8-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessageComponent {
  @Input() messageType: MessageType = 'info';
  @Input() actionTemplate: TemplateRef<unknown> | null = null;

  icons: SwitchMessageType<IconDefinition> = {
    info: faInfoCircle,
    warning: faExclamationTriangle,
    success: faCheckCircle,
    danger: faExclamationCircle,
  };

  get alertClass() {
    return 'alert alert-' + this.messageType;
  }
}
