import { Storage } from './storage.js';

class Task {
  constructor(description) {
    this.description = description;
    this.status = 'todo';
    this.uid = +new Date();
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
    if (!currentDroppable) {
      this.drawTasks();
      return;
    }
    this.columns.forEach((col) => {
      if (currentDroppable.getAttribute('id') == dragElement.getAttribute('data-status')) {
        this.drawTasks();
        //return;
      } else if (currentDroppable.getAttribute('id') == col) {
        const oldStatus = dragElement.getAttribute('data-status');
        const uid = +dragElement.getAttribute('uid');
        const list = Storage.get(oldStatus);
        const entity = list.find((item) => item.uid === uid);
        entity.status = col;
        this.change(entity, oldStatus);
      } else if (currentDroppable.classList.contains('bin')) {
        const uid = +dragElement.getAttribute('uid');
        Storage.delete(dragElement.getAttribute('data-status'), uid);
        this.drawTasks();
      }
    });
  }

  static change(entity, oldLocation) {
    const newLocation = entity.status;
    Storage.add(newLocation, entity);
    redefinition(newLocation);
    Storage.delete(oldLocation, entity.uid);
    redefinition(oldLocation);
    this.drawTasks();
    function redefinition(location) {
      Storage.get(location).forEach((item, index) => {
        item.count = index;
        Storage.update(location, item);
      });
    }
  }
}
