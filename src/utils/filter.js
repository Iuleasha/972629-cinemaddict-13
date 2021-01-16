import {FilterType} from "../const";

export const filter = {
  [FilterType.ALL]: (movies) => movies,
  [FilterType.WATCHLIST]: (movies) => movies.filter((movie) => movie.watchlist),
  [FilterType.FAVORITE]: (movies) => movies.filter((movie) => movie.favorite),
  [FilterType.WATCHED]: (movies) => movies.filter((movie) => movie.watched),
};
