import {createEmptyArray, createRandomArray, getRandomArrayItem, getRandomInteger, randomNumber} from '../utils/utils';
import {generateCommentBlock, generateData} from './comment-mock';
import {currentFilmsArray} from '../view/render-films-list';

const generateDescriptionFilm = () => {
  const description = [
    `Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
    `Cras aliquet varius magna, non porta ligula feugiat eget.`,
    `Fusce tristique felis at fermentum pharetra.`,
    `Aliquam id orci ut lectus varius viverra.`,
    `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.`,
    `Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.`,
    `Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.`,
    `Sed sed nisi sed augue convallis suscipit in sed felis.`,
    `Aliquam erat volutpat.`,
    `Nunc fermentum tortor ac porta dapibus.`,
    `In rutrum ac purus sit amet tempus.`
  ];
  const randomIndex = getRandomInteger(1, 5);
  return new Array(randomIndex).fill().map(() => description[getRandomInteger(0, randomIndex)]).join(` `);
};

const generateFilmTitle = () => {
  const filmTitle = [
    `The Dance of Life`,
    `Sagebrush Trail`,
    `The Man with the Golden Arm`,
    `Santa Claus Conquers the Martians`,
    `Popeye the Sailor Meets Sindbad the Sailor`,
    `The Great Flamarion`,
    `Made for Each Other`
  ];

  return getRandomArrayItem(filmTitle);
};


const generateFilmPoster = () => {
  const filmPoster = [
    `made-for-each-other.png`,
    `popeye-meets-sinbad.png`,
    `sagebrush-trail.jpg`,
    `santa-claus-conquers-the-martians.jpg`,
    `the-dance-of-life.jpg`,
    `the-great-flamarion.jpg`,
    `the-man-with-the-golden-arm.jpg`
  ];

  return `./images/posters/${getRandomArrayItem(filmPoster)}`;
};

const generateFilmDuration = () => {
  let duration = ``;
  const hour = getRandomInteger(0, 3);
  const minutes = getRandomInteger(0, 59);

  if (hour > 0) {
    duration += `${hour}h `;
  }

  duration += `${minutes < 10 ? `0` : ``}${minutes}m`;

  return duration;
};

const generateGenre = () => {
  const genres =
    [`Action`,
      `Adventure`,
      `Animation`,
      `Biography`,
      `Comedy`,
      `Crime`,
      `Documentary`,
      `Drama`,
      `Family`,
      `Fantasy`,
      `Film Noir`,
      `History`,
      `Horror`,
      `Music`,
      `Musical`,
      `Mystery`,
      `Romance`,
      `Sci-Fi`,
      `Short Film`,
      `Sport`,
      `Superhero`,
      `Thriller`,
      `War`,
      `Western`,
    ];

  return getRandomArrayItem(genres);
};

const generateGenres = () => {
  return createEmptyArray(3).map(() => generateGenre());
};

const generateCommentsArray = () => {
  const commentsArrayLength = getRandomInteger(0, 5);

  return commentsArrayLength !== 0 ? Array(commentsArrayLength).fill().map(generateCommentBlock) : [];
};

const generateDirectorArray = () => {
  const directors = [
    `Guy Ritchie`,
    `David Yates`,
    `Laurence Olivier`,
    `Nicolas Roeg`,
    `Oliver Parker`,
    `Paul McGuigan`,
  ];

  return getRandomArrayItem(directors);
};

const generateWritersArray = () => {
  const writers = [
    `Anne Wigton`,
    `Heinz Herald`,
    `Richard Weil`,
    `Billy Wilder`,
    `Robert Towne`,
    `Quentin Tarantino`,
  ];

  return createRandomArray(writers).join(`, `);
};

const generateActorsArray = () => {
  const actors = [
    `Frank J. Aard`,
    `Nicholas Aaron`,
    `William Abadie`,
    `Patrick J. Adams`,
    `Steve Zahn`,
    `Sybil Maas`,
    `Tobey Maguire`,
  ];
  return createRandomArray(actors).join(`, `);
};

const generateCountry = () => {
  const countries = [
    `USA`,
    `Russia`,
    `France`,
    `Germany`,
    `China`
  ];
  return getRandomArrayItem(countries);
};
const generateDetailsAge = () => {
  const ages = [
    `0+`,
    `6+`,
    `12+`,
    `16+`,
    `18+`,
  ];
  return getRandomArrayItem(ages);
};
export const generateFilmCard = () => {
  return {
    poster: generateFilmPoster(),
    title: generateFilmTitle(),
    rating: randomNumber(1, 10).toFixed(1),
    duration: generateFilmDuration(),
    genres: generateGenres(),
    country: generateCountry(),
    description: generateDescriptionFilm(),
    comments: generateCommentsArray(),
    controls: {
      addToWatchlist: !!getRandomInteger(0, 1),
      markAsWatched: !!getRandomInteger(0, 1),
      markAsFavorite: !!getRandomInteger(0, 1),
    },
    director: generateDirectorArray(),
    writers: generateWritersArray(),
    actors: generateActorsArray(),
    releaseDate: generateData(),
    age: generateDetailsAge(),
  };
};
const FILMS_COUNT = 20;

export const films = new Array(getRandomInteger(0, FILMS_COUNT)).fill().map(generateFilmCard);
export const watchlist = [];
export const asWatched = [];
export const favorites = [];
export let defaultSort = [];

export const filterFilms = () => {
  films.forEach((item) => {
    const {controls} = item;

    if (controls.addToWatchlist) {
      watchlist.push(item);
    }
    if (controls.markAsWatched) {
      asWatched.push(item);
    }
    if (controls.markAsFavorite) {
      favorites.push(item);
    }
  });
};

export const sortFilmByData = () => [...currentFilmsArray.filmsArray].sort((a, b) => {
  return b.releaseDate.toDate() - a.releaseDate.toDate();
});
export const sortByRating = () => [...currentFilmsArray.filmsArray].sort((a, b) => Number(b.rating) - Number(a.rating));
