export class PersistanceManager {
  constructor() {
    this.movieListSize = 0;
    this.tvListSize = 0;
  }

  persistMovies(newData) {
    localStorage.setItem("movieList", JSON.stringify(newData));
    this.movieListSize = newData.length;
  }

  getPersistedMovies() {
    const stored = JSON.parse(localStorage.getItem("movieList") || "[]");
    this.movieListSize = stored.length;
    return stored;
  }

  persistTV(newData) {
    localStorage.setItem("tvList", JSON.stringify(newData));
    this.tvListSize = newData.length;
  }

  getPersistedTV() {
    const stored = JSON.parse(localStorage.getItem("tvList") || "[]");
    this.tvListSize = stored.length;
    return stored;
  }
}
