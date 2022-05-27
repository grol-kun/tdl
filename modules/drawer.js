import { Storage } from './storage.js';

class Task {
  constructor(description) {
    this.description = description;
    this.status = 'todo';
  }
}

export class Drawer {
  static dataName = 'tasks';
  static columns = ['todo', 'process', 'done'];

  static addTask() {
    const entity = this.create();
    if (entity) {
      const tasks = Storage.add(this.dataName, entity);
      const text = document.getElementById('txt');
      text.value = '';
      this.change(tasks);
      this.drawTasks(); //?
    } else {
      return;
    }
  }

  static create() {
    const text = document.getElementById('txt');
    if (!text.value) return;
    return new Task(text.value);
  }

  static change(entity) {
    Storage.update(this.dataName, entity);
    this.drawTasks(); //?
  }

  static drawTasks() {
    this.columns.forEach((col) => {
      let column = document.getElementById(col);
      column.innerHTML = '';
      const tasks = Storage.get(this.dataName);
      if (!tasks) return;
      let count = 0;
      tasks.forEach((item, index) => {
        if (item.status == col) {
          count++;
          column.innerHTML += this.createTemplate(item, index, count);
        }
      });
      if (!count) {
        column.innerHTML = this.createEmptyTemplate(count);
      }
    });
    this.drowColumns();
  }

  static createTemplate(task, index, count) {
    return `<div class="col draggable card" uid="${task.uid}" id="${count}" style="padding-left: 0px;padding-right: 0px;"><div class="card-panel teal" style="margin-bottom: 0px;margin-top: 0px;">
      <span class="white-text">${task.description} </span>
      </div></div>`;
  }

  static createEmptyTemplate(count) {
    return `<div></br></div>`;
  }

  static drowColumns() {
    let maxHeight = 0;
    this.columns.forEach((col) => {
      let column = document.getElementById(col);
      maxHeight = Math.max(column.offsetHeight, maxHeight);
      //console.log(maxHeight);
    });
    this.columns.forEach((col) => {
      let column = document.getElementById(col);
      column.style.height = maxHeight + 'px';
      //console.log(column.style.height, maxHeight);
    });
  }

  static finish(dragElement, currentDroppable) {
    let entity = null;
    this.columns.forEach((col) => {
      if (currentDroppable.getAttribute('id') == col) {
        const uid = dragElement.getAttribute('uid');
        const list = Storage.get(this.dataName);
        entity = list.find((item) => item.uid == uid);
        entity.status = col;
        this.change(entity);
      } else if (currentDroppable.classList.contains('bin')) {
        const uid = +dragElement.getAttribute('uid');
        Storage.delete(this.dataName, uid);
        this.drawTasks();
      }
    });
  }
}
