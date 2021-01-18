import Observer from "../utils/observer";
import {MenuItem} from "../const";

export default class DisplayedContent extends Observer {
  constructor() {
    super();

    this._displayedContent = MenuItem.FILMS;
  }

  setDisplayedContent(updateType, filter) {
    this._displayedContent = filter;
    this._notify(updateType, filter);
  }

  getDisplayedContent() {
    return this._displayedContent;
  }
}
