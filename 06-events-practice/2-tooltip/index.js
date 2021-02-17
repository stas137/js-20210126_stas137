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
    }

    addPointerOver(){
        if (!this.element){
            document.addEventListener('pointerover', (event) => {
                if (event.target.dataset.tooltip){
                    this.render();

                    this.element.innerHTML = event.target.dataset.tooltip;

                    this.addPointerMove();
                }
            });
        }
    }

    addPointerOut(){
        document.addEventListener('pointerout', () => {
            if (this.element){
                document.removeEventListener('pointermove', this.pointerMove);
                this.remove();
            }
        });
    }

    pointerMove(event){
            const coordX = event.clientX + Tooltip.offset;
            const coordY = event.clientY + Tooltip.offset;
            this.element.style.left = coordX + 'px';
            this.element.style.top = coordY + 'px';
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
