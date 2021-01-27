/**
 * omit - creates an object composed of enumerable property fields
 * @param {object} obj - the source object
 * @param {...string} fields - the properties paths to omit
 * @returns {object} - returns the new object
 */
export const omit = (obj, ...fields) => {
    
/*     const obj = {
        apple: 2,
        orange: 4,
        banana: 3
    };
    let copy_fields = ['apple', 'banana']; */

    let copy_obj = Object.entries(obj);
    let copy_fields = [...fields]; 

    let res_obj = {};
    let flag = false;

    for (let item of copy_obj){
        flag = false;
        for (let item_f of copy_fields){
            if (item[0] == item_f){
                flag = true;
                break;
            }
        } 
        if (!flag) {
            res_obj[item[0]]=item[1];
        }
    }
    
    return res_obj;
};
