const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const port = 3000;

app.use(bodyParser.json());

// Servir les fichiers statiques
app.use(express.static(path.join(__dirname, 'public')));

// Servir le fichier HTML par défaut
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'main.html'));
});

app.post('/execute', (req, res) => {
    const command = req.body.command;
    // Here you can add code to execute the command on the server
    console.log(`Executing command: ${command}`);
    res.json({ result: `Command ${command} executed.` });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
