class Tooltip {

    static #instance = null;
    static offset = 15;

    constructor (){
        if (!Tooltip.#instance) {
            Tooltip.#instance = this;
        } else {
            return Tooltip.#instance;
        }
        this.element = null;

        this.pointerMove = this.pointerMove.bind(this);
        this.pointerOver = this.pointerOver.bind(this);
        this.pointerOut = this.pointerOut.bind(this);
    }

    addPointerOver(){
        if (!this.element){
            document.addEventListener('pointerover', this.pointerOver);
        }
    }

    addPointerOut(){
        document.addEventListener('pointerout', this.pointerOut);
    }

    pointerMove(event){
            const coordX = event.clientX + Tooltip.offset;
            const coordY = event.clientY + Tooltip.offset;
            this.element.style.left = coordX + 'px';
            this.element.style.top = coordY + 'px';
    }

    pointerOver(event){
        if (event.target.dataset.tooltip){
            this.render();
            this.element.innerHTML = event.target.dataset.tooltip;
            this.addPointerMove();
        }
    }

    pointerOut(){
        if (this.element){
            document.removeEventListener('pointermove', this.pointerMove);
            this.remove();
        }
    }

    addPointerMove(){
        document.addEventListener('pointermove', this.pointerMove);
    }

    get element(){
        return this._element;
    }

    set element(val){
        this._element = val || null;
    }

    remove(){
        document.removeEventListener('pointerOver', this.pointerOver);
        document.removeEventListener('pointerOut', this.pointerOut);

        if (this.element) {
            this.element.remove();
        }
    }

    destroy(){
        this.remove();
        this.element = null;
    }

    render(){
        this.element = document.createElement('div');
        this.element.classList.add('tooltip');
        document.body.append(this.element);
    }

    initialize(){
        this.addPointerOver();
        this.addPointerOut();
    }
}

const tooltip = new Tooltip();

export default tooltip;
