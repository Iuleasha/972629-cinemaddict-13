import AbstractView from './abstract';

const createFooterStatsTemplate = () => {
  return `<p>130 291 movies inside</p>`;
};

export default class FooterStats extends AbstractView {
  getTemplate() {
    return createFooterStatsTemplate();
  }
}
