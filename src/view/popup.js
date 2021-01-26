import {cutString, formatDate, formatFilmRuntime} from '../utils/common';
import SmartView from './smart';

const MAX_DESCRIPTION_LENGTH = 140;
const CUT_LENGTH = 139;

const createGenreItem = (genres) => {
  return genres.map((genre) => `<span class="film-details__genre">${genre}</span>`).join(``);
};

const eclipseDescription = (description) => {
  return description.length > MAX_DESCRIPTION_LENGTH ? cutString(description, CUT_LENGTH) : description;
};

const createPopupTemplate = (film) => {
  const {filmInfo, userDetails} = film;

  return `<section class="film-details">
  <form class="film-details__inner" action="" method="get">
    <div class="film-details__top-container">
      <div class="film-details__close">
        <button class="film-details__close-btn" type="button">close</button>
      </div>
      <div class="film-details__info-wrap">
        <div class="film-details__poster">
          <img class="film-details__poster-img" src="${filmInfo.poster}" alt="">

          <p class="film-details__age">${filmInfo.ageRating}</p>
        </div>

        <div class="film-details__info">
          <div class="film-details__info-head">
            <div class="film-details__title-wrap">
              <h3 class="film-details__title">${filmInfo.title}</h3>
              <p class="film-details__title-original">Original: ${filmInfo.alternativeTitle}</p>
            </div>

            <div class="film-details__rating">
              <p class="film-details__total-rating">${filmInfo.totalRating}</p>
            </div>
          </div>

          <table class="film-details__table">
            <tr class="film-details__row">
              <td class="film-details__term">Director</td>
              <td class="film-details__cell">${filmInfo.director}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Writers</td>
              <td class="film-details__cell">${filmInfo.writers}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Actors</td>
              <td class="film-details__cell">${filmInfo.actors}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Release Date</td>
              <td class="film-details__cell">${formatDate(filmInfo.release.date, `DD MMMM YYYY`)}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Runtime</td>
              <td class="film-details__cell">${formatFilmRuntime(filmInfo.runtime)}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Country</td>
              <td class="film-details__cell">${filmInfo.release.releaseCountry}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">${filmInfo.genre.length > 1 ? `Genres` : `Genre`}</td>
              <td class="film-details__cell">
                ${createGenreItem(filmInfo.genre)}</td>
            </tr>
          </table>

          <p class="film-details__film-description">${eclipseDescription(filmInfo.description)}</p>
        </div>
      </div>

      <section class="film-details__controls">
        <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist" ${userDetails.watchlist ? `checked` : ``}>
        <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>

        <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="alreadyWatched" ${userDetails.alreadyWatched ? `checked` : ``}>
        <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>

        <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite" ${userDetails.favorite ? `checked` : ``}>
        <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
      </section>
    </div>

    <div class="film-details__bottom-container">
      <section class="film-details__comments-wrap"></section>
    </div>
  </form>
</section>`;
};

export default class Popup extends SmartView {
  constructor(film) {
    super();

    this._data = film;

    this._controllerClickHandler = this._controllerClickHandler.bind(this);
  }

  getTemplate() {
    return createPopupTemplate(this._data);
  }

  restoreHandlers() {
    this.setCloseClickHandler(this._callback.closeClick);
    this.setControlsHandler(this._callback.controllersClick);
  }

  _controllerClickHandler(evt) {
    evt.preventDefault();

    this._callback.controllersClick(evt.target.name);
  }

  setControlsHandler(callback) {
    this._callback.controllersClick = callback;

    const controls = this.getElement().querySelectorAll(`.film-details__control-input`);

    controls.forEach((item) => {
      item.addEventListener(`change`, this._controllerClickHandler);
    });
  }

  setCloseClickHandler(callback) {
    this._callback.closeClick = callback;
    this.getElement().querySelector(`.film-details__close-btn`).addEventListener(`click`, this._callback.closeClick);
  }
}
