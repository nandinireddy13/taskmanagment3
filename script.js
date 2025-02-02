let users = {
    "Dean": { username: "dean", password: "dean123", role: "assigner" },
    "HOD": { username: "hod", password: "hod123", role: "assigner" },
    "Teacher1": { username: "teacher1", password: "teacher123", role: "teacher" },
    "Teacher2": { username: "teacher2", password: "teacher123", role: "teacher" },
    "Teacher3": { username: "teacher3", password: "teacher123", role: "teacher" },
    "Teacher4": { username: "teacher4", password: "teacher123", role: "teacher" },
    "Teacher5": { username: "teacher5", password: "teacher123", role: "teacher" }
};

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let deniedTasks = JSON.parse(localStorage.getItem("deniedTasks")) || [];
let waitingTasks = JSON.parse(localStorage.getItem("waitingTasks")) || [];

function login(event) {
    event.preventDefault();
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    
    let user = Object.values(users).find(user => user.username === username && user.password === password);
    
    if (user) {
        localStorage.setItem("currentUser", JSON.stringify(user));
        window.location.href = "Dean.html";
    } else {
        alert("Invalid login credentials!");
    }
}

function logout() {
    localStorage.removeItem("currentUser");
    window.location.href = "index.html";
}

function assignTask() {
    let currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (currentUser.role !== "assigner") {
        alert("Only Dean and HOD can assign tasks.");
        return;
    }
    let taskDesc = document.getElementById("taskDesc").value;
    let assignedTo = document.getElementById("teacherList").value;
    if (taskDesc && assignedTo) {
        tasks.push({ task: taskDesc, assignedTo, assignedBy: currentUser.username, status: "Waiting", reason: "" });
        waitingTasks.push({ task: taskDesc, assignedTo, assignedBy: currentUser.username });
        localStorage.setItem("tasks", JSON.stringify(tasks));
        localStorage.setItem("waitingTasks", JSON.stringify(waitingTasks));
        alert("Task Assigned Successfully");
        displayTasks();
    }
}

function populateTeacherList() {
    let teacherList = document.getElementById("teacherList");
    teacherList.innerHTML = "";
    let teachers = Object.values(users).filter(user => user.role === "teacher");
    teachers.forEach(teacher => {
        let option = document.createElement("option");
        option.value = teacher.username;
        option.textContent = teacher.username;
        teacherList.appendChild(option);
    });
}

function displayTasks() {
    let taskList = document.getElementById("taskList");
    taskList.innerHTML = "";
    let currentUser = JSON.parse(localStorage.getItem("currentUser"));
    let userTasks = currentUser.role === "teacher" ? tasks.filter(task => task.assignedTo === currentUser.username) : tasks.filter(task => task.assignedBy === currentUser.username);
    
    userTasks.forEach((task, index) => {
        let listItem = document.createElement("li");
        
        if (currentUser.role === "teacher") {
            if (task.status === "Waiting") {
                listItem.innerHTML = `${task.task} - Assigned by ${task.assignedBy} 
                    <button onclick='acceptTask(${index})'>Accept</button>
                    <button onclick='denyTask(${index})'>Deny</button>`;
            } else {
                listItem.innerHTML = `${task.task} - Status: ${task.status}`;
            }
        } else {
            listItem.innerHTML = `${task.task} - Assigned to ${task.assignedTo} (Status: ${task.status})`;
        }
        
        taskList.appendChild(listItem);
    });
}

function acceptTask(index) {
    tasks[index].status = "Accepted";
    waitingTasks = waitingTasks.filter(task => task.task !== tasks[index].task);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    localStorage.setItem("waitingTasks", JSON.stringify(waitingTasks));
    alert("Task Accepted!");
    displayTasks();
}

function denyTask(index) {
    let reason = prompt("Enter reason for denial:");
    if (reason) {
        let deniedTask = { ...tasks[index], status: "Denied", reason };
        deniedTasks.push(deniedTask);
        localStorage.setItem("deniedTasks", JSON.stringify(deniedTasks));
        tasks.splice(index, 1);
        waitingTasks = waitingTasks.filter(task => task.task !== deniedTask.task);
        localStorage.setItem("tasks", JSON.stringify(tasks));
        localStorage.setItem("waitingTasks", JSON.stringify(waitingTasks));
        alert("Task Denied! Notification sent to Dean.");
        displayTasks();
        displayDeniedTasks();
    }
}

function displayDeniedTasks() {
    let deniedTaskList = document.getElementById("deniedTaskList");
    if (deniedTaskList) {
        deniedTaskList.innerHTML = "";
        deniedTasks.forEach(task => {
            let listItem = document.createElement("li");
            listItem.innerHTML = `${task.task} - Assigned to ${task.assignedTo} (Denied: ${task.reason})`;
            deniedTaskList.appendChild(listItem);
        });
    }
}

function displayWaitingTasks() {
    let waitingTaskList = document.getElementById("waitingTaskList");
    waitingTaskList.innerHTML = "";
    waitingTasks.forEach(task => {
        let listItem = document.createElement("li");
        listItem.innerHTML = `${task.task} - Assigned to ${task.assignedTo} (Status: Waiting)`;
        waitingTaskList.appendChild(listItem);
    });
}

window.onload = function() {
    if (document.getElementById("teacherList")) {
        populateTeacherList();
    }
    if (document.getElementById("taskList")) {
        displayTasks();
    }
    if (document.getElementById("deniedTaskList")) {
        displayDeniedTasks();
    }
    if (document.getElementById("waitingTaskList")) {
        displayWaitingTasks();
    }
};
