function indexOfMin(a, start) {
    let min_i = start;
    let min = a[min_i];
    for (let i = start; i < a.length; ++i) {
        if (a[i] < min) {
            min = a[i];
            min_i = i;
        }
    }
    return min_i;
}

function selectionSort(a) {
    for (let i = 0; i < a.length; ++i) {
        const min_i = indexOfMin(a, i);
        const tmp = a[i];
        a[i] = a[min_i];
        a[min_i] = tmp;
    }
    return a;
}

module.exports = selectionSort;
