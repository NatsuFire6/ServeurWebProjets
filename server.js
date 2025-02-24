const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { exec } = require('child_process');
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
    const commands = req.body.command.split('\n').filter(cmd => cmd.trim() !== '').join(' && ');
    console.log(`Executing combined command: ${commands}`);
    exec(commands, (error, stdout, stderr) => {
        if (error) {
            console.error(`Erreur: ${error.message}`);
            return res.status(500).json({ result: `Erreur: ${error.message}` });
        }
        if (stderr) {
            console.error(`Stderr: ${stderr}`);
            return res.status(500).json({ result: `Erreur: ${stderr}` });
        }
        res.json({ result: stdout });
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
