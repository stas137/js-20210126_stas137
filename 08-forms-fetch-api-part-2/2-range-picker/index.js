export default class RangePicker {
    constructor({from, to}){

        this.from = from;
        this.to = to;

        this.leftMonth = this.from.getMonth();
        this.rightMonth = this.to.getMonth();
        this.leftYear = this.from.getFullYear();
        this.rightYear = this.to.getFullYear();

        this.stepRight = 0;
        this.stepLeft = 0;

        this.leftDate = null;
        this.rightDate = null;

        this.leftCell = null;
        this.rightCell = null;

        this.leftGrid = null;
        this.rightGrid = null;

        this.calendar = [];

        this.rangepickerOpen = this.rangepickerOpen.bind(this);
        this.rangepickerChange = this.rangepickerChange.bind(this);
        this.selectMonth = this.selectMonth.bind(this);
        this.getFormatDate = this.getFormatDate.bind(this);
        this.rangepickerClear = this.rangepickerClear.bind(this);
        this.calendarClear = this.calendarClear.bind(this);
        this.rangepickerBetweenSelected = this.rangepickerBetweenSelected.bind(this);

        this.render();
    }

    render(){

        for (let i = 2018; i<2021; i++){
            this.calendar[i] = [];
            for (let j = 0; j<12; j++){
                this.calendar[i][j] = this.createRangepickerGrid(new Date(i, j, 1));
            }
        }

        this.rangepickerBetweenSelected(this.from, this.to);

        this.element = this.createElement();
        this.rangepickerSelectorInner = this.createRangepickerSelector();

        this.rangepickerSelector = this.element.querySelector('.rangepicker__selector');
        this.rangepickerSelector.addEventListener('click', this.selectMonth);

        this.elementRangepickerOpen = this.element.querySelector('.rangepicker__input');
        this.elementRangepickerOpen.addEventListener('click', this.rangepickerOpen);
    }

    rangepickerOpen(event){

        this.element.classList.toggle('rangepicker_open');

        if (this.element.classList.contains('rangepicker_open')){

            if (!this.rangepickerSelector.innerHTML) {
                this.rangepickerSelector.innerHTML = this.rangepickerSelectorInner.innerHTML;
            }
            this.rangepickerDateGrid = this.element.querySelectorAll('.rangepicker__date-grid');
            this.leftGrid = this.rangepickerDateGrid[0];
            this.rightGrid = this.rangepickerDateGrid[1];
        }

    }

    rangepickerChange(direction){
        
         if ((direction === 1) && (this.rightMonth === 11)){
            this.rightYear += 1;
            this.rightMonth = -1;
        }

        if ((direction === 1) && (this.leftMonth === 11)){
            this.leftYear += 1;
            this.leftMonth = -1;
        }

        if ((direction === -1) && (this.rightMonth === 0)){
            this.rightYear -= 1;
            this.rightMonth = 12;
        }

        if ((direction === -1) && (this.leftMonth === 0)){
            this.leftYear -= 1;
            this.leftMonth = 12;
        } 

        this.rightMonth += direction;
        this.leftMonth += direction;

        const leftIndicator = this.leftGrid.parentElement.querySelector('.rangepicker__month-indicator');
        leftIndicator.firstElementChild.innerHTML = this.getFormatMonth(this.leftMonth);
        leftIndicator.firstElementChild.setAttribute('datetime', this.getFormatMonth(this.leftMonth));

        const rightIndicator = this.rightGrid.parentElement.querySelector('.rangepicker__month-indicator');
        rightIndicator.firstElementChild.innerHTML = this.getFormatMonth(this.rightMonth);
        rightIndicator.firstElementChild.setAttribute('datetime', this.getFormatMonth(this.rightMonth));

        this.leftGrid.innerHTML = this.calendar[this.leftYear][this.leftMonth].innerHTML;
        this.rightGrid.innerHTML = this.calendar[this.rightYear][this.rightMonth].innerHTML;

    }

    
    rangepickerClear(rangepickerDateGrid){
        for (let j=0; j < rangepickerDateGrid.length; j++){
            for (let i=0; i < rangepickerDateGrid[j].children.length; i++){
                if (rangepickerDateGrid[j].children[i].classList.contains('rangepicker__selected-from')){
                    rangepickerDateGrid[j].children[i].classList.toggle('rangepicker__selected-from');
                }
                if (rangepickerDateGrid[j].children[i].classList.contains('rangepicker__selected-between')){
                    rangepickerDateGrid[j].children[i].classList.toggle('rangepicker__selected-between');
                }
                if (rangepickerDateGrid[j].children[i].classList.contains('rangepicker__selected-to')){
                    rangepickerDateGrid[j].children[i].classList.toggle('rangepicker__selected-to');
                }
            }
        }
    }

    calendarClear(calendar){
        for (let j = 2018; j<2021; j++){
            for (let i = 0; i<12; i++){
                for (let k=0; k<this.calendar[j][i].children.length; k++){
                    if (calendar[j][i].children[k].classList.contains('rangepicker__selected-to')){
                        calendar[j][i].children[k].classList.toggle('rangepicker__selected-to');
                    }
                    if (calendar[j][i].children[k].classList.contains('rangepicker__selected-from')){
                        calendar[j][i].children[k].classList.toggle('rangepicker__selected-from');
                    }
                    if (calendar[j][i].children[k].classList.contains('rangepicker__selected-between')){
                        calendar[j][i].children[k].classList.toggle('rangepicker__selected-between');
                    }
                }
            }
        }
    }


    rangepickerBetweenSelected(leftDate, rightDate){

        this.calendar[leftDate.getFullYear()][leftDate.getMonth()].children[leftDate.getDate()-1].classList.toggle('rangepicker__selected-from');
        this.calendar[rightDate.getFullYear()][rightDate.getMonth()].children[rightDate.getDate()-1].classList.toggle('rangepicker__selected-to');

        if (leftDate.getTime() === rightDate.getTime()){
            return;

        } else if ((leftDate.getMonth() === rightDate.getMonth()) && (leftDate.getFullYear() === rightDate.getFullYear())){
            for (let i=leftDate.getDate(); i<rightDate.getDate()-1; i++){
                this.calendar[leftDate.getFullYear()][leftDate.getMonth()].children[i].classList.toggle('rangepicker__selected-between');
            }
            return;
        } else {
            for (let i=leftDate.getDate(); i<this.calendar[leftDate.getFullYear()][leftDate.getMonth()].children.length; i++){
                this.calendar[leftDate.getFullYear()][leftDate.getMonth()].children[i].classList.toggle('rangepicker__selected-between');
            }       
            for (let i=0; i<rightDate.getDate()-1; i++){
                this.calendar[rightDate.getFullYear()][rightDate.getMonth()].children[i].classList.toggle('rangepicker__selected-between');
            }
        }

        if (leftDate.getFullYear() === rightDate.getFullYear()){
            
            for (let j=leftDate.getMonth()+1; j<rightDate.getMonth(); j++){
                for (let i=0; i<this.calendar[leftDate.getFullYear()][j].children.length; i++){
                    this.calendar[leftDate.getFullYear()][j].children[i].classList.toggle('rangepicker__selected-between');
                }
            }      
        } else {
            for (let j=leftDate.getMonth()+1; j<12; j++){
                for (let i=0; i<this.calendar[leftDate.getFullYear()][j].children.length; i++){
                    this.calendar[leftDate.getFullYear()][j].children[i].classList.toggle('rangepicker__selected-between');
                } 
            }
            for (let j=0; j<rightDate.getMonth(); j++){
                for (let i=0; i<this.calendar[rightDate.getFullYear()][j].children.length; i++){
                    this.calendar[rightDate.getFullYear()][j].children[i].classList.toggle('rangepicker__selected-between');
                } 
            }
        }
    }

    selectMonth(event){

        if (event.target.closest('.rangepicker__cell')){

            const rangepickerCell = event.target.closest('.rangepicker__cell');

            if (!this.leftDate){
                this.leftCell = rangepickerCell;
                this.leftDate = rangepickerCell.dataset.value;
                
                this.rangepickerClear(this.rangepickerDateGrid);
    
                this.calendarClear(this.calendar);

                this.leftCell.classList.toggle('rangepicker__selected-from');
                this.leftCell.blur();

                this.from = new Date(this.leftDate);
                
            } else {
                this.rightCell = rangepickerCell;
                this.rightDate = rangepickerCell.dataset.value;

                this.rightCell.classList.toggle('rangepicker__selected-to');
                this.rightCell.blur();

                this.to = new Date(this.rightDate);

                if (this.from.getTime() > this.to.getTime()){
                    this.from = new Date(this.rightDate);
                    this.to = new Date(this.leftDate);
                } 

                this.rangepickerBetweenSelected(this.from, this.to);

                this.elementRangepickerOpen.firstElementChild.innerHTML = this.getFormatDate(this.from);
                this.elementRangepickerOpen.lastElementChild.innerHTML = this.getFormatDate(this.to); 

                this.element.classList.toggle('rangepicker_open');
                
                this.rangepickerChange(0);

                this.leftDate = null;
                this.rightDate = null;

                this.leftCell = null;
                this.rigthCell = null;
            }

        } else {
            if (event.target.closest('.rangepicker__selector-control-left')){
                this.rangepickerChange(-1);
            } else if (event.target.closest('.rangepicker__selector-control-right')){
                this.rangepickerChange(1);
            }
        }
    }


    getFormatMonth(month){
        const nameMonth = {
            '0': 'январь',
            '1': 'февраль',
            '2': 'март',
            '3': 'апрель',
            '4': 'май',
            '5': 'июнь',
            '6': 'июль',
            '7': 'август',
            '8': 'сентябрь',
            '9': 'октябрь',
            '10': 'ноябрь',
            '11': 'декабрь',
        }

        return nameMonth[month];
    }

    getFormatDate(date){
        
        const day = (date.getDate() > 9) ? date.getDate() : `0${date.getDate()}`;
        const month = ((date.getMonth()+1) > 9) ? (date.getMonth()+1) : (`0${date.getMonth()+1}`);
        const year = date.getFullYear();

        return `${day}.${month}.${year}`;
    }


    createRangepickerGrid(date){
                
        let str = '';
        let daysTemp = '';

        const monthDate = date.getMonth();
        const yearDate = date.getFullYear();
        const timeNow = new Date();
        const dateCount = new Date(yearDate, monthDate+1, 0);
        const daysCount = dateCount.getDate();

        daysTemp = new Date(yearDate, monthDate, 1, timeNow.getHours()+3, timeNow.getMinutes(), timeNow.getSeconds());
        let dayWeek = daysTemp.getDay();
        if (dayWeek === 0){
            dayWeek = 7;
        }     

        for (let i=1; i<=daysCount; i++){
            daysTemp = new Date(yearDate, monthDate, i, timeNow.getHours()+3, timeNow.getMinutes(), timeNow.getSeconds());
            str += (i!=1) ? `<button type="button" class="rangepicker__cell" data-value="${daysTemp.toISOString()}">${i}</button>` : `<button type="button" class="rangepicker__cell" data-value="${daysTemp.toISOString()}" style="--start-from: ${dayWeek}">${i}</button>`;
        }

        const node = document.createElement('div');
        node.innerHTML = `<div class="rangepicker__date-grid">${str}</div>`;
        return node.firstElementChild;
    }


    createBlockRangepickerSelector(date){
        const node = document.createElement('div');
        node.innerHTML = `
        <div class="rangepicker__calendar">
          <div class="rangepicker__month-indicator">
            <time datetime="${this.getFormatMonth(date.getMonth())}">${this.getFormatMonth(date.getMonth())}</time>
          </div>
          <div class="rangepicker__day-of-week">
            <div>Пн</div>
            <div>Вт</div>
            <div>Ср</div>
            <div>Чт</div>
            <div>Пт</div>
            <div>Сб</div>
            <div>Вс</div>
          </div>
          ${this.calendar[date.getFullYear()][date.getMonth()].outerHTML}
          </div>
        `;

        return node.innerHTML;
    }

    createRangepickerSelector(){
        const node = document.createElement('div');
        
        node.innerHTML = `
        <div class="rangepicker__selector" data-element="selector">
            <div class="rangepicker__selector-arrow"></div>
            <div class="rangepicker__selector-control-left"></div>
            <div class="rangepicker__selector-control-right"></div>
            ${this.createBlockRangepickerSelector(this.from)}
            ${this.createBlockRangepickerSelector(this.to)}
        </div>
        `;

        return node.firstElementChild;
    }

    createElement(){

        const node = document.createElement('div');

        node.innerHTML = `
        <div class="rangepicker">
            <div class="rangepicker__input" data-element="input">
                <span data-element="from">${this.getFormatDate(this.from)}</span> -
                <span data-element="to">${this.getFormatDate(this.to)}</span>
            </div>        
            <div class="rangepicker__selector" data-element="selector"></div>
        </div>
        `;

        return node.firstElementChild;
    }


    set element(val){
        this._element = val || null;
    }

    get element(){
        return this._element;
    }

    remove(){
        this.elementRangepickerOpen.removeEventListener('click', this.rangepickerOpen);
        this.rangepickerSelector.removeEventListener('click', this.selectMonth);
        
        if (this.element){
            this.element.remove();
        }
    }

    destroy(){
        this.remove();
        this.element = null;
    }
}