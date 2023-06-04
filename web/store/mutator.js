const methods = {
    upsertDays(days) {
        this.$logger.log(days)
        days.forEach(day => this.upsertDay(day))
    },
    upsertDay(day) {
        this.$logger.log(day)
        const existingDay = this.$store.days.find(d => d.id === day.id)

        let result = null
        if (existingDay) {
            Object.assign(existingDay, day)
            result = existingDay
        } else {
            const decoratedDay = {
                ...day,
                isEdit: false,
                isEditDay: false,
                searchTerm: '',
            }
            this.$store.days.push(decoratedDay)
            result = decoratedDay
        }
        return result;
    },
    deleteDay(day) {
        this.$logger.log(day)
        this.$store.days = this.$store.days.filter(d => d.id !== day.id)
    },
    upsertFoods(foods) {
        this.$logger.log(foods)
        return foods.map(food => this.upsertFood(food))
    },
    upsertFood(food) {
        this.$logger.log(food)
        const existingFood = this.$store.foods.find(f => f.id === food.id)
        if (existingFood) {
            Object.assign(existingFood, food)
            return existingFood;
        } else {
            const decoratedFood = {
                ...food,
                isEdit: false,
                selectedServing: food.servings.map(s => s.serving).find(s => s.grams === 100),
                newServing: {name: '', grams: 100}
            }
            this.$store.foods.push(decoratedFood)
            return decoratedFood;
        }
    },
    upsertEntry(day, entry) {
        this.$logger.log(day, entry)
        const existingEntry = day.entries.find(e => e.id === entry.id)
        if (existingEntry && entry.id) {
            Object.assign(day.entries, entry)
        } else {
            day.entries.push(entry)
        }
    },
    deleteEntry(day, entry) {
        this.$logger.log(day, entry)
        day.entries = day.entries.filter(e => e !== entry)
    },
    getFoodByNameContaining(str) {
        this.$logger.log(str)
        return this.$store.foods.filter(food => food.name.toLowerCase().startsWith(str.toLowerCase()))
    },
    upsertDishes(dishes) {
        this.$logger.log(dishes)
        return dishes.map(dish => this.upsertDish(dish))
    },
    upsertDish(dish) {
        this.$logger.log(dish)
        const existingDish = this.$store.dishes.find(d => d.id === dish.id)
        if (existingDish) {
            Object.assign(existingDish, dish)
            return existingDish;
        } else {
            const decoratedDish = {
                ...dish, // todo
                isEdit: false,
            }
            this.$store.dishes.push(decoratedDish);
            return decoratedDish;
        }
    },
}
export default new Vue({methods})
