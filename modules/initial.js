import { Drawer } from './drawer.js';
import { Drag_n_Drop } from './dragNdrop.js';

export const initial = {
  init() {
    const buttonAdd = document.getElementById('btn-add');
    buttonAdd.addEventListener('click', Drawer.addTask.bind(Drawer));

    //document.addEventListener('DOMContentLoaded', Drawer.setFocus.bind(Drawer));
    document.addEventListener('keydown', (event) => {
      if (event.code === 'Enter') Drawer.addTask();
    });

    document.addEventListener('mousedown', Drag_n_Drop.do.bind(Drag_n_Drop)); //add event если что

    Drawer.drawTasks();
  }
};
