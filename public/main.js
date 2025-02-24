document.addEventListener('DOMContentLoaded', () => {
    const macroForm = document.getElementById('macroForm');
    const macroList = document.getElementById('macroList');
    const output = document.getElementById('output');
    let editingMacro = null;
    let infiniteExecutionIntervals = [];

    // Charger les macros sauvegardées
    loadMacros();

    // Fetch server URL from configuration
    fetchServerURL();

    // Ajouter ou mettre à jour une macro
    macroForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const macroName = document.getElementById('macroName').value;
        const macroCommand = document.getElementById('macroCommand').value;

        if (macroName && macroCommand) {
            const macro = { name: macroName, command: macroCommand };
            if (editingMacro) {
                updateMacro(macro);
            } else {
                saveMacro(macro);
                displayMacro(macro);
            }
            macroForm.reset();
            editingMacro = null;
            document.getElementById('submitButton').textContent = 'Créer Macro';
        }
    });

    // Sauvegarder une macro dans le stockage local
    function saveMacro(macro) {
        let macros = JSON.parse(localStorage.getItem('macros')) || [];
        macros.push(macro);
        localStorage.setItem('macros', JSON.stringify(macros));
    }

    // Mettre à jour une macro dans le stockage local
    function updateMacro(updatedMacro) {
        let macros = JSON.parse(localStorage.getItem('macros')) || [];
        macros = macros.map(macro => macro.name === editingMacro.name ? updatedMacro : macro);
        localStorage.setItem('macros', JSON.stringify(macros));
        loadMacros();
    }

    // Charger les macros depuis le stockage local
    function loadMacros() {
        macroList.innerHTML = '';
        let macros = JSON.parse(localStorage.getItem('macros')) || [];
        macros.forEach(macro => displayMacro(macro));
    }

    // Afficher une macro dans la liste
    function displayMacro(macro) {
        const li = document.createElement('li');
        const commandText = document.createElement('div');
        commandText.classList.add('command-text');
        commandText.innerHTML = `<strong>${macro.name}:</strong><br>${macro.command.split('\n').join('<br>')}`;
        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('button-container');

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Supprimer';
        deleteButton.addEventListener('click', () => {
            deleteMacro(macro);
            li.remove();
        });

        const executeButton = document.createElement('button');
        executeButton.textContent = 'Exécuter';
        executeButton.addEventListener('click', () => {
            executeMacro(macro.command);
        });

        const infiniteButton = document.createElement('button');
        infiniteButton.textContent = 'Exécuter à l\'infini';
        infiniteButton.addEventListener('click', () => {
            startInfiniteExecution(macro.command);
        });

        const editButton = document.createElement('button');
        editButton.textContent = 'Modifier';
        editButton.addEventListener('click', () => {
            editMacro(macro);
        });

        buttonContainer.appendChild(deleteButton);
        buttonContainer.appendChild(executeButton);
        buttonContainer.appendChild(infiniteButton);
        buttonContainer.appendChild(editButton);

        li.appendChild(commandText);
        li.appendChild(buttonContainer);
        macroList.appendChild(li);
    }

    // Supprimer une macro du stockage local
    function deleteMacro(macroToDelete) {
        let macros = JSON.parse(localStorage.getItem('macros')) || [];
        macros = macros.filter(macro => macro.name !== macroToDelete.name);
        localStorage.setItem('macros', JSON.stringify(macros));
    }

    // Modifier une macro
    function editMacro(macro) {
        document.getElementById('macroName').value = macro.name;
        document.getElementById('macroCommand').value = macro.command;
        editingMacro = macro;
        document.getElementById('submitButton').textContent = 'Mettre à jour Macro';
    }

    // Fetch server URL from configuration file
    function fetchServerURL() {
        fetch('/config.json')
            .then(response => response.json())
            .then(data => {
                window.serverURL = data.serverURL;
                console.log(`Server URL fetched: ${window.serverURL}`);
            })
            .catch(error => console.error('Error fetching server URL:', error));
    }

    // Exécuter une macro dans le terminal
    function executeMacro(command) {
        output.textContent = `Exécution de la commande: ${command}`;
        console.log(`Executing command: ${command}`);
        if (window.serverURL) {
            fetch(`${window.serverURL}/execute`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ command })
            })
            .then(response => response.json())
            .then(data => {
                output.textContent = `Résultat: ${data.result}`;
                console.log(`Command result: ${data.result}`);
            })
            .catch(error => {
                output.textContent = `Erreur: ${error}`;
                console.error(`Error executing command: ${error}`);
            });
        } else {
            output.textContent = 'Erreur: URL du serveur non définie';
            console.error('Erreur: URL du serveur non définie');
        }
    }

    // Démarrer l'exécution infinie d'une commande
    function startInfiniteExecution(command) {
        stopAllInfiniteExecutions();
        const intervalId = setInterval(() => {
            executeMacro(command);
        }, 1000);
        infiniteExecutionIntervals.push(intervalId);
    }

    // Arrêter toutes les exécutions infinies
    function stopAllInfiniteExecutions() {
        infiniteExecutionIntervals.forEach(intervalId => clearInterval(intervalId));
        infiniteExecutionIntervals = [];
    }

    // Arrêter toutes les exécutions infinies lorsque la touche 'Escape' est pressée
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            stopAllInfiniteExecutions();
        }
    });
});
