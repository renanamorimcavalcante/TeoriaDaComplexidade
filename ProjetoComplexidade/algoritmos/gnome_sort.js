function gnomeSort(arr) {
  let i = 0;
  while (i < arr.length) {
    if (i === 0 || arr[i] >= arr[i - 1]) {
      i++;
    } else {
      [arr[i], arr[i - 1]] = [arr[i - 1], arr[i]];
      i--;
    }
  }
}
module.exports = { gnomeSort };