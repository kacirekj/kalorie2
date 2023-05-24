from flask import Flask, send_from_directory, request, redirect, url_for
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, scoped_session
from src import initdb
from src.constant import STATIC_FILE_SUFFIXES
from src.util import CustomJSONEncoder


app = Flask(__name__, )
app.json_encoder = CustomJSONEncoder

engine = create_engine("sqlite:///data/sqlite.db", echo=True)
session_factory = sessionmaker(bind=engine)
scoped_factory = scoped_session(session_factory)

import src.rest
import src.repository


@app.route('/')
def get_index():
    return send_from_directory('', 'index.html')


@app.route('/<path:text>')
def get_index_with(text: str):
    if text == '/':
        return send_from_directory('', 'index.html')
    elif text.startswith('/api'):
        pass
    elif text.endswith(STATIC_FILE_SUFFIXES):
        web_file = text.split('web/')[1]
        return send_from_directory('', f'web/{web_file}')
    else:
        return send_from_directory('', 'index.html')  # Should have 404 not found


@app.teardown_request
def teardown_request(exception):
    if '/api' not in request.path:
        return
    print('Teardown')
    session = scoped_factory()
    if not exception:
        print('Commit')
        session.commit()
    else:
        print('Rollback')
        session.rollback()
    session.close()


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=4000)
