import {remove, render, RenderPosition, replace} from "../utils/render";
import FilmCard from "../view/film-card";
import PopupView from "../view/popup";

const Mode = {
  CLOSE: `CLOSE`,
  OPEN: `OPEN`,
};

export default class MovieCard {
  constructor(moviesContainer, changeData, changeMode, updateCount) {
    this._moveisContainer = moviesContainer;
    this._changeData = changeData;
    this._changeMode = changeMode;
    this._updateCount = updateCount;

    this._moveiComponent = null;
    this._popupComponent = null;
    this._mode = Mode.CLOSE;

    this._handlerChangeData = this._handlerChangeData.bind(this);
    this._handleOpenClick = this._handleOpenClick.bind(this);
    this._handleCloseClick = this._handleCloseClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init(movie) {
    this._movie = movie;

    const prevMovieComponent = this._moveiComponent;
    const prevPopupComponent = this._popupComponent;

    this._moveiComponent = new FilmCard(movie);
    this._popupComponent = new PopupView(movie);

    this._popupComponent.setCloseClickHandler(this._handleCloseClick);
    this._popupComponent.setControlsHandler(this._handlerChangeData);
    this._moveiComponent.setClickHandler(this._handleOpenClick);
    this._moveiComponent.setControlsHandler(this._handlerChangeData);

    if (prevMovieComponent && prevPopupComponent) {
      replace(this._moveiComponent, prevMovieComponent);
      replace(this._popupComponent, prevPopupComponent);
    } else {
      render(this._moveisContainer, this._moveiComponent, RenderPosition.BEFOREEND);
    }

  }

  _handlerChangeData(controlData) {
    this._updateCount(controlData);
    this._changeData(
        Object.assign(
            {},
            this._movie,
            controlData));
  }

  _openPopup() {
    render(document.body, this._popupComponent, RenderPosition.BEFOREEND);
    document.addEventListener(`keydown`, this._escKeyDownHandler);
    document.body.classList.add(`hide-overflow`);
    this._changeMode();
    this._popupComponent.setCloseClickHandler(this._handleCloseClick);
    this._popupComponent.setControlsHandler(this._handlerChangeData);
    this._mode = Mode.OPEN;
  }

  _closePopup() {
    remove(this._popupComponent);
    document.body.classList.remove(`hide-overflow`);
    document.removeEventListener(`keydown`, this._escKeyDownHandler);
    this._mode = Mode.CLOSE;
  }

  resetView() {
    if (this._mode !== Mode.CLOSE) {
      this._closePopup();
    }
  }

  _handleOpenClick() {
    this._openPopup();
  }

  _handleCloseClick() {
    this._closePopup();
  }

  destroy() {
    remove(this._moveiComponent);
    remove(this._popupComponent);
    document.removeEventListener(`keydown`, this._escKeyDownHandler);
  }

  _escKeyDownHandler(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();

      this._closePopup();
    }
  }
}
