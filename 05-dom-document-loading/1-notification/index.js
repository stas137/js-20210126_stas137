export default class NotificationMessage {

    static countMessages = 0;

    constructor (...props){

        if (props){
            [this.message='', this.obj={}] = [...props]; 

            this.duration = this.obj.duration;
            this.type = this.obj.type;

            this.element = this.createHTMLElement(this.message, this.type, this.duration);
        } else {
            this.element = null;
        }
    }


    createHTMLElement(message, type, duration){

        let node = document.createElement('div');
        node.classList.add('notification');
        node.classList.add(type);
        node.style = `--value:${duration/1000}s`;
        node.setAttribute('id', 'elem');

        let timerChild = document.createElement('div');
        timerChild.classList.add('timer');
        node.append(timerChild);

        let innerWrapperChild = document.createElement('div');
        innerWrapperChild.classList.add('inner-wrapper');
        node.append(innerWrapperChild);

        let notificationHeaderChild = document.createElement('div');
        notificationHeaderChild.classList.add('notification-header');
        notificationHeaderChild.innerHTML = `${type}`;
        innerWrapperChild.append(notificationHeaderChild);

        let notificationBodyChild = document.createElement('div');
        notificationBodyChild.classList.add('notification-body');
        notificationBodyChild.innerHTML = `${message}`;
        innerWrapperChild.append(notificationBodyChild);
        
        return node;
    }

    installTime(duration){

        setTimeout(()=>{
            this.remove();
            NotificationMessage.countMessages--;
        }, duration);
    }

    show(parentNode){
        
        NotificationMessage.countMessages++;

        if (NotificationMessage.countMessages > 1){
            const node = document.getElementById('elem');
            node.remove();
        }

        if (parentNode){
            parentNode.append(this.element);
        } else {
            document.body.append(this.element);
        }
        this.installTime(this.duration);
    }

    remove(){
        this.element.remove();
    }

    destroy(){
        this.remove();
    }

    get element(){
        return this._element;
    }

    set element(val){
            this._element = val || null;
    }
}
