let input = document.getElementById('input-box');
let addbutton = document.getElementById('add');
let todolist = document.getElementById('list-elements');

document.addEventListener('DOMContentLoaded', gettodo);
addbutton.addEventListener('click', addtodo);
todolist.addEventListener('click', donecheck);

function addtodo(event) {
    event.preventDefault();

    let tododiv = document.createElement('div');
    tododiv.classList.add('todo-div');
    
    let newtodo = document.createElement('li');
    newtodo.innerHTML = input.value;
    newtodo.classList.add('todo-item');
    tododiv.appendChild(newtodo);

    save(input.value);

    const donebutton = document.createElement('button');
    donebutton.innerHTML = '&#10003';
    donebutton.classList.add('done-button');
    tododiv.appendChild(donebutton);

    todolist.appendChild(tododiv);

    input.value = "";
}

function donecheck(e) {
    let element = e.target;
    if(element.classList[0]=='done-button') {
        let deleting = element.parentElement;
        deletelocal(element);
        deleting.remove();
    }
}

function save(todo) {
    let todos;
    if(localStorage.getItem('todos')===null) {
        todos = [];
    }
    else {
        todos = JSON.parse(localStorage.getItem("todos"));
    }

    todos.push(todo);
    localStorage.setItem("todos", JSON.stringify(todos));
}

function gettodo() {
    let todos;
    if(localStorage.getItem('todos')===null) {
        todos = [];
    }
    else {
        todos = JSON.parse(localStorage.getItem("todos"));
    }
    todos.forEach(function(todo) {
        let tododiv = document.createElement('div');
        tododiv.classList.add('todo-div');
        
        let newtodo = document.createElement('li');
        newtodo.innerHTML = todo;
        newtodo.classList.add('todo-item');
        tododiv.appendChild(newtodo);

        const donebutton = document.createElement('button');
        donebutton.innerHTML = '&#10003';
        donebutton.classList.add('done-button');
        tododiv.appendChild(donebutton);

        todolist.appendChild(tododiv)
    });
}

function deletelocal(todo) {
    let todos;
    if(localStorage.getItem('todos')===null) {
        todos = [];
    }
    else {
        todos = JSON.parse(localStorage.getItem("todos"));
    }
    const index = todo.parentElement.children[0].innerHTML;
    todos.splice(todos.indexOf(index), 1);
    localStorage.setItem('todos', JSON.stringify(todos));
}

//////////////////////////////////////////clock


//circle start
let progressBar = document.querySelector('.e-c-progress');
let indicator = document.getElementById('e-indicator');
let pointer = document.getElementById('e-pointer');
let length = Math.PI * 2 * 100;

progressBar.style.strokeDasharray = length;

function update(value, timePercent) {
  var offset = - length - length * value / (timePercent);
  progressBar.style.strokeDashoffset = offset; 
  pointer.style.transform = `rotate(${360 * value / (timePercent)}deg)`; 
};

//circle ends
const displayOutput = document.querySelector('.display-remain-time')
const pauseBtn = document.getElementById('pause');
const setterBtns = document.querySelectorAll('button[data-setter]');

let intervalTimer;
let timeLeft;
let wholeTime = 0.5 * 60; // manage this to set the whole time 
let isPaused = false;
let isStarted = false;


update(wholeTime,wholeTime); //refreshes progress bar
displayTimeLeft(wholeTime);

function changeWholeTime(seconds){
  if ((wholeTime + seconds) > 0){
    wholeTime += seconds;
    update(wholeTime,wholeTime);
  }
}

for (var i = 0; i < setterBtns.length; i++) {
    setterBtns[i].addEventListener("click", function(event) {
        var param = this.dataset.setter;
        switch (param) {
            case 'minutes-plus':
                changeWholeTime(1 * 60);
                break;
            case 'minutes-minus':
                changeWholeTime(-1 * 60);
                break;
            case 'seconds-plus':
                changeWholeTime(1);
                break;
            case 'seconds-minus':
                changeWholeTime(-1);
                break;
        }
      displayTimeLeft(wholeTime);
    });
}

function timer (seconds){ //counts time, takes seconds
  let remainTime = Date.now() + (seconds * 1000);
  displayTimeLeft(seconds);
  
  intervalTimer = setInterval(function(){
    timeLeft = Math.round((remainTime - Date.now()) / 1000);
    if(timeLeft < 0){
      clearInterval(intervalTimer);
      isStarted = false;
      setterBtns.forEach(function(btn){
        btn.disabled = false;
        btn.style.opacity = 1;
      });
      displayTimeLeft(wholeTime);
      pauseBtn.classList.remove('pause');
      pauseBtn.classList.add('play');
      return ;
    }
    displayTimeLeft(timeLeft);
  }, 1000);
}
function pauseTimer(event){
  if(isStarted === false){
    timer(wholeTime);
    isStarted = true;
    this.classList.remove('play');
    this.classList.add('pause');
    
    setterBtns.forEach(function(btn){
      btn.disabled = true;
      btn.style.opacity = 0.5;
    });

  }else if(isPaused){
    this.classList.remove('play');
    this.classList.add('pause');
    timer(timeLeft);
    isPaused = isPaused ? false : true
  }else{
    this.classList.remove('pause');
    this.classList.add('play');
    clearInterval(intervalTimer);
    isPaused = isPaused ? false : true ;
  }
}

function displayTimeLeft (timeLeft){ //displays time on the input
  let minutes = Math.floor(timeLeft / 60);
  let seconds = timeLeft % 60;
  let displayString = `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  displayOutput.textContent = displayString;
  update(timeLeft, wholeTime);
}

pauseBtn.addEventListener('click',pauseTimer);