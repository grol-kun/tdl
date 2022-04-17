'use strict';

const buttonAdd = document.getElementById('btn-add');
const tasksPlace = document.getElementById('tasksplace');

buttonAdd.addEventListener('click', createTask);

drowTasks();

function createTask(){
    let text = document.getElementById('txt');
    if (!text.value) return;

    let newTask = {};
    newTask.content = text.value;
    newTask.complited = false;
    newTask.important = false;
   
    let tasks = JSON.parse(localStorage.getItem('tasks')) ? JSON.parse(localStorage.getItem('tasks')) : [] ; 
    tasks.push(newTask);
    localStorage.setItem('tasks',JSON.stringify(tasks));

    text.value ='';
    drowTasks();
}

function drowTasks(){
    let tasks = JSON.parse(localStorage.getItem('tasks')) ? JSON.parse(localStorage.getItem('tasks')) : [] ; 

    tasksPlace.innerHTML = '';
    
    if(tasks.length > 0){
        tasks.forEach((item, index)=>{
            creatingElements(item, index);
        })
    }
}

function creatingElements(item,index){
    let div = document.createElement('div');
    div.textContent = item.content;
    div.classList.add('task');
    tasksPlace.prepend(div);
    div.dataset.num = index;
    
    createCheckbox(item, div);
    createButtonDel( div);
    createImportantIcon(item, div);
}

function createImportantIcon(item, div){
    let subDiv = document.createElement('div');
    subDiv.classList.add('icon');
    subDiv.addEventListener('click', changeImportance);

    if(item.important){
        subDiv.classList.add('imp');
        div.classList.add('important');
    }else{
        subDiv.classList.add('not-imp');
    }

    div.prepend(subDiv);
}

function createCheckbox(item, div){
    let check = document.createElement('input');
    check.type = 'checkbox';
    check.classList.add('check');
    check.addEventListener('click', changeCheck);

    if(item.complited){
        check.checked = true;
        div.classList.add('complited');
    }

    let subDiv = document.createElement('div');
    div.prepend(subDiv);
    subDiv.innerHTML = "";
    subDiv.classList.add('sub-div');
    subDiv.prepend(check);
}

function createButtonDel(div){
    let button = document.createElement('button');
    button.addEventListener('click', deleteTask);
    button.classList.add('btn-del');
    button.innerHTML = 'X';
    div.prepend(button);
}

function deleteTask(){
    let tasks = JSON.parse(localStorage.getItem('tasks'));
    let index = this.closest('div').dataset.num;
    tasks.splice(index,1);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    drowTasks();
}

function changeImportance(){
    let index = this.parentElement.dataset.num;
    let tasks = JSON.parse(localStorage.getItem('tasks'));
    tasks[index].important = !tasks[index].important;

    change(tasks);
}

function changeCheck(){
    let index = this.parentElement.parentElement.dataset.num;
    let tasks = JSON.parse(localStorage.getItem('tasks'));
    tasks[index].complited = !tasks[index].complited;

   change(tasks);
}

function change(tasks){
    let isImportant = [];
    let isComplited = [];
    let isNotComplited = [];

    for(let i = 0; i < tasks.length; i++){
        if(tasks[i].complited){
        isComplited.push(tasks[i]);
        }else if(tasks[i].important){
            isImportant.push(tasks[i]);
        }else if(!tasks[i].complited){
            isNotComplited.push(tasks[i]);
        }
    }

    tasks = [...isComplited,...isNotComplited,...isImportant];
    localStorage.setItem('tasks',JSON.stringify(tasks));
    drowTasks();
}
