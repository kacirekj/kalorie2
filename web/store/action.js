const methods = {
    async upsertEntry(day, newEntry) {
        this.$logger.log()
        day.entries.push(newEntry)
        const freshDay = await this.$connector.upsertDays([day])
        this.$mutator.upsertDay(freshDay)
    },
    async upsertFood(food) {
        this.$logger.log()
        const freshFoods = await this.$connector.upsertFoods([food])
        this.$mutator.upsertFoods(freshFoods)
        return freshFoods
    },
    async upsertDay(day) {
        this.$logger.log(day)
        const freshDay = await this.$connector.upsertDays([day])
        return this.$mutator.upsertDay(freshDay[0])
    },
    async deleteDay(day) {
        this.$logger.log()
        const nothing = await this.$connector.deleteDay(day)
        this.$mutator.deleteDay(day)
    },
    async refreshDay(day) {
        this.$logger.log()
        const days = await this.$connector.getDays()
        const freshDay = days.find(d => d.id === day.id)
        this.$mutator.upsertDay(freshDay)
        return freshDay;
    },
    async refreshFood(food) {
        this.$logger.log()
        const freshFood = await this.$connector.getFoods([food.id], null)
        this.$mutator.upsertFood(freshFood[0])
        return freshFood;
    },
    async fetchDaysToStore() {
        this.$logger.log()
        const days = await this.$connector.getDays()
        const foodIds = days.flatMap(d => d.entries).map(e => e.food_id)
        await this.fetchFoodWhereIds(foodIds)
        this.$mutator.upsertDays(days)
    },
    async fetchFoods(searchTerm, type, noOverride = false) {
        this.$logger.log(searchTerm)

        searchTerm = searchTerm.toLowerCase()

        // If alraedy searched for "Mouk", then we already have fetched results also for "Mouka", "Mouka polohru", etc.
        // so we don't have call API again
        const isTermAlreadySearched = this.$store.alreadySearchedTerms.find(term => searchTerm.startsWith(term))
        if (isTermAlreadySearched) {
            return
        }

        const foundFoods = await this.$connector.getFoods(null, searchTerm, type)
        this.$mutator.upsertFoods(foundFoods, noOverride)
        this.$store.alreadySearchedTerms.push(searchTerm)
    },
    async fetchFoodWhereIds(ids, noOverride) {
        this.$logger.log(ids)
        const nonloadedIds = ids.filter(id => !this.$store.foodsById[id])
        const foundFoods = await this.$connector.getFoods(nonloadedIds, null)
        const nonloadedIngredientFoodIds = foundFoods.flatMap(f => f.ingredients)
            .filter(i => !nonloadedIds.includes(i.food_id))
            .map(i => i.food_id)
        if(nonloadedIngredientFoodIds.length > 0) {
            await this.fetchFoodWhereIds(nonloadedIngredientFoodIds)
        }
        this.$mutator.upsertFoods(foundFoods, noOverride)
    },
}
export default new Vue({methods})