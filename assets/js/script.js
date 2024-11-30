// Select form elements
const addTaskForm = document.querySelector("#add-task form");
const activeTaskList = document.getElementById("active-task-list");

// Add event listener for the form submission
addTaskForm.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent page reload

    // Get input values
    const taskTitle = document.getElementById("task-title").value;
    const startTimestamp = document.getElementById("start-timestamp").value;
    const endTimestamp = document.getElementById("end-timestamp").value;

    // Validate input (basic check)
    if (!taskTitle || !startTimestamp || !endTimestamp) {
        alert("Please fill out all required fields!");
        return;
    }

    // Create a new list item for the active task
    const taskItem = document.createElement("li");
    taskItem.innerHTML = `
        <strong>${taskTitle}</strong>
        <p>Start: ${new Date(startTimestamp).toLocaleString()}</p>
        <p>End: ${new Date(endTimestamp).toLocaleString()}</p>
        <button class="complete-task">Mark as Complete</button>
    `;

    // Add functionality to mark tasks as completed
    taskItem.querySelector(".complete-task").addEventListener("click", function () {
        taskItem.remove();
        moveToCompleted(taskTitle, startTimestamp, endTimestamp);
    });

    // Append the task to the active task list
    activeTaskList.appendChild(taskItem);

    // Clear the form
    addTaskForm.reset();
});

// Function to move tasks to the completed tasks list
function moveToCompleted(taskTitle, startTimestamp, endTimestamp) {
    const completedTaskList = document.getElementById("completed-task-list");

    // Create a new list item for the completed task
    const taskItem = document.createElement("li");
    taskItem.innerHTML = `
        <strong>${taskTitle}</strong>
        <p>Start: ${new Date(startTimestamp).toLocaleString()}</p>
        <p>End: ${new Date(endTimestamp).toLocaleString()}</p>
    `;

    // Append to the completed tasks list
    completedTaskList.appendChild(taskItem);
}

