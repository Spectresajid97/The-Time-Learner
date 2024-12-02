const tasks = JSON.parse(localStorage.getItem('tasks')) || []; // Load tasks from local storage
let editingTaskId = null; // Track the task being edited

// Event listener for form submission
document.querySelector('form').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent page refresh

    // Collect task data
    const taskTitle = document.getElementById('task-title').value.trim();
    const taskDesc = document.getElementById('task-desc').value.trim();
    const startTimestamp = document.getElementById('start-timestamp').value;
    const endTimestamp = document.getElementById('end-timestamp').value;
    const reminder = document.getElementById('task-reminder').value === 'yes'; // Check if reminder is "Yes"

    // Validate input fields
    if (!taskTitle || !startTimestamp || !endTimestamp) {
        alert("Please fill in all required fields (title, start time, end time).");
        return;
    }

    if (new Date(startTimestamp) >= new Date(endTimestamp)) {
        alert("Start time must be earlier than end time.");
        return;
    }

    if (editingTaskId) {
        // Edit existing task
        const task = tasks.find(t => t.id === editingTaskId);
        if (task) {
            task.title = taskTitle;
            task.description = taskDesc;
            task.startTime = new Date(startTimestamp).toISOString(); // Save in ISO format
            task.endTime = new Date(endTimestamp).toISOString(); // Save in ISO format
            task.reminder = reminder;

            if (reminder) {
                setTaskReminder(task);
            }

            editingTaskId = null; // Reset editing state
            alert("Task updated successfully!");
        }
    } else {
        // Create a new task
        const task = {
            id: Date.now(), // Unique ID
            title: taskTitle,
            description: taskDesc,
            startTime: new Date(startTimestamp).toISOString(), // Save in ISO format
            endTime: new Date(endTimestamp).toISOString(), // Save in ISO format
            reminder: reminder,
            isCompleted: false,
        };

        tasks.push(task);

        if (reminder) {
            setTaskReminder(task);
        }

        alert("Task added successfully!");
    }

    updateActiveTasks(); // Update task list
    resetForm(); // Clear form
    saveTasks(); // Save tasks to local storage
});

// Save tasks to local storage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Set a reminder for a task
function setTaskReminder(task) {
    const now = new Date();
    const timeUntilReminder = new Date(task.startTime) - now; // Convert back to local time

    if (timeUntilReminder > 0) {
        setTimeout(() => {
            alert(`Reminder: ${task.title}\n${task.description}`);
        }, timeUntilReminder);
    } else {
        console.log("The reminder time for this task has already passed.");
    }
}

// Format date for display (example: "12/3/2024, 12:31:00 AM")
function formatDate(date) {
    const options = {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
    };
    return new Date(date).toLocaleString('en-US', options); // Custom formatting for AM/PM
}

// Format date for input (datetime-local format)
function formatDateForInput(date) {
    const localDate = new Date(date);
    const year = localDate.getFullYear();
    const month = String(localDate.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(localDate.getDate()).padStart(2, '0');
    const hours = String(localDate.getHours()).padStart(2, '0');
    const minutes = String(localDate.getMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day}T${hours}:${minutes}`;
}

// Update the active tasks list
function updateActiveTasks() {
    const activeTaskList = document.getElementById('active-task-list');
    activeTaskList.innerHTML = ""; // Clear the list

    const activeTasks = tasks.filter(task => !task.isCompleted);
    if (activeTasks.length === 0) {
        activeTaskList.innerHTML = "<li>No active tasks found.</li>";
        return;
    }

    activeTasks.forEach(task => {
        const taskItem = document.createElement('li');
        taskItem.id = `task-${task.id}`;
        taskItem.innerHTML = `    
            <strong>${task.title}</strong>: ${task.description || "No description"}<br>
            <em>Start:</em> ${formatDate(task.startTime)}<br>
            <em>End:</em> ${formatDate(task.endTime)}
        `;

        // Add buttons
        const completeButton = document.createElement('button');
        completeButton.textContent = task.isCompleted ? "Mark as Incomplete" : "Mark as Completed";
        completeButton.onclick = () => markTaskAsCompleted(task.id);

        const editButton = document.createElement('button');
        editButton.textContent = "Edit Task";
        editButton.onclick = () => editTask(task.id);

        taskItem.appendChild(completeButton);
        taskItem.appendChild(editButton);
        activeTaskList.appendChild(taskItem);
    });
}

// Populate form for editing a task
function editTask(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        // Populate form fields with existing task data
        document.getElementById('task-title').value = task.title;
        document.getElementById('task-desc').value = task.description;
        
        // Convert Date object to 'datetime-local' format (yyyy-MM-ddTHH:mm)
        document.getElementById('start-timestamp').value = formatDateForInput(task.startTime);
        document.getElementById('end-timestamp').value = formatDateForInput(task.endTime);
        
        document.getElementById('task-reminder').value = task.reminder ? 'yes' : 'no';

        editingTaskId = taskId; // Set the editing state
    }
}

// Mark a task as completed
function markTaskAsCompleted(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        task.isCompleted = !task.isCompleted; // Toggle completion status

        // Update lists
        updateActiveTasks();
        updateCompletedTasks();
        saveTasks(); // Save updated tasks to local storage
    }
}

// Update the completed tasks list
function updateCompletedTasks() {
    const completedTaskList = document.getElementById('completed-task-list');
    completedTaskList.innerHTML = ""; // Clear the list

    const completedTasks = tasks.filter(task => task.isCompleted);
    if (completedTasks.length === 0) {
        completedTaskList.innerHTML = "<li>No completed tasks found.</li>";
        return;
    }

    completedTasks.forEach(task => {
        const taskItem = document.createElement('li');
        taskItem.innerHTML = `    
            <strong style="text-decoration: line-through;">${task.title}</strong>: 
            <span style="text-decoration: line-through;">${task.description || "No description"}</span><br>
            <em>Start:</em> <span style="text-decoration: line-through;">${formatDate(task.startTime)}</span><br>
            <em>End:</em> <span style="text-decoration: line-through;">${formatDate(task.endTime)}</span>
        `;
        completedTaskList.appendChild(taskItem);
    });
}


// Reset the form
function resetForm() {
    document.querySelector('form').reset();
    editingTaskId = null;
}

// Clear all completed tasks
function clearCompletedTasks() {
    // Filter out completed tasks and save the rest
    const remainingTasks = tasks.filter(task => !task.isCompleted);
    tasks.length = 0; // Clear current task list
    tasks.push(...remainingTasks); // Push the remaining tasks back

    updateActiveTasks(); // Update task list
    updateCompletedTasks(); // Update completed task list
    saveTasks(); // Save updated tasks to local storage
}

// Automatically move tasks to completed if end time has passed
function checkTaskCompletion() {
    const now = new Date();
    tasks.forEach(task => {
        const endTime = new Date(task.endTime); // Ensure comparing Date objects
        if (!task.isCompleted && endTime <= now) {
            task.isCompleted = true;
            console.log(`Task with ID ${task.id} marked as completed. End Time: ${endTime}, Now: ${now}`); // Debug log
        }
    });

    // Save and update UI after checking tasks
    saveTasks();
    updateActiveTasks();
    updateCompletedTasks();
}

// On page load, load tasks from local storage and update the active task list
window.addEventListener('load', function() {
    updateActiveTasks(); // Populate task list
    updateCompletedTasks(); // Ensure completed tasks are also loaded

    // Add event listener for clearing completed tasks
    document.getElementById('clear-completed-btn').addEventListener('click', clearCompletedTasks);

    // Start checking tasks every seconds (10,000 ms)
    setInterval(checkTaskCompletion, 10000);
});
