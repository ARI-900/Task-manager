interface Task {
  id: number,
  title: string,
  description: string,
  completed: boolean,
}

class TaskManager {
  private tasks: Task[] = [];
  private storageKey: string = "Tasks";

  constructor() {
    this.loadFromStorage();
  }

  // Save tasks to local storage
  private saveToStorage(): void {
    const jsonData = JSON.stringify(this.tasks);
    localStorage.setItem(this.storageKey, jsonData);
  }


  // load tasks from local storage to tasks[] >>>
  private loadFromStorage(): void {
    const response = localStorage.getItem(this.storageKey);
    if (response) {
      const data = JSON.parse(response);
      this.tasks = data;
      console.log(data);
    }
  }


  // ADD NEW TASK >>>
  public addTask(title: string, description: string): void {

    const newTask: Task = {
      id: Date.now(),
      title,
      description,
      completed: false,
    }

    this.tasks.push(newTask);
    this.saveToStorage();
  }



  // DELETE TASK BY ITS ID >>>
  public deleteTask(id: number): void {

    this.tasks = this.tasks.filter((task) => task.id !== id);
    this.saveToStorage();
    alert("Task Deleted Successfully");
  }




  // EDIT TASK BY ITS ID >>>
  public editTask(id: number, newTitle: string, newDescription: string): void {
    this.tasks =  this.tasks.map((task) => (
      task.id === id ?
        {
          ...task,
          title: newTitle,
          description: newDescription,
        } :
        task
    ));

    this.saveToStorage();
  }



  // TOGGLE THE COMPLETION STATUS OF THE TASK BASED ON ID >>>
  public toggleTask(id: number) {
    this.tasks = this.tasks.map((task) => {
      return task.id === id ? { ...task, completed: !task.completed } : task
    })

    this.saveToStorage();
  }


  // generate all tasks as per the category
  public getTask(filter: string = "all"): Task[] {

    if (filter === 'all') {
      return this.tasks;
    }
    else if (filter === 'active') {
      return this.tasks.filter((data) => data.completed === false);
    }
    else {
      // filter based on completed status
      return this.tasks.filter((data) => data.completed === true);
    }
  }
}




// DOM MANIPULATION AND EVEN HANDLING >>>>  
const taskmanager = new TaskManager();


const taskTitle = document.getElementById('taskTitle') as HTMLInputElement;
const taskDescription = document.getElementById('taskDesc') as HTMLInputElement;
const addTaskBtn = document.getElementById('addTaskBtn') as HTMLButtonElement;
const taskList = document.getElementById('tasks') as HTMLUListElement;
const filterBtns = document.querySelectorAll('.filter-btn');


let currFilter: string = "all";


// Event Listner for adding a new task
addTaskBtn.addEventListener('click', (e) => {
  e.preventDefault();
  const title = taskTitle.value.trim();
  const description = taskDescription.value.trim() || "*** Empty Description ***";

  // error handling (runtime)
  if (title === '' && title.length < 3) {
    alert('Task title must be at least 3 characters long');
    return;
  }

  taskmanager.addTask(title, description);
  taskTitle.value = '';
  taskDescription.value = '';

  renderTasks(); // Rerender the UI 
})




// Event Listeners to the filter buttons
filterBtns.forEach((filterBtn) => {
  filterBtn.addEventListener('click', () => {

    // remove prev state active class from a specific filter btn
    filterBtns.forEach((btn) => btn.classList.remove('active'));
    // add new active class to the current filter btn
    filterBtn.classList.add('active');
    currFilter = filterBtn.getAttribute('data-filter') || 'all';
    console.log("current filter: ", currFilter);

    renderTasks();
  })
})


const renderTasks = (): void => {

  taskList.innerHTML = "";
  const tasks = taskmanager.getTask(currFilter);

  if(tasks.length === 0) {
    const noTasksMsg = document.createElement('p');
    noTasksMsg.textContent = 'No tasks found';
    taskList.appendChild(noTasksMsg);
    return;
  }

  tasks.forEach((task) => {

    const li = document.createElement('li');
    li.className = 'task-item';

    if (task.completed) {
      li.classList.add('completed');
    }

    li.setAttribute('data-id', task.id.toString());

    // checkbox
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.completed;  // true if completed or false
    checkbox.addEventListener('change', () => {
      taskmanager.toggleTask(task.id);
      renderTasks();
    })


    // task details: title and description
    const details = document.createElement('div');
    details.className = 'task-details';

    const title = document.createElement('p'); // add title component
    title.textContent = task.title; // assign value to title
    title.className = 'task-title';
    details.appendChild(title); // added into details

    if (task.description.length > 0) {
      const description = document.createElement('p'); // add description component
      description.textContent = task.description; // assign value to description
      description.className = 'task-desc';
      details.appendChild(description); // added into details
    }





    // Taking a div to contains two button 1: Edit 2: Delete >>>
    const actionDiv = document.createElement('div');
    actionDiv.className = 'task-actions';

    // Edit buttons banau bhau
    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.className = 'edit';

    editBtn.addEventListener('click', () => {
      // Now i need to perform update that i will do via prompt dialog
      let newTitle = prompt("Enter task title: ", task.title) || "";
      let newDescription = prompt("Enter task description:", task.description) || "*** Empty Description ***";


      // error handling
      if ((newTitle === '') && (newTitle?.trim() === '')) {
        alert("Must provide Some Title");
        return;
      }
      // Description can be empty/optional
      newDescription = newDescription?.trim() === ''? "" : newDescription?.trim() ;
      
      // Edit the task >>>
      taskmanager.editTask(task.id, newTitle, newDescription);
      renderTasks();
    })

    // Delete Buttons banau bhai >>>
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.className = 'delete';

    deleteBtn.addEventListener('click', () => {
      // Delete the task from the task manager
      taskmanager.deleteTask(task.id);
      renderTasks();
    })

    actionDiv.appendChild(editBtn);
    actionDiv.appendChild(deleteBtn);

    li.appendChild(checkbox);
    li.appendChild(details);
    li.appendChild(actionDiv);
    
    taskList.appendChild(li);

  })

}

renderTasks();