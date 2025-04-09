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

  @OneToOne(() => User, user => user.financialProfile)
  @JoinColumn()
  user: User;

  @Column('decimal', { precision: 10, scale: 2 })
  monthlyIncome: number;

  @Column({
    type: 'varchar',
    enum: IncomeFrequency,
    default: IncomeFrequency.MONTHLY
  })
  incomeFrequency: IncomeFrequency;

  @Column('decimal', { precision: 10, scale: 2 })
  monthlyExpenses: number;

  @Column('decimal', { precision: 10, scale: 2 })
  totalSavings: number;

  @Column('decimal', { precision: 10, scale: 2 })
  totalDebt: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  investmentBalance: number;

  @Column({
    type: 'varchar',
    enum: RiskTolerance,
    default: RiskTolerance.MODERATE
  })
  riskTolerance: RiskTolerance;

  @Column('simple-json', { nullable: true })
  financialGoals: {
    type: string;
    targetAmount: number;
    targetDate: Date;
    priority: number;
  }[];

  @Column('simple-json', { nullable: true })
  monthlyBudget: {
    category: string;
    amount: number;
    actual?: number;
  }[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 