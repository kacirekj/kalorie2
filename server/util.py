import dataclasses
import re
import unicodedata
from datetime import date

import jwt
from flask.json import JSONEncoder
from flask import request
from unidecode import unidecode
from werkzeug.exceptions import Unauthorized


class CustomJSONEncoder(JSONEncoder):
    def default(self, obj):
        try:
            if isinstance(obj, date):
                return obj.isoformat()
            iterable = iter(obj)
        except TypeError:
            pass
        else:
            return list(iterable)
        return JSONEncoder.default(self, obj)


def normalize(s: str):
    s = unicodedata.normalize('NFC', s)  # I'm not sure if needed
    s = s.lower()
    s = unidecode(s)
    s = re.sub('[^A-Za-z0-9]+', "-", s)
    return s


def get_session_id():
    return request.headers.get('Session-Id')


def get_user_id():
    token = request.headers.get('Authorization')
    session_id = request.headers.get('Session-Id')
    mimick = request.args.get('mimick')  # Secret param!
    try:
        if token:
            token = token.split('Bearer ')[1]
            token = jwt.decode(token, algorithms=['HS256'], key='ktabulky.cz@secret') # can throw exception
            user_id = token['id']
        elif session_id:
            user_id = session_id
        elif mimick:
            user_id = mimick
        else:
            user_id = 'unknown'
        return user_id
    except Exception as e:
        raise Unauthorized(e)


def get_request_fingerprint():
    pass
