import { Drawer } from './drawer.js';
export class DragDrop {
  static isDragging = false;
  static dragElement = null;
  static currentDroppable = null;

  static onMouseMoveBound = this.onMouseMove.bind(this);
  static do(event) {
    this.event = event;
    this.dragElement = event.target.closest('.draggable');
    console.log(this.dragElement);
    if (!this.dragElement) return;
    this.dragElement.style.zIndex = 1000;
    event.preventDefault();
    this.dragElement.ondragstart = function () {
      return false;
    };
    this.startDrag(event.clientX, event.clientY);
  }

  static onMouseUp(event) {
    if (this.currentDroppable) {
      this.currentDroppable.style.borderColor = '';
    }
    Drawer.finish(this.dragElement, this.currentDroppable);
    this.finishDrag();
  }

  static finishDrag() {
    if (!this.isDragging) {
      return;
    }
    this.isDragging = false;
    document.removeEventListener('mousemove', this.onMouseMoveBound);
    this.dragElement.removeEventListener('mouseup', this.onMouseUp.bind(this));
    this.dragElement = null;
    this.currentDroppable = null;
  }

  static startDrag(clientX, clientY) {
    if (this.isDragging) {
      return;
    }
    this.isDragging = true;
    document.addEventListener('mousemove', this.onMouseMoveBound);
    this.dragElement.addEventListener('mouseup', this.onMouseUp.bind(this));
    this.shiftX = clientX - this.dragElement.getBoundingClientRect().left;
    this.shiftY = clientY - this.dragElement.getBoundingClientRect().top+6.5;
    this.dragElement.style.position = 'fixed';

    this.moveAt(clientX, clientY);
  }

  static moveAt(clientX, clientY) {
    let newX = clientX - this.shiftX;
    let newY = clientY - this.shiftY;
    console.log(newY);
    let newBottom = newY + this.dragElement.offsetHeight;
    if (newBottom > document.documentElement.clientHeight) {
      let docBottom = document.documentElement.getBoundingClientRect().bottom;
      let scrollY = Math.min(docBottom - newBottom, 10);
      if (scrollY < 0) scrollY = 0;
      window.scrollBy(0, scrollY);
      newY = Math.min(newY, document.documentElement.clientHeight - this.dragElement.offsetHeight);
    }
    if (newY < 0) {
      let scrollY = Math.min(-newY, 10);
      if (scrollY < 0) scrollY = 0; // проверяем ошибки точности
      window.scrollBy(0, -scrollY);
      // быстрое перемещение мыши может поместить курсор за пределы документа вверх
      newY = Math.max(newY, 0); // newY не может быть меньше нуля
    }
    // ограничим newX размерами окна
    // горизонтальная прокрутка отсутствует, поэтому это не сложно:
    if (newX < 0) newX = 0;
    if (newX > document.documentElement.clientWidth - this.dragElement.offsetWidth) {
      newX = document.documentElement.clientWidth - this.dragElement.offsetWidth;
    }
    this.dragElement.style.left = newX + 'px';
    this.dragElement.style.top = newY + 'px';
  }

  static enterDroppable() {
    if (this.currentDroppable.classList.contains('bin')) {
      this.dragElement.style.opacity = '0.5';
      return;
    }
    if (this.currentDroppable.classList.contains('board')) {
      this.currentDroppable.style.borderColor = 'red';
    }
  }

  static leaveDroppable() {
    this.dragElement.style.opacity = '';
    this.currentDroppable.style.borderColor = '';
  }

  static onMouseMove(event) {
    this.moveAt(event.clientX, event.clientY);
    this.dragElement.hidden = true;
    let elemBelow = document.elementFromPoint(event.clientX, event.clientY);
    this.dragElement.hidden = false;
    if (!elemBelow) return;
    let droppableBelow = elemBelow.closest('.droppable');
    if (this.currentDroppable != droppableBelow) {
      if (this.currentDroppable) {
        this.leaveDroppable();
      }
      this.currentDroppable = droppableBelow;
      if (this.currentDroppable) {
        this.enterDroppable();
      }
    }
  }

  static getCurrentY() {
    return this.shiftY;
  }
}
