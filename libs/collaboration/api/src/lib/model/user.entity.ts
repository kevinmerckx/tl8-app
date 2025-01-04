import {
  Entity,
  PrimaryKey,
  Property,
  SerializedPrimaryKey,
} from '@mikro-orm/core';
import { ObjectId } from '@mikro-orm/mongodb';

@Entity()
export class UserEntity {
  @PrimaryKey()
  _id: ObjectId;

  @SerializedPrimaryKey()
  id!: string;

  @Property({ nullable: false })
  name: string;

  @Property({ nullable: false })
  createdAt = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}
