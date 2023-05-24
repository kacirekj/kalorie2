import dataclasses
import re
import unicodedata
from datetime import date

from flask.json import JSONEncoder
from unidecode import unidecode


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