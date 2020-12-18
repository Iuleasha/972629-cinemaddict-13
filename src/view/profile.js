import {generateRank} from './statistic';
import AbstractView from './abstract';

const createProfileTemplate = () => {
  return `<section class="header__profile profile">
    <p class="profile__rating">${generateRank()}</p>
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    </section>`;
};

export default class Profile extends AbstractView {
  getTemplate() {
    return createProfileTemplate();
  }
}
