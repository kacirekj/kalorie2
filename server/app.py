from flask import Flask, send_from_directory, request, redirect, url_for
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, scoped_session
import initdb
import util
from constant import STATIC_FILE_SUFFIXES, WEB_DIR, DATA_DIR
from util import CustomJSONEncoder


app = Flask(__name__, )
app.json_encoder = CustomJSONEncoder
# app.config['JSON_SORT_KEYS'] = False
# app.config['JSONIFY_PRETTYPRINT_REGULAR'] = False

engine = create_engine(f"sqlite:///{DATA_DIR}/sqlite.db", echo=True)
session_factory = sessionmaker(bind=engine)
scoped_factory = scoped_session(session_factory)


import rest
import repository


@app.route('/')
def get_index():
    return send_from_directory(WEB_DIR, 'index.html')


@app.route('/<path:text>')
def get_index_with(text: str):
    if text == '/':
        return send_from_directory(WEB_DIR, 'index.html')
    elif text.startswith('/api'):
        pass
    elif text.endswith(STATIC_FILE_SUFFIXES):
        web_file = text.split('web/')[1]
        return send_from_directory(WEB_DIR, web_file)
    else:
        return send_from_directory(WEB_DIR, 'index.html')  # Should have 404 not found


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
