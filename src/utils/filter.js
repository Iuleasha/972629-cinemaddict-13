import {FilterType} from "../const";

export const filter = {
  [FilterType.ALL]: (films) => films,
  [FilterType.WATCHLIST]: (films) => films.filter((film) => film.userDetails.watchlist),
  [FilterType.FAVORITE]: (films) => films.filter((film) => film.userDetails.favorite),
  [FilterType.ALREADY_WATCHED]: (films) => films.filter((film) => film.userDetails.alreadyWatched),
};
