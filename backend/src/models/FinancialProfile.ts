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
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  monthlyIncome: number;

  @Column({
    type: 'varchar',
    enum: IncomeFrequency,
    default: IncomeFrequency.MONTHLY
  })
  incomeFrequency: IncomeFrequency;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  monthlyExpenses: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  totalSavings: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  totalDebt: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  investmentBalance: number;

  @Column({
    type: 'varchar',
    enum: RiskTolerance,
    default: RiskTolerance.MODERATE
  })
  riskTolerance: RiskTolerance;

  @Column('int', { default: 10 })
  investmentHorizon: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  currentSavings: number;

  @Column('json', { default: '{"salary": 0, "other": 0}' })
  income: {
    salary: number;
    other: number;
  };

  @Column('json', { default: '{"housing": 0, "transportation": 0, "food": 0, "utilities": 0, "other": 0}' })
  expenses: {
    housing: number;
    transportation: number;
    food: number;
    utilities: number;
    other: number;
  };

  @Column('json', { default: '{"stocks": 0, "bonds": 0, "realEstate": 0, "other": 0}' })
  investments: {
    stocks: number;
    bonds: number;
    realEstate: number;
    other: number;
  };

  @Column('json', { default: '{"creditCards": 0, "loans": 0, "mortgage": 0, "other": 0}' })
  debt: {
    creditCards: number;
    loans: number;
    mortgage: number;
    other: number;
  };

  @Column('json', { default: '{"shortTerm": [], "mediumTerm": [], "longTerm": []}' })
  goals: {
    shortTerm: string[];
    mediumTerm: string[];
    longTerm: string[];
  };

  @Column('simple-json', { nullable: true, default: '[]' })
  financialGoals: {
    type: string;
    targetAmount: number;
    targetDate: Date;
    priority: number;
  }[];

  @Column('simple-json', { nullable: true, default: '[]' })
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