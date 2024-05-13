import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { IsEmail, Matches } from 'class-validator';


@Entity("User")
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({ length: 250 })
  username: string;

  @Column({ length: 100 })
  password: string;

  @Column({ length: 10 })
  confirm_pasword: string;

  @Column({ length: 30 })
  @IsEmail()
  email: string;

  @Column({ default: false })
  verified: boolean;
}