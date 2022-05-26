import { Drawer } from './drawer.js';

export const initial = {
  init() {
    const buttonAdd = document.getElementById('btn-add');
    buttonAdd.addEventListener('click', Drawer.addTask.bind(Drawer));
    document.addEventListener('DOMContentLoaded', Drawer.setFocus.bind(Drawer));
    document.addEventListener('keydown', (event) => {
      if (event.code === 'Enter') Drawer.addTask();
    });

    Drawer.drawTasks();
  },
};
