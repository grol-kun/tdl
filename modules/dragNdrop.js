import { Drawer } from "./drawer.js";

let isDragging = false;
let currentDroppable = null;

export class Drag_n_Drop {
  static do(event) {
    let dragElement = event.target.closest('.draggable');
    if (!dragElement) return;
                dragElement.style.zIndex = 1000;
                console.log(dragElement);
    event.preventDefault();
    dragElement.ondragstart = function () {
      return false;
    };
    let coords, shiftX, shiftY;

    //StartPosition

    //let startPosition = [];

    /*      function returnOnStartPosition(){
      const [left, top] = startPosition;
      console.log(left, top);
      dragElement.style.left = left+'px';
      dragElement.style.top = top+'px';
    }   */

    startDrag(dragElement, event.clientX, event.clientY);

    function onMouseUp(event) {
      currentDroppable.style.borderColor = '';
      Drawer.finish(dragElement, currentDroppable);
      finishDrag();
    }

    function onMouseMove(event) {
      moveAt(event.clientX, event.clientY);
      // .......................................Дропбл!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      dragElement.hidden = true;
      let elemBelow = document.elementFromPoint(event.clientX, event.clientY);
      dragElement.hidden = false;
      // событие mousemove может произойти и когда указатель за пределами окна
      // (мяч перетащили за пределы экрана)

      // если clientX/clientY за пределами окна, elementFromPoint вернёт null
      if (!elemBelow) return;
      // потенциальные цели переноса помечены классом droppable (может быть и другая логика)
      let droppableBelow = elemBelow.closest('.droppable');
      if (currentDroppable != droppableBelow) {
        // мы либо залетаем на цель, либо улетаем из неё
        // внимание: оба значения могут быть null
        //   currentDroppable=null,
        //     если мы были не над droppable до этого события (например, над пустым пространством)
        //   droppableBelow=null,
        //     если мы не над droppable именно сейчас, во время этого события

        if (currentDroppable) {
          // логика обработки процесса "вылета" из droppable (удаляем подсветку)
          leaveDroppable(currentDroppable);
        }
        currentDroppable = droppableBelow;
        if (currentDroppable) {
          // логика обработки процесса, когда мы "влетаем" в элемент droppable
          enterDroppable(currentDroppable);
        }
      }
    }
    function enterDroppable(currentDroppable) {
      if (currentDroppable.classList.contains('bin')) {
        dragElement.style.opacity = '0.5';
        return;
      }
      if (currentDroppable.classList.contains('board')) {
        currentDroppable.style.borderColor = 'red';
      }
      currentDroppable.classList.add('currentDroppable');
    }
    function leaveDroppable(currentDroppable) {
      dragElement.style.opacity = '';
      currentDroppable.style.borderColor = '';
      currentDroppable.classList.remove('currentDroppable');
    }

    // в начале перемещения элемента:
    //   запоминаем место клика по элементу (shiftX, shiftY),
    //   переключаем позиционирование элемента (position:fixed) и двигаем элемент
    function startDrag(element, clientX, clientY) {
      if (isDragging) {
        return;
      }

      isDragging = true;

      document.addEventListener('mousemove', onMouseMove);
      element.addEventListener('mouseup', onMouseUp);

      shiftX = clientX - element.getBoundingClientRect().left;
      shiftY = clientY - element.getBoundingClientRect().top;

      //startPosition = [element.getBoundingClientRect().left, element.getBoundingClientRect().top];
      //console.log(startPosition);

      element.style.position = 'fixed';

      moveAt(clientX, clientY);
    }

    // переключаемся обратно на абсолютные координаты
    // чтобы закрепить элемент относительно документа
    function finishDrag() {
      if (!isDragging) {
        return;
      }

      isDragging = false;

      dragElement.style.top = parseInt(dragElement.style.top) + pageYOffset + 'px';
      dragElement.style.position = 'fixed'; // <- -------Изменить??? fixed /absolute

      document.removeEventListener('mousemove', onMouseMove);
      dragElement.removeEventListener('mouseup', onMouseUp);
    }

    function moveAt(clientX, clientY) {
      // вычисляем новые координаты (относительно окна)
      let newX = clientX - shiftX;
      let newY = clientY - shiftY;

      // проверяем, не переходят ли новые координаты за нижний край окна:
      // сначала вычисляем гипотетический новый нижний край окна
      let newBottom = newY + dragElement.offsetHeight;

      // затем, если новый край окна выходит за пределы документа, прокручиваем страницу
      if (newBottom > document.documentElement.clientHeight) {
        // координата нижнего края документа относительно окна
        let docBottom = document.documentElement.getBoundingClientRect().bottom;

        // простой скролл документа на 10px вниз имеет проблему -
        // он может прокручивать документ за его пределы,
        // поэтому используем Math.min(расстояние до конца, 10)
        let scrollY = Math.min(docBottom - newBottom, 10);

        // вычисления могут быть не совсем точны - случаются ошибки при округлении,
        // которые приводят к отрицательному значению прокрутки. отфильтруем их:
        if (scrollY < 0) scrollY = 0;

        window.scrollBy(0, scrollY);

        // быстрое перемещение мыши может поместить курсор за пределы документа вниз
        // если это произошло -
        // ограничиваем новое значение Y максимально возможным исходя из размера документа:
        newY = Math.min(newY, document.documentElement.clientHeight - dragElement.offsetHeight);
      }

      // проверяем, не переходят ли новые координаты за верхний край окна (по схожему алгоритму)
      if (newY < 0) {
        // прокручиваем окно вверх
        let scrollY = Math.min(-newY, 10);
        if (scrollY < 0) scrollY = 0; // проверяем ошибки точности

        window.scrollBy(0, -scrollY);
        // быстрое перемещение мыши может поместить курсор за пределы документа вверх
        newY = Math.max(newY, 0); // newY не может быть меньше нуля
      }

      // ограничим newX размерами окна
      // согласно условию, горизонтальная прокрутка отсутствует, поэтому это не сложно:
      if (newX < 0) newX = 0;
      if (newX > document.documentElement.clientWidth - dragElement.offsetWidth) {
        newX = document.documentElement.clientWidth - dragElement.offsetWidth;
      }

      dragElement.style.left = newX + 'px';
      dragElement.style.top = newY + 'px';
    }
  }
}
