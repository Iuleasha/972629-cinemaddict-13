import {createCardTemplate} from './film-card';
import {generateFilmCard} from '../mock/film';

const MAX_EXTRAS = 2;

const films = new Array(MAX_EXTRAS).fill().map(generateFilmCard);
const createExtraList = () => {
  let list = ``;

  for (let i = 0; i < MAX_EXTRAS; i++) {
    list += createCardTemplate(films[i]);
  }

  return list;
};

export const createExtraTemplate = (title) => {
  return `<section class="films-list films-list--extra">
      <h2 class="films-list__title">${title}</h2>
      <div class="films-list__container">${createExtraList()}</div>
    </section>`;
};
