import { Injectable } from '@nestjs/common';
import * as Store from 'electron-store';

@Injectable()
export class UserStoreManager {
  private electronStore = new Store<{
    user: undefined | { name: string; userId: string };
  }>();

  getUser() {
    return this.electronStore.get('user', undefined);
  }

  setUser(user: { name: string; userId: string }) {
    this.electronStore.set('user', user);
  }

  clearUser() {
    this.electronStore.delete('user');
  }
}
