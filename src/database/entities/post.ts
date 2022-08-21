/* eslint-disable import/no-cycle */
import { Entity, Column, OneToMany } from 'typeorm';

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

  @Column('varchar', { length: 255 })
  email!: string;

  @Column('varchar', { length: 255 })
  phone!: string;

  @Column('varchar', { length: 255, nullable: true })
  password!: string;

  // Post:Image = 1:N
  @OneToMany(() => Image, (images) => images.post)
  images!: Image[];

  // Post:Comment = 1:N
  @OneToMany(() => Comment, (comments) => comments.post)
  comments!: Comment[];
}

export default Post;
