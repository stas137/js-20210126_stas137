export default class SortableList {
    constructor({items}={}){

        this.items = items;

        this.offsetX = 0;
        this.offsetY = 0;

        this.offsetMarginY = 16;

        this.elemHeight = 0;
        this.elemWidth = 0;

        this.prevPageY = 0;
        this.down = 1;

        this.elem = null;
        this.elemParent = null;

        this.elemIndex = null;
        this.elemDestination = null;

        this.onPointerDown = this.onPointerDown.bind(this);
        this.onPointerMove = this.onPointerMove.bind(this);
        this.onPointerUp = this.onPointerUp.bind(this);
        this.moveAt = this.moveAt.bind(this);

        this.render();
    }

    render(){
        this.element = document.createElement('ul');
        this.element.classList.add('sortable-list');

        for (let i=0; i<this.items.length; i++){
            this.items[i].classList.add('sortable-list__item');
            this.items[i].addEventListener('pointerdown', this.onPointerDown);
            this.element.append(this.items[i]);
        }
    }


    moveAt(pageX, pageY){
        this.elem.style.left = pageX - this.offsetX + 'px';
        this.elem.style.top = pageY - this.offsetY + 'px';
    }

    onPointerMove(event){

        if (this.prevPageY <= event.pageY){
            this.down = 1;
        } else {
            this.down = -1;
        }
        this.prevPageY = event.pageY;

        this.moveAt(event.pageX, event.pageY);

        for (let i=0; i<this.elemParent.children.length-1; i++){

            const upperLine = this.elemHeight*i + this.offsetMarginY*(i+1);
            const lowerLine = this.elemHeight*(i+1) + this.offsetMarginY*(i+1);

            if (( event.pageY > upperLine) && ( event.pageY < (upperLine + this.elemHeight/2) ) && (this.down === 1)){

                this.elemDestination = i;
                this.elemParent.children[this.elemDestination].after(this.node);
                
            }  else if (( event.pageY > (upperLine  + this.elemHeight/2) ) && ( event.pageY < lowerLine ) && (this.down === -1)){

                this.elemDestination = i;
                this.elemParent.children[this.elemDestination].before(this.node);
            } 
        }
    }

    onPointerUp(){

         if (this.elemDestination === null){
            this.elemDestination = this.elemIndex;
        } 

        this.elemParent.children[this.elemDestination].after(this.elemParent.children[this.elemParent.children.length-1]);
        this.elem.classList.toggle('sortable-list__item_dragging');
        this.elem.style = '';
        
        this.node.remove();

        this.offsetX = 0;
        this.offsetY = 0;

        this.elemIndex = null;
        this.elemDestination = null;

        document.removeEventListener('pointermove', this.onPointerMove);
        this.elem.removeEventListener('pointerup', this.onPointerUp);
    }

    onPointerDown(event){
        
        if (event.target.dataset.deleteHandle != undefined){

            this.elem = event.target.closest('li');

            for (let i=0; i<this.items.length; i++){
                if (this.items[i] === this.elem){
                    this.elemIndex = i;
                    break;
                }
            }
            this.items.splice(this.elemIndex, 1);
            this.elem.remove();

        } else if (event.target.dataset.grabHandle != undefined){

            this.elem = event.target.closest('li');
            
            this.offsetX = event.clientX - this.elem.getBoundingClientRect().left;
            this.offsetY = event.clientY - this.elem.getBoundingClientRect().top;

            this.elemHeight = this.elem.clientHeight;
            this.elemWidth = this.elem.clientWidth;

            this.node = document.createElement('div');
            this.node.classList.add('sortable-list__placeholder');

            this.node.style.minHeight = this.elemHeight + 'px';
            this.node.style.minWidth = this.elemWidth + 'px';

            this.elemParent = this.elem.parentElement;

            for (let i=0; i<this.elemParent.children.length; i++){
                if (this.elemParent.children[i] === this.elem){
                    this.elemIndex = i;
                    this.elemParent.children[this.elemIndex].before(this.node);
                    break;
                }
            }

            this.elem.classList.toggle('sortable-list__item_dragging');

            this.elem.style.minHeight = this.elemHeight + 'px';
            this.elem.style.minWidth = this.elemWidth + 'px';

            this.elemParent.children[this.elemParent.children.length-1].after(this.elem);

            this.prevPageY = event.pageY;
            this.moveAt(event.pageX, event.pageY);

            this.elem.ondragstart = function(){
                return false;
            }

            document.addEventListener('pointermove', this.onPointerMove);
            this.elem.addEventListener('pointerup', this.onPointerUp);
        }
    }

    get element(){
        return this._element;
    }
    set element(val){
        this._element = (val) || '';
    }

    remove(){
        if (this.element){
            for (let i=0; i<this.items.length; i++){
                this.items[i].removeEventListener('pointerdown', this.onPointerDown);
            }
            this.element.remove();
        }
    }

    destroy(){
        this.remove();
        this.element = null;
    }
}