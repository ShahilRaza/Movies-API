import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from "typeorm";
import { MovieDetails } from "./moviedeteils";

@Entity("Movies")
export class Movie {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ length: 100, nullable: true })
  createdBy: string;

  @Column({ length: 250 })
  title: string;

  @Column({ length: 100 })
  name: string;

  @Column({ type: "int" })
  duration: number;

  @Column({ type: "int" })
  rating: number;

  @Column({ type: "text" })
  description: string;

  @OneToOne(() => MovieDetails, (details) => details.movie, { cascade: true })
  details: MovieDetails;
}
