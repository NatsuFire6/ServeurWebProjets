#!/bin/bash

# Vérifier si Node.js est installé
if ! command -v node &> /dev/null; then
    echo "Node.js n'est pas installé. Installation en cours..."
    # Détecter le système d'exploitation
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
        sudo apt-get install -y nodejs
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        brew install node
    elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "win32" ]]; then
        echo "Veuillez installer Node.js manuellement depuis https://nodejs.org/"
        exit 1
    else
        echo "Système d'exploitation non supporté pour l'installation de Node.js."
        exit 1
    fi
fi

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

# Vérifier si pip est installé
if ! command -v pip3 &> /dev/null; then
    echo "pip n'est pas installé. Installation en cours..."
    # Détecter le système d'exploitation
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        sudo apt-get install -y python3-pip
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        brew install python
    elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "win32" ]]; then
        echo "Veuillez installer pip manuellement depuis https://pip.pypa.io/en/stable/installation/"
        exit 1
    else
        echo "Système d'exploitation non supporté."
        exit 1
    fi
fi

# Vérifier si Flask est installé
if ! python3 -c "import flask" &> /dev/null; then
    echo "Flask n'est pas installé. Installation en cours..."
    python3 -m pip install --user flask
fi

# Vérifier si bs4 (BeautifulSoup) est installé
if ! python3 -c "import bs4" &> /dev/null; then
    echo "bs4 n'est pas installé. Installation en cours..."
    python3 -m pip install --user bs4
fi

python3 launch_servers.py