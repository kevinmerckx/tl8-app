import { Component, Input } from '@angular/core';
import { Author } from '@tl8/api';

@Component({
  selector: 'tl8-user-badge',
  templateUrl: './user-badge.component.html',
  styleUrls: ['./user-badge.component.sass'],
})
export class UserBadgeComponent {
  @Input() user!: Author;

  getInitials(name: string) {
    return name.charAt(0).toLowerCase();
  }
}
