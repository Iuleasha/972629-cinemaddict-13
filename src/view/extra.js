import AbstractView from './abstract';


const createExtraTemplate = (title) => {
  return `<section class="films-list films-list--extra">
      <h2 class="films-list__title">${title}</h2>
    </section>`;
};

export default class FilmCardExtras extends AbstractView {
  constructor(title) {
    super();

    this.title = title;
  }

  getTemplate() {
    return createExtraTemplate(this.title);
  }
}
