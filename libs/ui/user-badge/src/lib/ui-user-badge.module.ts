import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserBadgeComponent } from './components/user-badge/user-badge.component';
import { ClrTooltipModule } from '@clr/angular';

@NgModule({
  imports: [CommonModule, ClrTooltipModule],
  declarations: [UserBadgeComponent],
  exports: [UserBadgeComponent],
})
export class UiUserBadgeModule {}
