import { cleanHTML } from "./sanitizer.js";

const API_URL = "https://api.tvmaze.com/search/shows?q=";

const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#input-show");
const movieTemplate = document.querySelector("#movieTemplate");
const movieRoster = document.querySelector(".show-container");

searchForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    let currentDataList = movieRoster.hasChildNodes();

    // clear content if applicable
    if (currentDataList) {
        clearContent(movieRoster);
    }

    // get the current input from the text field
    let currentQuery = getInputContent();

    try {
        // fetching the result from the database query
        const result = await queryDatabase(currentQuery);

        // iterating over the list and rendering each item
        result.map((movie) => renderMovieItem(movie));
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

function renderMovieItem(movie) {
    const title = movie.show.name;
    const cover = resolveCoverImg(movie.show.image);

    // clone template from shadow dom
    const templateClone = movieTemplate.content.cloneNode(true);

    // get all the nodes
    const titleNode = templateClone.querySelector("h1");
    const imgNode = templateClone.querySelector("img");
    const infoNode = templateClone.querySelector(".show-info");

    titleNode.innerHTML = title;
    imgNode.src = cover;

    renderDescription(movie.show.summary, infoNode);

    movieRoster.appendChild(templateClone);
}

function renderDescription(desc, parentNode) {
    // if movie description is null, don't bother sanitizing and creating a node
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
