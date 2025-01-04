import { Component, ContentChildren, Input, QueryList } from '@angular/core';
import { MessageType } from '@tl8/ui/message';
import { MessageGroupItemComponent } from '../message-group-item/message-group-item.component';

@Component({
  selector: 'tl8-message-group',
  templateUrl: './message-group.component.html',
  styleUrls: ['./message-group.component.sass'],
})
export class MessageGroupComponent {
  @Input() groupType: MessageType = 'info';
  @ContentChildren(MessageGroupItemComponent) items:
    | QueryList<MessageGroupItemComponent>
    | undefined;
}
