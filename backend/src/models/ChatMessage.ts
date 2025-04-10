import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User';

export enum MessageRole {
  USER = 'user',
  ASSISTANT = 'assistant',
  SYSTEM = 'system'
}

@Entity('chat_messages')
export class ChatMessage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, user => user.messages)
  @JoinColumn()
  user: User;

  @Column('text')
  content: string;

  @Column({
    type: 'varchar',
    enum: MessageRole,
    default: MessageRole.USER
  })
  role: MessageRole;

  @Column('simple-json', { nullable: true })
  context?: {
    relatedStrategy?: string;
    financialMetrics?: {
      metric: string;
      value: number;
    }[];
    userIntent?: string;
    emotionalState?: string;
  };

  @Column('simple-json', { nullable: true })
  metadata?: {
    tokens: number;
    processingTime: number;
    model: string;
  };

  @CreateDateColumn()
  createdAt: Date;
} 