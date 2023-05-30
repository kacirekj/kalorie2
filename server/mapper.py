import datetime

from model import Day, Entry, Food, Serving, DayExport, FoodServing


def dict_to_serving(dic):
    if dic is None:
        return None
    return Serving(
        id=dic.get('id'),
        name=dic.get('name'),
        grams=dic.get('grams'),
        inactive=dic.get('inactive'),
    )


def dict_to_food_servings(arr):
    return [dict_to_food_serving(**food_serving) for food_serving in arr]


def dict_to_food_serving(**kwargs):
    return FoodServing(
        id=kwargs.get('id'),
        food_id=kwargs.get('food_id'),
        serving_id=kwargs.get('serving_id'),
        serving=dict_to_serving(kwargs.get('serving')),
    )


def dict_to_foods(arr):
    return [dict_to_food(**food) for food in arr]


def dict_to_food(**kwargs):
    return Food(
        id=kwargs.get('id'),
        name=kwargs.get('name'),
        proteins=kwargs.get('proteins'),
        carbs=kwargs.get('carbs'),
        fats=kwargs.get('fats'),
        fiber=kwargs.get('fiber'),
        salt=kwargs.get('salt'),
        sat_fats=kwargs.get('sat_fats'),
        sugars=kwargs.get('sugars'),
        inactive=kwargs.get('inactive'),
        calories=kwargs.get('calories'),
        servings=dict_to_food_servings(kwargs.get('servings')),
        user_id=kwargs.get('user_id'),
        visibility=kwargs.get('visibility'),
        source=kwargs.get('source'),
    )


def dicts_to_days(arr):
    return [dict_to_day(**day) for day in arr]


def dict_to_day(**kwargs):
    return Day(
        id=kwargs.get('id'),
        date=datetime.date.fromisoformat(kwargs.get('date')),
        entries=dict_to_entries(kwargs.get('entries', [])),
        user_id=kwargs.get('user_id')
    )


def dict_to_entries(arr):
    return [dict_to_entry(**entry) for entry in arr]


def dict_to_entry(**kwargs):
    return Entry(
        id=kwargs.get('id'),
        food_id=kwargs.get('food_id'),
        amount=kwargs.get('amount'),
        day_id=kwargs.get('day_id'),
        serving_id=kwargs.get('serving_id'),
        course_id=kwargs.get('course_id')
    )


def map_to_day_export(day, food) -> DayExport:
    pass

