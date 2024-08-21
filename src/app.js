const express = require('express');
const path = require('path');
const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, '../public')));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', routes);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
