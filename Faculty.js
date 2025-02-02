document.addEventListener("DOMContentLoaded", function () {
    displayTasks();
    displayAcceptedTasks();
    displayDeniedTasks();
});

function displayTasks() {
    let taskList = document.getElementById("taskList");
    taskList.innerHTML = "";

    let currentUser = JSON.parse(localStorage.getItem("currentUser"));
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    let userTasks = tasks.filter(task => task.assignedTo === currentUser.username);

    userTasks.forEach(task => {
        let listItem = document.createElement("li");

        if (task.status === "Waiting") {
            listItem.innerHTML = `${task.task} - Assigned by ${task.assignedBy} 
                <button onclick='acceptTask("${task.id}")'>Accept</button>
                <button onclick='denyTask("${task.id}")'>Deny</button>`;
            taskList.appendChild(listItem);
        }
    });
}

function acceptTask(taskId) {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    tasks.forEach(task => {
        if (task.id === taskId) {
            task.status = "Accepted";
        }
    });

    localStorage.setItem("tasks", JSON.stringify(tasks));
    alert("Task Accepted!");
    displayTasks();
    displayAcceptedTasks();
}

function denyTask(taskId) {
    let reason = prompt("Enter reason for denial:");
    if (reason) {
        let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

        tasks.forEach(task => {
            if (task.id === taskId) {
                task.status = "Denied";
                task.reason = reason;
            }
        });

        localStorage.setItem("tasks", JSON.stringify(tasks));
        alert("Task Denied!");
        displayTasks();
        displayDeniedTasks();
    }
}

function displayAcceptedTasks() {
    let acceptedTaskList = document.getElementById("acceptedTaskList");
    acceptedTaskList.innerHTML = "";

    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    let currentUser = JSON.parse(localStorage.getItem("currentUser"));
    let acceptedTasks = tasks.filter(task => task.assignedTo === currentUser.username && task.status === "Accepted");

    acceptedTasks.forEach(task => {
        let listItem = document.createElement("li");
        listItem.innerHTML = `${task.task} - Status: Accepted`;
        acceptedTaskList.appendChild(listItem);
    });
}

function displayDeniedTasks() {
    let deniedTaskList = document.getElementById("deniedTaskList");
    deniedTaskList.innerHTML = "";

    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    let currentUser = JSON.parse(localStorage.getItem("currentUser"));
    let deniedTasks = tasks.filter(task => task.assignedTo === currentUser.username && task.status === "Denied");

    deniedTasks.forEach(task => {
        let listItem = document.createElement("li");
        listItem.innerHTML = `${task.task} - Denied (Reason: ${task.reason})`;
        deniedTaskList.appendChild(listItem);
    });
}

function logout() {
    localStorage.removeItem("currentUser");
    window.location.href = "index.html";
}
