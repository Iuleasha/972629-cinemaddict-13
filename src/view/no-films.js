import AbstractView from './abstract';

const createNoMoviesTemplate = () => `<section class="films-list">
      <h2 class="films-list__title">There are no movies in our database</h2>
    </section>`;


export default class NoFilms extends AbstractView {
  getTemplate() {
    return createNoMoviesTemplate();
  }
}
