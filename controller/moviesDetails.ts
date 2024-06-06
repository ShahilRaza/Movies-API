import { MovieDetails } from "../entity/moviedeteils";
import { Request, Response } from "express";
import {
  FindManyOptions,
  getRepository,
} from "typeorm";


export const CreateMoviesDetails = async (req: Request, res: Response) => {
  try {
    const {
      totalRating,
      releaseDate,
      releaseYear,
      directorName,
      actorName,
      coverImage,
      price,
      MovieId,
    } = req.body;
    const moviesDetailsRepository = getRepository(MovieDetails);
    const moviExiting = await moviesDetailsRepository.findOne({
      where: {
        MovieId: MovieId,
      },
    });
    if (!moviExiting) {
      const result = await moviesDetailsRepository.save({
        totalRating: totalRating,
        releaseDate: releaseDate,
        releaseYear: releaseYear,
        directorName: directorName,
        actorName: actorName,
        coverImage: coverImage,
        price: price,
        MovieId: MovieId,
      });
      res.status(201).json(result);
    } else {
      return res
        .status(409)
        .json({ message: "movie Allready exist this Movi Id" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const SortrmoviesDetails = async (req: Request, res: Response) => {
  try {
    const { sort } = req.query;
    const moviesDetailsRepository = getRepository(MovieDetails);
    let options: FindManyOptions<MovieDetails> = {};
    if (sort) {
      const sortFields = Array.isArray(sort) ? sort : [sort];
      const validData = ["totalRating", "price"];
      if (!sortFields.every((field) => validData.includes(field as string))) {
        return res.status(400).json({
          status: "Fail",
          message: "Invalid sort parameter",
        });
      }
      const orderOptions: { [field: string]: "ASC" | "DESC" } = {};
      sortFields.forEach((field) => {
        orderOptions[field as string] = "DESC";
      });
      options = {
        order: orderOptions,
      };
    }
    const sortedMovies = await moviesDetailsRepository.find(options);
    return res.status(200).json(sortedMovies);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "Fail",
      message: "Internal Server Error",
    });
  }
};

export const LimiteFieldmoviesDetails = async (req: Request, res: Response) => {
  try {
    const { fields } = req.query;
    const moviesDetailsRepository = getRepository(MovieDetails);
    if (!fields) {
      return res.status(400).json({
        status: "Fail",
        message: "Fields parameter is missing",
      });
    }
    const selectfields = typeof fields === "string" ? [fields] : fields;
    const selectOption: (keyof MovieDetails)[] =
      selectfields as (keyof MovieDetails)[];
    const options: FindManyOptions<MovieDetails> = {
      select: selectOption,
    };
    const movies = await moviesDetailsRepository.find(options);
    return res.status(200).json(movies);
  } catch (error) {
    console.error(error);
    res.status(404).json({
      status: "Fail",
      message: "Not Found",
    });
  }
};

export const paginationmoviesDetails = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const moviesDetailsRepository = getRepository(MovieDetails);
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
    const take = parseInt(limit as string);
    if (skip) {
      const countsmovies = await moviesDetailsRepository.count();
      if (skip >= countsmovies) {
        return res.status(404).json({
          status: "Fail",
          message: `Page not found`,
        });
      }
    }
    const movies = await moviesDetailsRepository.find({ skip, take });
    return res.status(200).json(movies);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "Fail",
      message: "Internal Server Error",
    });
  }
};

/// impliment aggregation pipe line for movidetais controller

export const AggregationPipelineforMovidetais = async (
  req: Request,
  res: Response
) => {
  try {
    const moviesDetailsRepository = getRepository(MovieDetails);
    const results = await moviesDetailsRepository
      .createQueryBuilder("movieDetails")
      .where("movieDetails.totalRating > :rating", { rating: parseFloat("4") })
      .select([
        "AVG(movieDetails.totalRating) as averageRating",
        "AVG(movieDetails.price) as averagePrice",
        "MIN(movieDetails.price) as minPrice",
        "MAX(movieDetails.price) as mxPrice",
        "SUM(movieDetails.price) as totalPrice",
      ])
      .groupBy("movieDetails.releaseYear")
      .addOrderBy(" averageRating", "ASC")
      .getRawMany();
    return res.status(200).json({
      status: "Success",
      data: { results },
    });
  } catch (error) {
    console.error("Error executing query:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getmoviesbygenre = async (req: Request, res: Response) => {
  try {
    const genre = req.params.genre;
    const moviesDetailsRepository = getRepository(MovieDetails);
    const result = await moviesDetailsRepository
      .createQueryBuilder("movieDetails")
      .leftJoinAndSelect("movieDetails.movie", "movie")
      .where("movie.genre = :genre", { genre })
      .addSelect(["movie.id", "movie.title", "movie.genre"])
      .addSelect([
        "movieDetails.totalRating",
        "movieDetails.releaseDate",
        "movieDetails.releaseYear",
      ])
      .addSelect([
        "movieDetails.directorName",
        "movieDetails.actorName",
        "movieDetails.coverImage",
        "movieDetails.price",
      ])
      .getMany();
    return res.status(200).json({
      status: "Success",
      data: { result },
    });
  } catch (error) {
    console.error("Error executing query:", error);
  }
};
