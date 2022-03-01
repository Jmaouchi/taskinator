var taskIdCounter = 0;
var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");
var pageContentEl = document.querySelector("#page-content");
var tasksInProgressEl = document.querySelector("#tasks-in-progress");
var tasksCompletedEl = document.querySelector("#tasks-completed");
var tasks = [];

// main function 
var taskFormHandler = function(event) {
  event.preventDefault();
  var taskNameInput = document.querySelector("input[name='task-name']").value; // this is the first input value
  var taskTypeInput = document.querySelector("select[name='task-type']").value; // this is the second input value 

  // check if input values are empty strings
  if (!taskNameInput || !taskTypeInput) {
  alert("You need to fill out the task form!");
 
  return false; // this will stop it from going to the next step and it will set the alert again 
  }
  formEl.reset(); // this will make the textContent on the input form disappear 
  //The browser-provided DOM element interface has the reset() method, which is designed specifically for the <form> element and won't work on any other element.

  var isEdit = formEl.hasAttribute("data-task-id");
  // has data attribute, so get task id and call function to complete edit process
  if (isEdit) {
    var taskId = formEl.getAttribute("data-task-id");
    completeEditTask(taskNameInput, taskTypeInput, taskId);
  } 
  // no data attribute, so create object as normal and pass to createTaskEl function
  else {
    var taskDataObj = {
      name: taskNameInput,
      type: taskTypeInput,
      status: "to do"
    }

  // send it as an argument to createTaskEl
  createTaskEl(taskDataObj);
  }

};




var createTaskEl = function(taskDataObj) {
  // create an li
  var listItemEl = document.createElement("li");
  // set a className
  listItemEl.className = "task-item";
  // add task id as a custom attribute
  listItemEl.setAttribute("data-task-id", taskIdCounter); // same than this ==> <li classe='data-task-id='0'>...</li> and the taskIdCounter is the value of the data-attr

  var taskInfoEl = document.createElement("div");
  taskInfoEl.className = "task-info";
  taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span>";
  // append the taskObj.name and taskObj.type to the li (list)
  listItemEl.appendChild(taskInfoEl);
  //appended the taskActionE1 (2 buttons and a selector) to the div
  var taskActionsEl = createTaskActions(taskIdCounter);
  listItemEl.appendChild(taskActionsEl);
  taskDataObj.id = taskIdCounter; // this will creat an id of every single object and we can save it to local storage 
  tasks.push(taskDataObj); // we did push the taskDataObj.id which is 0 for now, to the object we have 
  //local storage
  saveTasks()

  tasksToDoEl.appendChild(listItemEl);
  // increase task counter for next unique id
  taskIdCounter++; //this will change the id of the li on every new one cause we have a var counter = 0;
};

var createTaskActions = function(taskId) {
  var actionContainerEl = document.createElement("div");
  actionContainerEl.className = "task-actions";

  // create edit button and  append to the div
  var editButtonEl = document.createElement("button");
  editButtonEl.textContent = "Edit";
  editButtonEl.className = "btn edit-btn";
  editButtonEl.setAttribute("data-task-id", taskId);


  actionContainerEl.appendChild(editButtonEl);

  // create delete button and append to the div
  var deleteButtonEl = document.createElement("button");
  deleteButtonEl.textContent = "Delete";
  deleteButtonEl.className = "btn delete-btn";
  deleteButtonEl.setAttribute("data-task-id", taskId);

  actionContainerEl.appendChild(deleteButtonEl);
  

  // create a select with options and append to div
  var statusSelectEl = document.createElement("select");
  statusSelectEl.className = "select-status";
  statusSelectEl.setAttribute("name", "status-change");
  statusSelectEl.setAttribute("data-task-id", taskId);

  actionContainerEl.appendChild(statusSelectEl);

  // create an array of options 
  var statusChoices = ["To Do", "In Progress", "Completed"];
  for (var i = 0; i < statusChoices.length; i++) { // we created that function that will allow us to add the options by looping through the array until the length will be hit and it will stop
    //this is way better and faster than creating 3 different options and append them 3 times ... 

    // create option element
    var statusOptionEl = document.createElement("option");
    statusOptionEl.textContent = statusChoices[i];
    statusOptionEl.setAttribute("value", statusChoices[i]);
  
    // append to select
    statusSelectEl.appendChild(statusOptionEl);
  }


  return actionContainerEl;


};

formEl.addEventListener("submit", taskFormHandler);



// click btn event listener start
var taskButtonHandler = function(event) {
  // get target element from event
  var targetEl = event.target;

  // edit button was clicked
  if (targetEl.matches(".edit-btn")) {
    var taskId = targetEl.getAttribute("data-task-id");
    editTask(taskId);
  } 
  // delete button was clicked
  else if (targetEl.matches(".delete-btn")) {
    var taskId = targetEl.getAttribute("data-task-id");
    deleteTask(taskId);
  }
};

// delete function start

var deleteTask = function(taskId) {
  console.log(taskId);
  var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");//notice that there's no space between the .task-item and the [data-task-id] attribute, which means that both properties must be on the same element; a space would look for a element with the [data-task-id] attribute somewhere inside a .task-item element.
  taskSelected.remove();

  // create new array to hold updated list of tasks
  var updatedTaskArr = [];

  // loop through current tasks
  for (var i = 0; i < tasks.length; i++) {
    // if tasks[i].id doesn't match the value of taskId, let's keep that task and push it into the new array
    if (tasks[i].id !== parseInt(taskId)) {
      updatedTaskArr.push(tasks[i]);
    }
  }
  //local storage
  saveTasks()
  deleteStorege()
// reassign tasks array to be the same as updatedTaskArr
tasks = updatedTaskArr;

};



// edit function start
var editTask = function(taskId) {
// get task list item element
var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']"); //this is the li selected, by checking its own id

// get content from task name and type
var taskName = taskSelected.querySelector("h3.task-name").textContent;
taskName = document.querySelector("input[name='task-name']").value;

var taskType = taskSelected.querySelector("span.task-type").textContent;
document.querySelector("select[name='task-type']").value = taskType;

document.querySelector("#save-task").textContent = "Save Task";
formEl.setAttribute("data-task-id", taskId);
console.log(formEl);
};

pageContentEl.addEventListener("click", taskButtonHandler);



// complete task function start
var completeEditTask = function(taskName, taskType, taskId) {
// find the matching task list item
var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

// set new values
taskSelected.querySelector("h3.task-name").textContent = taskName;
taskSelected.querySelector("span.task-type").textContent = taskType;

// loop through tasks array and task object with new content
for (var i = 0; i < tasks.length; i++) {
  if (tasks[i].id === parseInt(taskId)) {
    tasks[i].name = taskName;
    tasks[i].type = taskType;
  }
};
//local storage
saveTasks()

alert("Task Updated!");
formEl.removeAttribute("data-task-id");
document.querySelector("#save-task").textContent = "Add Task";

};





var taskStatusChangeHandler = function(event) {
  // get the task item's id
  var taskId = event.target.getAttribute("data-task-id"); // data-task-id is the id of the li tag

  // get the currently selected option's value and convert to lowercase
  var statusValue = event.target.value.toLowerCase();

  // find the parent task item element based on the id
  var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']"); // the taskSelected is the li tag with the specefic id number wich is the taskId

  if (statusValue === "to do") {
    tasksToDoEl.appendChild(taskSelected);
  } 
  else if (statusValue === "in progress") {
    tasksInProgressEl.appendChild(taskSelected);
  } 
  else if (statusValue === "completed") {
    tasksCompletedEl.appendChild(taskSelected);
  }

  // update task's in tasks array  // this will loop through the array that we have and change the statuse on that object to be equal to are current value 
  for (var i = 0; i < tasks.length; i++) {
    if (tasks[i].id === parseInt(taskId)) {
      tasks[i].status = statusValue;
    }
  }

  //local storage
  saveTasks()
};

pageContentEl.addEventListener("change", taskStatusChangeHandler);

// save to local storage
var saveTasks = function() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// get from local storage
var loadTasks = function() {
  var savedTasks = localStorage.getItem("tasks");
  // if there are no tasks, set tasks to an empty array and return out of the function
  if (!savedTasks) {
    return false;
  }
  console.log("Saved tasks found!");
  // else, load up saved tasks

  // parse into array of objects
  savedTasks = JSON.parse(savedTasks);

  // loop through savedTasks array
  for (var i = 0; i < savedTasks.length; i++) {
    // pass each task object into the `createTaskEl()` function
    createTaskEl(savedTasks[i]);
  }
}

loadTasks();