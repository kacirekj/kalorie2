"""
Import External libraries
"""

from flask import Flask, send_from_directory, request, redirect, url_for
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, scoped_session

"""
Import modules
"""

import context
import initdb
import util
import constant
from util import CustomJSONEncoder

"""
Configure Flask
"""

context.app = Flask(__name__, )
# app.json_encoder = CustomJSONEncoder
# app.config['JSON_SORT_KEYS'] = False
# app.config['JSONIFY_PRETTYPRINT_REGULAR'] = False


"""
Configure Sql Alchemy
"""

context.engine = create_engine(f"sqlite:///{constant.DATA_DIR}/sqlite.db", echo=True)
context.session_factory = sessionmaker(bind=context.engine)
context.scoped_factory = scoped_session(context.session_factory)


"""
Import modules
"""

import rest
import repository


@context.app.route('/')
def get_index():
    return send_from_directory(constant.WEB_DIR, 'index.html')


@context.app.route('/<path:text>')
def get_index_with(text: str):
    if text == '/':
        return send_from_directory(constant.WEB_DIR, 'index.html')
    elif text.startswith('/api'):
        pass
    elif text.endswith(constant.STATIC_FILE_SUFFIXES):
        web_file = text.split('web/')[1]
        return send_from_directory(constant.WEB_DIR, web_file)
    else:
        return send_from_directory(constant.WEB_DIR, 'index.html')  # Should have 404 not found


@context.app.teardown_request
def teardown_request(exception):
    if '/api' not in request.path:
        return
    print('Teardown')
    session = context.scoped_factory()
    if not exception:
        print('Commit')
        session.commit()
    else:
        print('Rollback')
        session.rollback()
    session.close()

application = context.app  # gunicorn needs "application" variable

if __name__ == '__main__':
    context.app.run(debug=True, host='0.0.0.0', port=4000)
