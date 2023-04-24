const APIurl = "https://api.novaposhta.ua/v2.0/json/";
const apiKey = "";
let data = "";

function connectToApi(strData)
{
    fetch(APIurl, 
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: strData
        })
    .then(res => res.json())
    .then(data => setTable(data));
}

function setTable({data})
{
    console.log(data);
    const tableContainer = document.getElementById("table-container");
    
    // Отримати кількість рядків і стовпців з масиву даних
    const rows = data.length;
    //const columns = Object.keys(data[0]).length;
    
    // Створити таблицю і додати її до контейнера
    const table = document.createElement("table");
    tableContainer.appendChild(table);
    
    // Створити заголовок таблиці
    const tableHeader = document.createElement("thead");
    const tableHeaderRow = document.createElement("tr");
    
    // Додати заголовки стовпців до заголовка таблиці
    for (const key in data[0]) 
    {
        switch (key) 
        {
            case "Description":
                const tableHeaderCellDescUa = document.createElement("th");
                tableHeaderCellDescUa.textContent = "Опис українською мовою";
                tableHeaderRow.appendChild(tableHeaderCellDescUa);
                break;
            case "SettlementTypeDescription":
                const tableHeaderCellDescRu = document.createElement("th");
                tableHeaderCellDescRu.textContent = "Тип населеного пункту";
                tableHeaderRow.appendChild(tableHeaderCellDescRu);
                break;
            case "Latitude":
                const tableHeaderCellW = document.createElement("th");
                tableHeaderCellW.textContent = "Довгота";
                tableHeaderRow.appendChild(tableHeaderCellW);
                break;
            case "Longitude":
                const tableHeaderCellDescTy = document.createElement("th");
                tableHeaderCellDescTy.textContent = "Широта";
                tableHeaderRow.appendChild(tableHeaderCellDescTy);
                break;
            case "ShortAddress":
                const tableHeaderCellL = document.createElement("th");
                tableHeaderCellL.textContent = "Коротка адреса";
                tableHeaderRow.appendChild(tableHeaderCellL);
                break;
            case "Phone":
                const tableHeaderCellH = document.createElement("th");
                tableHeaderCellH.textContent = "Телефон";
                tableHeaderRow.appendChild(tableHeaderCellH);
                break;
            case "Number":
                const tableHeaderCellVW = document.createElement("th");
                tableHeaderCellVW.textContent = "Номер відділення";
                tableHeaderRow.appendChild(tableHeaderCellVW);
                break;
            case "PostalCodeUA":
                const tableHeaderCellVR = document.createElement("th");
                tableHeaderCellVR.textContent = "Поштовий індекс адреси відділення";
                tableHeaderRow.appendChild(tableHeaderCellVR);
                break;
            case "WarehouseIndex":
                const tableHeaderCellFN = document.createElement("th");
                tableHeaderCellFN.textContent = "Цифрова адреса складу НП";
                tableHeaderRow.appendChild(tableHeaderCellFN);
                break;
            default:
                break;
        }
    }
    
    tableHeader.appendChild(tableHeaderRow);
    table.appendChild(tableHeader);
    
    // Створити тіло таблиці
    const tableBody = document.createElement("tbody");

    // Додати рядки з даними до тіла таблиці
    for (let i = 0; i < rows; i++) 
    {
        const tableBodyRow = document.createElement("tr");
    
        for (const key in data[i]) 
        {
            if(key == "Description" || key == "SettlementTypeDescription" ||
            key == "Latitude" || key == "Longitude" || 
            key == "ShortAddress" || key == "Phone" || 
            key == "Number" || key == "PostalCodeUA" ||
            key == "WarehouseIndex") 
            {
                const tableBodyCell = document.createElement("td");
                tableBodyCell.textContent = data[i][key];
                tableBodyRow.appendChild(tableBodyCell);
            }
            continue;
        }
    
        tableBody.appendChild(tableBodyRow);
    }
    
    table.appendChild(tableBody);

    const br = document.createElement("br");
}

function clearTable()
{
    const tableContainer = document.getElementById("table-container");
    tableContainer.innerHTML = "";
}

function clearTableControllers()
{
    const tableContainer = document.getElementById("table-controllerDown");
    tableContainer.innerHTML = "";
}

function searchSettlements(pageNum, limit)
{
    clearTable();
    const CityName = document.getElementById("cityName");
    const LIMIT = '' + limit;
    const pageNumber = '' + pageNum;
    data = 
    {
        "apiKey": apiKey,
        "modelName": "Address",
        "calledMethod": "getWarehouses",
        "methodProperties": 
        {
            "CityName" : CityName.value,
            "Limit" : LIMIT,
            "Page" : pageNumber
        }
     }
    let strData = JSON.stringify(data);
    connectToApi(strData);
}

function fillTable()
{
    let pageNum = 1;
    let totalPages = 1000;
    let limit = 20;

    const tableControllerDown = document.getElementById("table-controllerDown");
    tableControllerDown.innerHTML = "";

    // Додавання класів до елементів
    tableControllerDown.classList.add('pagination');

    const prevButton = document.createElement('button');
    prevButton.classList.add('prev-btn');
    prevButton.innerText = 'Назад';

    const pageNumberLabel = document.createElement('label');
    pageNumberLabel.classList.add('page-num');
    pageNumberLabel.innerText = '1';

    prevButton.addEventListener('click', () => 
    {
        if (pageNum > 1) 
        {
            pageNum--;
            pageNumberLabel.innerText = pageNum;
            searchSettlements(pageNum, limit);
        }
    });

    tableControllerDown.appendChild(prevButton);

    tableControllerDown.appendChild(pageNumberLabel);

    const nextButton = document.createElement('button');
    nextButton.classList.add('next-btn');
    nextButton.innerText = 'Вперед';
    nextButton.addEventListener('click', () => 
    {
        if (pageNum < totalPages) 
        {
            pageNum++;
            pageNumberLabel.innerText = pageNum;
            searchSettlements(pageNum, limit);
        }
    });

    tableControllerDown.appendChild(nextButton);

    const select = document.createElement('select');
    select.classList.add('page-size');
    select.innerHTML = `
        <option value="20">20</option>
        <option value="50">50</option>
        <option value="100">100</option>
    `;
    select.addEventListener('change', () => 
    {
        limit = parseInt(select.value);
        pageNum = 1;
        pageNumberLabel.innerText = pageNum;
        searchSettlements(pageNum, limit);
    });

    tableControllerDown.appendChild(select);

    searchSettlements(pageNum, limit);
}