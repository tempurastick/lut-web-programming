const titleBtn = document.querySelector("#my-button");
const listBtn = document.querySelector("#add-data");
const textContent = document.querySelector("#textToCopy");
const textBtn = document.querySelector("#addTextBtn");
const list = document.querySelector("#my-list");
const headline = document.querySelector("h1");

titleBtn.addEventListener("click", () => {
    console.log("hello world");
    headline.innerHTML = "Moi maailma";
});

listBtn.addEventListener("click", () => {
    const babyListEl = document.createElement("li");

    babyListEl.innerHTML = "Epic test string";

    list.appendChild(babyListEl);
});

function copyText() {
    const copyListEl = document.createElement("li");

    copyListEl.innerHTML = textContent.value;

    list.appendChild(copyListEl);
    textContent.value = "";
    textBtn.disabled = true;
}

function checkEmpty() {
    const content = textContent.value.trim();
    if (content == "") {
        return true;
    }
}

textContent.addEventListener("keyup", () => {
    if (checkEmpty()) {
        textBtn.disabled = true;
    } else {
        textBtn.disabled = false;
    }
});

textBtn.addEventListener("click", () => {
    copyText();
});
