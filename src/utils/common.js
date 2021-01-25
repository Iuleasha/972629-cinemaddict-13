import dayjs from 'dayjs';
import objectSupport from "dayjs/plugin/objectSupport";
import relativeTime from 'dayjs/plugin/relativeTime';
import {FILM_RUNTIME_FORMAT, StatisticsType} from "../const";

dayjs.extend(relativeTime);
dayjs.extend(objectSupport);

export const formatDate = (date, format) => dayjs(date).format(format);

export const formatDateToTimeFromNow = (date) => dayjs(date).fromNow();

export const formatFilmRuntime = (runtime) => dayjs({minute: runtime}).format(FILM_RUNTIME_FORMAT);

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

export const filterWatchedFilmsByPeriod = (films, type) => type !== StatisticsType.ALL_TIME ? films.filter((film) => dayjs(film.userDetails.watchingDate).isSame(dayjs(), type)) : films;

export const isOnline = () => window.navigator.onLine;
