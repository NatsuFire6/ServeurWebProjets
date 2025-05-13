from bs4 import BeautifulSoup
import requests
import sys

# Définir l'URL dans une variable
url = "https://example.com"

def copier_html_avec_soup(url):
    try:
        response = requests.get(url)
        response.raise_for_status()  # Vérifie les erreurs HTTP
        soup = BeautifulSoup(response.text, 'html.parser')  # Analyse le HTML avec BeautifulSoup
        return [a.get('href') for a in soup.find_all('a', href=True)]  # Retourne une liste de tous les liens
    except requests.exceptions.RequestException as e:
        return f"Erreur lors de la récupération de l'URL: {e}"
