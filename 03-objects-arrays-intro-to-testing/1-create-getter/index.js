/**
 * createGetter - creates function getter which allows select value from object
 * @param {string} path - the strings path separated by dot
 * @returns {function} - function-getter which allow get value from object by set path
 */
export function createGetter(path) {

    const [...arr] = path.split('.');

    return (product) => {
        let temp = Object.assign({}, product);
        for (let item of arr){
            if (item in temp) {
                temp = temp[item];
            } else {
                return undefined;
            }
        }
        return temp;
    }; 
}

const product = {
    category: {
      title: 'Goods'
    }
  }
  
const getter = createGetter('category.bar');
  
console.log(getter(product));