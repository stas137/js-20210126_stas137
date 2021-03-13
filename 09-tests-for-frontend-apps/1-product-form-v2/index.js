import SortableList from '../2-sortable-list/index.js';
import escapeHtml from './utils/escape-html.js';
import fetchJson from './utils/fetch-json.js';

const IMGUR_CLIENT_ID = '28aaa2e823b03b1';
const BACKEND_URL = 'https://course-js.javascript.ru';

export default class ProductForm {
  constructor (productId = null) {
    this.productId = productId;
    
    this.productPartUrl = `/api/rest/products`;
    this.categoryPartUrl = `/api/rest/categories`;
    this.imgurUrl = new URL(`/3/image`, `https://api.imgur.com`);

    this.saveUrl = new URL(this.productPartUrl, BACKEND_URL);
    this.productUrl = new URL(this.productPartUrl, BACKEND_URL);

    if (this.productId){
      this.productUrl.searchParams.set('id', this.productId);
      this.buttonName = 'Сохранить товар';
    } else {
      this.buttonName = 'Добавить товар';
    }

    this.categoryUrl = new URL(this.categoryPartUrl, BACKEND_URL);
    this.categoryUrl.searchParams.set('_sort', 'weight');
    this.categoryUrl.searchParams.set('_refs', 'subcategory');

    this.data = {};
    this.dataPost = {};
    this.dataPost.images = [];
    this.categoriesData = [];
    
    this.submitForm = this.submitForm.bind(this);
    this.deleteImage = this.deleteImage.bind(this);
    this.uploadImage = this.uploadImage.bind(this);
    this.insertImage = this.insertImage.bind(this);
  }

  async insertImage(event){

    const imageFile = event.target.files[0]; 

    const formData = new FormData();
    formData.append('image', imageFile);

    const response = await fetch(this.imgurUrl.toString(), {
      method: 'POST',
      headers: {
        'Authorization': `Client-ID ${IMGUR_CLIENT_ID}`
      },
      body: formData
    });

    if (response.ok) {
      const data = await response.json();

      const indexImageId =  data.data.link.lastIndexOf('/');
      const imageId = data.data.link.slice(indexImageId+1, data.data.link.length);
      
      console.log('id = ', imageId);
      console.log('link = ', data.data.link);

      this.data.images.push({'source': imageId, 'url': data.data.link});
      
      const node = document.createElement('div');
      node.innerHTML = this.imageListItem({'source': imageId, 'url': data.data.link});
      this.element.querySelector('.form-group.form-group__wide .sortable-list').append(node.firstElementChild);

    } else {
      console.error('Error PUT image, status = ', response.status);
    }
  }

  uploadImage(){
    this.element.querySelector('#uploadImageInput').click();
   }


  deleteImage(event){

    if (event.target.alt === 'delete'){
      const myImage = event.target.closest('.products-edit__imagelist-item');
      const tempImages = [];

      for (const image of this.data.images){
        if (image.source != myImage.children[1].value){
          tempImages.push(image);
        }
      }
  
      this.data.images = [...tempImages];
      myImage.remove();
    }
  }

  submitForm(){

    document.querySelectorAll('.form-control').forEach(item => {
      if ((Number(item.value) || (item.value === '0')) && (item.name!='title') && (item.name!='description')) {
        this.dataPost[item.name] = Number(item.value);
      } else {
        this.dataPost[item.name] = item.value;
      }
    });

    this.categoriesData.forEach(item => {
      item.subcategories.forEach(itemSub => {
        if (itemSub.title === this.dataPost.subcategory){
          this.dataPost.subcategory = itemSub.id;
        }
      });
    });

    this.save();
  }

  async render(){

    await this.getData();
    this.element = this.createElement();

    this.element.firstElementChild.addEventListener('submit', (event)=>{
      event.preventDefault();
    });

    this.element.querySelector('.form-buttons > .button-primary-outline').addEventListener('pointerdown', this.submitForm);
    //this.element.querySelector('.form-group.form-group__wide .sortable-list').addEventListener('pointerdown', this.deleteImage);
    this.element.querySelector('#uploadImage').addEventListener('pointerdown', this.uploadImage);
    this.element.querySelector('#uploadImageInput').addEventListener('change', this.insertImage);
    
    return this.element;
  }

  

  async getData(){
    const responceCategory = await fetch(this.categoryUrl.toString());
    const categoriesData = await responceCategory.json(); 
    this.categoriesData = categoriesData;

    if (this.productId){
      const responceData = await fetch(this.productUrl.toString());
      const data = await responceData.json(); 
      this.data = data[0];
    } else {
      this.data.title = '';
      this.data.description = '';
      this.data.images = [];
      this.data.price = 100;
      this.data.discount = 0;
      this.data.quantity = 1;
      this.data.status = 1;
    }
  }

  async save(){  
  
    this.dataPost.images = this.data.images;

    if (this.productId){
      
      this.dataPost.id = this.productId;
      
      const response = await fetch(this.saveUrl.toString(), {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(this.dataPost)
      });

      if (response.ok) {
        const myEvent = new CustomEvent('product-updated', { detail: 'product-updated' });
        this.element.dispatchEvent(myEvent);
      } else {
        console.error('Error PATCH, status = ', response.status);
      }
    } else {

      const response = await fetch(this.saveUrl.toString(), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(this.dataPost)
      });

      if (response.ok) {
        const myEvent = new CustomEvent('product-saved', { detail: 'product-saved' });
        this.element.dispatchEvent(myEvent);
      } else {
        console.error('Error PUT, status = ', response.status);
      }      
    }
  }

  get subElements(){
    const productForm = this.element;
    const imageListContainer = this.element.querySelector('.form-group.form-group__wide .sortable-list');
    return { productForm, imageListContainer };
  }

  getStatus(){
    return ((this.data.status) ? 
    `<option value="1" selected>Активен</option><option value="0">Неактивен</option>` :
    `<option value="1">Активен</option><option value="0" selected>Неактивен</option>`);
  }

  getCategoriesData(subcategoryId){
    const names = [];
    for (const category of this.categoriesData) {
      for (const subcategory of category.subcategories) {
        names.push((subcategoryId === subcategory.id) ? `<option value="${subcategory.title}" selected>${category.title} &gt; ${subcategory.title}</option>` : 
        `<option value="${subcategory.title}">${category.title} &gt; ${subcategory.title}</option>`);
      }
    }
    return names.join('');
  }

  imageListItem(item){

      const node = document.createElement('li');
      node.classList.add('products-edit__imagelist-item');
      node.innerHTML = `<input type="hidden" name="url" value="${item.url}">
      <input type="hidden" name="source" value="${item.source}">
      <span>
        <img src="icon-grab.svg" data-grab-handle="" alt="grab">
        <img class="sortable-table__cell-img" alt="Image" src="${item.url}">
        <span>${item.source}</span>
      </span>
      <button type="button">
        <img src="icon-trash.svg" data-delete-handle="" alt="delete">
      </button>`;
      return node;
  }

  getImageList(data = []){
    return data.map(item => {
      return this.imageListItem(item);
    });
  }

  createElement(){

    const items = this.getImageList(this.data.images);
    const sortableList = new SortableList({items});

    const node = document.createElement('div');
    node.classList.add('product-form');

    const nodeFormGrid = document.createElement('form');
    nodeFormGrid.setAttribute('data-element', 'productForm');
    nodeFormGrid.classList.add('form-grid');

    const nodeName = document.createElement('div');
    nodeName.classList.add('form-group');
    nodeName.classList.add('form-group__half_left');
    nodeName.innerHTML = `<fieldset>
        <label class="form-label">Название товара</label>
        <input required="" type="text" name="title" class="form-control" placeholder="Название товара" value='${this.data.title}' id="title">
      </fieldset>`;

    const nodeDescription = document.createElement('div');
    nodeDescription.classList.add('form-group');
    nodeDescription.classList.add('form-group__wide');
    nodeDescription.innerHTML = `<label class="form-label">Описание</label>
    <textarea required="" class="form-control" name="description" data-element="productDescription" placeholder="Описание товара" id="description">${this.data.description}</textarea>`;

    const nodeListContainer = document.createElement('div');
    nodeListContainer.classList.add('form-group');
    nodeListContainer.classList.add('form-group__wide');
    nodeListContainer.setAttribute('data-element', 'sortable-list-container');

    const nodeFotoLabel = document.createElement('label');
    nodeFotoLabel.classList.add('form-label');
    nodeFotoLabel.innerHTML = `Фото`;
    nodeListContainer.append(nodeFotoLabel);

    const nodeImageList = document.createElement('div');
    nodeImageList.setAttribute('data-element', 'imageListContainer');
    nodeImageList.append(sortableList.element);
    nodeListContainer.append(nodeImageList);

    const nodeUploadImage = document.createElement('button');
    nodeUploadImage.setAttribute('type', 'button');
    nodeUploadImage.setAttribute('name', 'uploadImage');
    nodeUploadImage.setAttribute('id', 'uploadImage');
    nodeUploadImage.classList.add('button-primary-outline');
    nodeUploadImage.innerHTML = `<span>Загрузить</span>`;
    nodeListContainer.append(nodeUploadImage);

    const nodeUploadImageInput = document.createElement('input');
    nodeUploadImageInput.setAttribute('type', 'file');
    nodeUploadImageInput.setAttribute('hidden', 'hidden');
    nodeUploadImageInput.setAttribute('id', 'uploadImageInput');
    nodeListContainer.append(nodeUploadImageInput);

    const nodeCategory = document.createElement('div');
    nodeCategory.classList.add('form-group');
    nodeCategory.classList.add('form-group__half_left');
    nodeCategory.innerHTML = `<label class="form-label">Категория</label>
      <select class="form-control" name="subcategory" id="subcategory">
        ${this.getCategoriesData(this.data.subcategory)}
      </select>`;

    const nodePriceDiscount = document.createElement('div');
    nodePriceDiscount.classList.add('form-group');
    nodePriceDiscount.classList.add('form-group__half_left');
    nodePriceDiscount.classList.add('form-group__two-col');
    nodePriceDiscount.innerHTML = `<fieldset>
        <label class="form-label">Цена ($)</label>
        <input required="" type="number" name="price" class="form-control" placeholder="100" value="${this.data.price}" id="price">
      </fieldset>
      <fieldset>
        <label class="form-label">Скидка ($)</label>
        <input required="" type="number" name="discount" class="form-control" placeholder="0" value="${this.data.discount}" id="discount">
      </fieldset>`;

    const nodeQuantity = document.createElement('div');
    nodeQuantity.classList.add('form-group');
    nodeQuantity.classList.add('form-group__part-half');
    nodeQuantity.innerHTML = `<label class="form-label">Количество</label>
    <input required="" type="number" class="form-control" name="quantity" placeholder="1" value="${this.data.quantity}" id="quantity">`;

    const nodeStatus = document.createElement('div');
    nodeStatus.classList.add('form-group');
    nodeStatus.classList.add('form-group__part-half');
    nodeStatus.innerHTML = `<label class="form-label">Статус</label>
    <select class="form-control" name="status" id="status">
      ${this.getStatus()}
    </select>`;

    const nodeSave = document.createElement('div');
    nodeSave.classList.add('form-buttons');
    nodeSave.innerHTML = `<button name="save" class="button-primary-outline">
      ${this.buttonName}
    </button>`;

    nodeFormGrid.append(nodeName);
    nodeFormGrid.append(nodeDescription);
    nodeFormGrid.append(nodeListContainer);
    nodeFormGrid.append(nodeCategory);
    nodeFormGrid.append(nodePriceDiscount);
    nodeFormGrid.append(nodeQuantity);
    nodeFormGrid.append(nodeStatus);
    nodeFormGrid.append(nodeSave);

    node.append(nodeFormGrid);

    return node;
  }

  remove(){
    this.element.querySelector('.form-buttons > .button-primary-outline').removeEventListener('pointerdown', this.submitForm);
    this.element.querySelector('.form-group.form-group__wide .sortable-list').removeEventListener('pointerdown', this.deleteImage);
    this.element.querySelector('#uploadImage').removeEventListener('pointerdown', this.uploadImage);
    this.element.querySelector('#uploadImageInput').removeEventListener('change', this.insertImage);

    if (this.element){
      this.element.remove();
    }
  }

  destroy(){
    this.remove();
    this.element = null;
  }

  get element(){
    return this._element;
  }

  set element(val){
    this._element = val || '';
  }
}