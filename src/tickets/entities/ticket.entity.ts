import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { User } from '../../users/entities/user.entity';
import { TransportType } from '../enums/transport-type.enum';
import { VerificationStatus } from '../enums/verification-status.enum';

@Entity('tickets')
export class Ticket {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  from: string;

  @Column()
  to: string;

  @Column({
    type: 'enum',
    enum: TransportType,
  })
  transportType: TransportType;

  @Column('decimal')
  price: number;

  @Column()
  quantity: number;

  @Column()
  departureDateTime: Date;

  @Column('simple-array')
  perks: string[];

  @Column()
  image: string;

  @Column({
    type: 'enum',
    enum: VerificationStatus,
    default: VerificationStatus.PENDING,
  })
  verificationStatus: VerificationStatus;

  @Column({
    default: false,
  })
  isAdvertised: boolean;

  @ManyToOne(() => User, {
    eager: true,
  })
  vendor: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}