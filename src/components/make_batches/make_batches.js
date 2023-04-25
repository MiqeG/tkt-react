export const makeBatches = (items, batchSize) => {
  const arrayOfArrays = [];

  while (items.length) {
    arrayOfArrays.push(items.splice(0, batchSize));
  }
  return arrayOfArrays;
};
