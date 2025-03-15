var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var TaskManager = /** @class */ (function () {
    function TaskManager() {
        this.tasks = [];
        this.storageKey = "Tasks";
        this.loadFromStorage();
    }
    // Save tasks to local storage
    TaskManager.prototype.saveToStorage = function () {
        var jsonData = JSON.stringify(this.tasks);
        localStorage.setItem(this.storageKey, jsonData);
    };
    // load tasks from local storage to tasks[] >>>
    TaskManager.prototype.loadFromStorage = function () {
        var response = localStorage.getItem(this.storageKey);
        if (response) {
            var data = JSON.parse(response);
            this.tasks = data;
            console.log(data);
        }
    };
    // ADD NEW TASK >>>
    TaskManager.prototype.addTask = function (title, description) {
        var newTask = {
            id: Date.now(),
            title: title,
            description: description,
            completed: false,
        };
        this.tasks.push(newTask);
        this.saveToStorage();
    };
    // DELETE TASK BY ITS ID >>>
    TaskManager.prototype.deleteTask = function (id) {
        this.tasks = this.tasks.filter(function (task) { return task.id !== id; });
        this.saveToStorage();
        alert("Task Deleted Successfully");
    };
    // EDIT TASK BY ITS ID >>>
    TaskManager.prototype.editTask = function (id, newTitle, newDescription) {
        this.tasks = this.tasks.map(function (task) { return (task.id === id ? __assign(__assign({}, task), { title: newTitle, description: newDescription }) :
            task); });
        this.saveToStorage();
    };
    // TOGGLE THE COMPLETION STATUS OF THE TASK BASED ON ID >>>
    TaskManager.prototype.toggleTask = function (id) {
        this.tasks = this.tasks.map(function (task) {
            return task.id === id ? __assign(__assign({}, task), { completed: !task.completed }) : task;
        });
        this.saveToStorage();
    };
    // generate all tasks as per the category
    TaskManager.prototype.getTask = function (filter) {
        if (filter === void 0) { filter = "all"; }
        if (filter === 'all') {
            return this.tasks;
        }
        else if (filter === 'active') {
            return this.tasks.filter(function (data) { return data.completed === false; });
        }
        else {
            // filter based on completed status
            return this.tasks.filter(function (data) { return data.completed === true; });
        }
    };
    return TaskManager;
}());
// DOM MANIPULATION AND EVEN HANDLING >>>>  
var taskmanager = new TaskManager();
var taskTitle = document.getElementById('taskTitle');
var taskDescription = document.getElementById('taskDesc');
var addTaskBtn = document.getElementById('addTaskBtn');
var taskList = document.getElementById('tasks');
var filterBtns = document.querySelectorAll('.filter-btn');
var currFilter = "all";
// Event Listner for adding a new task
addTaskBtn.addEventListener('click', function (e) {
    e.preventDefault();
    var title = taskTitle.value.trim();
    var description = taskDescription.value.trim() || "*** Empty Description ***";
    // error handling (runtime)
    if (title === '' && title.length < 3) {
        alert('Task title must be at least 3 characters long');
        return;
    }
    taskmanager.addTask(title, description);
    taskTitle.value = '';
    taskDescription.value = '';
    renderTasks(); // Rerender the UI 
});
// Event Listeners to the filter buttons
filterBtns.forEach(function (filterBtn) {
    filterBtn.addEventListener('click', function () {
        // remove prev state active class from a specific filter btn
        filterBtns.forEach(function (btn) { return btn.classList.remove('active'); });
        // add new active class to the current filter btn
        filterBtn.classList.add('active');
        currFilter = filterBtn.getAttribute('data-filter') || 'all';
        console.log("current filter: ", currFilter);
        renderTasks();
    });
});
var renderTasks = function () {
    taskList.innerHTML = "";
    var tasks = taskmanager.getTask(currFilter);
    if (tasks.length === 0) {
        var noTasksMsg = document.createElement('p');
        noTasksMsg.textContent = 'No tasks found';
        taskList.appendChild(noTasksMsg);
        return;
    }
    tasks.forEach(function (task) {
        var li = document.createElement('li');
        li.className = 'task-item';
        if (task.completed) {
            li.classList.add('completed');
        }
        li.setAttribute('data-id', task.id.toString());
        // checkbox
        var checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.completed; // true if completed or false
        checkbox.addEventListener('change', function () {
            taskmanager.toggleTask(task.id);
            renderTasks();
        });
        // task details: title and description
        var details = document.createElement('div');
        details.className = 'task-details';
        var title = document.createElement('p'); // add title component
        title.textContent = task.title; // assign value to title
        title.className = 'task-title';
        details.appendChild(title); // added into details
        if (task.description.length > 0) {
            var description = document.createElement('p'); // add description component
            description.textContent = task.description; // assign value to description
            description.className = 'task-desc';
            details.appendChild(description); // added into details
        }
        // Taking a div to contains two button 1: Edit 2: Delete >>>
        var actionDiv = document.createElement('div');
        actionDiv.className = 'task-actions';
        // Edit buttons banau bhau
        var editBtn = document.createElement('button');
        editBtn.textContent = 'Edit';
        editBtn.className = 'edit';
        editBtn.addEventListener('click', function () {
            // Now i need to perform update that i will do via prompt dialog
            var newTitle = prompt("Enter task title: ", task.title) || "";
            var newDescription = prompt("Enter task description:", task.description) || "*** Empty Description ***";
            // error handling
            if ((newTitle === '') && ((newTitle === null || newTitle === void 0 ? void 0 : newTitle.trim()) === '')) {
                alert("Must provide Some Title");
                return;
            }
            // Description can be empty/optional
            newDescription = (newDescription === null || newDescription === void 0 ? void 0 : newDescription.trim()) === '' ? "" : newDescription === null || newDescription === void 0 ? void 0 : newDescription.trim();
            // Edit the task >>>
            taskmanager.editTask(task.id, newTitle, newDescription);
            renderTasks();
        });
        // Delete Buttons banau bhai >>>
        var deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.className = 'delete';
        deleteBtn.addEventListener('click', function () {
            // Delete the task from the task manager
            taskmanager.deleteTask(task.id);
            renderTasks();
        });
        actionDiv.appendChild(editBtn);
        actionDiv.appendChild(deleteBtn);
        li.appendChild(checkbox);
        li.appendChild(details);
        li.appendChild(actionDiv);
        taskList.appendChild(li);
    });
};
renderTasks();
