import AbstractView from './abstract';

const createFooterStatsTemplate = (totalFilms) => {
  return `<p>${totalFilms} movies inside</p>`;
};

export default class FooterStats extends AbstractView {
  constructor(totalFilms) {
    super();

    this._totalFilms = totalFilms;
  }

  getTemplate() {
    return createFooterStatsTemplate(this._totalFilms);
  }
}
