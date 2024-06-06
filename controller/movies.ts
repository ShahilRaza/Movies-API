import { Movie } from "../entity/movies";
import { NextFunction, Request, Response, query } from "express";
import { getRepository } from "typeorm";
import { CustomErrorHanding } from "../CustomError/CustomError";
import { asgnErrorHandling } from "../AsynError/asynError";

export const CreateMovies = asgnErrorHandling(
  async (req: Request, res: Response, next: NextFunction) => {
    const { title, name, duration, rating, description } = req.body;
    const moviesRepository = getRepository(Movie);
    const existingMovie = await moviesRepository.findOne({
      where: { name: name },
    });
    if (!existingMovie) {
      const newMovieData = {
        title: title,
        name: name,
        duration: duration,
        rating: rating,
        description: description,
      };
      const newMovie = moviesRepository.create(newMovieData);
      const result = await moviesRepository.save(newMovie);
      res.status(201).json(result);
    } else {
      const error = new CustomErrorHanding("Movie already exists", 409);
      next(error);
    }
  }
);

export const GetAllMovies = asgnErrorHandling(
  async (req: Request, res: Response, next: NextFunction) => {
    const moviesRepository = getRepository(Movie);
    const getAllmovies = await moviesRepository.find();
    res.status(200).json({
      data: getAllmovies,
      count: getAllmovies.length,
    });
    if (!getAllmovies) {
      const error = new CustomErrorHanding("No movie found", 404);
      next(error);
    } else {
      return getAllmovies;
    }
  }
);

export const GetbyIdMovies = asgnErrorHandling(
  async (req: Request, res: Response, next: NextFunction) => {
    const movieId = req.params.id;
    const moviesRepository = getRepository(Movie);
    const getAllmovies = await moviesRepository.findOne({
      where: {
        id: movieId,
      },
    });
    if (!getAllmovies) {
      const error = new CustomErrorHanding("not found", 404);
      next(error);
    } else {
      res.status(200).json(getAllmovies);
    }
  }
);

export const DeletebyIdMovies = asgnErrorHandling(
  async (req: Request, res: Response, next: NextFunction) => {
    const movieId = req.params.id;
    const moviesRepository = getRepository(Movie);
    const movie = await moviesRepository.findOneBy({ id: movieId });
    if (!movie) {
      const error = new CustomErrorHanding("not found", 404);
      next(error);
    } else {
      await moviesRepository.remove(movie);
      res
        .status(200)
        .json({ message: `Movie with id ${movieId} deleted successfully` });
    }
  }
);

export const updateMovies = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const movieId = req.params.id;
  const updatedata = req.body;
  const { title, name, duration, rating, description } = req.body;
  const moviesRepository = getRepository(Movie);
  const checkMovieExist = await moviesRepository.findOne({
    where: { id: movieId },
  });
  if (!checkMovieExist) {
    const error = new CustomErrorHanding("not found", 404);
    return next(error);
  } else {
    const newData = await moviesRepository.update(movieId, {
      title,
      name,
      duration,
      rating,
      description,
    });
    const data = { ...newData.raw };
    res.status(201).json({
      message: "Update Successfully",
    });
  }
};

export const searchmovies = async (req: Request, res: Response) => {
  try {
    const { duration, rating } = req.query;
    const parsedDuration = parseInt(String(duration), 10);
    const parsedRating = parseInt(String(rating), 10);
    const moviesRepository = getRepository(Movie);
    const movie = await moviesRepository.findOne({
      where: {
        duration: parsedDuration,
        rating: parsedRating,
      },
    });
    if (movie) {
      res.status(200).json(movie);
    } else {
      res.status(404).json({
        status: "Fail",
        message: "Movie not found",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "Error",
      message: "Internal Server Error",
    });
  }
};

export const filtermovies = async (req: Request, res: Response) => {
  try {
    const excludedFields = ["sort", "page", "limit"];
    const queryObject = { ...req.query };
    const { duration, rating } = queryObject;
    excludedFields.forEach((field) => delete queryObject[field]);
    const moviesRepository = getRepository(Movie);
  } catch (error) {
    const err = new CustomErrorHanding(error.message, error.statusCode || 500);
    return res
      .status(err.statusCode)
      .json({ status: err.status, message: err.message });
  }
};
