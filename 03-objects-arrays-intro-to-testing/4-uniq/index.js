/**
 * uniq - returns array of uniq values:
 * @param {*[]} arr - the array of primitive values
 * @returns {*[]} - the new array with uniq values
 */
export function uniq(arr) {

    let res_arr = [];
    let index = 0;

    if (arr){
        for (let item of arr){
            if (!res_arr.includes(item)) {
                res_arr[index] = item;
                index++;
            }
        }
    }

    return(res_arr);
}
