const tableContent = document.querySelector("#tableContent");

const apiUrl =
    "https://pxdata.stat.fi/PxWeb/api/v1/fi/StatFin/vaerak/statfin_vaerak_pxt_11ra.px";

const apiEmploymentUrl =
    "https://pxdata.stat.fi/PxWeb/api/v1/fi/StatFin/tyokay/statfin_tyokay_pxt_115b.px";

addEventListener("DOMContentLoaded", async (e) => {
    //fetchPopulationData();

    // storing the promise response in variables
    const populationJson = await loadLocalFile("./population_query.json");
    const employmentJson = await loadLocalFile("./employment_query.json");

    const populationApiData = await fetchApiData(apiUrl, populationJson);
    const employmentApiData = await fetchApiData(
        apiEmploymentUrl,
        employmentJson
    );

    createTable(populationApiData, employmentApiData);
});

// the overall function - need to rename this later
async function fetchPopulationData() {
    await fetch("./population_query.json")
        .then((response) => response.json())
        .then((json) => {
            // once we fetched the local file, we can trigger the function for the endpoint fetch
            resolveEndpoint(json);
        })
        .catch((error) => console.log(error));
}

// the little doll inside the overall function
async function resolveEndpoint(receivingData) {
    await fetch(apiUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(receivingData),
    })
        .then((response) => {
            if (!response.ok) {
                return response.text().then((text) => {
                    throw new Error(`HTTP ${response.status}: ${text}`);
                });
            }
            return response.json();
        })
        .then((data) => {
            populateTable(data);
        })
        .catch((error) => {
            console.error("Error details:", error);
            console.error("Response status:", error.status);
            console.error("Response text:", error.text);
        });
}

// this is where we can start manipulating the dom
function populateTable(data) {
    // grabbing all entries from the obj - this is important so we have an index
    const municipalityList = Object.values(data.dimension.Alue.category.label);

    const values = data.value;

    // now we can iterate through the number of entries in value and grab the corresponding municipality
    values.forEach((value, index) => {
        const municipality = municipalityList[index];
        const tr = document.createElement("tr");
        const municipalityCell = document.createElement("td");
        const populationCell = document.createElement("td");

        municipalityCell.innerHTML = municipality;
        populationCell.innerHTML = value;

        tr.appendChild(municipalityCell);
        tr.appendChild(populationCell);
        tableContent.appendChild(tr);
        //console.log(`Value: ${value}, Label: ${municipality}`);
    });
}

async function loadLocalFile(file) {
    return fetch(file)
        .then((response) => response.json())
        .catch((error) => console.log(error));
}

async function fetchApiData(api, url) {
    return await fetch(api, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(url),
    }).then((response) => response.json());
}

function createTable(population, employment) {
    const municipalityList = Object.values(
        population.dimension.Alue.category.label
    );
    const populationDataList = population.value;

    populationDataList.forEach((population, index) => {
        let currentEmployment = employment.value[index];
        let currentMunicipality = municipalityList[index];

        const tr = document.createElement("tr");
        const municipalityCell = document.createElement("td");
        const populationCell = document.createElement("td");
        const employmentCell = document.createElement("td");
        const employmentRatioCell = document.createElement("td");
        const ratio = employmentRatio(population, currentEmployment);
        console.log(ratio);

        municipalityCell.innerHTML = currentMunicipality;
        populationCell.innerHTML = population;
        employmentCell.innerHTML = currentEmployment;
        employmentRatioCell.innerHTML = `${ratio}%`;

        tr.classList.add(conditionalStyling(ratio));

        tr.appendChild(municipalityCell);
        tr.appendChild(populationCell);
        tr.appendChild(employmentCell);
        tr.appendChild(employmentRatioCell);
        tableContent.appendChild(tr);
    });
}

function employmentRatio(population, employment) {
    return ((employment / population) * 100).toFixed(2);
}

function conditionalStyling(ratio) {
    const percentage = Math.round(ratio);
    if (percentage > 45) {
        return `high-employment`;
    } else if (percentage < 25) {
        return `low-employment`;
    } else {
        return `regular-employment`;
    }
}
