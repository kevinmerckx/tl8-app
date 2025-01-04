import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { UiMessageModule } from '@tl8/ui/message';
import { MessageGroupItemComponent } from './components/message-group-item/message-group-item.component';
import { MessageGroupComponent } from './components/message-group/message-group.component';

@NgModule({
  imports: [CommonModule, UiMessageModule],
  declarations: [MessageGroupComponent, MessageGroupItemComponent],
  exports: [MessageGroupComponent, MessageGroupItemComponent],
})
export class UiMessageGroupModule {}
