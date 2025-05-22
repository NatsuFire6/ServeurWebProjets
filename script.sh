#!/bin/bash

# Vérifier si python3 est installé
if ! command -v python3 &> /dev/null; then
    echo "python3 n'est pas installé. Installation en cours..."
    # Détecter le système d'exploitation
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        sudo apt-get update
        sudo apt-get install -y python3
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        brew install python
    elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "win32" ]]; then
        echo "Veuillez installer python3 manuellement depuis https://www.python.org/downloads/windows/"
        exit 1
    else
        echo "Système d'exploitation non supporté."
        exit 1
    fi
fi

# Lancer le script Python launch_servers.py
python3 launch_servers.py