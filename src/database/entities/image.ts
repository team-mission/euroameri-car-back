/* eslint-disable import/no-cycle */
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';

import BasicEntity from './basic-entity';
import Post from './post';

@Entity()
class Image extends BasicEntity {
  @Column('varchar', { length: 255 })
  src!: string;

  // Image:Post = N:1
  @ManyToOne(() => Post, (post) => post.images, { onDelete: 'CASCADE' })
  @JoinColumn({
    name: 'post_id',
  })
  post!: Post;
}

export default Image;
