export default class ColumnChart {
    
    constructor({url = '', range = '', label='', link='', formatHeading = ''} = {}) {

        this.chartHeight = 50;

        this.url = url;
        this.range = range;
        this.label = label;
        this.link = link;
        this.formatHeading = formatHeading;
        this.data = [];

        this.render();
    }

    async getData(from, to){
        const str = `https://course-js.javascript.ru/${this.url}?from=${from}&to=${to}`;
        const responce = await fetch(str);
        const data = await responce.json();

        this.data = data;
        this.element = this.createColumnChart(this.data, this.label, this.link);
    }

    render(){             
        this.getData(this.range.from, this.range.to);
        this.element = this.createColumnChart(this.data, this.label, this.link);
     }

    get subElements(){
        const body = this.bodyElement.firstElementChild;
        return { body };
    }

    async update(from, to){
        this.element.classList.add('column-chart_loading');
        await this.getData(from, to);
    }

    createBodyElement(arrData){
        const node = document.createElement('div');
        node.innerHTML = `
        <div data-element="body" class="column-chart__chart"> 
            ${this.getChartValue(arrData)}                   
        </div>`;
        return node;
    }

    createInnerColumnChart(label, linkMain, valueTotal){
        return `
        <div class="column-chart__title">
            Total ${label}
            ${linkMain}
        </div>
        <div class="column-chart__container">
            <div data-element="header" class="column-chart__header">${(this.formatHeading) ? this.formatHeading(valueTotal) : valueTotal}</div>
            ${this.bodyElement.innerHTML}
        </div>
        `;
    }

    createColumnChart(data = {}, label = '', link = ''){

        const valueTotal = (label === 'sales') ? Object.values(data).reduce((sum,item)=>{return sum+item;}, 0) : Object.values(data).length;
        
        const classMain = (Object.values(data)[0]) ? 'column-chart' : 'column-chart column-chart_loading';
        
        const linkMain = (link) ? `<a href="${link}" class="column-chart__link">View all</a>` : '';
        
        if (!this.element){

            const node = document.createElement('div');
            this.bodyElement = this.createBodyElement(Object.values(data));

            node.innerHTML = `
                <div class="${classMain}" style="--chart-height: ${this.chartHeight}">
                    ${this.createInnerColumnChart(label, linkMain, valueTotal)}
                </div>
            `;

            return node.firstElementChild;

        } else {
            this.element.classList.remove('column-chart_loading');
            this.bodyElement.remove();
            this.bodyElement = this.createBodyElement(Object.values(data));

            this.element.innerHTML = this.createInnerColumnChart(label, linkMain, valueTotal);

            return this.element;
        }
    }

    getColumnHeight(data, chartHeight){
        const maxValue = Math.max(...data);
        const scale = chartHeight / maxValue;

        return data.map(elem => {
            return {
                value: String(Math.floor(elem * scale)),
                percent: ((elem / maxValue)*100).toFixed(0) + '%',
            }
        });
    }

    getChartValue(data) {
        return this.getColumnHeight(data, this.chartHeight).map(item => {
            return `<div style="--value: ${item.value}" data-tooltip="${item.percent}"></div>`;
        }).join('');
    }

    destroy(){
        this.remove();
    }

    remove(){
        this.element.remove();
    }

    get element(){
        return this._element;
    }

    set element(val){
        this._element = val || '';
    }
}