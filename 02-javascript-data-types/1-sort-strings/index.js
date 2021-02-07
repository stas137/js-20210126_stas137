/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export function sortStrings(arr, param = 'asc') {

    const arrCopy = [...arr];
    let direction = 1;

    switch (param){
        case 'asc':
            direction = 1;
            break;
        case 'desc':
            direction *= -1;
            break;
        default:
            return arrCopy;
    }

    return arrCopy.sort((str, str2) => direction*mySortStr(str, str2));

}

function mySortStr(str, str2){
    const collator = new Intl.Collator(['ru-RU', 'en-EN'], { caseFirst: 'upper' });
    return collator.compare(str, str2);
}

