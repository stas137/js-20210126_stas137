/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export function sortStrings(arr, param = 'asc') {
    const new_arr = arr.map(item => item);
    //const new_arr = arr.slice(0, arr.length);

    const collator = new Intl.Collator(['ru-RU', 'en-EN'], { caseFirst: 'upper' });

    if (param == 'asc'){
        return new_arr.sort((str, str2) => {
            return collator.compare(str, str2);
        });
    }
    else {
        return new_arr.sort((str2, str) => {
            return collator.compare(str, str2);
        });
    }
}


