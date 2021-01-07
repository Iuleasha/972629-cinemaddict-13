import {remove, render, RenderPosition} from "../utils/render";
import FilmCard from "../view/film-card";

export default class MovieCard {
  constructor(moviesContainer, changeData, openPopup) {
    this._moveisContainer = moviesContainer;
    this._changeData = changeData;
    this._openPopup = openPopup;

    this._moveiComponent = null;
  }

  init(movie) {
    this._movie = movie;
    this._moveiComponent = new FilmCard(movie);

    this._handleOpenPopup();
    this._renderMovieCard();
  }

  _renderMovieCard() {
    render(this._moveisContainer, this._moveiComponent, RenderPosition.BEFOREEND);
  }

  _handleOpenPopup() {
    this._moveiComponent.setClickHandler(() => this._openPopup(this._movie));
  }

  destroy() {
    remove(this._moveiComponent);
  }
}
