import datetime
import string
from dataclasses import dataclass
from datetime import date
from typing import List

from sqlalchemy import String, ForeignKey
from sqlalchemy.orm import declarative_base, relationship, Mapped, mapped_column

from util import normalize

Base = declarative_base()


@dataclass
class FoodServing(Base):
    __tablename__ = 'food_serving_table'

    id: Mapped[int] = mapped_column(primary_key=True)
    food_id: Mapped[int] = mapped_column(ForeignKey("food_table.id"))
    serving_id: Mapped[int] = mapped_column(ForeignKey("serving_table.id"))
    serving: Mapped['Serving'] = relationship(lazy='joined')


@dataclass
class Food(Base):
    __tablename__ = 'food_table'
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    name_nrm: Mapped[str] = mapped_column(String(100), nullable=True)
    proteins: Mapped[int] = mapped_column(nullable=False)
    carbs: Mapped[int] = mapped_column(nullable=False)
    fats: Mapped[int] = mapped_column(nullable=False)
    calories: Mapped[int] = mapped_column(nullable=False)
    source: Mapped[str] = mapped_column(String(200), nullable=True)
    inactive: Mapped[bool] = mapped_column(nullable=True)
    servings: Mapped[List['FoodServing']] = relationship(lazy='joined')
    user_id: Mapped[int] = mapped_column(nullable=False)
    visibility: Mapped[int] = mapped_column(nullable=False)  # null or 0 - public (only owner), 1 - private,

    @staticmethod
    def normalize_name(name: str):
        n = name.lower()
        n = name.translate(str.maketrans('', '', string.punctuation))

    def __init__(self, **kwargs):
        super().__init__(**{'visibility': 0, **kwargs, 'name_nrm': normalize(kwargs['name'])})


@dataclass
class Day(Base):
    __tablename__ = 'day_table'
    id: Mapped[int] = mapped_column(primary_key=True)
    date: Mapped[datetime.date] = mapped_column(nullable=False)
    entries: Mapped[List['Entry']] = relationship(lazy='selectin', cascade='all, delete-orphan')
    user_id: Mapped[int] = mapped_column(ForeignKey("user_table.id"), nullable=False)

    def merge(self, source: 'Day'):
        self.entries = [*self.entries, *source.entries]


@dataclass
class Entry(Base):
    __tablename__ = 'entry_table'
    id: Mapped[int] = mapped_column(primary_key=True)
    amount: Mapped[int] = mapped_column(nullable=False)
    day_id: Mapped[int] = mapped_column(ForeignKey("day_table.id"))
    food_id: Mapped[int] = mapped_column(ForeignKey("food_table.id"), nullable=False)
    serving_id: Mapped[int] = mapped_column(ForeignKey("serving_table.id"), nullable=False)
    course_id: Mapped[int] = mapped_column(nullable=True)  # 0 - all day, 1 - Breakfast, 2 - Snack 1., 3 - Lunch, ...


@dataclass
class Serving(Base):
    __tablename__ = 'serving_table'
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(nullable=False)
    grams: Mapped[int] = mapped_column(nullable=False)
    inactive: Mapped[bool] = mapped_column(nullable=True)


@dataclass
class User(Base):
    __tablename__ = 'user_table'
    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(nullable=True)
    created: Mapped[datetime.datetime] = mapped_column(nullable=True)
    last_visit: Mapped[datetime.datetime] = mapped_column(nullable=True)
    fingerprint: Mapped[str] = mapped_column(nullable=True)


@dataclass
class DayExport:
    day_date: str
    entry_amount: str
    serving_grams: str
    serving_name: str
    food_name: str
    food_proteins: str
    food_carbs: str
    food_fats: str
    food_calories: str
