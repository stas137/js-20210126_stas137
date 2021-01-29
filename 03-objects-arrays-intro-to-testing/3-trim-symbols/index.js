/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {

    const copy_arr = [...string];
    let res_arr = [];
    let res_str = '';
    let index = 0;

    for (let item of copy_arr){
        if (res_arr[index] == undefined){
            res_arr[index] = item;
        } else {
            if (res_arr[index].includes(item)){
                res_arr[index] += item;
            } else {
                index++;
                res_arr[index] = item;
            }
        }
    }

    for (let item of res_arr){
        res_str += item.slice(0, size);
    }

    return(res_str);
}
