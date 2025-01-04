import {
  Entity,
  PrimaryKey,
  Property,
  SerializedPrimaryKey,
} from '@mikro-orm/core';
import { ObjectId } from '@mikro-orm/mongodb';
import { Work } from '@tl8/api';

@Entity()
export class CollaborationEntity {
  @PrimaryKey()
  _id: ObjectId;

  @SerializedPrimaryKey()
  id!: string;

  @Property({ nullable: false })
  host: string;

  @Property({ nullable: false })
  work: {
    [lang: string]: Work[];
  };

  @Property({ nullable: false })
  createdAt = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}
