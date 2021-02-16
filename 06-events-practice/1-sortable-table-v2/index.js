export default class SortableTable {

    constructor(header = [], {data = []} = {}){

        this.header = header;
        this.data = data;

        this.title = 'Name';
        this.order = 'asc';

        this.render();
    }

    render(){
        this.sort('title', this.order);
        this.headerElement = this.createHeaderElement(this.header, this.title, this.order);
        this.bodyElement = this.createBodyElement(this.data);

        this.element = this.createElement(this.headerElement, this.bodyElement);
    }

    myEvent(item){

        item.addEventListener('pointerdown', (event)=>{

            let targetName = event.target.textContent.trim('');
 
            if (targetName != 'Image'){

                this.order = (this.order == 'asc') ? 'desc' : 'asc';
                this.title = (targetName != '') ? targetName : this.title;

                if (this.title == 'Name'){
                    this.sort('title', this.order);
                } else {
                    this.sort(this.title.toLocaleLowerCase(), this.order);
                }
                
                for (let item of this.headerElement.children){

                    if (item.textContent.trim('') == this.title) {

                        if (item.firstElementChild == item.lastElementChild){
                            item.setAttribute('data-order', this.order);
                            let spanArrow = document.createElement('div');
                            spanArrow.innerHTML = ` <span data-element="arrow" class="sortable-table__sort-arrow">
                                                        <span class="sort-arrow"></span>
                                                    </span>`;
                            item.append(spanArrow.firstElementChild);
                        } else {
                            item.setAttribute('data-order', this.order);
                        }
                    } else {
                        item.innerHTML = `<span>${item.textContent.trim('')}</span>`;
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

    getHeaderItems(header, title='Name', order='asc'){
        return [...header].map(item => {

            let headerItem = '';

            if (item.title == title){
                headerItem = `
                <div data-id="${item.id}" class="sortable-table__cell" data-sortable="${item.sortable}" data-order="${order}">
                    <span>${item.title}</span>
                    <span data-element="arrow" class="sortable-table__sort-arrow">
                        <span class="sort-arrow"></span>
                    </span>
                </div>`;
            }  else {
                headerItem = `
                <div data-id="${item.id}" class="sortable-table__cell" data-sortable="${item.sortable}" data-order="${order}">
                    <span>${item.title}</span>
                </div>`;
            }

            return headerItem;

        }).join('');
    }

    getBodyItems(data){

        return [...data].map(item => {

            let img = '';
            let title = '';
            let quantity = '';
            let price = '';
            let sales = '';
            
            if (item.images){
                img = `<div class="sortable-table__cell"><img class="sortable-table-image" alt="Image" src=${item.images[0].url}></div>`;
            } 

            if (item.title){
                title = `<div class="sortable-table__cell">${item.title}</div>`;
            }

            if (item.quantity){
                quantity = `<div class="sortable-table__cell">${item.quantity}</div>`;
            }

            if (item.price){
                price = `<div class="sortable-table__cell">${item.price}</div>`;
            }

            if (item.sales){
                sales = `<div class="sortable-table__cell">${item.sales}</div>`;
            }

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


    createHeaderElement(header = [], title, order){

            const headerElement = document.createElement('div');

            headerElement.innerHTML = `
            <div data-element="header" class="sortable-table__header sortable-table__row">
                ${this.getHeaderItems(header, title, order)}
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


