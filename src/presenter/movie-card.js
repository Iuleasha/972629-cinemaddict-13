import {remove, render, replace, RenderPosition} from "../utils/render";
import FilmCard from "../view/film-card";

export default class MovieCard {
  constructor(moviesContainer, changeData, openPopup, updateCount) {
    this._moveisContainer = moviesContainer;
    this._changeData = changeData;
    this._updateCount = updateCount;
    this._openPopup = openPopup;
    this._moveiComponent = null;
    this._handlerChangeData = this._handlerChangeData.bind(this);
  }

  init(movie) {
    this._movie = movie;
    const prevMovieComponent = this._moveiComponent;
    this._moveiComponent = new FilmCard(movie);
    this._moveiComponent.setClickHandler(() => this._openPopup(this._movie));
    this._moveiComponent.setControlsHandler(this._handlerChangeData);
    this._renderMovieCard();

    if (prevMovieComponent === null) {
      this._renderMovieCard();

      return;
    }

    replace(this._moveiComponent, prevMovieComponent);
  }

  _renderMovieCard() {
    render(this._moveisContainer, this._moveiComponent, RenderPosition.BEFOREEND);
  }

  _handlerChangeData(controlData) {
    this._updateCount(controlData);
    this._changeData(
        Object.assign(
            {},
            this._movie,
            controlData));
  }

  destroy() {
    remove(this._moveiComponent);
  }
}
