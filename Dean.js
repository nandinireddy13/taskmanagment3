document.addEventListener("DOMContentLoaded", function () {
    populateTeacherList();
    displayTasks();
    displayAcceptedTasks();
    displayDeniedTasks();
});

function populateTeacherList() {
    let teacherList = document.getElementById("teacherList");
    teacherList.innerHTML = ""; // Clear previous options

    let users = JSON.parse(localStorage.getItem("users")) || {};
    let eligibleUsers = Object.values(users).filter(user => 
        (user.role === "teacher" || user.role === "assigner") && user.username !== "dean"
    );

    eligibleUsers.forEach(user => {
        let option = document.createElement("option");
        option.value = user.username;
        option.textContent = user.username + (user.role === "assigner" ? " (HOD)" : "");
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
        displayTasks();
    }
}

function displayTasks() {
    let waitingTaskList = document.getElementById("waitingTaskList");
    waitingTaskList.innerHTML = "";

    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    let currentUser = JSON.parse(localStorage.getItem("currentUser"));

    // Ensure Dean doesn't see tasks assigned by HOD
    tasks.filter(task => task.status === "Waiting" && 
        (currentUser.role !== "dean" || task.assignedBy === currentUser.username) // Filter out HOD-assigned tasks for Dean
    ).forEach(task => {
        let listItem = document.createElement("li");
        listItem.textContent = `${task.task} - Assigned to ${task.assignedTo}`;
        waitingTaskList.appendChild(listItem);
    });
}

function displayAcceptedTasks() {
    let acceptedTaskList = document.getElementById("acceptedTaskList");
    acceptedTaskList.innerHTML = "";

    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    let currentUser = JSON.parse(localStorage.getItem("currentUser"));

    // Ensure Dean doesn't see tasks assigned by HOD
    tasks.filter(task => task.status === "Accepted" && 
        (currentUser.role !== "dean" || task.assignedBy === currentUser.username) // Filter out HOD-assigned tasks for Dean
    ).forEach(task => {
        let listItem = document.createElement("li");
        listItem.textContent = `${task.task} - Accepted by ${task.assignedTo}`;
        acceptedTaskList.appendChild(listItem);
    });
}

function displayDeniedTasks() {
    let deniedTaskList = document.getElementById("deniedTaskList");
    deniedTaskList.innerHTML = "";

    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    let currentUser = JSON.parse(localStorage.getItem("currentUser"));

    // Ensure Dean doesn't see tasks assigned by HOD
    tasks.filter(task => task.status === "Denied" && 
        (currentUser.role !== "dean" || task.assignedBy === currentUser.username) // Filter out HOD-assigned tasks for Dean
    ).forEach(task => {
        let listItem = document.createElement("li");
        listItem.textContent = `${task.task} - Denied by ${task.assignedTo} (Reason: ${task.reason})`;
        deniedTaskList.appendChild(listItem);
    });
}

function logout() {
    localStorage.removeItem("currentUser");
    window.location.href = "index.html";
}
