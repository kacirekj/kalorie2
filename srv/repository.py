from sqlalchemy import delete, select
from sqlalchemy.orm import Session

from model import Day, Food, Entry, FoodServing
from __main__ import scoped_factory


def get_days():
    return scoped_factory().scalars(select(Day)).all()


def upsert_days(days: list[Day]):
    session = scoped_factory()
    fresh_days = []
    for day in days:
        fresh_day = session.merge(day)
        fresh_days.append(fresh_day)
    session.flush()
    return fresh_days


def delete_day(id):
    scoped_factory().query(Day).where(Day.id.in_([id])).delete()


def get_foods(ids: list, name_nrm_contains: list):
    stmn = select(Food)
    if ids:
        stmn = stmn.where(Food.id.in_(ids))
    if name_nrm_contains:
        for s in name_nrm_contains:
            stmn = stmn.where(Food.name_nrm.contains(s))
    if not ids and not name_nrm_contains:
        # stmn = stmn.limit(1000)
        pass

    return scoped_factory().scalars(stmn).all()


def upsert_foods(foods: list[Food]):
    session: Session = scoped_factory()
    fresh_foods = []
    for food in foods:
        if food.id is None:
            fresh_food = session.merge(food)
        else:
            fresh_food = session.merge(food)
        fresh_foods.append(fresh_food)
    session.flush()
    return fresh_foods


def delete_foods(ids):
    session: Session = scoped_factory()
    session.query(Food).where(Food.id.in_(ids)).delete()


def upsert_entry(entries: list[Entry]):
    session: Session = scoped_factory()
    for entry in entries:
        session.merge(entry)
    return entries
