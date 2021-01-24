import dayjs from 'dayjs';
import objectSupport from "dayjs/plugin/objectSupport";
import {FILM_RUNTIME_FORMAT, StatisticsType} from "../const";

export const formatDate = (date, format) => {
  return dayjs(date).format(format);
};

export const updateItem = (items, update) => {
  const index = items.findIndex((item) => item.id === update.id);

  if (index === -1) {
    return items;
  }

  return [
    ...items.slice(0, index),
    update,
    ...items.slice(index + 1),
  ];
};

export const formatFilmRuntime = (runtime) => {
  dayjs.extend(objectSupport);

  return dayjs({minute: runtime}).format(FILM_RUNTIME_FORMAT);
};

export const sortGenres = (films) => {
  const genres = {};

  films.forEach((item) => {
    item.filmInfo.genre.forEach((genre) => {
      genres[genre] = (genres[genre] || 0) + 1;
    });
  });

  return Object.fromEntries(
      Object
      .entries(genres)
      .sort(([, a], [, b]) => b - a)
  );
};

export const getWatchedFilms = (films) => films.filter((film) => film.userDetails.alreadyWatched);

export const formatTotalDuration = (totalDuration) => {
  const minutesPerHour = 60;
  const totalHours = Math.floor(totalDuration / minutesPerHour);
  let totalMinutes = Math.floor(totalDuration - totalHours * minutesPerHour);
  totalMinutes = totalMinutes < 10 ? `0${totalMinutes}` : totalMinutes;

  return {
    totalHours,
    totalMinutes,
  };
};

export const generateRank = (films) => {
  const rank = films.length;

  if (rank >= 1 && rank <= 10) {
    return `novice`;
  } else if (rank >= 11 && rank <= 20) {
    return `fan`;
  } else if
  (rank >= 21) {
    return `movie buff`;
  } else {
    return ``;
  }
};

export const filterWatchedFilmsByPeriod = (films, type) => {
  return type !== StatisticsType.ALL_TIME ? films.filter((film) => dayjs(film.userDetails.watchingDate).isSame(dayjs(), type)) : films;
};

export const isOnline = () => {
  return window.navigator.onLine;
};
