const userTable = document.querySelector("#userTable");
const tableHeadlines = document.querySelector("#tableHeadlines");
const emptyBtn = document.querySelector("#empty-table");

const nameField = document.querySelector("#input-username");
const emailField = document.querySelector("#input-email");
const adminField = document.querySelector("#input-admin");
const submitBtn = document.querySelector("#submit-data");
const imageUploader = document.querySelector("#input-image");
let userImg;

emptyBtn.addEventListener("click", () => {
    userTable.innerHTML = "";
});

submitBtn.addEventListener("click", () => {
    event.preventDefault();
    addUser();
});

function addUser() {
    const nameValue = nameField.value;
    const emailValue = emailField.value;

    if (nameValue.trim() == "") {
        nameField.focus();

        console.warn("Missing username");

        return;
    } else if (emailValue.trim() == "") {
        emailField.focus();
        console.warn("Missing email");
        return;
    }

    const existingUser = checkUsernames(nameValue);
    let parentRow;

    if (existingUser) {
        const emailCell = existingUser.nextElementSibling;
        const adminCell = emailCell.nextElementSibling;
        parentRow = existingUser.parentElement;

        emailCell.innerHTML = emailValue;
        setAdmin(adminCell, adminField);
    } else {
        //const row = userTable.insertRow();
        parentRow = userTable.insertRow();

        const nameCell = parentRow.insertCell(0);
        nameCell.dataset.table = "username";
        const emailCell = parentRow.insertCell(1);
        const adminCell = parentRow.insertCell(2);

        nameCell.innerHTML = nameValue;
        emailCell.innerHTML = emailValue;

        setAdmin(adminCell, adminField);
    }

    // by declaring parentRow before checking for existing user, we can just do the check for userImg once, because the value of parentRow gets its value from the existing check.
    if (userImg) {
        const imageCell = parentRow.insertCell(3);
        setImg(imageCell);
    }

    //reset on submit
    nameField.value = "";
    emailField.value = "";
    adminField.checked = false;
}

// if admin is true set "x" as value in cell
function setAdmin(displayedValue, currentValue) {
    displayedValue.innerHTML = currentValue.checked ? `X` : ``;
}

// iterate through all cells with dataset data-table="username" and check if username already exists. If yes, return that element.
function checkUsernames(name) {
    const usernames = document.querySelectorAll(`[data-table="username"]`);

    for (const username of usernames.values()) {
        const usernameValue = username.innerHTML;
        if (name.trim() == usernameValue.trim()) {
            return username;
        }
    }
}

// listener for file upload
imageUploader.addEventListener("change", getImg);

// access uploaded file and update userImg variable
function getImg(event) {
    const file = event.target.files[0];
    let url = window.URL.createObjectURL(file);
    userImg = url;
}

function setImg(parentEl) {
    const imageEl = document.createElement("img");
    imageEl.src = userImg;
    imageEl.width = 64;
    imageEl.height = 64;
    console.log(imageEl);
    parentEl.appendChild(imageEl);
}
