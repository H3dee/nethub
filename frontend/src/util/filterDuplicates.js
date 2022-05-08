export const filterDuplicatesByField = (listOfItems, fieldName) => {
  let prevRecord = null;

  const filteredList = listOfItems.filter((record, i) => {
    const isFirstIteration = i === 0;
    const isDuplicate = isFirstIteration ? false : record[fieldName] === prevRecord[fieldName];

    prevRecord = record;

    if (isDuplicate) {
      return false;
    }

    return true;
  });

  return filteredList;
};

export default filterDuplicatesByField;
