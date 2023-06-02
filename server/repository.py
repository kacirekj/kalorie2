from sqlalchemy import delete, select, update
from sqlalchemy.orm import Session

from model import Day, Food, Entry, FoodServing, User, Dish
from __main__ import scoped_factory


def get_days(ids=None, user_id=None, date=None, not_id=None) -> list[Day]:
    session = scoped_factory()
    q = select(Day)
    if user_id is not None:
        q = q.where(Day.user_id == user_id)
    if ids:
        q = q.where(Day.id.in_(ids))
    if date:
        q = q.where(Day.date == date)
    if not_id:
        q = q.where(Day.id != not_id)
    return session.scalars(q).all()


def upsert_days(days: list[Day]):
    session = scoped_factory()
    fresh_days = []
    for day in days:
        try:  # Prevent duplicities
            exs_day = get_days(date=day.date, user_id=day.user_id, not_id=day.id)[0]
            exs_day.merge(source=day)
            fresh_day = session.merge(exs_day)
            delete_day(day.id)
        except:
            fresh_day = session.merge(day)

        fresh_days.append(fresh_day)

    session.flush()
    return fresh_days


def delete_day(id):
    scoped_factory().query(Day).where(Day.id.in_([id])).delete()


def get_foods(ids: list = None, name_nrm_contains: list = None, user_id: int = None, visibility: int = None, show_popular: bool = None) -> list[Food]:
    q = select(Food)
    if ids:
        q = q.where(Food.id.in_(ids))
    if name_nrm_contains:
        for s in name_nrm_contains:
            q = q.where(Food.name_nrm.contains(s))
    if show_popular:
        subq = select(Entry.food_id).limit(10)
        q = q.where(Food.id.in_(subq))

    # Auth
    if user_id is not None:
        q = q.where(Food.user_id == user_id)
    if visibility is not None:
        q = q.where(Food.visibility == visibility)

    r = scoped_factory().scalars(q)
    return r.unique().all()


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


def get_users(email: str = None):
    q = select(User)
    if email:
        q = q.where(User.email == email.lower())
    return scoped_factory().scalars(q).all()


def upsert_user(user: User):
    session: Session = scoped_factory()
    fresh_user = session.merge(user)
    session.flush()
    return fresh_user


def get_dishes():
    q = select(Dish)
    r = scoped_factory().scalars(q)
    return r.unique().all()


def upser_dishes(dishes: list[Dish]):
    session: Session = scoped_factory()
    fresh_dishes = []
    for dish in dishes:
        fresh_dish = session.merge(dish)
        fresh_dishes.append(fresh_dish)
    session.flush()
    return fresh_dishes


def delete_dishes(ids):
    session: Session = scoped_factory()
    session.query(Dish).where(Dish.id.in_(ids)).delete()
