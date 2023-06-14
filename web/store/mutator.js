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
    upsertFoods(foods, noOverride) {
        this.$logger.log(foods)
        return foods.map(food => this.upsertFood(food, noOverride))
    },
    upsertFood(food, noOverride) {
        this.$logger.log(food)
        const existingFood = this.$store.foods.find(f => f.id === food.id)

        if(existingFood && noOverride) {
            return existingFood
        }

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
    upsertEntry(entries, entry) {
        this.$logger.log(entries, entry)
        const existingEntry = entries.find(e => e.id === entry.id)
        if (existingEntry && entry.id) {
            Object.assign(existingEntry, entry) // it's not called
        } else {
            entries.push(entry)
        }
    },
    deleteEntry(entries, entry) {
        this.$logger.log(entries, entry)
        this.$util.arrayRemoveIf(entries, e => e.id === entry.id)
    },
    getFoodByNameContaining(str) {
        this.$logger.log(str)
        return this.$store.foods.filter(food => food.name.toLowerCase().startsWith(str.toLowerCase()))
    },
    addServing(foodDish) {
        const name = foodDish.newServing.name
        foodDish.newServing.name = name ? name : 'Bez názvu'
        foodDish.servings.push({
            food_id: foodDish.id,
            serving: {...foodDish.newServing}
        })
        foodDish.newServing = {name: '', grams: 100}
    },
    removeServing(serving) {
        serving.inactive = true;
    },
}
export default new Vue({methods})
