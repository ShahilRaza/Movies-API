const express = require("express");
import {
  SortmoviesMiddlewareDetails,
  formDataValidatorMiddleware,
  handleValidationErrors,
  protectRoute,
  userLogin,
  userRegistrationFormMiddleware,
} from "../controller/middlewareRouteHandler";
import { UserSigup, UserVerified, loginUser } from "../controller/User";
import {
  CreateMovies,
  DeletebyIdMovies,
  GetAllMovies,
  GetbyIdMovies,
  filtermovies,
  searchmovies,
  updateMovies,
} from "../controller/movies";
import {
  AggregationPipelineforMovidetais,
  CreateMoviesDetails,
  LimiteFieldmoviesDetails,
  SortrmoviesDetails,
  getmoviesbygenre,
  paginationmoviesDetails,
} from "../controller/moviesDetails";

const router = express.Router();
router
  .route("/userRegiser")
  .post(userRegistrationFormMiddleware, handleValidationErrors, UserSigup);
router.route("/userlogin").post(userLogin, handleValidationErrors, loginUser);
router.route("/userVerified").post(UserVerified);
router
  .route("/createMovies")
  .post(formDataValidatorMiddleware, handleValidationErrors, CreateMovies);
router.route("/getallmovies").get(protectRoute, GetAllMovies);
router.route("/getbyIdmovies/:id").get(protectRoute, GetbyIdMovies);
router.route("/deletebyIdmovies/:id").delete(protectRoute, DeletebyIdMovies);
router.route("/upadatedmovies/:id").put(protectRoute, updateMovies);
router.route("/searchmovies/").get(protectRoute, searchmovies);
router.route("/filtermovies/").get(protectRoute, filtermovies);

///# CreateMoviesDetails Routers
router.route("/createmoviesdetails").post(CreateMoviesDetails);
router.route("/sortmoviesdetails/").get(SortrmoviesDetails);
router.route("/limitefieldsmoviesdetails/").get(LimiteFieldmoviesDetails);
router.route("/paginationmoviesdetails/").get(paginationmoviesDetails);
router
  .route("/aggregationpipelineformovidetais/")
  .get(AggregationPipelineforMovidetais);
router.route("/getmoviesbygenre/").get(getmoviesbygenre);

module.exports = router;
