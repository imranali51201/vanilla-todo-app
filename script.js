let tasks = []; // Array to store tasks
let editIndex = null; // Variable to track index of the task being edited
const tasksList = document.querySelector("#tasks-list"); // Reference to the task list DOM element
const taskForm = document.querySelector("#task-form");
/**
 * Renders the tasks list to the DOM
 */
const render = () => {
    tasksList.innerHTML = ""; // Clear current tasks list
    tasks.forEach((task, index) => {
        tasksList.innerHTML += `
        <li class="task">
            <input type="checkbox" onchange="toggleCompleteTask(${index})" ${task.completed ? "checked" : ""} />
            <span class="task-title ${task.completed ? "completed-task-title" : ""}">${task.title}</span>
            <button class="button" onclick="editTask(${index})">Edit</button>
            <button class="button" onclick="deleteTask(${index})">Delete</button>
        </li>
        `;
    });
};

/**
 * Toggles the completion status of a task
 */
const toggleCompleteTask = (index) => {
    tasks[index].completed = !tasks[index].completed; // Toggle the completion status
    tasks = [...tasks]; // Update tasks array to trigger reactivity
    localStorage.setItem("tasks", JSON.stringify(tasks)); // Save updated tasks to local storage
    render(); // Re-render the tasks list
};

/**
 * Deletes a task from the tasks list
 */
const deleteTask = (index) => {
    tasks = tasks.filter((_, _index) => _index !== index); // Remove the task from the array
    tasks = [...tasks]; // Update tasks array to trigger reactivity
    localStorage.setItem("tasks", JSON.stringify(tasks)); // Save updated tasks to local storage
    render(); // Re-render the tasks list
};

/**
 * Prepares the form for editing an existing task.
 */
const editTask = (index) => {
    const input = taskForm.querySelector("input[name='title']"); // Get the title input field from the form
    input.value = tasks[index].title; // Set the input field's value to the task's current title
    input.focus(); // Focus the input field to allow immediate editing
    taskForm.querySelector("input[type='submit']").value = "Update"; // Change the submit button text to "Update"
    editIndex = index; // Set the edit index to the current task index
};

/**
 * Handles the task addition form submission
 */
const onAddTask = (event) => {
    event.preventDefault(); // Prevent page reload

    const form = event.target; // Get the form element
    const formData = new FormData(form); // Get form data
    const formValues = Object.fromEntries(formData.entries()); // Convert form data to an object

    const newTask = {
        title: formValues.title,
        completed: false
    };

    if (editIndex !== null) {
        tasks[editIndex] = { ...tasks[editIndex], ...newTask }; // Update existing task
        taskForm.querySelector("input[type='submit']").value = "Add"// Update button
        editIndex = null; // Reset edit index
    } else {
        tasks = [...tasks, newTask]; // Add new task to the tasks array
    }

    localStorage.setItem("tasks", JSON.stringify(tasks)); // Save tasks to local storage
    render(); // Re-render the tasks list
    form.reset(); // Reset the form
};

taskForm.addEventListener("submit", onAddTask); // Add event listener for task form submission

/**
 * Initializes the tasks list from local storage
 */
const initialize = () => {
    tasks = JSON.parse(localStorage.getItem("tasks") || "[]"); // Load tasks from local storage
    render(); // Render the tasks list
};

// Initialize tasks list on page load
initialize();
