import subprocess

# Lancer serveur JS (Express)
subprocess.Popen(["node", "server.js"])

# Lancer serveur Python (Flask)
subprocess.Popen(["python3", "fetchLien/server.py"])
