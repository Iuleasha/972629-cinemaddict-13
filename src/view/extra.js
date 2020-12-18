import {generateFilmCard} from '../mock/film';
import FilmCardView from './film-card';
import {render, RenderPosition} from '../utils/render';
import PopupView from './popup';
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
    this.title = title;
  }

  getTemplate() {
    return createExtraTemplate(this.title);
  }

  getExtraList() {
    const films = new Array(MAX_EXTRAS).fill().map(generateFilmCard);
    const filmContainer = this.getElement().querySelector(`.films-list__container`);

    for (let i = 0; i < MAX_EXTRAS; i++) {
      const filmCard = new FilmCardView(films[i]);

      filmCard.setClickHandler(() => {
        const popupView = new PopupView(films[i]);
        popupView.showPopup();
      });

      render(filmContainer, filmCard.getElement(), RenderPosition.BEFOREEND);
    }
  }
}
