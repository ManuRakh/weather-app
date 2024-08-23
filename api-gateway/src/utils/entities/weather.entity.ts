import { Entity, Column, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity()
@Unique(["city"])
export class Weather {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  city: string;

  @Column()
  date: string;

  @Column()
  temperature: number;

  @Column()
  condition: string;
}
