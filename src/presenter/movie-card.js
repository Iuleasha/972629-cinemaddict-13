import {remove, render, RenderPosition, replace} from "../utils/render";
import FilmCard from "../view/film-card";
import CommentsModel from "../model/comments";
import PopupView from "../view/popup";
import {UpdateType, UserAction} from "../const.js";
import CommentsView from "../view/comments";
import AddCommentView from "../view/add-comment";

const Mode = {
  CLOSE: `CLOSE`,
  OPEN: `OPEN`,
};

export default class MovieCard {
  constructor(moviesContainer, changeData, changeMode) {
    this._moveisContainer = moviesContainer;
    this._changeData = changeData;
    this._changeMode = changeMode;
    this._moveiComponent = null;
    this._popupComponent = null;
    this._mode = Mode.CLOSE;
    this._commentsModel = new CommentsModel();

    this._handlerChangeData = this._handlerChangeData.bind(this);
    this._handleOpenClick = this._handleOpenClick.bind(this);
    this._handleCloseClick = this._handleCloseClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._handleDeleteCommentClick = this._handleDeleteCommentClick.bind(this);
    this._handleCommentEvent = this._handleCommentEvent.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);

  }

  init(movie) {
    this._movie = movie;
    this._commentsModel.setComments(this._movie.comments);

    const prevMovieComponent = this._moveiComponent;

    this._moveiComponent = new FilmCard(movie);
    this._moveiComponent.setClickHandler(this._handleOpenClick);
    this._moveiComponent.setControlsHandler(this._handlerChangeData);

    if (prevMovieComponent === null) {
      render(this._moveisContainer, this._moveiComponent, RenderPosition.BEFOREEND);
      return;
    }

    replace(this._moveiComponent, prevMovieComponent);
    remove(prevMovieComponent);
  }

  destroy() {
    remove(this._moveiComponent);
  }

  _handlerChangeData(key) {
    this._changeData(
        UserAction.UPDATE_FILM,
        UpdateType.PATCH,
        Object.assign(
            {},
            this._movie,
            {[key]: !this._movie[key]}));
  }

  _handleCommentEvent(userAction, update) {
    switch (userAction) {
      case UserAction.ADD_COMMENT:
        this._movie.comments.push(update);
        this._filmCommentsComponent.updateData(this._movie.comments);
        this._newCommentComponent.updateData();
        break;

      case UserAction.DELETE_COMMENT:
        let commentIdToDelete = this._movie.comments.findIndex((item) => item.id === update);
        this._movie.comments.splice(commentIdToDelete, 1);
        this._filmCommentsComponent.updateData(this._movie.comments);
        break;
    }

    this._handlerChangeData({comments: this._movie.comments});
  }

  _openPopup() {
    document.addEventListener(`keydown`, this._escKeyDownHandler);
    document.body.classList.add(`hide-overflow`);

    this._popupComponent = new PopupView(this._movie);
    this._newCommentComponent = new AddCommentView();
    this._filmCommentsComponent = new CommentsView(this._movie.comments);

    this._popupComponent.setCloseClickHandler(this._handleCloseClick);
    this._popupComponent.setControlsHandler(this._handlerChangeData);
    this._newCommentComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._filmCommentsComponent.setDeleteCommentClickHandler(this._handleDeleteCommentClick);
    this._commentsModel.addObserver(this._handleCommentEvent);

    render(document.body, this._popupComponent, RenderPosition.BEFOREEND);

    this._changeMode();
    this._mode = Mode.OPEN;

    const commentsWrapper = this._popupComponent.getElement().querySelector(`.film-details__comments-wrap`);

    render(commentsWrapper, this._filmCommentsComponent, RenderPosition.BEFOREEND);
    render(commentsWrapper, this._newCommentComponent, RenderPosition.BEFOREEND);
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
    remove(this._moveiComponent);
  }

  _escKeyDownHandler(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();

      this._closePopup();
    }
  }

  _handleDeleteCommentClick(event) {
    if (event.target.tagName === `BUTTON`) {
      const commentId = event.target.closest(`.film-details__comment`).dataset.id;
      this._commentsModel.deleteComment(UserAction.DELETE_COMMENT, commentId);
    }
  }

  _handleFormSubmit(comment) {
    this._commentsModel.addComment(UserAction.ADD_COMMENT, comment);
  }
}
