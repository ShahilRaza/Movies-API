import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { IsEmail, Matches } from "class-validator";
import { Exclude } from "class-transformer";



export enum UserRole {
  ADMIN = 'admin',
  SUPER_ADMIN = 'superAdmin',
  USER = 'user',
}


@Entity("User")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ length: 250 })
  username: string;

  @Column({ length: 100 })
  password: string;

  @Column({ length: 100 })
  @Exclude()
  confirm_pasword: string;

  @Column({ length: 30 })
  @IsEmail()
  email: string;

  @Column({ type: "bytea", nullable: true })
  photo: Buffer;

  @Column({
    type: "enum",
    enum: UserRole,
    default: UserRole.USER,
    nullable: false,
  })
  role: UserRole;

 
  @Column({ default: false })
  verified: boolean;
}
