from flask import Flask, jsonify
from db.db import DB


app = Flask(__name__)
DB = DB(app)


@app.route('/', methods=['GET'])
def test():
    return jsonify({"message": "This is a test message"})



if __name__ == '__main__':
    DB.create_all()
    app.run(debug=True, port='5002')