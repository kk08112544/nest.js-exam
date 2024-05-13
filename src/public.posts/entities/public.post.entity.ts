import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()

export class Post {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({type:'text'})
    title: string;

    @Column({type:'text', nullable: true})
    content: string;

    @Column({type: 'boolean', default: false})
    published: boolean;

    @Column({type:'integer', default: 0})
    view_count: number;

    @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    updated_at: Date;

}
