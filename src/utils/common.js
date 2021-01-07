import dayjs from 'dayjs';

export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const randomNumber = (a, b) => {
  const lower = Math.min(a, b);
  const upper = Math.max(a, b);

  return lower + Math.random() * (upper - lower);
};

export const createEmptyArray = (length) => {
  return new Array(length ? length : 1).fill();
};

export const createRandomArray = (array) => {
  const randomIndex = getRandomInteger(0, array.length - 1);

  return createEmptyArray(randomIndex).map(() => array[getRandomInteger(0, array.length - 1)]);
};

export const getRandomArrayItem = (array) => {
  const randomIndex = getRandomInteger(0, array.length - 1);

  return array[randomIndex];
};

export const formatDate = (date, format) => {
  return dayjs(date).format(format);
};

export const getDuration = (time) => {
  let duration = ``;

  if (time.hour > 0) {
    duration += `${time.hour}h `;
  }

  duration += `${time.minutes < 10 ? `0` : ``}${time.minutes}m`;

  return duration;
};

export const updateItem = (items, update) => {
  const index = items.findIndex((item) => item.id === update.id);

  if (index === -1) {
    return items;
  }

  return [
    ...items.slice(0, index),
    update,
    ...items.slice(index + 1)
  ];
};
