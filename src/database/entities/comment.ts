/* eslint-disable import/no-cycle */
import {
  Entity,
  ManyToOne,
  Column,
  JoinColumn,
  DeleteDateColumn,
} from 'typeorm';

import BasicEntity from './basic-entity';
import Post from './post';

@Entity()
class Comment extends BasicEntity {
  @Column('text')
  content!: string;

  // Comment:Post = N:1
  @ManyToOne(() => Post, (post) => post.comments, { onDelete: 'CASCADE' })
  @JoinColumn({
    name: 'post_id',
  })
  post!: Post;

  // 삭제된 날짜 (기본: Null)
  @DeleteDateColumn({ name: 'deleted_at', select: false })
  deletedDate!: Date;
}

export default Comment;
