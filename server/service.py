import datetime

import jwt
import requests
from werkzeug.exceptions import Unauthorized

import repository
import util
from model import User


def get_or_create_user(email):
    users: list = repository.get_users(email=email)
    if not users:
        user = User(email=email, created=datetime.datetime.now())
        user = repository.upsert_user(user)
    else:
        user = users[0]

    # Update last visit
    user.last_visit = datetime.datetime.now()
    repository.upsert_user(user)

    # Change ownership of Guest items to User
    sid = util.get_session_id()
    days = repository.get_days(user_id=sid)
    foods = repository.get_foods(user_id=sid)
    for d in days:
        d.user_id = user.id
    for f in foods:
        f.user_id = user.id
    repository.upsert_days(days)
    repository.upsert_foods(foods)

    return user


def get_token(code, redirect_uri):
    """
    It works like this:
    1. User clicks on Login via Seznam.cz and new Window pop-ups
    2. User login on Seznam.cz side and browser is redirected to loginView.js with "code" param
    3. LoginView.js calls this endpoint with "code" param
    4. This method calls Seznam.cz and will receive Jwt Token
    Redirect uris are stored on frontend (are dynamically created).
    :return: Jwt Token with UserId
    """

    # Call Seznam.cz for Jwt
    resp = requests.post('https://login.szn.cz/api/v1/oauth/token', headers={'Accept': 'application/json'}, data={
        "grant_type": "authorization_code",
        "code": code,
        "redirect_uri": redirect_uri,  # It contains / on end!
        "client_secret": "e1aa3424867c522acb81c7e7d37cdb8fcbc8a889bf84718e",
        "client_id": "d3759562806afe6d5e43b6e2508a49e11abfe112822fedb3"
    })
    resp = resp.json()
    user = get_or_create_user(resp['account_name'])
    encoded_jwt = jwt.encode({'email': user.email, 'id': user.id}, 'ktabulky.cz@secret', algorithm='HS256')

    return encoded_jwt


def authorize(models: list, user_id):
    for m in models:
        if m.user_id != user_id:
            raise Unauthorized()
