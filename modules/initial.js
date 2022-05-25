import { Drawer } from './drawer.js';

export const initial = {
  init() {
    const buttonAdd = document.getElementById('btn-add');
    document.addEventListener('DOMContentLoaded', Drawer.setFocus.bind(Drawer));
    document.addEventListener('keydown', (event) => {
      if (event.code === 'Enter') Drawer.createTask();
    });

    buttonAdd.addEventListener('click', Drawer.createTask.bind(Drawer));
    Drawer.drawTasks();
  },
};
