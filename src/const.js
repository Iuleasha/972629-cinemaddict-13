export const SortType = {
  DEFAULT: `default`,
  BY_DATE: `by-date`,
  BY_RATING: `by-rating`,
};

export const UserAction = {
  ADD_COMMENT: `UPDATE_MOVIE`,
  DELETE_COMMENT: `DELETE_COMMENT`,
  UPDATE_FILM: `UPDATE_FILM`,
};

export const FilterType = {
  STATISTIC: `alreadyWatched`,
  ALREADY_WATCHED: `alreadyWatched`,
  FAVORITE: `favorite`,
  WATCHLIST: `watchlist`,
  ALL: `all`,
};

export const ExtraType = {
  BY_RATING: `Top rated`,
  BY_COMMENTS: `Most commented`,
};

export const UpdateType = {
  PATCH: `PATCH`,
  MINOR: `MINOR`,
  MAJOR: `MAJOR`,
  INIT: `INIT`
};

export const StatisticsType = {
  ALL_TIME: `all-time`,
  TODAY: `day`,
  WEEK: `week`,
  MONTH: `month`,
  YEAR: `year`,
};

export const MenuItem = {
  FILMS: `FILMS`,
  STATISTICS: `STATISTICS`,
};

export const statisticsItems = [
  {
    type: StatisticsType.ALL_TIME,
    name: `All time`,
  },
  {
    type: StatisticsType.TODAY,
    name: `Today`,
  },
  {
    type: StatisticsType.WEEK,
    name: `Week`,
  },
  {
    type: StatisticsType.MONTH,
    name: `Month`,
  },
  {
    type: StatisticsType.YEAR,
    name: `Year`,
  },
];

export const FILM_RUNTIME_FORMAT = `H[h] m[m]`;
