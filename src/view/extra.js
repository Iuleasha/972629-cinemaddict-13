import {generateFilmCard} from '../mock/film';
import FilmCard from './film-card';
import {createElement} from '../utils/utils';

const MAX_EXTRAS = 2;

const films = new Array(MAX_EXTRAS).fill().map(generateFilmCard);
const createExtraList = () => {
  let list = ``;

  for (let i = 0; i < MAX_EXTRAS; i++) {
    list += new FilmCard(films[i]).getTemplate();
  }
  return list;
};

const createExtraTemplate = (title) => {
  return `<section class="films-list films-list--extra">
      <h2 class="films-list__title">${title}</h2>
      <div class="films-list__container">${createExtraList()}</div>
    </section>`;
};

export default class FilmCardExtras {
  constructor(title) {
    this.title = title;
    this._element = null;
  }

  getTemplate() {
    return createExtraTemplate(this.title);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
