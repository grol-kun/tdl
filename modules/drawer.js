import { DragDrop } from './dragNdrop.js';
import { Storage } from './storage.js';

class Task {
  constructor(description) {
    this.description = description;
    this.status = 'todo';
    this.uid = +new Date();
    this.count = Storage.get(this.status).length;
  }
}
export class Drawer {
  static columns = ['todo', 'process', 'done'];

  static addTask() {
    const entity = this.create();
    if (entity) {
      const tasks = Storage.add(this.columns[0], entity);
      const text = document.getElementById('txt');
      text.value = '';
      this.drawTasks();
    } else {
      return;
    }
  }

  static create() {
    const text = document.getElementById('txt');
    if (!text.value) return;
    return new Task(text.value);
  }

  static drawTasks() {
    this.columns.forEach((col) => {
      console.log(`-----------Список ${col}------------`);
      let column = document.getElementById(col);
      column.innerHTML = '';
      const tasks = Storage.get(col);
      tasks.sort((a, b) => a.count - b.count);
      if (!tasks) return;
      tasks.forEach((item, index) => {
        console.log(item);
        column.innerHTML += this.createTemplate(item, index, item.count);
      });
    });
    console.log(`Its Drawn!`);
  }

  static createTemplate(task, index, count) {
    return `
      <div class="col draggable card " uid="${task.uid}" data-count="${count}" data-status="${task.status}">
        <div class="card-panel teal ${task.status}" >
          <span class="white-text">${task.description}</span>
        </div>
      </div>
    `;
  }

  static finish(dragElement, currentDroppable) {
    const oldStatus = dragElement.getAttribute('data-status');
    let drawn = false;
    if (!currentDroppable) {
      this.drawTasks();
      return;
    }
    this.columns.forEach((col) => {
      if (currentDroppable.getAttribute('id') == dragElement.getAttribute('data-status')) {
        if (drawn) return;
        this.setPosition(dragElement, currentDroppable, oldStatus);
        drawn = true;
      } else if (currentDroppable.getAttribute('id') == col) {
        this.setPosition(dragElement, currentDroppable, oldStatus);
      } else if (currentDroppable.classList.contains('bin')) {
        const uid = +dragElement.getAttribute('uid');
        Storage.delete(dragElement.getAttribute('data-status'), uid);
        this.drawTasks();
      }
    });
  }

  static setPosition(dragElement, currentDroppable, oldStatus) {
    const positions = [];
    const dragElementCoords = dragElement.getBoundingClientRect();
    const dragElementMiddleY = dragElementCoords.top + dragElementCoords.height / 2;
    const cards = currentDroppable.querySelectorAll('.draggable.card');
    cards.forEach((item) => {
      if (item == dragElement) return;
      let coords = item.getBoundingClientRect();
      let middleY = coords.top + coords.height / 2;
      positions.push(middleY);
    });
    const newPos = positions.filter((top) => top < dragElementMiddleY).length;
    const uid = +dragElement.getAttribute('uid');
    const list = Storage.get(oldStatus);
    const entity = list.find((item) => item.uid === uid);
    entity.status = currentDroppable.getAttribute('id');
    entity.count = newPos;
    const tmp = { ...entity };
    Storage.delete(oldStatus, entity.uid);

    const newList = Storage.get(currentDroppable.id);
    newList.sort((a, b) => a.count - b.count);
    newList.splice(newPos, 0, tmp);
    newList.forEach((item, index) => (item.count = index));
    Storage.bulk(currentDroppable.id, newList);
    this.drawTasks();
  }
}
