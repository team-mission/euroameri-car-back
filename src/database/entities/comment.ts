/* eslint-disable import/no-cycle */
import { Entity, ManyToOne, Column, JoinColumn } from 'typeorm';

import BasicEntity from './basic-entity';
import Post from './post';

@Entity()
class Comment extends BasicEntity {
  @Column('text')
  content!: string;

  // Comment:Post = N:1
  @ManyToOne(() => Post, (post) => post.comments)
  @JoinColumn({
    name: 'post_id',
  })
  post!: Post;
}

export default Comment;
