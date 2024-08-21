const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs'); // Asegúrate de agregar esta línea
const { getExcelColumns, convertExcelToJsonWithSelectedColumns } = require('./excelToJson');

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../uploads'));
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage: storage });

// Ruta para obtener las columnas del archivo Excel
router.post('/get-columns', upload.single('excel'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No se subió ningún archivo.');
    }

    const filePath = req.file.path;
    const columns = getExcelColumns(filePath);
    res.json(columns);
});

// Ruta para convertir el archivo Excel a JSON con las columnas seleccionadas
router.post('/convert', upload.single('excel'), (req, res) => {
    const selectedColumns = JSON.parse(req.body.selectedColumns);
    const filePath = req.file.path;

    const jsonOutput = convertExcelToJsonWithSelectedColumns(filePath, selectedColumns);

    // Guardar el archivo JSON en el servidor
    const outputFilePath = path.join(__dirname, `../uploads/output-${Date.now()}.json`);
    fs.writeFileSync(outputFilePath, JSON.stringify(jsonOutput, null, 4), 'utf-8');

    res.json({ data: jsonOutput, downloadLink: `/download?file=${path.basename(outputFilePath)}` });
});

router.get('/download', (req, res) => {
    const file = req.query.file;
    const filePath = path.join(__dirname, '../uploads/', file);
    res.download(filePath);
});

module.exports = router;
