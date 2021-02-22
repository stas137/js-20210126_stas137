export default class SortableTable {

    constructor(header = [], { data = [] } = {}){

        this.header = header;
        this.data = data;

        this.render();
    }

    render(){

        this.headerElement = this.createHeaderElement(this.header);
        this.bodyElement = this.createBodyElement(this.data, this.header);

        this.element = this.createElement(this.headerElement, this.bodyElement);
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
            default:
                break;
        }
        
        this.removeHeader();
        this.removeBody();

        this.headerElement = this.createHeaderElement(this.header, fieldValue, orderValue);
        this.bodyElement = this.createBodyElement(this.data);

        this.element.append(this.headerElement);
        this.element.append(this.bodyElement);
    }

    remove(){
        this.element.remove();
    }

    removeBody(){
        this.bodyElement.remove();
    }

    removeHeader(){
        this.headerElement.remove();
    }

    getHeaderItems(header, fieldValue = 'title', order){
        return [...header].map(item => {

            let headerItem = '';

            const orderItem = (order) ? `data-order="${order}"` : '';


            if ((item.id == fieldValue) && (item.id!='images')){
                headerItem = `
                <div data-id="${item.id}" class="sortable-table__cell" data-sortable="${item.sortable}" ${orderItem}>
                    <span>${item.title}</span>
                    <span data-element="arrow" class="sortable-table__sort-arrow">
                        <span class="sort-arrow"></span>
                    </span>
                </div>`;
            } else {
                headerItem = `
                <div data-id="${item.id}" class="sortable-table__cell" data-sortable="${item.sortable}" ${orderItem}>
                    <span>${item.title}</span>
                </div>`;
            }

            return headerItem;

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


    createHeaderElement(header = [], fieldValue, orderValue){

            const headerElement = document.createElement('div');

            headerElement.innerHTML = `
            <div data-elem="header" class="sortable-table__header sortable-table__row">
                ${this.getHeaderItems(header, fieldValue, orderValue)}
            </div>`;

            return headerElement.firstElementChild;
    }

    createBodyElement(data = []){

            const bodyElement = document.createElement('div');

            bodyElement.innerHTML = `
                <div data-elem="body" sortable-table__body>
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
        const body = this.bodyElement;
        return { body };
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