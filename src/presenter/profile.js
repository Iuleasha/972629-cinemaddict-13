import {render, replace, remove, RenderPosition} from "../utils/render";
import {getWatchedFilms,generateRank} from "../utils/common";
import ProfileView from "../view/profile";

export default class Profile {
  constructor(headerContainer, filmsModel) {
    this._headerContainer = headerContainer;
    this._filmsModel = filmsModel;

    this._profileComponent = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._filmsModel.addObserver(this._handleModelEvent);
  }

  init() {
    this._films = this._filmsModel.getFilms();
    this._userRank = generateRank(getWatchedFilms(this._films));

    const prevProfileComponent = this._profileComponent;
    this._profileComponent = new ProfileView(this._userRank);

    if (prevProfileComponent === null) {
      render(this._headerContainer, this._profileComponent, RenderPosition.BEFOREEND);
      return;
    }

    replace(this._profileComponent, prevProfileComponent);
    remove(prevProfileComponent);
  }

  _handleModelEvent() {
    this.init();
  }
}
