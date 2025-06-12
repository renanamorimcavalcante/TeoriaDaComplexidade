function cocktailSort(arr) {
  let start = 0;
  let end = arr.length - 1;
  let swapped = true;

  while (swapped) {
    swapped = false;

    for (let i = start; i < end; i++) {
      if (arr[i] > arr[i + 1]) {
        [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
        swapped = true;
      }
    }

    if (!swapped) break;

    swapped = false;
    end--;

    for (let i = end; i > start; i--) {
      if (arr[i] < arr[i - 1]) {
        [arr[i], arr[i - 1]] = [arr[i - 1], arr[i]];
        swapped = true;
      }
    }

    start++;
  }
}
module.exports = { cocktailSort };