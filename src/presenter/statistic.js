import StatisticView from "../view/statistic";
import {remove, render, RenderPosition} from "../utils/render";
import {MenuItem, StatisticsType} from "../const";
import {getWatchedFilms} from "../utils/common";
import dayjs from "dayjs";
import isToday from "dayjs/plugin/isToday";

dayjs.extend(isToday);

export default class Statistic {
  constructor(mainContainer, filmsModel, statisticModel) {
    this._mainContainerContainer = mainContainer;
    this._statsModel = statisticModel;
    this._filmsModel = filmsModel;
    this._statisticsComponent = null;
    this._wathedFilms = this.getWatchedFilms(getWatchedFilms(this._filmsModel.getFilms()), StatisticsType.ALL_TIME);

    this._handleSwitchStatistic = this._handleSwitchStatistic.bind(this);
    this._showStatusEvent = this._showStatusEvent.bind(this);

    this._statsModel.addObserver(this._showStatusEvent);
  }

  init() {
    this._statisticsComponent = new StatisticView(this._wathedFilms);
    this._statisticsComponent.setSwitchStatisticsHandler(this._handleSwitchStatistic);
  }

  _showStatusEvent(menuType) {
    if (this._currentMenyType === menuType) {
      return;
    }

    this._currentMenyType = menuType;

    if (MenuItem.FILMS !== menuType) {
      this._wathedFilms = this.getWatchedFilms(getWatchedFilms(this._filmsModel.getFilms()), StatisticsType.ALL_TIME);
      this._statisticsComponent = new StatisticView(this._wathedFilms, StatisticsType.ALL_TIME);
      this._statisticsComponent.setSwitchStatisticsHandler(this._handleSwitchStatistic);
      this.renderStatistic();
    } else {
      remove(this._statisticsComponent);
    }
  }

  _handleSwitchStatistic(type) {
    this._statisticsComponent.updateData({sortType: type, watchedFilms: this.getWatchedFilms(getWatchedFilms(this._filmsModel.getFilms()), type)});
  }

  renderStatistic() {
    render(this._mainContainerContainer, this._statisticsComponent, RenderPosition.BEFOREEND);
  }

  getWatchedFilms(films, type) {
    switch (type) {
      case StatisticsType.TODAY:
        return films.filter((film) => dayjs(film.userDetails.watchingDate).isToday());
      case StatisticsType.WEEK:
        return films.filter((film) => dayjs(film.userDetails.watchingDate).isSame(dayjs(), `week`));
      case StatisticsType.MONTH:
        return films.filter((film) => dayjs(film.userDetails.watchingDate).isSame(dayjs(), `month`));
      case StatisticsType.YEAR:
        return films.filter((film) => dayjs(film.userDetails.watchingDate).isSame(dayjs(), `year`));
      default:
        return films;
    }
  }
}
