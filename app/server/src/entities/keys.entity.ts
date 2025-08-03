import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'keys' })
export class Keys {
  @PrimaryColumn({ type: 'varchar', length: 50 })
  key: string;

  @Column({ type: 'bigint', default: 0 })
  count: number;
}
