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

  @Column('float')
  riskTolerance: number;

  @Column('int')
  investmentHorizon: number;

  @Column('float')
  currentSavings: number;

  @Column('json')
  income: {
    salary: number;
    other: number;
  };

  @Column('json')
  expenses: {
    housing: number;
    transportation: number;
    food: number;
    utilities: number;
    other: number;
  };

  @Column('json')
  investments: {
    stocks: number;
    bonds: number;
    realEstate: number;
    other: number;
  };

  @Column('json')
  debt: {
    creditCards: number;
    loans: number;
    mortgage: number;
    other: number;
  };

  @Column('json')
  goals: {
    shortTerm: string[];
    mediumTerm: string[];
    longTerm: string[];
  };

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