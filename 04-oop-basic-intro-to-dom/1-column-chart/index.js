export default class ColumnChart {

    static countColumnChart = 0;

    constructor(props){

        this.chartHeight = 50;
    
        if (props){

            this.data = props.data;
            this.label = props.label;
            this.value = props.value;
            this.link = props.link;

            this.element = this.createElementColumnChart(this.data, this.label, this.value, this.link);
        }
        else {
            this.element = this.createEmptyElementColumnChart();
        }
    }


    update({data, label, value, link}) {
        return this.element = this.createElementColumnChart(data, label, value, link);
    }

    destroy() {
        this.remove();
    }

    remove() {
        this.element.remove();
    }

    createEmptyElementColumnChart(){

        let node = document.createElement('div');
        node.classList.add("column-chart_loading");
            
        node.innerHTML = `
        <div class="column-chart__title">
            Total label
            <a href="#link" class="column-chart__link">View all</a>
        </div>
        <div class="column-chart__container">
            <div data-element="header" class="column-chart__header">
                value
            </div>
            <div data-element="body" class="column-chart__chart"> 
                data                  
            </div>
        </div>
        `;

        return node;
    }

    createElementColumnChart(data, label, value, link){

        ColumnChart.countColumnChart++;

        let node = document.createElement('div');
        node.classList.add("column-chart");
        node.style = `--chart-height: ${this.chartHeight}`;
        
        let childTitle = document.createElement('div');
        childTitle.classList.add('column-chart__title');
        childTitle.innerHTML = `Total ${label}`;

        if (link){
            childTitle.innerHTML += `<a href="${link}" class="column-chart__link">View all</a>`;
        }

        node.append(childTitle);

        let childContainer = document.createElement('div');
        childContainer.classList.add('column-chart__container');

        childContainer.innerHTML = `
            <div data-element="header" class="column-chart__header">
                ${value}
            </div>
            <div data-element="body" class="column-chart__chart"> 
                ${this.getChartValue(data)}                    
            </div>
        `; 

        node.append(childContainer);

        return node;
    }

    getColumnHeight(data){
        const maxValue = Math.max(...data);
        const scale = 50 / maxValue;

        return data.map(elem => {
            return {
                value: String(Math.floor(elem * scale)),
                percent: ((elem / maxValue)*100).toFixed(0) + '%',
            }
        });
    }

    getChartValue(data) {
        let str = '';
        if (data){
            const newData = this.getColumnHeight(data);
            for(let item of newData){
                str += `<div style="--value: ${item.value}" data-tooltip="${item.percent}"></div>`
            }
        }
        return str;
    }

    get element() {
        return this._element;
    } 

    set element(val) {
        if (val){
            this._element = val;
        }
        else {
            this._element = this.createEmptyElementColumnChart();
        }
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
