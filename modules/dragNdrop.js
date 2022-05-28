import { Drawer } from './drawer.js';

let isDragging = false;
let currentDroppable = null;
let dragElement = null;

export class DragDrop {
  static onMouseMoveBound = this.onMouseMove.bind(this);
  static do(event) {
    this.event = event;
    dragElement = event.target.closest('.draggable');
    if (!dragElement) return;
    dragElement.style.zIndex = 1000;
    event.preventDefault();
    dragElement.ondragstart = function () {
      return false;
    };
    this.startDrag(event.clientX, event.clientY);
  }

  static onMouseUp(event) {
    currentDroppable.style.borderColor = '';
    Drawer.finish(dragElement, currentDroppable);
    this.finishDrag();
  }

  static finishDrag() {
    if (!isDragging) {
      return;
    }
    isDragging = false;
    dragElement.style.top = parseInt(dragElement.style.top) + pageYOffset + 'px';
    dragElement.style.position = 'fixed';
    document.removeEventListener('mousemove', this.onMouseMoveBound);
    dragElement.removeEventListener('mouseup', this.onMouseUp.bind(this));
  }

  static startDrag(clientX, clientY) {
    if (isDragging) {
      return;
    }
    isDragging = true;
    document.addEventListener('mousemove', this.onMouseMoveBound);
    dragElement.addEventListener('mouseup', this.onMouseUp.bind(this));
    this.shiftX = clientX - dragElement.getBoundingClientRect().left;
    this.shiftY = clientY - dragElement.getBoundingClientRect().top;
    dragElement.style.position = 'fixed';

    this.moveAt(clientX, clientY);
  }

  static moveAt(clientX, clientY) {
    let newX = clientX - this.shiftX;
    let newY = clientY - this.shiftY;
    let newBottom = newY + dragElement.offsetHeight;
    if (newBottom > document.documentElement.clientHeight) {
      let docBottom = document.documentElement.getBoundingClientRect().bottom;
      let scrollY = Math.min(docBottom - newBottom, 10);
      if (scrollY < 0) scrollY = 0;
      window.scrollBy(0, scrollY);
      newY = Math.min(newY, document.documentElement.clientHeight - dragElement.offsetHeight);
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
    if (newX > document.documentElement.clientWidth - dragElement.offsetWidth) {
      newX = document.documentElement.clientWidth - dragElement.offsetWidth;
    }
    dragElement.style.left = newX + 'px';
    dragElement.style.top = newY + 'px';
  }

  static enterDroppable(currentDroppable) {
    if (currentDroppable.classList.contains('bin')) {
      dragElement.style.opacity = '0.5';
      return;
    }
    if (currentDroppable.classList.contains('board')) {
      currentDroppable.style.borderColor = 'red';
    }
  }

  static leaveDroppable(currentDroppable) {
    dragElement.style.opacity = '';
    currentDroppable.style.borderColor = '';
  }

  static onMouseMove(event) {
    this.moveAt(event.clientX, event.clientY);
    dragElement.hidden = true;
    let elemBelow = document.elementFromPoint(event.clientX, event.clientY);
    dragElement.hidden = false;
    if (!elemBelow) return;
    let droppableBelow = elemBelow.closest('.droppable');
    if (currentDroppable != droppableBelow) {
      if (currentDroppable) {
        this.leaveDroppable(currentDroppable);
      }
      currentDroppable = droppableBelow;
      if (currentDroppable) {
        this.enterDroppable(currentDroppable);
      }
    }
  }
}
