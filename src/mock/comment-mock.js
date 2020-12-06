import dayjs from 'dayjs';
import {getRandomArrayItem, getRandomInteger} from '../utils/utils';

const generateTextComment = () => {
  const comments = [
    `Необычный сюжет, спецэффекты, игра актёров;`,
    `Крутой фильм, но надо смотреть очень внимательно, иначе теряется нить сюжета.`,
    `Отличное качество, не пусто, со смыслом, операторская работа, графика, оригинальность`,
    `Немного затянуто, даже несмотря на постоянную динамику событий,`
  ];

  return getRandomArrayItem(comments);
};

const generateEmojiBlock = () => {
  const emoji = [
    `smile.png`,
    `sleeping.png`,
    `puke.png`,
    `angry.png`
  ];

  return `./images/emoji/${getRandomArrayItem(emoji)}`;
};

const generateAuthorName = () => {
  const authors = [
    `Андрей К.`,
    `Юлия М.`,
    `Сергей В.`
  ];

  return getRandomArrayItem(authors);
};

export const generateData = () => {
  const maxYearsGap = 2010;
  const yearGap = getRandomInteger(maxYearsGap - 10, 2020);
  const daysGap = getRandomInteger(1, 31);
  const monthGap = getRandomInteger(1, 12);

  return dayjs().set(`year`, yearGap).set(`month`, monthGap).set(`day`, daysGap).toDate();
};

export const generateCommentBlock = () => {
  return {
    text: generateTextComment(),
    emoji: generateEmojiBlock(),
    author: generateAuthorName(),
    date: generateData(),
  };
};
