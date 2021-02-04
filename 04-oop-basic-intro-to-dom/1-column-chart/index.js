export default class ColumnChart {

    constructor(props){

        this.chartHeight = 50;
    
        if (props){

            this.data = props.data;
            this.label = props.label;
            this.value = props.value;
            this.link = props.link;

            this.element = this.createElementColumnChart(this.data, this.label, this.value, this.link);
                    
            console.log('data = ' + this.data);
            console.log('label = ' + this.label);
            console.log('value = ' + this.value);
            console.log('link = ' + this.link);
        }
        else {
            this.element = this.createEmptyElementColumnChart();
        }
    }


    update({data, label, value, link}) {
        return this.element = this.createElementColumnChart(data, label, value, link);
    }

    destroy() {
        this.element = null;
        return this.element;
    }

    remove() {
        this.element.remove();
        return this.element;
    }

    createEmptyElementColumnChart(){

        let node = document.createElement('div');

        node.classList.add("column-chart_loading");
            
        node.innerHTML = `
        <div class="column-chart__title">
            Total label
            <a href="#link" class="column-chart__link">More</a>
        </div>
        <div class="column-chart__container">
            <div class="column-chart__header">
                value
            </div>
            <div class="column-chart__chart"> 
                data                  
            </div>
        </div>
        `;

        return node;
    }

    createElementColumnChart(data, label, value, link){

        let node = document.createElement('div');

        node.innerHTML = `
        <div class="column-chart__title">
            Total ${label}
            <a href="${link}" class="column-chart__link">More</a>
        </div>
        <div class="column-chart__container">
            <div class="column-chart__header">
                ${value}
            </div>
            <div class="column-chart__chart"> 
                ${this.getLineValue(data)}                    
            </div>
        </div>
        `;

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

    getLineValue(data) {
        let str = '';
        if (data){
            const new_data = this.getColumnHeight(data);
            for(let item of new_data){
                str += `<div style="--value:${item.value}" data-tooltip="${item.percent}"></div>`
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
        if (val){
            this._data = val;
        }
        else {
            this._data = [];
        }
    }
    
    get label() {
        return this._label;
    } 

    set label(val) {
        if (val){
            this._label = val;
        } else {
            this._label = '';
        }
    }

    get link() {
        return this._link;
    } 

    set link(val) {
        if (val){
            this._link = val;
        } else {
            this._link = '';
        }
    }
     
    get chartHeight() {
        return this._chartHeight;
    } 

    set chartHeight(val) {
        if (val){
            this._chartHeight = val;
        } else {
            this._chartHeight = '';
        }
    }
}
