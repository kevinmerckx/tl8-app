import { EntityManager } from '@mikro-orm/core';
import { Injectable, NotFoundException } from '@nestjs/common';
import {
  ActiveTranslations,
  ActiveUsers,
  Author,
  Collaboration,
  Work,
} from '@tl8/api';
import {
  ChangeTranslationMessage,
  CreateCollaborationPayload,
  CreateCollaborationUserPayload,
  UserFocusedOnTranslationParams,
} from '@tl8/collaboration/interfaces';
import { CollaborationEntity } from '../model/collaboration.entity';
import { UserEntity } from '../model/user.entity';

@Injectable()
export class CollaborationService {
  constructor(private entityManager: EntityManager) {}

  private activeUsers: Record<Collaboration['id'], ActiveUsers> = {};
  private activeTranslations: Record<Collaboration['id'], ActiveTranslations> =
    {};

  async createUser(body: CreateCollaborationUserPayload) {
    const user = new UserEntity();
    user.name = body.name;
    await this.entityManager.persistAndFlush(user);
    return user;
  }

  async getOne(collaborationId: Collaboration['id']): Promise<Collaboration> {
    const result = await this.entityManager.findOne(
      CollaborationEntity,
      collaborationId
    );
    if (!result) {
      throw new NotFoundException('Collaboration not found');
    }
    return result;
  }

  async create(body: CreateCollaborationPayload) {
    const newCollaboration = new CollaborationEntity();
    newCollaboration.host = body.host;
    newCollaboration.work = Object.entries(
      body.webAppOverwrittenTranslations
    ).reduce((prev, [lang, langTranslations]) => {
      return {
        ...prev,
        [lang]: Object.entries(langTranslations).map(([key, value]) => ({
          key,
          history: [
            {
              value,
              comments: [],
            },
          ],
        })),
      };
    }, {});
    await this.entityManager.persistAndFlush(newCollaboration);
    return newCollaboration;
  }

  async addActiveUserOnTranslation(
    collaborationId: Collaboration['id'],
    author: Author,
    params: UserFocusedOnTranslationParams
  ) {
    this.activeTranslations[collaborationId] = [
      ...(this.activeTranslations[collaborationId] || []).filter(
        (t) =>
          !(
            t.author.userId === author.userId &&
            t.key === params.key &&
            t.lang === params.lang
          )
      ),
      {
        author,
        key: params.key,
        lang: params.lang,
      },
    ];
  }

  async removeActiveUserFromTranslation(
    collaborationId: Collaboration['id'],
    author: Author,
    params: UserFocusedOnTranslationParams
  ) {
    this.activeTranslations[collaborationId] = (
      this.activeTranslations[collaborationId] || []
    ).filter(
      (t) =>
        !(
          t.author.userId === author.userId &&
          t.key === params.key &&
          t.lang === params.lang
        )
    );
  }

  async getActiveUsersOfCollaboration(collaborationId: Collaboration['id']) {
    return this.activeUsers[collaborationId] || [];
  }

  async getActiveTranslationsOfCollaboration(
    collaborationId: Collaboration['id']
  ) {
    return this.activeTranslations[collaborationId] || [];
  }

  async addActiveUser(collaborationId: Collaboration['id'], user: Author) {
    this.activeUsers[collaborationId] = [
      ...(this.activeUsers[collaborationId] || []).filter(
        (u) => u.userId !== user.userId
      ),
      {
        name: user.name,
        userId: user.userId,
      },
    ];
  }

  async removeActiveUser(collaborationId: Collaboration['id'], userId: string) {
    this.activeUsers[collaborationId] = (
      this.activeUsers[collaborationId] || []
    ).filter((u) => u.userId !== userId);
  }

  async removeUserFromAllActivities(
    collaborationId: Collaboration['id'],
    userId: string
  ) {
    await this.removeActiveUser(collaborationId, userId);
    this.activeTranslations[collaborationId] = (
      this.activeTranslations[collaborationId] || []
    ).filter((t) => t.author.userId !== userId);
  }

  async changeTranslation(
    collaborationId: Collaboration['id'],
    message: ChangeTranslationMessage
  ) {
    await this.findOneOrFailAndStartTransactional(
      collaborationId,
      async (collaboration, entityManager) => {
        let inLangWork = collaboration.work[message.params.lang] || [];
        const workItem = {
          value: message.params.value,
          author: message.author,
          comments: [],
        };
        const existingItem = inLangWork.find(
          ({ key }) => message.params.key === key
        );
        if (existingItem) {
          inLangWork = inLangWork.map((item) =>
            item !== existingItem
              ? item
              : {
                  ...item,
                  history: compactHistory([workItem, ...item.history]),
                }
          );
        } else {
          inLangWork = [
            ...inLangWork,
            { key: message.params.key, history: [workItem] },
          ];
        }
        collaboration.work = {
          ...collaboration.work,
          [message.params.lang]: inLangWork,
        };
        entityManager.persist(collaboration);
      }
    );
  }

  private async findOneOrFailAndStartTransactional(
    collaborationId: Collaboration['id'],
    cb: (
      collaboration: CollaborationEntity,
      entityManager: EntityManager
    ) => Promise<void>
  ) {
    return this.entityManager.transactional(async (entityManager) => {
      const collaboration = await entityManager.findOne(
        CollaborationEntity,
        collaborationId
      );
      if (!collaboration) {
        throw new NotFoundException();
      }
      await cb(collaboration, entityManager);
    });
  }
}

function compactHistory(history: Work['history']) {
  const result: Work['history'] = [history[0]];
  history.slice(1).forEach((workItem) => {
    const lastStored = result[result.length - 1];
    if (lastStored.author?.userId === workItem.author?.userId) {
      return;
    }
    result.push(workItem);
  });
  return result;
}
