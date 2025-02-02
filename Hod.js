document.addEventListener("DOMContentLoaded", function () {
    populateTeacherList();
    displayTasksToAccept();
    displayHodAssignedTasks();
    displayAcceptedTasks();
    displayDeniedTasks();
    displayPendingTasksForOtherTeachers(); // New function to show pending tasks for other teachers
});

function populateTeacherList() {
    let teacherList = document.getElementById("teacherList");
    teacherList.innerHTML = ""; // Clear previous options

    let users = JSON.parse(localStorage.getItem("users")) || {};
    let eligibleUsers = Object.values(users).filter(user => 
        user.role === "teacher" && user.username !== "dean"  // Only teachers and not dean
    );

    eligibleUsers.forEach(user => {
        let option = document.createElement("option");
        option.value = user.username;
        option.textContent = user.username + " (Teacher)";
        teacherList.appendChild(option);
    });
}

function assignTask() {
    let taskDesc = document.getElementById("taskDesc").value;
    let selectedOptions = document.getElementById("teacherList").selectedOptions;
    let assignedTo = Array.from(selectedOptions).map(option => option.value);
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    let currentUser = JSON.parse(localStorage.getItem("currentUser"));

    if (taskDesc && assignedTo.length > 0) {
        assignedTo.forEach(user => {
            let newTask = { 
                id: `${taskDesc}-${user}-${Date.now()}`, // Unique identifier for each task
                task: taskDesc, 
                assignedTo: user, 
                assignedBy: currentUser.username, 
                status: "Waiting", 
                reason: "" 
            };
            tasks.push(newTask);
        });

        localStorage.setItem("tasks", JSON.stringify(tasks));
        alert("Task Assigned Successfully");
        displayHodAssignedTasks();
    } else {
        alert("Please provide a task description and select at least one teacher.");
    }
}

function displayTasksToAccept() {
    let waitingTaskList = document.getElementById("waitingTaskList");
    waitingTaskList.innerHTML = "";

    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    let currentUser = JSON.parse(localStorage.getItem("currentUser"));

    // Tasks that the HOD needs to accept (Assigned by Dean)
    tasks.filter(task => task.status === "Waiting" && task.assignedTo === currentUser.username).forEach(task => {
        let listItem = document.createElement("li");
        listItem.textContent = `${task.task} - Assigned by ${task.assignedBy}`;
        listItem.innerHTML += `<button onclick='acceptTask("${task.id}")'>Accept</button>`;
        listItem.innerHTML += `<button onclick='denyTask("${task.id}")'>Deny</button>`;
        waitingTaskList.appendChild(listItem);
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
    displayTasksToAccept();
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
        displayTasksToAccept();
        displayDeniedTasks();
    }
}

// ✅ Display tasks assigned BY the HOD to teachers
function displayHodAssignedTasks() {
    let hodTaskList = document.getElementById("hodTaskList");
    hodTaskList.innerHTML = "";

    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    let currentUser = JSON.parse(localStorage.getItem("currentUser"));

    tasks.filter(task => task.assignedBy === currentUser.username).forEach(task => {
        let listItem = document.createElement("li");
        listItem.textContent = `${task.task} - Assigned to ${task.assignedTo} - Status: ${task.status}`;
        if (task.status === "Denied") {
            listItem.textContent += ` (Reason: ${task.reason})`;
        }
        hodTaskList.appendChild(listItem);
    });
}

function displayAcceptedTasks() {
    let acceptedTaskList = document.getElementById("acceptedTaskList");
    acceptedTaskList.innerHTML = "";

    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    let currentUser = JSON.parse(localStorage.getItem("currentUser"));
    tasks.filter(task => task.assignedTo === currentUser.username && task.status === "Accepted").forEach(task => {
        let listItem = document.createElement("li");
        listItem.textContent = `${task.task} - Status: Accepted`;
        acceptedTaskList.appendChild(listItem);
    });
}

function displayDeniedTasks() {
    let deniedTaskList = document.getElementById("deniedTaskList");
    deniedTaskList.innerHTML = "";

    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    let currentUser = JSON.parse(localStorage.getItem("currentUser"));
    tasks.filter(task => task.assignedTo === currentUser.username && task.status === "Denied").forEach(task => {
        let listItem = document.createElement("li");
        listItem.textContent = `${task.task} - Denied (Reason: ${task.reason})`;
        deniedTaskList.appendChild(listItem);
    });
}

// ✅ Display pending tasks assigned to other teachers
function displayPendingTasksForOtherTeachers() {
    let pendingTasksForOtherTeachers = document.getElementById("pendingTasksForOtherTeachers");
    pendingTasksForOtherTeachers.innerHTML = "";

    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    let currentUser = JSON.parse(localStorage.getItem("currentUser"));

    // Show pending tasks for other teachers assigned by the HOD
    tasks.filter(task => task.assignedBy === currentUser.username && task.status === "Waiting").forEach(task => {
        let listItem = document.createElement("li");
        listItem.textContent = `${task.task} - Assigned to ${task.assignedTo}`;
        pendingTasksForOtherTeachers.appendChild(listItem);
    });
}

function logout() {
    localStorage.removeItem("currentUser");
    window.location.href = "index.html";
}
