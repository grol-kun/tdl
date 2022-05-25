import { Storage } from './storage.js';

export class Drawer {
  static pointer = 'tasks';
  static drawTasks() {
    const tasksPlace = document.getElementById('tasksplace');
    const tasks = Storage.get(this.pointer);
    tasksPlace.innerHTML = '';

    if (tasks.length > 0) {
      tasks
        .sort((a, b) => Number(b.complited) - Number(a.complited))
        .sort((a, b) => Number(a.important) - Number(b.important))
        .forEach((item, index) => {
          this.creatingElements(item, index, tasksPlace);
        });
    }

    this.setFocus();
  }

  static creatingElements(item, index, tasksPlace) {
    const div = document.createElement('div');
    div.textContent = item.content;
    div.classList.add('task');
    tasksPlace.prepend(div);
    div.dataset.index = item.uid;

    this.createCheckbox(item, div);
    this.createButtonDel(div);
    this.createImportantIcon(item, div);
  }

  static createCheckbox(item, div) {
    const check = document.createElement('input');
    check.type = 'checkbox';
    check.classList.add('check');
    check.addEventListener('click', this.changeCheck.bind(this, check));

    if (item.complited) {
      check.checked = true;
      div.classList.add('complited');
    }

    const subDiv = document.createElement('div');
    div.prepend(subDiv);
    subDiv.innerHTML = '';
    subDiv.classList.add('sub-div');
    subDiv.prepend(check);
  }

  static createButtonDel(div) {
    const subDiv = document.createElement('div');
    subDiv.classList.add('btn-del');
    div.prepend(subDiv);
    const index = subDiv.parentElement.dataset.index;
    subDiv.addEventListener('click', this.deleteTask.bind(this, index));
  }

  static createImportantIcon(item, div) {
    const subDiv = document.createElement('div');
    subDiv.classList.add('icon');
    subDiv.addEventListener('click', this.changeImportance.bind(this, subDiv));

    if (item.important) {
      subDiv.classList.add('imp');
      div.classList.add('important');
    } else {
      subDiv.classList.add('not-imp');
    }

    div.prepend(subDiv);
  }

  static setFocus() {
    const txt = document.getElementById('txt');
    txt.focus();
  }

  static createTask() {
    const entity = this.create();
    if (entity) {
      const tasks = Storage.add(this.pointer, entity);
      const text = document.getElementById('txt');
      text.value = '';
      this.change(tasks);
      this.drawTasks();
    } else {
      return;
    }
  }

  static create() {
    const text = document.getElementById('txt');
    if (!text.value) return;
    const entity = {};
    entity.content = text.value;
    entity.complited = false;
    entity.important = false;
    return entity;
  }

  static deleteTask(index) {
    Storage.delete(this.pointer, index);
    this.drawTasks();
  }

  static changeImportance(subDiv) {
    const index = +subDiv.parentElement.dataset.index;
    const tasks = Storage.get(this.pointer);
    const task = tasks.find((i) => i.uid === index);
    task.important = !task.important;
    this.change(task);
  }

  static changeCheck(check) {
    const index = +check.parentElement.parentElement.dataset.index;
    const tasks = Storage.get(this.pointer);
    const task = tasks.find((i) => i.uid === index);
    task.complited = !task.complited;
    this.change(task);
  }

  static change(entity) {
    Storage.update(this.pointer, entity);
    this.drawTasks();
  }
}
