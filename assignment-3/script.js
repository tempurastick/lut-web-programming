const tableContent = document.querySelector("#tableContent");

const apiUrl =
    "https://pxdata.stat.fi/PxWeb/api/v1/fi/StatFin/vaerak/statfin_vaerak_pxt_11ra.px";

const apiEmploymentUrl =
    "https://pxdata.stat.fi/PxWeb/api/v1/fi/StatFin/tyokay/statfin_tyokay_pxt_115b.px";

addEventListener("DOMContentLoaded", async (e) => {
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

// read provided file and get the json
async function loadLocalFile(file) {
    return fetch(file)
        .then((response) => response.json())
        .catch((error) => console.log(error));
}

// pass the local json to the external api and get the response
async function fetchApiData(api, url) {
    return await fetch(api, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(url),
    }).then((response) => response.json());
}

// now that we have all the data we can use it to create our table rows
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

// calculate employment percentage
function employmentRatio(population, employment) {
    return ((employment / population) * 100).toFixed(2);
}

// add class depending on employment ratio
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
