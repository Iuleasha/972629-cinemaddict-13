import dayjs from 'dayjs';

export const RenderPosition = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`
};

export const render = (container, element, place) => {
  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(element);
      break;
    case RenderPosition.BEFOREEND:
      container.append(element);
      break;
  }
};
export const renderTemplate = (container, template, place = `beforeend`) => {
  container.insertAdjacentHTML(place, template);
};
export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;

  return newElement.firstChild;
};

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
