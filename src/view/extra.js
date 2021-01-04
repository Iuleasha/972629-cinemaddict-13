import FilmCardView from './film-card';
import {render, RenderPosition} from '../utils/render';
import Popup from '../presenter/popup';
import AbstractView from './abstract';

const MAX_EXTRAS = 2;

const createExtraTemplate = (title) => {
  return `<section class="films-list films-list--extra">
      <h2 class="films-list__title">${title}</h2>
      <div class="films-list__container"></div>
    </section>`;
};

export default class FilmCardExtras extends AbstractView {
  constructor(title) {
    super();

    this._popup = new Popup();
    this.title = title;
  }

  getTemplate() {
    return createExtraTemplate(this.title);
  }

  getExtraList(array) {
    const filmContainer = this.getElement().querySelector(`.films-list__container`);

    array.slice(0, MAX_EXTRAS).forEach((item) => {
      const filmCard = new FilmCardView(item);

      filmCard.setClickHandler(() => {
        this._popup.init(item);
      });

      render(filmContainer, filmCard, RenderPosition.BEFOREEND);
    });
  }
}
