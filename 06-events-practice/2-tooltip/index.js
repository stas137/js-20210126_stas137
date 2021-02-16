class Tooltip {

    static #instance = null;

    constructor (){
        if (!Tooltip.#instance) {
            Tooltip.#instance = this;

            this.element = null;
            this.coordX = null;
            this.coordY = null;
            this.offset = 15;

        } else {
            return Tooltip.#instance;
        }
    }

    addPointerOver(){
        if (!this.element){
            document.addEventListener('pointerover', (event) => {
                if (event.target.dataset.tooltip){
                    this.render();

                    this.element.innerHTML = event.target.dataset.tooltip;

                    this.coordX = event.clientX + this.offset;
                    this.coordY = event.clientY + this.offset;
                    this.element.style.left = this.coordX + 'px';
                    this.element.style.top = this.coordY + 'px';
                }
            });
        }

    }

    addPointerOut(){
        document.addEventListener('pointerout', () => {
            this.remove();
        });
    }

    addPointerMove(){
        document.addEventListener('pointermove', (event) => {
            if (this.element){

                this.coordX = event.clientX + this.offset;
                this.coordY = event.clientY + this.offset;
                this.element.style.left = this.coordX + 'px';
                this.element.style.top = this.coordY + 'px';
            }
        });
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
        this.addPointerMove();
    }
}

const tooltip = new Tooltip();

export default tooltip;
