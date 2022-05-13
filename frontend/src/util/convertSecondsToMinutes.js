export const convertSecondsToMinutes = (seconds) => {
  const convert = (x) => (x < 10 ? '0' + x : x);

  return convert(parseInt((seconds / 60) % 60)) + ' : ' + String(convert(seconds % 60)).slice(0, 2);
};

export default convertSecondsToMinutes;
