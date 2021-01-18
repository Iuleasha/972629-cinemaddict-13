import {createEmptyArray, createRandomArray, getRandomArrayItem, getRandomInteger, randomNumber} from '../utils/common';
import {generateCommentBlock, generateData} from './comment-mock';

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

  return commentsArrayLength !== 0 ? Array(commentsArrayLength).fill().map((item, index) => generateCommentBlock(index)) : [];
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

export const generateFilmCard = (index) => {
  const isWatched = !!getRandomInteger(0, 1);
  return {
    id: index,
    comments: generateCommentsArray(),
    filmInfo: {
      title: generateFilmTitle(),
      alternativeTitle: generateFilmTitle(),
      totalRating: randomNumber(1, 10).toFixed(1),
      poster: generateFilmPoster(),
      ageRating: generateDetailsAge(),
      director: generateDirectorArray(),
      writers: generateWritersArray(),
      actors: generateActorsArray(),
      release: {
        date: generateData(),
        releaseCountry: generateCountry(),
      },
      runtime: randomNumber(40, 200),
      genre: generateGenres(),
      description: generateDescriptionFilm(),
    },
    userDetails: {
      watchlist: !!getRandomInteger(0, 1),
      alreadyWatched: isWatched,
      watchingDate: isWatched ? generateData() : ``,
      favorite: !!getRandomInteger(0, 1),
    },
  };
};

const FILMS_COUNT = 20;

export const films = new Array(getRandomInteger(0, FILMS_COUNT)).fill().map((item, index) => generateFilmCard(index));
