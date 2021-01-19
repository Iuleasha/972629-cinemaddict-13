import dayjs from "dayjs";
import isToday from "dayjs/plugin/isToday";
import {MenuItem, StatisticsType} from "../const";
import {filterWatchedFilmsByPeriod, getWatchedFilms} from "../utils/common";
import {remove, render, RenderPosition} from "../utils/render";
import StatisticView from "../view/statistic";

dayjs.extend(isToday);

export default class Statistic {
  constructor(mainContainer, filmsModel, statisticModel) {
    this._mainContainerContainer = mainContainer;
    this._statsModel = statisticModel;
    this._filmsModel = filmsModel;
    this._statisticsComponent = null;

    this._handleSwitchStatistic = this._handleSwitchStatistic.bind(this);
    this._showStatusEvent = this._showStatusEvent.bind(this);

    this._statsModel.addObserver(this._showStatusEvent);
  }

  init() {
    this._wathedFilms = filterWatchedFilmsByPeriod(this._getWatchedFilms(), StatisticsType.ALL_TIME);
    this._statisticsComponent = new StatisticView(this._wathedFilms, StatisticsType.ALL_TIME);
    this._statisticsComponent.setSwitchStatisticsHandler(this._handleSwitchStatistic);
  }

  _showStatusEvent(menuType) {
    if (this._currentMenyType === menuType) {
      return;
    }

    this._currentMenyType = menuType;

    if (MenuItem.FILMS !== menuType) {
      this.init();
      this.renderStatistic();
    } else {
      remove(this._statisticsComponent);
    }
  }

  _getWatchedFilms() {
    return getWatchedFilms(this._filmsModel.getFilms());
  }

  _handleSwitchStatistic(type) {
    this._statisticsComponent.updateData({
      sortType: type,
      watchedFilms: filterWatchedFilmsByPeriod(this._getWatchedFilms(), type),
    });
  }

  renderStatistic() {
    render(this._mainContainerContainer, this._statisticsComponent, RenderPosition.BEFOREEND);
  }
}
