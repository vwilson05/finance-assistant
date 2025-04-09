import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { User } from './User';

export enum StrategyType {
  SAVINGS = 'savings',
  INVESTMENT = 'investment',
  DEBT_REDUCTION = 'debt_reduction',
  RETIREMENT = 'retirement',
  EMERGENCY_FUND = 'emergency_fund'
}

export enum StrategyStatus {
  ACTIVE = 'active',
  COMPLETED = 'completed',
  ABANDONED = 'abandoned'
}

@Entity('strategies')
export class Strategy {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  user: User;

  @Column({
    type: 'varchar',
    enum: StrategyType
  })
  type: StrategyType;

  @Column()
  name: string;

  @Column('text')
  description: string;

  @Column('simple-json')
  recommendations: {
    action: string;
    priority: number;
    timeframe: string;
    expectedImpact: string;
  }[];

  @Column('simple-json')
  milestones: {
    description: string;
    targetDate: Date;
    completed: boolean;
  }[];

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  targetAmount: number;

  @Column({ type: 'date', nullable: true })
  targetDate: Date;

  @Column({
    type: 'varchar',
    enum: StrategyStatus,
    default: StrategyStatus.ACTIVE
  })
  status: StrategyStatus;

  @Column('simple-json', { nullable: true })
  progress: {
    currentAmount: number;
    lastUpdated: Date;
    notes: string;
  };

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 