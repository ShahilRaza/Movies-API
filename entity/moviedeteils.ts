import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { Movie } from "./movies";

@Entity("MovieDetails")
export class MovieDetails {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "int" })
  totalRating: number;

  @Column({ type: "uuid", unique: true })
  MovieId: string;

  @Column({ type: "date" })
  releaseDate: Date;

  @Column({ type: "int" })
  releaseYear: number;

  @Column({ length: 100 })
  directorName: string;

  @Column({ length: 100 })
  actorName: string;

  @Column({ length: 255 })
  coverImage: string;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  price: number;

  @OneToOne(() => Movie, (movie) => movie.details, { onDelete: "CASCADE" })
  movie: Movie;
}
