import dayjs from 'dayjs';
import {getRandomArrayItem, getRandomInteger} from '../utils/common';

const generateTextComment = () => {
  const comments = [
    `Необычный сюжет, спецэффекты, игра актёров;`,
    `Крутой фильм, но надо смотреть очень внимательно, иначе теряется нить сюжета.`,
    `Отличное качество, не пусто, со смыслом, операторская работа, графика, оригинальность`,
    `Немного затянуто, даже несмотря на постоянную динамику событий,`
  ];

  return getRandomArrayItem(comments);
};

const generateAuthorName = () => {
  const authors = [
    `Андрей К.`,
    `Юлия М.`,
    `Сергей В.`,
  ];

  return getRandomArrayItem(authors);
};

export const emotion = [`smile`, `sleeping`, `puke`, `angry`];

export const generateData = () => {
  const maxYearsGap = 2021;
  const yearGap = getRandomInteger(maxYearsGap - 1, maxYearsGap);
  const daysGap = getRandomInteger(1, 31);
  const monthGap = getRandomInteger(1, 12);

  return dayjs().set(`year`, yearGap).set(`month`, monthGap).set(`day`, daysGap).toDate();
};

export const generateCommentBlock = (index) => {
  return {
    id: index,
    comment: generateTextComment(),
    emotion: getRandomArrayItem(emotion),
    author: generateAuthorName(),
    date: generateData(),
  };
};
