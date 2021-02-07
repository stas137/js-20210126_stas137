/**
 * uniq - returns array of uniq values:
 * @param {*[]} arr - the array of primitive values
 * @returns {*[]} - the new array with uniq values
 */
export function uniq(arr) {

    let resArr = [];
    let set = new Set(undefined);

    for (let item of set.values()){
        resArr.push(item);
    }

    return(resArr);
}
