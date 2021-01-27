/**
 * pick - Creates an object composed of the picked object properties:
 * @param {object} obj - the source object
 * @param {...string} fields - the properties paths to pick
 * @returns {object} - returns the new object
 */
export const pick = (obj, ...fields) => {

    let copy_fields = [...fields]; 
    let res_obj = {};

     for (let i=0; i<copy_fields.length; i++){
        for (let key of Object.keys(obj)){
            if (copy_fields[i] == key){
                res_obj[key] = obj[key];
            }
        }
    } 

    return res_obj;
};
