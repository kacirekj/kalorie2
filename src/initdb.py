import datetime
import json

from sqlalchemy import create_engine
from sqlalchemy.orm import Session

from src.model import Food, Day, Entry, Base, Serving, FoodServing

id = 0
date = datetime.date.today()

sqlite='sqlite:///../data/sqlite.db'


def get_id_and_increment():
    global id
    id += 1
    return id


def get_date_and_decrement():
    global date
    result = (date - datetime.timedelta(days=1))
    date = datetime.datetime.fromisoformat(result.isoformat())
    return result


def init():
    engine = create_engine(sqlite, echo=True)
    Base.metadata.create_all(engine)

    with Session(engine) as session:
        serving0 = Serving(id=0, name='', grams=1)
        serving1 = Serving(id=1, name='', grams=100)
        serving2 = Serving(id=2, name='Malé', grams=50)
        serving3 = Serving(id=3, name='Střední', grams=55)
        serving4 = Serving(id=4, name='Velké', grams=60)
        serving5 = Serving(id=5, name='Vanička', grams=250)
        serving6 = Serving(id=6, name='Konzerva', grams=360)

        session.merge(serving0)
        session.merge(serving1)
        session.merge(serving2)
        session.merge(serving3)
        session.merge(serving4)
        session.merge(serving5)
        session.merge(serving6)

        mouka = Food(id=1, name='Mouka pšeničná', proteins=11, carbs=73, fats=1.5, calories=356)
        vejce = Food(id=2, name='Vejce slepičí', proteins=12.4, carbs=1, fats=10.9, calories=151)
        maso = Food(id=3, name='Kuřecí prsa syrová bez kůže', proteins=23.1, carbs=0, fats=1.5, calories=106)
        mleko = Food(id=4, name='Mléko polotučné', proteins=3.4, carbs=4.9, fats=1.5, calories=47)
        chleb = Food(id=5, name='Chléb konzumní kmínový', proteins=8, carbs=45, fats=1.1, calories=244)
        tvaroh = Food(id=6, name='Tvaroh polotučný Milko', proteins=10, carbs=4, fats=3.8, calories=91)
        ryze = Food(id=7, name='Rio Mare Insalatissime Tuňákový salát s kuskusem', proteins=10, carbs=9.5, fats=13, calories=300)

        mouka = session.merge(mouka)
        vejce = session.merge(vejce)
        maso = session.merge(maso)
        mleko = session.merge(mleko)
        chleb = session.merge(chleb)
        tvaroh = session.merge(tvaroh)
        ryze = session.merge(ryze)

        fs0 = FoodServing(id=0, food_id=1, serving_id=0)
        fs1 = FoodServing(id=1, food_id=1, serving_id=1)
        fs2 = FoodServing(id=2, food_id=2, serving_id=0)
        fs3 = FoodServing(id=3, food_id=2, serving_id=1)
        fs4 = FoodServing(id=4, food_id=3, serving_id=0)
        fs5 = FoodServing(id=5, food_id=3, serving_id=1)
        fs6 = FoodServing(id=6, food_id=4, serving_id=0)
        fs7 = FoodServing(id=7, food_id=4, serving_id=1)
        fs8 = FoodServing(id=8, food_id=5, serving_id=0)
        fs9 = FoodServing(id=9, food_id=5, serving_id=1)
        fs10 = FoodServing(id=10, food_id=6, serving_id=0)
        fs11 = FoodServing(id=11, food_id=6, serving_id=1)
        fs12 = FoodServing(id=12, food_id=7, serving_id=0)
        fs13 = FoodServing(id=13, food_id=7, serving_id=1)

        fs14 = FoodServing(id=14, food_id=2, serving_id=2)
        fs15 = FoodServing(id=15, food_id=2, serving_id=3)
        fs16 = FoodServing(id=16, food_id=2, serving_id=4)

        fs17 = FoodServing(id=17, food_id=6, serving_id=5)

        fs18 = FoodServing(id=18, food_id=7, serving_id=6)


        session.merge(fs0)
        session.merge(fs1)
        session.merge(fs2)
        session.merge(fs3)
        session.merge(fs4)
        session.merge(fs5)
        session.merge(fs6)
        session.merge(fs7)
        session.merge(fs8)
        session.merge(fs9)
        session.merge(fs10)
        session.merge(fs11)
        session.merge(fs12)
        session.merge(fs13)
        session.merge(fs14)
        session.merge(fs15)
        session.merge(fs16)
        session.merge(fs17)
        session.merge(fs18)

        for i in range(1, 10):
            day0 = Day(id=i, date=get_date_and_decrement())
            day0 = session.merge(day0)

            if i == 7:
                e0 = Entry(id=get_id_and_increment(), day_id=day0.id, food_id=mouka.id, amount=300, serving_id=serving0.id, course_id=0)
                e1 = Entry(id=get_id_and_increment(), day_id=day0.id, food_id=vejce.id, amount=6, serving_id=serving4.id, course_id=0)
                e2 = Entry(id=get_id_and_increment(), day_id=day0.id, food_id=maso.id, amount=125, serving_id=serving0.id, course_id=0)
                e3 = Entry(id=get_id_and_increment(), day_id=day0.id, food_id=chleb.id, amount=300, serving_id=serving0.id, course_id=0)
                e4 = Entry(id=get_id_and_increment(), day_id=day0.id, food_id=vejce.id, amount=6, serving_id=serving4.id, course_id=0)
                e5 = Entry(id=get_id_and_increment(), day_id=day0.id, food_id=maso.id, amount=125, serving_id=serving0.id, course_id=0)
                e6 = Entry(id=get_id_and_increment(), day_id=day0.id, food_id=mouka.id, amount=300, serving_id=serving0.id, course_id=0)
                e7 = Entry(id=get_id_and_increment(), day_id=day0.id, food_id=vejce.id, amount=6, serving_id=serving4.id, course_id=0)
                e8 = Entry(id=get_id_and_increment(), day_id=day0.id, food_id=maso.id, amount=125, serving_id=serving0.id, course_id=0)
                e9 = Entry(id=get_id_and_increment(), day_id=day0.id, food_id=tvaroh.id, amount=300, serving_id=serving0.id, course_id=0)
                e10 = Entry(id=get_id_and_increment(), day_id=day0.id, food_id=ryze.id, amount=400, serving_id=serving0.id, course_id=0)

                session.merge(e0)
                session.merge(e1)
                session.merge(e2)
                session.merge(e3)
                session.merge(e4)
                session.merge(e5)
                session.merge(e6)
                session.merge(e7)
                session.merge(e8)
                session.merge(e9)
                session.merge(e10)
            elif i % 1 == 0:
                e0 = Entry(id=get_id_and_increment(), day_id=day0.id, food_id=mouka.id, amount=300, serving_id=serving0.id, course_id=1)
                e1 = Entry(id=get_id_and_increment(), day_id=day0.id, food_id=vejce.id, amount=6, serving_id=serving4.id, course_id=1)
                e2 = Entry(id=get_id_and_increment(), day_id=day0.id, food_id=maso.id, amount=125, serving_id=serving0.id, course_id=1)
                e3 = Entry(id=get_id_and_increment(), day_id=day0.id, food_id=chleb.id, amount=300, serving_id=serving0.id, course_id=1)
                e4 = Entry(id=get_id_and_increment(), day_id=day0.id, food_id=vejce.id, amount=6, serving_id=serving4.id, course_id=2)
                e5 = Entry(id=get_id_and_increment(), day_id=day0.id, food_id=maso.id, amount=125, serving_id=serving0.id, course_id=3)
                e6 = Entry(id=get_id_and_increment(), day_id=day0.id, food_id=mouka.id, amount=300, serving_id=serving0.id, course_id=3)
                e7 = Entry(id=get_id_and_increment(), day_id=day0.id, food_id=vejce.id, amount=6, serving_id=serving4.id, course_id=3)
                e8 = Entry(id=get_id_and_increment(), day_id=day0.id, food_id=maso.id, amount=125, serving_id=serving0.id, course_id=5)
                e9 = Entry(id=get_id_and_increment(), day_id=day0.id, food_id=tvaroh.id, amount=300, serving_id=serving0.id, course_id=5)
                e10 = Entry(id=get_id_and_increment(), day_id=day0.id, food_id=ryze.id, amount=400, serving_id=serving0.id, course_id=5)

                session.merge(e0)
                session.merge(e1)
                session.merge(e2)
                session.merge(e3)
                session.merge(e4)
                session.merge(e5)
                session.merge(e6)
                session.merge(e7)
                session.merge(e8)
                session.merge(e9)
                session.merge(e10)

            if i % 2 == 0:
                e0 = Entry(id=get_id_and_increment(), day_id=day0.id, food_id=mleko.id, amount=750, serving_id=serving0.id, course_id=4)
                e1 = Entry(id=get_id_and_increment(), day_id=day0.id, food_id=vejce.id, amount=4, serving_id=serving3.id, course_id=5)
                e2 = Entry(id=get_id_and_increment(), day_id=day0.id, food_id=tvaroh.id, amount=2, serving_id=serving5.id, course_id=6)
                e3 = Entry(id=get_id_and_increment(), day_id=day0.id, food_id=ryze.id, amount=1, serving_id=serving6.id, course_id=1)
                e4 = Entry(id=get_id_and_increment(), day_id=day0.id, food_id=chleb.id, amount=250, serving_id=serving0.id, course_id=1)

                session.merge(e0)
                session.merge(e1)
                session.merge(e2)
                session.merge(e3)
                session.merge(e4)

            if i % 3 == 0:
                e0 = Entry(id=get_id_and_increment(), day_id=day0.id, food_id=maso.id, amount=250, serving_id=serving0.id, course_id=1)
                e1 = Entry(id=get_id_and_increment(), day_id=day0.id, food_id=vejce.id, amount=3, serving_id=serving2.id, course_id=2)
                e2 = Entry(id=get_id_and_increment(), day_id=day0.id, food_id=tvaroh.id, amount=3, serving_id=serving5.id, course_id=3)

                session.merge(e0)
                session.merge(e1)
                session.merge(e2)

        session.commit()


def insert_kalori_tabulky():
    engine = create_engine(sqlite, echo=False)
    Base.metadata.create_all(engine)

    with open('../data/kalori_tabulky_result.json') as f:
        dicarr = json.loads(f.read())

    with Session(engine) as session:
        for dic in dicarr:
            food = Food(**{**dic, 'servings': [FoodServing(serving_id=0), FoodServing(serving_id=1)]})
            session.add(food)
        session.commit()


if __name__ == '__main__':
    init()
    insert_kalori_tabulky()