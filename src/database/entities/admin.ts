/* eslint-disable import/no-cycle */
import { Entity, Column } from 'typeorm';

import BasicEntity from './basic-entity';

@Entity()
class Admin extends BasicEntity {
  @Column('varchar', { length: 255 })
  uid!: string;

  @Column('varchar', { length: 255 })
  password!: string;
}

export default Admin;
