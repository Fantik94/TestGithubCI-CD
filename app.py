from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/')
def hello_world():
    return 'Hello, World!'

@app.route('/eval', methods=['POST'])
def eval_endpoint():
    # Attention: Utiliser `eval()` avec des données non fiables est dangereux!
    data = request.get_json()
    result = eval(data['code'])  # Ceci est vulnérable à une injection de code
    return jsonify(result="ok", output=result)

if __name__ == '__main__':
    app.run(debug=True)
