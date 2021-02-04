export default class NotificationMessage {

    static countElements = 0;

    constructor (...props){

        if (props){
            [this.message='', this.obj={}] = [...props]; 

            this.duration = this.obj.duration;
            this.type = this.obj.type;

            this.element = this.createHTMLElement(this.message, this.type);
        } else {
            this.element = null;
        }
    }


    createHTMLElement(message, type){

        let node = document.createElement('div');
        node.classList.add('notification');
        node.classList.add(type);
        node.setAttribute('id', 'elem');

        node.innerHTML = `${message}`;  
        return node;
    }

    installTime(duration){

        setTimeout(()=>{
            
            this.remove();
            NotificationMessage.countElements--;

        }, duration);
    }

    show(parentNode){
        
        NotificationMessage.countElements++;

        if (NotificationMessage.countElements > 1){
            //console.log('waiting');
            const node = document.getElementById('elem');
            node.remove();
        }

        //console.log(this.element, NotificationMessage.count);

        if (parentNode){
            parentNode.append(this.element);
        } else {
            document.body.append(this.element);
        }
        this.installTime(this.duration);
    }

    remove(){
        this.element.remove();
        return this.element;
    }

    destroy(){
        this.element = null;
        return this.element;
    }

    get element(){
        return this._element;
    }

    set element(val){
        if (val){
            this._element = val;
        } else {
            this._element = null;
        }
    }
}
