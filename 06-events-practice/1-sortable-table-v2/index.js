export default class SortableTable {

    constructor(header = [], {data = []} = {}){

        this.header = header;
        this.data = data;

        this.prevId = null;
        this.id = 'title';
        this.order = 'asc';

        this.render();
    }

    render(){
        this.sort(this.id, this.order);

        this.headerElement = this.createHeaderElement(this.header, this.id, this.order);
        this.bodyElement = this.createBodyElement(this.data);

        this.element = this.createElement(this.headerElement, this.bodyElement);
    }

    spanArrow(){
        return `<span data-element="arrow" class="sortable-table__sort-arrow">
                    <span class="sort-arrow"></span>
                </span>`;
    }

    myEvent(item){

        item.addEventListener('pointerdown', (event)=>{

            const myTarget = event.target.closest('.sortable-table__cell');

            if (myTarget.dataset.sortable === 'true'){

                const orderObj = {
                    'asc': 'desc',
                    'desc': 'asc'
                }

                this.order = orderObj[this.order];
                this.prevId = this.id;
                this.id = myTarget.dataset.id;
                   
                this.sort(this.id, this.order);

                myTarget.setAttribute('data-order', this.order);

                if (this.prevId != this.id){

                    for (let item of this.headerElement.children){

                        if (item.dataset.id == this.id) {
                            if (item.firstElementChild === item.lastElementChild){
                                item.innerHTML = `<span>${item.textContent.trim('')}</span>
                                                        ${this.spanArrow()}`;
                            } 
                        } else {
                            item.innerHTML = `<span>${item.textContent.trim('')}</span>`;
                        }
                    }
                }

                this.removeBody();
                this.bodyElement = this.createBodyElement(this.data);
                this.element.append(this.bodyElement);

            } 
        });
    }

    sortRow(data, key, orderValue = 'asc', kindSort = 'string'){

        if ((orderValue == 'asc') && (kindSort == 'string')){
            return data.sort((prev, next) => this.mySortStr(prev[key], next[key]));
        } else if ((orderValue == 'desc') && (kindSort == 'string')) {
            return data.sort((prev, next) => this.mySortStr(next[key], prev[key]));
        } else if ((orderValue == 'asc') && (kindSort == 'number')){
            return data.sort((prev, next) => (prev[key] - next[key]));
        } else {
            return data.sort((prev, next) => (next[key] - prev[key]));
        } 
    }
    
    mySortStr(str, str2){
        const collator = new Intl.Collator(['ru-RU', 'en-EN'], { caseFirst: 'upper' });
        return collator.compare(str, str2);
    }

    destroy(){
        this.remove();
    }

    sort(fieldValue, orderValue){

        switch (fieldValue) {
            case 'title':
                this.sortRow(this.data, fieldValue, orderValue, 'string');
                break;
            case 'quantity':
                this.sortRow(this.data, fieldValue, orderValue, 'number');
                break;
            case 'price':
                this.sortRow(this.data, fieldValue, orderValue, 'number');
                break;
            case 'sales':
                this.sortRow(this.data, fieldValue, orderValue, 'number');
                break;
            case 'custom':
                this.sortRow(this.data, fieldValue, orderValue, 'string');
                break;
            default:
                break;
        }
    }

    remove(){
        this.element.remove();
    }

    removeHeader(){
        this.headerElement.remove();
    }

    removeBody(){
        this.bodyElement.remove();
    }

    getHeaderItems(header, id='title', order='asc'){
        return [...header].map(item => {

            if (item.id === id){
                return `
                <div data-id="${item.id}" class="sortable-table__cell" data-sortable="${item.sortable}" data-order="${order}">
                    <span>${item.title}</span>
                    ${this.spanArrow()}
                </div>`;
            }  else {
                return `
                <div data-id="${item.id}" class="sortable-table__cell" data-sortable="${item.sortable}" data-order="${order}">
                    <span>${item.title}</span>
                </div>`;
            }

        }).join('');
    }

    getBodyItems(data){

        return [...data].map(item => {

            const img = (item.images) ? this.header[0].template(item.images) : '';
            const title = (item.title) ? `<div class="sortable-table__cell">${item.title}</div>` : '';
            const quantity = (item.quantity) ? `<div class="sortable-table__cell">${item.quantity}</div>` : '';
            const price = (item.price) ? `<div class="sortable-table__cell">${item.price}</div>` : '';
            const sales = (item.sales) ? `<div class="sortable-table__cell">${item.sales}</div>` : '';

            const bodyItem = `<a class="sortable-table__row" href="/products/${item.id}">
                                ${img}
                                ${title}
                                ${quantity}
                                ${price}
                                ${sales}
                            </a>`;

            return bodyItem;
        }).join('');
    }


    createHeaderElement(header = [], id, order){

            const headerElement = document.createElement('div');

            headerElement.innerHTML = `
            <div data-element="header" class="sortable-table__header sortable-table__row">
                ${this.getHeaderItems(header, id, order)}
            </div>`;
          
            this.myEvent(headerElement.firstElementChild);

            return headerElement.firstElementChild;
    }

    createBodyElement(data = []){

            const bodyElement = document.createElement('div');

            bodyElement.innerHTML = `
                <div data-element="body" class="sortable-table__body">
                    ${this.getBodyItems(data)}
                </div>
            `;         
            
            return bodyElement.firstElementChild;
    }

    createElement(headerElement, bodyElement){

        const node = document.createElement('div');
        node.classList.add("sortable-table");
        node.append(headerElement);
        node.append(bodyElement);

        return node;
    }

    get subElements(){
        const obj = {};
        obj.header = this.headerElement;
        obj.body = this.bodyElement;
        return obj;
    } 

    get firstElementChild(){
        return this.bodyElement.firstElementChild;
    }

    get lastElementChild(){
        return this.bodyElement.lastElementChild;
    }

    get element(){
        return this._element;
    }

    set element(val){
        this._element = val || null;
    }

    get dataElement(){
        return this._dataElement;
    }

    set dataElement(val){
        this._dataElement = val || null;
    }
}