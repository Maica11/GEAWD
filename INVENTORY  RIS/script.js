document.addEventListener('DOMContentLoaded', () => {
    // Initialize data from local storage
    loadInventory();
    loadReports();

    // Event listeners for forms
    document.getElementById('inventoryForm').addEventListener('submit', addItem);
    document.getElementById('reportForm').addEventListener('submit', addReport);

    // Event listeners for buttons
    document.getElementById('printInventoryButton').addEventListener('click', printTable('inventoryTable'));
    document.getElementById('printReportButton').addEventListener('click', printTable('reportTable'));

    // Attach event listeners to update total on input change
    document.querySelectorAll('#inventoryForm input[type="number"]').forEach(input => {
        input.addEventListener('input', updateTotal);
    });
});

// Calculate and update the total
function updateTotal() {
    const onhandPerCount = parseFloat(document.getElementById('onhandPerCount').value) || 0;
    const purchased = parseFloat(document.getElementById('purchased').value) || 0;
    const delivery = parseFloat(document.getElementById('delivery').value) || 0;
    const problems = parseFloat(document.getElementById('problems').value) || 0;
    const repair = parseFloat(document.getElementById('repair').value) || 0;

    const total = onhandPerCount + purchased + delivery + problems - repair ;

    document.getElementById('total').value = total.toFixed(2);
}

// Add item to inventory table
function addItem(event) {
    event.preventDefault();
    updateTotal(); // Ensure total is up-to-date before adding item

    const material = document.getElementById('material').value;
    const stockNumber = document.getElementById('stockNumber').value;
    const unitOfMeasure = document.getElementById('unitOfMeasure').value;
    const onhandPerCount = document.getElementById('onhandPerCount').value;
    const inOut = document.getElementById('inOut').value;
    const purchased = document.getElementById('purchased').value;
    const delivery = document.getElementById('delivery').value;
    const problems = document.getElementById('problems').value;
    const repair = document.getElementById('repair').value;
    const total = document.getElementById('total').value;

    const inventoryTable = document.getElementById('inventoryTable').getElementsByTagName('tbody')[0];
    const newRow = inventoryTable.insertRow();

    newRow.innerHTML = `
        <td>${material}</td>
        <td>${stockNumber}</td>
        <td>${unitOfMeasure}</td>
        <td>${onhandPerCount}</td>
        <td>${inOut}</td>
        <td>${purchased}</td>
        <td>${delivery}</td>
        <td>${problems}</td>
        <td>${repair}</td>
        <td>${total}</td>
        <td class="action-buttons">
            <button class="edit">Edit</button>
            <button class="delete">Delete</button>
        </td>
    `;

    newRow.querySelector('.edit').addEventListener('click', () => editRow(newRow));
    newRow.querySelector('.delete').addEventListener('click', () => deleteRow(newRow));

    saveInventory();
}

// Add report to report table
function addReport(event) {
    event.preventDefault();

    const reportDate = document.getElementById('reportDate').value;
    const reportMaterials = document.getElementById('reportMaterials').value;
    const reportSuppliesNumber = document.getElementById('reportSuppliesNumber').value;
    const reportDescription = document.getElementById('reportDescription').value;
    const totalItems = document.getElementById('totalItems').value;

    const reportTable = document.getElementById('reportTable').getElementsByTagName('tbody')[0];
    const newRow = reportTable.insertRow();

    newRow.innerHTML = `
        <td>${reportDate}</td>
        <td>${reportMaterials}</td>
        <td>${reportSuppliesNumber}</td>
        <td>${reportDescription}</td>
        <td>${totalItems}</td>
        <td class="action-buttons">
            <button class="edit">Edit</button>
            <button class="delete">Delete</button>
        </td>
    `;

    newRow.querySelector('.edit').addEventListener('click', () => editReportRow(newRow));
    newRow.querySelector('.delete').addEventListener('click', () => deleteReportRow(newRow));

    saveReports();
}

// Edit row functionality
function editRow(row) {
    const cells = row.getElementsByTagName('td');
    const inputs = [
        'material', 'stockNumber', 'unitOfMeasure', 'onhandPerCount',
        'inOut', 'purchased', 'delivery', 'problems', 'repair', 'total'
    ];

    inputs.forEach((input, index) => {
        cells[index].innerHTML = `<input type="text" value="${cells[index].innerText}">`;
    });

    row.querySelectorAll('input[type="text"]').forEach(input => {
        input.addEventListener('input', () => updateRowTotal(row));
    });

    row.querySelector('.edit').style.display = 'none';
    row.querySelector('.action-buttons').innerHTML += '<button class="save">Save</button>';
    row.querySelector('.save').addEventListener('click', () => saveRow(row));
}

// Update row total while editing
function updateRowTotal(row) {
    const inputs = row.querySelectorAll('input[type="text"]');
    const [onhandPerCount, purchased, delivery, problems, repair] = Array.from(inputs).slice(3, 8 ).map(input => parseFloat(input.value) || 0);
    const total = onhandPerCount + purchased + delivery + problems - repair - save;

    row.getElementsByTagName('td')[9].innerText = total.toFixed(2);
}

// Save edited row
function saveRow(row) {
    const inputs = row.querySelectorAll('input[type="text"]');
    const cells = row.getElementsByTagName('td');

    inputs.forEach((input, index) => {
        cells[index].innerText = input.value;
    });

    row.querySelector('.save').remove();
    row.querySelector('.edit').style.display = 'inline-block';

    saveInventory();
}

// Delete row functionality
function deleteRow(row) {
    if (confirm('Are you sure you want to delete this item?')) {
        row.remove();
        saveInventory();
    }
}

// Edit report row functionality
function editReportRow(row) {
    const cells = row.getElementsByTagName('td');
    const inputs = [
        'reportDate', 'reportMaterials', 'reportSuppliesNumber', 'reportDescription', 'totalItems'
    ];

    inputs.forEach((input, index) => {
        cells[index].innerHTML = `<input type="text" value="${cells[index].innerText}">`;
    });

    row.querySelector('.edit').style.display = 'none';
    row.querySelector('.action-buttons').innerHTML += '<button class="save">Save</button>';
    row.querySelector('.save').addEventListener('click', () => saveReportRow(row));
}

// Save edited report row
function saveReportRow(row) {
    const inputs = row.querySelectorAll('input[type="text"]');
    const cells = row.getElementsByTagName('td');

    inputs.forEach((input, index) => {
        cells[index].innerText = input.value;
    });

    row.querySelector('.save').remove();
    row.querySelector('.edit').style.display = 'inline-block';

    saveReports();
}

// Delete report row functionality
function deleteReportRow(row) {
    if (confirm('Are you sure you want to delete this report?')) {
        row.remove();
        saveReports();
    }
}

// Save inventory to local storage
function saveInventory() {
    const rows = document.querySelectorAll('#inventoryTable tbody tr');
    const inventory = [];
    rows.forEach(row => {
        const cells = row.getElementsByTagName('td');
        const item = {
            material: cells[0].innerText,
            stockNumber: cells[1].innerText,
            unitOfMeasure: cells[2].innerText,
            onhandPerCount: parseFloat(cells[3].innerText),
            inOut: cells[4].innerText,
            purchased: parseFloat(cells[5].innerText),
            delivery: parseFloat(cells[6].innerText),
            problems: parseFloat(cells[7].innerText),
            repair: parseFloat(cells[8].innerText),
            total: parseFloat(cells[9].innerText)
        };
        inventory.push(item);
    });
    localStorage.setItem('inventory', JSON.stringify(inventory));
}

// Load inventory from local storage
function loadInventory() {
    const inventory = JSON.parse(localStorage.getItem('inventory')) || [];
    inventory.forEach(item => {
        const inventoryTable = document.getElementById('inventoryTable').getElementsByTagName('tbody')[0];
        const newRow = inventoryTable.insertRow();
        newRow.innerHTML = `
            <td>${item.material}</td>
            <td>${item.stockNumber}</td>
            <td>${item.unitOfMeasure}</td>
            <td>${item.onhandPerCount}</td>
            <td>${item.inOut}</td>
            <td>${item.purchased}</td>
            <td>${item.delivery}</td>
            <td>${item.problems}</td>
            <td>${item.repair}</td>
            <td>${item.total}</td>
            <td class="action-buttons">
                <button class="edit">Edit</button>
                <button class="delete">Delete</button>
            </td>
        `;
        newRow.querySelector('.edit').addEventListener('click', () => editRow(newRow));
        newRow.querySelector('.delete').addEventListener('click', () => deleteRow(newRow));
    });
}

// Save reports to local storage
function saveReports() {
    const rows = document.querySelectorAll('#reportTable tbody tr');
    const reports = [];
    rows.forEach(row => {
        const cells = row.getElementsByTagName('td');
        const report = {
            date: cells[0].innerText,
            materials: cells[1].innerText,
            suppliesNumber: cells[2].innerText,
            description: cells[3].innerText,
            totalItems: cells[4].innerText
        };
        reports.push(report);
    });
    localStorage.setItem('reports', JSON.stringify(reports));
}

// Load reports from local storage
function loadReports() {
    const reports = JSON.parse(localStorage.getItem('reports')) || [];
    reports.forEach(report => {
        const reportTable = document.getElementById('reportTable').getElementsByTagName('tbody')[0];
        const newRow = reportTable.insertRow();
        newRow.innerHTML = `
            <td>${report.date}</td>
            <td>${report.materials}</td>
            <td>${report.suppliesNumber}</td>
            <td>${report.description}</td>
            <td>${report.totalItems}</td>
            <td class="action-buttons">
                <button class="edit">Edit</button>
                <button class="delete">Delete</button>
            </td>
        `;
        newRow.querySelector('.edit').addEventListener('click', () => editReportRow(newRow));
        newRow.querySelector('.delete').addEventListener('click', () => deleteReportRow(newRow));
    });
}

// Print table function
function printTable(tableId) {
    return () => {
        const printWindow = window.open('', '', 'height=600,width=800');
        const tableHtml = document.getElementById(tableId).outerHTML;
        printWindow.document.write('<html><head><title>Print</title>');
        printWindow.document.write('</head><body>');
        printWindow.document.write(tableHtml);
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
    };
}



