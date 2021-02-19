export default class ColumnChart {

    constructor({ data=[], label='', value='', link=''} = {}){

        this.chartHeight = 50;

        this.data = data;
        this.label = label;
        this.value = value;
        this.link = link;

        this.render();
    }
    
    render(){
        this.element = this.createElementColumnChart(this.data);
    }

    update({ data = [] }) {
        return this.element = this.createElementColumnChart(data);
    }

    destroy() {
        this.remove();
    }

    remove() {
        this.element.remove();
    }

    createElementColumnChart(data){

        const classMain = (data[0]) ? 'column-chart' : 'column-chart column-chart_loading';
        const linkMain = (this.link) ? `<a href="${this.link}" class="column-chart__link">View all</a>` : '';
        
        const node = document.createElement('div');

        node.innerHTML = `
            <div class="${classMain}" style="--chart-height: ${this.chartHeight}">
                <div class="column-chart__title">
                    Total ${this.label}
                    ${linkMain}
                </div>
                <div class="column-chart__container">
                    <div data-element="header" class="column-chart__header">${this.value}</div>
                    <div data-element="body" class="column-chart__chart"> 
                        ${this.getChartValue(data)}                   
                    </div>
                </div>
            </div>
        `;

        return node.firstElementChild;
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

    get element() {
        return this._element;
    } 

    set element(val) {
            this._element = val || '';
    }
    
    get data() {
        return this._data;
    } 

    set data(val) {
        this._data = val || [];
    }
    
    get label() {
        return this._label;
    } 

    set label(val) {
        this._label = val || '';
    }

    get link() {
        return this._link;
    } 

    set link(val) {
            this._link = val || '';
    }
     
    get chartHeight() {
        return this._chartHeight;
    } 

    set chartHeight(val) {
        this._chartHeight = val || '';
    }
}
