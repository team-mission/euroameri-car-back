/* eslint-disable import/no-cycle */
import { Entity, Column, OneToMany, DeleteDateColumn } from 'typeorm';

import BasicEntity from './basic-entity';
import Image from './image';
import Comment from './comment';

@Entity()
class Post extends BasicEntity {
  @Column('varchar', { length: 255 })
  title!: string;

  @Column('text')
  content!: string;

  @Column('varchar', { length: 30 })
  name!: string;

  @Column('varchar', { length: 255, select: false })
  email!: string;

  @Column('varchar', { length: 255, select: false })
  phone!: string;

  @Column('varchar', { length: 255, nullable: true, select: false })
  password!: string;

  @Column('bool', { default: false })
  secret!: boolean;

  // Post:Image = 1:N
  @OneToMany(() => Image, (images) => images.post)
  images!: Image[];

  // Post:Comment = 1:N
  @OneToMany(() => Comment, (comments) => comments.post)
  comments!: Comment[];

  // 삭제된 날짜 (기본: Null)
  @DeleteDateColumn({ name: 'deleted_at', select: false })
  deletedDate!: Date;
}

export default Post;
