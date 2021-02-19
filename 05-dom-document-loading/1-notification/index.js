export default class NotificationMessage {

    static prevMessage = null;

    constructor (message='', obj={}){

            this.message = message;
            this.duration = obj.duration || 2000;
            this.type = obj.type || 'success';

            this.render();
    }

    render(){

        this.element = this.createHTMLElement(this.message, this.type, this.duration);

        if (NotificationMessage.prevMessage) {
            NotificationMessage.prevMessage.remove();
        }

        NotificationMessage.prevMessage = this.element;
    }

    createHTMLElement(message, type, duration){

        const node = document.createElement('div');
        node.innerHTML = `
        <div class="notification ${type}" style="--value:${duration/1000}s" id="elem">
            <div class="timer">
            </div>
            <div class="inner-wrapper">
                <div class="notification-header">${type}</div>
                <div class="notification-body">${message}</div>
            </div>
        </div>
        `; 

        return node.firstElementChild;
    }

    installTime(duration){

        setTimeout(()=>{
            this.remove();
            NotificationMessage.prevMessage = null;
        }, duration);
    }

    show(parentNode){
        
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
        NotificationMessage.prevMessage = null;
    }

    get element(){
        return this._element;
    }

    set element(val){
        this._element = val || null;
    }
}
