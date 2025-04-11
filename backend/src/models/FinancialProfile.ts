import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { User } from './User';

export enum IncomeFrequency {
  WEEKLY = 'weekly',
  BIWEEKLY = 'biweekly',
  MONTHLY = 'monthly',
  ANNUALLY = 'annually'
}

export enum RiskTolerance {
  LOW = 'low',
  MODERATE = 'moderate',
  HIGH = 'high'
}

@Entity('financial_profiles')
export class FinancialProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @OneToOne(() => User, user => user.financialProfile)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column('decimal', { precision: 15, scale: 2, default: 0 })
  netWorth: number;

  @Column('decimal', { precision: 15, scale: 2, default: 0 })
  monthlyIncome: number;

  @Column('decimal', { precision: 15, scale: 2, default: 0 })
  monthlyExpenses: number;

  @Column('decimal', { precision: 5, scale: 2, default: 0 })
  riskTolerance: number;

  @Column('integer', { default: 0 })
  investmentHorizon: number;

  @Column('decimal', { precision: 15, scale: 2, default: 0 })
  currentSavings: number;

  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updatedAt: Date;
} 