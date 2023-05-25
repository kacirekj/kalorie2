import csv
import dataclasses
from __main__ import app
from dataclasses import asdict

import jwt
import requests
from flask import request, send_file, redirect

import repository
from mapper import dict_to_foods, dict_to_entries, dicts_to_days

FILE = 'export_foods.csv'


@app.get('/api/days')
def get_days():
    return [dataclasses.asdict(day) for day in repository.get_days()]


@app.post('/api/days')
def post_days():
    days = dicts_to_days(request.json)
    days = repository.upsert_days(days)
    result = [dataclasses.asdict(day) for day in days]
    return result


@app.delete('/api/days/<id>')
def delete_day(id):
    repository.delete_day(id)
    return ''


@app.post('/api/entries')
def post_entries():
    entries = dict_to_entries(request.json)
    entries = repository.upsert_entry(entries)
    return [entry.to_dict() for entry in entries]


@app.get('/api/foods')
def get_foods():
    ids = request.args.getlist('ids[]')
    name_nrm_contains = request.args.getlist('name_nrm_contains[]')
    return [asdict(food) for food in repository.get_foods(ids, name_nrm_contains)]


@app.post('/api/foods')
def post_foods():
    foods = dict_to_foods(request.json)
    foods = repository.upsert_foods(foods)
    return [asdict(food) for food in foods]


@app.delete('/api/foods/<id>')
def delete_foods(id):
    repository.delete_foods([id])
    return ''


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
    resp = requests.post('https://login.szn.cz/api/v1/oauth/token', headers={'Accept': 'application/json'}, data={
        "grant_type": "authorization_code",
        "code": code,
        "redirect_uri": redirect_uri,  # It contains / on end!
        "client_secret": "e1aa3424867c522acb81c7e7d37cdb8fcbc8a889bf84718e",
        "client_id": "d3759562806afe6d5e43b6e2508a49e11abfe112822fedb3"
    })
    resp = resp.json()
    encoded_jwt = jwt.encode({'email': resp['account_name']}, 'ktabulky.cz@secret', algorithm='HS256')
    return encoded_jwt
