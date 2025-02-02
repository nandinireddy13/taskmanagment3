let users = {
    "Dean": { username: "dean", password: "dean123", role: "assigner" },
    "HOD": { username: "hod", password: "hod123", role: "assigner" },
    "Teacher1": { username: "teacher1", password: "teacher123", role: "teacher" },
    "Teacher2": { username: "teacher2", password: "teacher123", role: "teacher" },
    "Teacher3": { username: "teacher3", password: "teacher123", role: "teacher" },
    "Teacher4": { username: "teacher4", password: "teacher123", role: "teacher" },
    "Teacher5": { username: "teacher5", password: "teacher123", role: "teacher" }
};

if (!localStorage.getItem("users")) {
    localStorage.setItem("users", JSON.stringify(users));
}

function login(event) {
    event.preventDefault();
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    let users = JSON.parse(localStorage.getItem("users"));

    let user = Object.values(users).find(user => user.username === username && user.password === password);

    if (user) {
        localStorage.setItem("currentUser", JSON.stringify(user));

        if (user.role === "assigner") {
            window.location.href = (user.username === "hod") ? "Hod.html" : "Dean.html";
        } else {
            window.location.href = "Faculty.html";
        }
    } else {
        alert("Invalid login credentials!");
    }
}
