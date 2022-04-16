const buttonAdd = document.getElementById('btn-add');
const tasksplace = document.getElementById('tasksplace');

let tasks = [];

buttonAdd.addEventListener('click', createTask);

drowTasks();

function createTask(){

    let text = document.getElementById('txt');
    let newTask = {};
   //добавить обработку на ввод пустого поля
    newTask.content = text.value;
    newTask.complited = false;
    newTask.important = false;

    tasks.push(newTask);
    localStorage.setItem('tasks',JSON.stringify(tasks));
    drowTasks();
}

function drowTasks(){

    tasks = JSON.parse(localStorage.getItem('tasks'));
    tasksplace.innerHTML = '';
    if(tasks.length > 0){
        tasks.forEach((item, index)=>{
            addingTasks(item, index);
        })
    }
}

function addingTasks(item,index){

    let div = document.createElement('div');
    div.textContent = item.content;
    div.classList.add('task');
    tasksplace.prepend(div);
    div.dataset.num = index;

    createButton( div);
    createCheckbox(item, div);

}

function createButton(div){

    let button = document.createElement('button');
    button.onclick = deleteTask;
    button.classList.add('btn-del');
    button.innerHTML = 'Удалить';
    div.append(button);

}

function createCheckbox(item, div){

    let check = document.createElement('input');
    check.type = 'checkbox';
    check.value = 'выполнено';
    check.classList.add('check');

    if(item.complited){
        check.checked = true;
        div.classList.add('complited');
    }else{
        check.checked = false;
        div.classList.remove('complited');
    }

    check.onclick = changeCheck;
    div.append(check);

}

function deleteTask(){
    
    let index = this.closest('div').dataset.num;
    tasks.splice(index,1);
    localStorage.setItem('tasks',JSON.stringify(tasks));
    drowTasks();

}

function changeCheck(){

    let index = this.closest('div').dataset.num
    tasks[index].complited = !tasks[index].complited;

    let isComplited = [];
    let isNotComplited = [];

    for (let i = 0; i < tasks.length; i++ ){
        if(tasks[i].complited){
            isComplited.push(tasks[i]);
        }else{
            isNotComplited.push(tasks[i]);
        }
    }
    tasks = [...isComplited,...isNotComplited];

    localStorage.setItem('tasks',JSON.stringify(tasks));
    drowTasks();

}
