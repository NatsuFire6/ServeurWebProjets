from flask import Flask, request, render_template_string
from aspirateurDeLien import copier_html_avec_soup

app = Flask(__name__)

@app.route('/')
def index():
    # Render the HTML form directly from the server
    return '''
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>URL Sender</title>
    </head>
    <body>
        <h1>Envoyer un URL</h1>
        <form action="/process-url" method="post">
            <label for="url">Entrez un URL :</label>
            <input type="url" id="url" name="url" required>
            <button type="submit">Envoyer</button>
        </form>
        <button onclick="location.href=window.location.protocol + '//' + window.location.hostname + ':3000'">Autre fonctionnalité</button>
    </body>
    </html>
    '''

@app.route('/process-url', methods=['POST'])
def process_url():
    url = request.form['url']
    html_content = copier_html_avec_soup(url)
    return render_template_string(f'''
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Résultat</title>
    </head>
    <body>
        <h1>Contenu de l'URL : {url}</h1>
        <div style="white-space: pre-wrap; border: 1px solid #ddd; padding: 10px; background-color: #f9f9f9;">
            {html_content}
        </div>
        <a href="/">Retour</a>
    </body>
    </html>
    ''', url=url)

if __name__ == '__main__':
    app.run(debug=True)
