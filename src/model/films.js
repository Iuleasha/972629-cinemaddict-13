import Observer from "../utils/observer";

export default class Films extends Observer {
  constructor() {
    super();

    this._films = [];
  }

  static adaptToClient(film) {
    const adaptedMovie = Object.keys(film).map((item) => {
      let key = item;
      let objectValue = film[key];
      const index = key.indexOf(`_`);

      if (objectValue instanceof Object && !Array.isArray(objectValue)) {
        objectValue = Films.adaptToClient(objectValue);
      } else if (objectValue && objectValue instanceof Date) {
        objectValue = new Date(objectValue);
      }

      if (index >= 0) {
        const chart = item.charAt(index + 1);
        key = item.replace(`_${chart}`, chart.toLocaleUpperCase());
      }

      return {[key]: objectValue};
    });

    return Object.assign({}, ...adaptedMovie);
  }

  getFilms() {
    return this._films;
  }

  static adaptToServer(film) {
    const {filmInfo, userDetails} = film;
    const adaptedFilm = Object.assign(
        {},
        film,
        {
          "film_info": Object.assign({}, filmInfo, {
            "alternative_title": filmInfo.alternativeTitle,
            "total_rating": filmInfo.totalRating,
            "age_rating": filmInfo.ageRating,
            "release": {
              "date": filmInfo.release.date ? new Date(filmInfo.release.date).toISOString() : null,
              "release_country": filmInfo.release.releaseCountry,
            },
          }),
          "user_details": Object.assign({}, userDetails, {
            "already_watched": userDetails.alreadyWatched,
            "watching_date": userDetails.watchingDate ? new Date(userDetails.watchingDate).toISOString() : null,
          }
          )});

    delete adaptedFilm.filmInfo;
    delete adaptedFilm.film_info.alternativeTitle;
    delete adaptedFilm.film_info.totalRating;
    delete adaptedFilm.film_info.ageRating;
    delete adaptedFilm.userDetails;
    delete adaptedFilm.user_details.alreadyWatched;
    delete adaptedFilm.user_details.watchingDate;

    return adaptedFilm;
  }

  setFilms(updateType, films) {
    this._films = films.slice();

    this._notify(updateType);
  }

  updateFilms(updateType, update) {
    const index = this._films.findIndex((film) => film.id === update.id);

    if (index === -1) {
      throw new Error(`Can't update unexisting film`);
    }

    this._films = [
      ...this._films.slice(0, index),
      update,
      ...this._films.slice(index + 1),
    ];

    this._notify(updateType, update);
  }
}
