import {FilterType, UpdateType, UserAction} from "../const";
import CommentsModel from "../model/comments";
import {isOnline} from "../utils/common";
import {remove, render, RenderPosition, replace} from "../utils/render";
import {toast} from "../utils/toast/toast";
import AddCommentView from "../view/add-comment";
import CommentsView from "../view/comments";
import FilmCard from "../view/film-card";
import PopupView from "../view/popup";

const Mode = {
  CLOSE: `CLOSE`,
  OPEN: `OPEN`,
};

export default class Film {
  constructor(filmsContainer, changeData, changeMode, filterModel, api) {
    this._filterModel = filterModel;
    this._filmsContainer = filmsContainer;
    this._changeData = changeData;
    this._changeMode = changeMode;
    this._api = api;
    this._filmComponent = null;
    this._popupComponent = null;
    this._mode = Mode.CLOSE;
    this._commentsModel = new CommentsModel();

    this._handlerChangeData = this._handlerChangeData.bind(this);
    this._handleUpdateFilmCardComments = this._handleUpdateFilmCardComments.bind(this);
    this._handleOpenClick = this._handleOpenClick.bind(this);
    this._handleCloseClick = this._handleCloseClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._handleDeleteCommentClick = this._handleDeleteCommentClick.bind(this);
    this._handleCommentEvent = this._handleCommentEvent.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
  }

  init(film) {
    this._film = film;

    const prevMovieComponent = this._filmComponent;

    this._filmComponent = new FilmCard(film);
    this._filmComponent.setClickHandler(this._handleOpenClick);
    this._filmComponent.setControlsHandler(this._handlerChangeData);

    if (prevMovieComponent === null) {
      render(this._filmsContainer, this._filmComponent, RenderPosition.BEFOREEND);
      return;
    }

    replace(this._filmComponent, prevMovieComponent);
    remove(prevMovieComponent);
  }

  destroy() {
    remove(this._filmComponent);
  }

  _handlerChangeData(key) {
    const userDetails = Object.assign(
        {},
        this._film.userDetails,
        {[key]: !this._film.userDetails[key]});

    if (key === FilterType.ALREADY_WATCHED) {
      userDetails.watchingDate = userDetails.alreadyWatched ? new Date() : ``;
    }

    this._changeData(
        UserAction.UPDATE_FILM,
        this._filterModel.getFilter() === FilterType.ALL ? UpdateType.PATCH : UpdateType.MINOR,
        Object.assign(
            {},
            this._film,
            {userDetails}));
  }

  _handleUpdateFilmCardComments(comments) {
    this._changeData(
        UserAction.UPDATE_FILM,
        UpdateType.EXTRA,
        Object.assign(
            {},
            this._film,
            {comments}));
  }

  _handleCommentEvent(userAction, update) {
    switch (userAction) {
      case UserAction.ADD_COMMENT:
        this._filmCommentsComponent.updateData(update);
        this._commentsModel.setComments(update);
        this._newCommentComponent.updateData();
        break;

      case UserAction.DELETE_COMMENT:
        this._filmCommentsComponent.updateData(this._commentsModel.getComments());
        break;
    }

    this._handleUpdateFilmCardComments(this._commentsModel.getComments().map(({id}) => id));
  }

  _openPopup() {
    document.addEventListener(`keydown`, this._escKeyDownHandler);
    document.body.classList.add(`hide-overflow`);

    this._popupComponent = new PopupView(this._film);
    this._newCommentComponent = new AddCommentView();

    this._popupComponent.setCloseClickHandler(this._handleCloseClick);
    this._popupComponent.setControlsHandler(this._handlerChangeData);
    this._newCommentComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._commentsModel.addObserver(this._handleCommentEvent);

    render(document.body, this._popupComponent, RenderPosition.BEFOREEND);

    this._changeMode();
    this._mode = Mode.OPEN;
    const commentsWrapper = this._popupComponent.getElement().querySelector(`.film-details__comments-wrap`);

    render(commentsWrapper, this._newCommentComponent, RenderPosition.BEFOREEND);

    if (!isOnline()) {
      toast(`You can't get comments offline`);
    } else {
      this._api.getComments(this._film.id).then((comments) => {
        this._commentsModel.setComments(comments);
        this._filmCommentsComponent = new CommentsView(comments);
        this._filmCommentsComponent.setDeleteCommentClickHandler(this._handleDeleteCommentClick);

        render(commentsWrapper, this._filmCommentsComponent, RenderPosition.AFTERBEGIN);
      });
    }
  }

  _closePopup() {
    document.body.classList.remove(`hide-overflow`);
    document.removeEventListener(`keydown`, this._escKeyDownHandler);
    remove(this._popupComponent);
    this._commentsModel.removeObserver(this._handleCommentEvent);
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
    document.removeEventListener(`keydown`, this._escKeyDownHandler);
    remove(this._filmComponent);
  }

  _escKeyDownHandler(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();

      this._closePopup();
    }
  }

  _handleDeleteCommentClick(commentId) {
    if (!isOnline()) {
      toast(`You can't delete comment offline`);

      return;
    }

    this._api.deleteComment(commentId).then(() => {
      this._commentsModel.deleteComment(UserAction.DELETE_COMMENT, commentId);
    }).catch(() => {
      this._commentsModel.setDefaultDeleteButtonText(commentId);
    });
  }

  _handleFormSubmit(comment) {
    if (!isOnline()) {
      toast(`You can't submit comment offline`);
      this._newCommentComponent.addAnimation();
      this._newCommentComponent.switchDisableFormStus(false);

      return;
    }

    this._api.addComment(comment, this._film.id).then(({comments}) => {
      this._commentsModel.addComment(UserAction.ADD_COMMENT, comments);
    });
  }
}
