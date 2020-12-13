import {watchlist} from '../mock/film';

export const generateRank = () => {
  const rank = watchlist.length;
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


