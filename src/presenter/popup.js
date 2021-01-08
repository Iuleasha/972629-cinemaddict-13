import PopupView from '../view/popup';
import {remove, render, RenderPosition} from "../utils/render";

export default class Popup {
  constructor() {
    this._popupComponent = null;

    this._onCloseClick = this._onCloseClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._handlerChangeData = this._handlerChangeData.bind(this);
  }

  init(movieInfo, changeData) {
    this.movieInfo = movieInfo;
    this._changeData = changeData;

    if (this._popupComponent !== null) {
      this.destroy();
    }

    this._popupComponent = new PopupView(movieInfo);
    this._popupComponent.setCloseClickHandler(this._onCloseClick);
    this._popupComponent.setControlsHandler(this._handlerChangeData);

    render(document.body, this._popupComponent, RenderPosition.BEFOREEND);

    document.body.classList.add(`hide-overflow`);
    document.addEventListener(`keydown`, this._escKeyDownHandler);
    this._popupComponent.setControlsHandler(this._handlerChangeData);
  }

  _handlerChangeData(controlData) {
    this._changeData(
        Object.assign(
            {},
            this.movieInfo,
            controlData));
  }

  destroy() {
    if (this._popupComponent === null) {
      return;
    }

    remove(this._popupComponent);
    this._popupComponent = null;

    document.body.classList.remove(`hide-overflow`);
    document.removeEventListener(`keydown`, this._escKeyDownHandler);
  }

  _onCloseClick() {
    this.destroy();
  }

  _escKeyDownHandler(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      this.destroy();
    }
  }
}
