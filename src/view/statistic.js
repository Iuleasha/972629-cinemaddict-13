import SmartView from './smart';
import {StatisticsType} from "../const";
import {formatTotalDuration, sortGenres, generateRank} from "../utils/common";
import Chart from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';

const renderChart = (statisticCtx, labels, data) => {
  const BAR_HEIGHT = 50;

  statisticCtx.height = BAR_HEIGHT * labels.length;

  return new Chart(statisticCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: `#ffe800`,
        hoverBackgroundColor: `#ffe800`,
        anchor: `start`,
      }],
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 20,
          },
          color: `#ffffff`,
          anchor: `start`,
          align: `start`,
          offset: 40,
        },
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#ffffff`,
            padding: 100,
            fontSize: 20,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
          barThickness: 24,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
};

const createFilterItemTemplate = (filter, currentStatisticsType) => {
  const {type, name} = filter;

  return (`<input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-${type}" value="${type}" ${currentStatisticsType === type ? `checked` : ``}>
           <label for="statistic-${type}" class="statistic__filters-label">${name}</label>`);
};

const createFiltersTemplate = (filterItems, currentStatisticsType) => {
  const filterItemsTemplate = filterItems
    .map((filter) => createFilterItemTemplate(filter, currentStatisticsType))
    .join(``);

  return (`<form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
      <p class="statistic__filters-description">Show stats:</p>
        ${filterItemsTemplate}
      </form>`);
};

const createStatisticTemplate = (filters, data) => {
  const {totalDuration, sortType, watchedFilms, userRank} = data;

  return `<section class="statistic">
    <p class="statistic__rank">
      Your rank
      <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
      <span class="statistic__rank-label">${userRank}</span>
    </p>

    ${createFiltersTemplate(filters, sortType)}

    <ul class="statistic__text-list">
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">You watched</h4>
        <p class="statistic__item-text">${watchedFilms.length} <span class="statistic__item-description">movies</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Total duration</h4>
        <p class="statistic__item-text">${formatTotalDuration(totalDuration).totalHours} <span class="statistic__item-description">h</span> ${formatTotalDuration(totalDuration).totalMinutes} <span class="statistic__item-description">m</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Top genre</h4>
        <p class="statistic__item-text">Top genre</p>
      </li>
    </ul>

    <div class="statistic__chart-wrap">
      <canvas class="statistic__chart" width="1000"></canvas>
    </div>
  </section>`;
};

export default class Statistic extends SmartView {
  constructor(films, type) {
    super();

    this._data = {
      watchedFilms: films,
      sortType: type,
      userRank: generateRank(films),
      totalDuration: films.reduce((acc, current) => acc + current.filmInfo.runtime, 0),
    };

    this._chart = null;
    this._statisticsTypeClickHandler = this._statisticsTypeClickHandler.bind(this);
    this._setChart();
  }

  updateData(update) {
    this._data.watchedFilms = update.watchedFilms;
    this._data.sortType = update.sortType;
    this._data.totalDuration = update.watchedFilms.reduce((acc, current) => acc + current.filmInfo.runtime, 0);

    this.updateElement();
  }

  removeElement() {
    super.removeElement();

    if (this._chart !== null) {
      this._chart = null;
    }
  }

  restoreHandlers() {
    this._setChart();
    this.setSwitchStatisticsHandler(this._callback.showStatistic);
  }

  getTemplate() {
    return createStatisticTemplate(this._getStatisticFilters(), this._data);
  }

  _statisticsTypeClickHandler(evt) {
    evt.preventDefault();

    this._callback.showStatistic(evt.target.value);
  }

  setSwitchStatisticsHandler(callback) {
    this._callback.showStatistic = callback;
    this.getElement().querySelector(`.statistic__filters`).addEventListener(`change`, this._statisticsTypeClickHandler);
  }

  _getStatisticFilters() {
    return [
      {
        type: StatisticsType.ALL_TIME,
        name: `All time`,
      },
      {
        type: StatisticsType.TODAY,
        name: `Today`,
      },
      {
        type: StatisticsType.WEEK,
        name: `Week`,
      },
      {
        type: StatisticsType.MONTH,
        name: `Month`,
      },
      {
        type: StatisticsType.YEAR,
        name: `Year`,
      },
    ];
  }

  _setChart() {
    if (this._chart !== null) {
      this._chart = null;
    }

    const statisticsCanvasElement = this.getElement().querySelector(`.statistic__chart`);

    const sortedGenres = sortGenres(this._data.watchedFilms);
    const allGenres = Object.keys(sortedGenres);
    const genresCount = Object.values(sortedGenres);

    this._chart = renderChart(statisticsCanvasElement, allGenres, genresCount);
  }
}
