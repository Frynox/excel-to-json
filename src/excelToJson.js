const XLSX = require('xlsx');

// Función para obtener las columnas de una hoja de Excel
function getExcelColumns(filePath) {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0]; // Asumimos que queremos la primera hoja
    const worksheet = workbook.Sheets[sheetName];
    
    const columns = [];
    const headers = XLSX.utils.sheet_to_json(worksheet, { header: 1 })[0]; // Leemos solo la primera fila

    headers.forEach(header => {
        columns.push(header);
    });

    return columns;
}

// Función para convertir Excel a JSON con las columnas seleccionadas
function convertExcelToJsonWithSelectedColumns(filePath, selectedColumns) {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0]; // Asumimos que queremos la primera hoja
    const worksheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    // Filtramos las columnas seleccionadas
    const filteredData = worksheet.map(row => {
        const filteredRow = {};
        selectedColumns.forEach(column => {
            filteredRow[column] = row[column];
        });
        return filteredRow;
    });

    return filteredData;
}

module.exports = { getExcelColumns, convertExcelToJsonWithSelectedColumns };
