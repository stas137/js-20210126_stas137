/**
 * omit - creates an object composed of enumerable property fields
 * @param {object} obj - the source object
 * @param {...string} fields - the properties paths to omit
 * @returns {object} - returns the new object
 */
export const omit = (obj, ...fields) => {
    
    const copy_fields = [...fields]; 
    let res_obj = {};

    for (let [key, value] of Object.entries(obj)){
        if (!copy_fields.includes(key)){
            res_obj[key] = value;
        }
    }
    
    return res_obj;
};
