document.addEventListener('DOMContentLoaded', () => {
    const macroForm = document.getElementById('macroForm');
    const macroList = document.getElementById('macroList');
    const output = document.getElementById('output');

    // Charger les macros sauvegardées
    loadMacros();

    // Fetch server URL from configuration
    fetchServerURL();

    // Ajouter une macro
    macroForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const macroName = document.getElementById('macroName').value;
        const macroCommand = document.getElementById('macroCommand').value;

        if (macroName && macroCommand) {
            const macro = { name: macroName, command: macroCommand };
            saveMacro(macro);
            displayMacro(macro);
            macroForm.reset();
        }
    });

    // Sauvegarder une macro dans le stockage local
    function saveMacro(macro) {
        let macros = JSON.parse(localStorage.getItem('macros')) || [];
        macros.push(macro);
        localStorage.setItem('macros', JSON.stringify(macros));
    }

    // Charger les macros depuis le stockage local
    function loadMacros() {
        let macros = JSON.parse(localStorage.getItem('macros')) || [];
        macros.forEach(macro => displayMacro(macro));
    }

    // Afficher une macro dans la liste
    function displayMacro(macro) {
        const li = document.createElement('li');
        li.textContent = `${macro.name}: ${macro.command}`;
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
        li.appendChild(deleteButton);
        li.appendChild(executeButton);
        macroList.appendChild(li);
    }

    // Supprimer une macro du stockage local
    function deleteMacro(macroToDelete) {
        let macros = JSON.parse(localStorage.getItem('macros')) || [];
        macros = macros.filter(macro => macro.name !== macroToDelete.name);
        localStorage.setItem('macros', JSON.stringify(macros));
    }

    // Fetch server URL from configuration file
    function fetchServerURL() {
        fetch('config.json')
            .then(response => response.json())
            .then(data => {
                window.serverURL = data.serverURL;
            })
            .catch(error => console.error('Error fetching server URL:', error));
    }

    // Exécuter une macro dans le terminal
    function executeMacro(command) {
        output.textContent = `Exécution de la commande: ${command}`;
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
            })
            .catch(error => {
                output.textContent = `Erreur: ${error}`;
            });
        } else {
            output.textContent = 'Erreur: URL du serveur non définie';
        }
    }
});