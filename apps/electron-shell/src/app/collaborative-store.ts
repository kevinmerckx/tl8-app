import {
  ActiveTranslations,
  ActiveUsers,
  Author,
  ChangeTranslationParams,
  Collaboration,
} from '@tl8/api';
import {
  ActiveTranslationsMessage,
  ActiveUsersMessage,
  ChangeTranslationMessage,
  PresenceMessage,
  TranslationChangedMessage,
  UserFocusedOnTranslationMessage,
  UserFocusedOnTranslationParams,
} from '@tl8/collaboration/interfaces';
import { io } from 'socket.io-client';
import { WebAppOverwrittenTranslations } from 'tl8';
import { environment } from '../environments/environment';

export class CollaborativeStore {
  private socket = io(environment.apiUrl);
  activeUsers: ActiveUsers = [];
  activeTranslations: ActiveTranslations = [];

  get collaboration() {
    return this._collaboration;
  }

  constructor(
    private _collaboration: Collaboration,
    private events: {
      onTranslationChanged: (message: TranslationChangedMessage) => void;
      onActiveUsersChanged: (message: ActiveUsersMessage) => void;
      onActiveTranslationsChanged: (message: ActiveTranslationsMessage) => void;
      onConnectionStatus: (status: 'connected' | 'disconnected') => void;
    }
  ) {}

  destroy() {
    this.socket.disconnect();
  }

  connectAsUser(user: Author) {
    let resolvedOnce = false;
    return new Promise<void>((resolve) => {
      this.socket.connect();

      this.socket.on('connect', () => {
        this.events.onConnectionStatus('connected');
        this.socket.emit('presence', {
          collaborationId: this._collaboration.id,
          author: user,
        } as PresenceMessage);
      });

      this.socket.on('disconnect', () => {
        this.events.onConnectionStatus('disconnected');
      });

      this.socket.on('activeUsers', (message: ActiveUsersMessage) => {
        this.activeUsers = message.activeUsers;
        this.events.onActiveUsersChanged(message);
      });

      this.socket.on(
        'activeTranslations',
        (message: ActiveTranslationsMessage) => {
          this.activeTranslations = message.activeTranslations;
          this.events.onActiveTranslationsChanged(message);
        }
      );

      this.socket.on('collaboration', (data: Collaboration) => {
        // We get the current state of the collaboration, should happen when connecting
        this._collaboration = data;
        if (!resolvedOnce) {
          resolvedOnce = true;
          resolve();
        }
      });

      this.socket.on(
        'translationChanged',
        (data: TranslationChangedMessage) => {
          this.handleTranslationChanged(data);
        }
      );
    });
  }

  getOverwrittenTranslationsForLocation(): WebAppOverwrittenTranslations {
    return Object.entries(this._collaboration.work).reduce(
      (prev, [lang, langTranslations]) => {
        return {
          ...prev,
          [lang]: langTranslations.reduce(
            (prev2, { key, history: [currentItem] }) => {
              return {
                ...prev2,
                [key]: currentItem.value,
              };
            },
            {}
          ),
        };
      },
      {} as WebAppOverwrittenTranslations
    );
  }

  changeTranslationForLocation(
    params: ChangeTranslationParams,
    author: Author
  ) {
    this.insertChange(params, author);
    const message: ChangeTranslationMessage = { params, author };
    this.socket.emit('changeTranslation', message);
  }

  removeFromActiveTranslation(
    author: Author,
    params: UserFocusedOnTranslationParams
  ) {
    const message: UserFocusedOnTranslationMessage = {
      author,
      params,
    };
    this.socket.emit('removeActiveUserFromTranslation', message);
  }

  addToActiveTranslation(
    author: Author,
    params: UserFocusedOnTranslationParams
  ) {
    const message: UserFocusedOnTranslationMessage = {
      author,
      params,
    };
    this.socket.emit('addActiveUserOnTranslation', message);
  }

  private insertChange(params: ChangeTranslationParams, author: Author) {
    let inLangWork = this._collaboration.work[params.lang] || [];
    const workItem = {
      value: params.value,
      author,
      comments: [],
    };
    const existingItem = inLangWork.find(({ key }) => params.key === key);
    if (existingItem) {
      inLangWork = inLangWork.map((item) =>
        item !== existingItem
          ? item
          : {
              ...item,
              history: [workItem, ...item.history],
            }
      );
    } else {
      inLangWork = [...inLangWork, { key: params.key, history: [workItem] }];
    }
    this._collaboration = {
      ...this._collaboration,
      work: {
        ...this._collaboration.work,
        [params.lang]: inLangWork,
      },
    };
  }

  private handleTranslationChanged(message: TranslationChangedMessage) {
    this._collaboration = {
      ...this._collaboration,
      work: message.currentWork,
    };
    this.events.onTranslationChanged(message);
  }
}
