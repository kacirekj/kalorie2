import csv
import dataclasses
from __main__ import app
from dataclasses import asdict

from flask import request, send_file
from werkzeug.exceptions import Conflict

import mapper
import repository
import service
import util

FILE = 'export_foods.csv'


# Days

@app.get('/api/days')
def get_days():
    user_id = util.get_user_id()
    return [dataclasses.asdict(day) for day in repository.get_days(user_id=user_id)]


@app.post('/api/days')
def post_days():
    user_id = util.get_user_id()
    days = mapper.to_days(request.json)

    # Auth
    day_ids = [day.id for day in days]
    all_days = repository.get_days(day_ids)
    service.authorize(all_days, user_id)

    # Validate Day Date doesn't exists
    dates = [d for d in all_days]
    for d in days:
        if d.date in dates:
            raise Conflict('Date already exists.')

    days = repository.upsert_days(days)
    result = [dataclasses.asdict(day) for day in days]
    return result


@app.delete('/api/days/<id>')
def delete_day(id):
    repository.delete_day(id)
    return ''


@app.post('/api/entries')
def post_entries():
    entries = mapper.to_entries(request.json)
    entries = repository.upsert_entry(entries)
    return [entry.to_dict() for entry in entries]


# Foods

@app.get('/api/foods')
def get_foods():
    ids = request.args.getlist('ids[]')
    name_nrm_contains = request.args.getlist('name_nrm_contains[]')
    show_popular = bool(request.args.get('show_popular'))
    type = request.args.get('type')
    user_id = util.get_user_id()

    if not (ids or name_nrm_contains or show_popular or type):
        return []

    own_foods = repository.get_foods(ids, name_nrm_contains, user_id, show_popular=show_popular, type=type)
    pub_foods = repository.get_foods(ids, name_nrm_contains, visibility=0, show_popular=show_popular, type=type)
    return [asdict(food) for food in [*pub_foods, *own_foods]]


@app.post('/api/foods')
def post_foods():
    user_id = util.get_user_id()
    foods = mapper.to_foods(request.json)

    # Auth
    food_ids = [food.id for food in foods]
    all_foods = repository.get_foods(ids=food_ids)
    service.authorize(all_foods, user_id)

    foods = repository.upsert_foods(foods)
    return [asdict(food) for food in foods]


@app.delete('/api/foods/<id>')
def delete_foods(id):
    repository.delete_foods([id])
    return ''


# Ohter

@app.get('/api/export/foods')
def get_export_foods():
    foods = [asdict(food) for food in repository.get_foods(None, None)]

    with open(FILE, 'w') as f:  # You will need 'wb' mode in Python 2.x
        w = csv.DictWriter(f, foods[0].keys())
        w.writeheader()
        w.writerows(foods)

    return send_file(FILE, as_attachment=True)


@app.get('/api/login')
def login():
    code = request.args.get('code')
    redirect_uri = request.args.get('redirect_uri')
    token = service.get_token(code, redirect_uri)
    return token


@app.get('/api/users')
def get_users():
    # Temporary unprotected todo
    return [asdict(user) for user in repository.get_users()]

