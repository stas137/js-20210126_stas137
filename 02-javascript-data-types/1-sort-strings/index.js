/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export function sortStrings(arr, param = 'asc') {
    //let param = 'asc';
    
    //let arr = ['banana', 'Banana', 'яблоко', 'Яблоко', 'ёжик', 'Ёжик'];
    //console.log(arr);

    let new_arr = arr.map(item => item);
    //let new_arr = arr.slice(0, arr.length);

    new_arr.sort(function (str, str2){
        let collator = new Intl.Collator(['ru-RU', 'en-EN'], { caseFirst: 'upper' });
        return collator.compare(str, str2);
        //return str.localeCompare(str2);
    });

    if (param == 'asc'){
        //console.log(new_arr);
        return new_arr;
    }
    else {
        new_arr.reverse();
        //console.log(new_arr);
        return new_arr;
    }
    
}


