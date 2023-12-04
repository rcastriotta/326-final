import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

class MovieDB {
  constructor() {
    this.baseURL = "https://api.themoviedb.org/3/movie";
    this.commonHeaders = {
      accept: "application/json",
      Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
    };
  }

  async fetchMovies(type) {
    try {
      const url = `${this.baseURL}/${type}?language=en-US&page=1`;
      const response = await axios.get(url, { headers: this.commonHeaders });
      return response.data.results.map((movie) => ({
        ...movie,
        poster_url: `https://image.tmdb.org/t/p/w220_and_h330_face${movie.poster_path}`,
      }));
    } catch (error) {
      throw new Error("Error fetching movies");
    }
  }

  async getPopularMovies() {
    return this.fetchMovies("popular");
  }

  async getNowPlayingMovies() {
    return this.fetchMovies("now_playing");
  }

  async getTopRatedMovies() {
    return this.fetchMovies("top_rated");
  }

  async getUpcomingMovies() {
    return this.fetchMovies("upcoming");
  }
}
const movieDB = new MovieDB();

export { movieDB };
