import { Drawer } from './drawer.js';
import { DragDrop } from './dragNdrop.js';

export const initial = {
  init() {
    const buttonAdd = document.getElementById('btn-add');
    buttonAdd.addEventListener('click', Drawer.addTask.bind(Drawer));

    document.addEventListener('keydown', (event) => {
      if (event.code === 'Enter') {
        Drawer.addTask();
      }
    });

    const input = document.getElementById('txt');
    input.addEventListener('input', (event) => {
      buttonAdd.disabled = event.target.value.length < 3;
    });

    //document.addEventListener('DOMContentLoaded', Drawer.setFocus.bind(Drawer));

    document.addEventListener('mousedown', DragDrop.do.bind(DragDrop));

    Drawer.drawTasks();
  },
};
