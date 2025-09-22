import { cleanHTML } from "./sanitizer.js";

const API_URL = "https://api.tvmaze.com/search/shows?q=";

const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#input-show");
const showTemplate = document.querySelector("#showTemplate");
const showRoster = document.querySelector(".show-container");

searchForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    let currentDataList = showRoster.hasChildNodes();

    // clear content if applicable
    if (currentDataList) {
        clearContent(showRoster);
    }

    // get the current input from the text field
    let currentQuery = getInputContent();

    try {
        // fetching the result from the database query
        const result = await queryDatabase(currentQuery);

        // iterating over the list and rendering each item
        result.map((show) => rendershowItem(show));
    } catch (error) {
        console.log(error);
    }
});

function getInputContent() {
    return searchInput.value.trim();
}

async function queryDatabase(query) {
    // first we await the response and store it as a variable
    const response = await fetch(`${API_URL}${query}`);

    // error handling
    if (!response.ok) {
        throw new Error("bla");
    }

    // finally we send the response back as a json
    return await response.json();
}

function rendershowItem(show) {
    const title = show.show.name;
    const cover = resolveCoverImg(show.show.image);

    // clone template from shadow dom
    const templateClone = showTemplate.content.cloneNode(true);

    // get all the nodes
    const titleNode = templateClone.querySelector("h1");
    const imgNode = templateClone.querySelector("img");
    const infoNode = templateClone.querySelector(".show-info");

    titleNode.textContent = title;
    imgNode.src = cover;

    renderDescription(show.show.summary, infoNode);

    showRoster.appendChild(templateClone);
}

function renderDescription(desc, parentNode) {
    // if show description is null, don't bother sanitizing and creating a node
    if (!desc) {
        return;
    }

    // sanitize in case there's malicious tags or scripts
    let sanitizedNodes = cleanHTML(desc, true);
    for (let node of sanitizedNodes) {
        parentNode.appendChild(node);
    }
}

// some of the responses don't have images, so we use a fallback for them
function resolveCoverImg(cover) {
    if (!cover) {
        return `https://placehold.co/210x290?text=No+Cover`;
    } else {
        return cover.medium;
    }
}

// there's not really any point of passing a param for a small function like this, especially in this context but I feel like it's nice to make things reusable
function clearContent(content) {
    content.innerHTML = ``;
}
