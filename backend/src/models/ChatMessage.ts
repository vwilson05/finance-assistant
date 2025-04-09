import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
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

  @ManyToOne(() => User)
  user: User;

  @Column({
    type: 'varchar',
    enum: MessageRole
  })
  role: MessageRole;

  @Column('text')
  content: string;

  @Column('simple-json', { nullable: true })
  context: {
    relatedStrategy?: string;
    financialMetrics?: {
      metric: string;
      value: number;
    }[];
    userIntent?: string;
  };

  @Column('simple-json', { nullable: true })
  metadata: {
    tokens: number;
    processingTime: number;
    model: string;
  };

  @CreateDateColumn()
  createdAt: Date;
} 