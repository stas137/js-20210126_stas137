import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru';
const START = 0;
const END = 30;
const OFFSET = 250;

export default class SortableTable {

    constructor(header = [], {url = ''} = {}){

        this.header = header;

        this.start = START;
        this.end = END;

        this.prevId = null;
        this.id = 'title';
        this.order = 'asc';
        this.data = [];

        this.offset = OFFSET;
        this.flag = false;

        this.url = url;

        this.render();

        document.addEventListener('scroll', () => {

            if ( ((document.documentElement.scrollTop + document.documentElement.clientHeight + this.offset) > document.documentElement.scrollHeight) && (!this.flag)) {
                this.flag = !this.flag;
                this.start = this.end + 1;
                this.end += this.end;

                this.sortOnServer(this.id, this.order);
            }

        });
    }

    async sortOnServer(fieldValue, orderValue){
        this.URL = new URL(this.url+`?_sort=${fieldValue}&_order=${orderValue}&_start=${this.start}&_end=${this.end}`, BACKEND_URL);
        await this.getData(this.URL.toString());
    }

    async render(){
        
        if (!this.element){
            
            this.headerElement = this.createHeaderElement(this.header, this.id, this.order);
            this.bodyElement = this.createBodyElement(this.data);
            this.loadingElement = this.createLoadingElement();

            this.element = this.createElement(this.headerElement, this.bodyElement, this.loadingElement);
        }

        await this.sortOnServer(this.id, this.order);
   
    }

    async getData(url){

        if (!this.start) { 
            this.showLoading(); 
        }

        const responce = await fetch(url);
        const data = await responce.json();
        
        if (!this.start) {
            this.data = data;
        } else {
            this.data.push(...data);
        }

        this.removeBody();
        this.bodyElement = this.createBodyElement(this.data);
        this.element.append(this.bodyElement);

        this.hideLoading();

        this.flag = false;
    }

    spanArrow(){
        return `<span data-element="arrow" class="sortable-table__sort-arrow">
                    <span class="sort-arrow"></span>
                </span>`;
    }

    myEvent(item){

        item.addEventListener('pointerdown', (event) => {

            const myTarget = event.target.closest('.sortable-table__cell');

            if (myTarget.dataset.sortable === 'true'){

                const orderObj = {
                    'asc': 'desc',
                    'desc': 'asc'
                }

                this.order = orderObj[this.order];
                this.prevId = this.id;
                this.id = myTarget.dataset.id;

                this.start = START;
                this.end = END;
                
                this.sortOnServer(this.id, this.order);

                myTarget.setAttribute('data-order', this.order);

                if (this.prevId != this.id){

                    for (let item of this.headerElement.children){

                        if (item.dataset.id == this.id) {
                            if (item.firstElementChild === item.lastElementChild){
                                item.innerHTML = `<span>${item.textContent.trim()}</span>
                                                        ${this.spanArrow()}`;
                            } 
                        } else {
                            item.innerHTML = `<span>${item.textContent.trim()}</span>`;
                        }
                    }
                }
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

    showLoading(){
        this.loadingElement.style.display = 'block';
        this.bodyElement.style.display = 'none';
    }

    hideLoading(){
        this.loadingElement.style.display = 'none';
        this.bodyElement.style.display = '';
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
            
            const status = this.header[4].template(item.status);

            const bodyItem = `<a class="sortable-table__row" href="/products/${item.id}">
                                ${img}
                                ${title}
                                ${quantity}
                                ${price}
                                ${sales}
                                ${status}
                            </a>`;

            return bodyItem;
        }).join('');
    }

    createLoadingElement(){

        const loadingElement = document.createElement('div');

        loadingElement.innerHTML = `
        <div data-element="loading" class="loading-line sortable-table__loading-line">
        </div>`;
        loadingElement.firstElementChild.style.display = 'block';

        return loadingElement.firstElementChild;
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

    createElement(headerElement, bodyElement, loadingElement){

        const node = document.createElement('div');
        node.classList.add("sortable-table");

        node.append(headerElement);
        node.append(bodyElement);
        node.append(loadingElement);

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