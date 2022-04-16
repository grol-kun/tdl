const buttonAdd = document.getElementById('btn-add');
const tasksplace = document.getElementById('tasksplace');

let tasks = [];

buttonAdd.addEventListener('click', createTask);

drowTasks();

function createTask(){

    let text = document.getElementById('txt');
    if (!text.value) return;

    let newTask = {};
    newTask.content = text.value;
    newTask.complited = false;

    tasks.push(newTask);
    localStorage.setItem('tasks',JSON.stringify(tasks));
    text.value ='';
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

    
    createCheckbox(item, div);
    createButton( div);

}

function createButton(div){

    let button = document.createElement('button');
    button.addEventListener('click', deleteTask);
    button.classList.add('btn-del');
    button.innerHTML = 'X';
    div.prepend(button);

}

function createCheckbox(item, div){

    let check = document.createElement('input');
    check.type = 'checkbox';
    check.value = 'выполнено';
    check.classList.add('check');
    check.addEventListener('click', changeCheck);

    if(item.complited){
        check.checked = true;
        div.classList.add('complited');
    }else{
        check.checked = false;
        div.classList.remove('complited');
    }

    let subDiv = document.createElement('div');
    div.prepend(subDiv);
    subDiv.innerHTML = "";
    subDiv.classList.add('sub-div');
    subDiv.prepend(check);

}

function deleteTask(){
    
    let index = this.closest('div').dataset.num;
    tasks.splice(index,1);
    localStorage.setItem('tasks',JSON.stringify(tasks));
    drowTasks();

}

function changeCheck(){

    let index = this.parentElement.parentElement.dataset.num;
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
