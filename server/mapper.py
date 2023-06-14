import datetime
from typing import List

from model import Day, Entry, Food, Serving, DayExport, FoodServing


def to_serving(serving: dict):
    if serving is None:
        return None
    return Serving(
        id=serving.get('id'),
        name=serving.get('name'),
        grams=serving.get('grams'),
        inactive=serving.get('inactive'),
    )


def to_food_servings(servings: List[dict]):
    return [to_food_serving(food_serving) for food_serving in servings]


def to_food_serving(food_serving: dict):
    return FoodServing(
        id=food_serving.get('id'),
        food_id=food_serving.get('food_id'),
        serving_id=food_serving.get('serving_id'),
        serving=to_serving(food_serving.get('serving')),
    )


def to_entries(entries: List[dict]):
    return [to_entry(entry) for entry in entries]


def to_entry(entry: dict):
    return Entry(
        id=entry.get('id'),
        rank=entry.get('rank'),
        food_id=entry.get('food_id'),
        amount=entry.get('amount'),
        serving_id=entry.get('serving_id'),
        day_id=entry.get('day_id'),
        course_id=entry.get('course_id'),
        dish_id=entry.get('dish_id'),
    )


def to_foods(foods: List[dict]):
    return [to_food(food) for food in foods]


def to_food(food: dict):
    return Food(
        id=food.get('id'),
        type=food.get('type'),
        name=food.get('name'),
        proteins=food.get('proteins'),
        carbs=food.get('carbs'),
        fats=food.get('fats'),
        fiber=food.get('fiber'),
        salt=food.get('salt'),
        sat_fats=food.get('sat_fats'),
        sugars=food.get('sugars'),
        inactive=food.get('inactive'),
        calories=food.get('calories'),
        servings=to_food_servings(food.get('servings')),
        user_id=food.get('user_id'),
        visibility=food.get('visibility'),
        source=food.get('source'),
        note=food.get('note'),
        ingredients=to_entries(food.get('ingredients')),
    )


def to_days(days: List[dict]):
    return [to_day(day) for day in days]


def to_day(day):
    return Day(
        id=day.get('id'),
        date=datetime.date.fromisoformat(day.get('date')),
        entries=to_entries(day.get('entries', [])),
        user_id=day.get('user_id')
    )


def map_to_day_export(day, food) -> DayExport:
    pass

