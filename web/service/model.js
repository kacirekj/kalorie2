const methods = {
    getEntriesMacronutrientPercent(entries) {
        const calories = this.getEntriesNutrient(entries, 'calories')
        const proteins = this.getEntriesNutrient(entries, 'proteins')
        const carbs = this.getEntriesNutrient(entries, 'carbs')
        const fats = this.getEntriesNutrient(entries, 'fats')
        const proteinsRatio = proteins * 4 / calories
        const carbsRatio = carbs * 4 / calories
        const fatsRatio = fats * 4 / calories
        const total = proteinsRatio + carbsRatio + fatsRatio
        const resultPercentage = {
            proteins: proteinsRatio / total,
            carbs: carbsRatio / total,
            fats: fatsRatio / total,
        }
        return resultPercentage
    },
    getEntriesNutrient(entries, nutrientAttributeName) {
        return entries.map(entry => this.getEntryNutrient(entry, nutrientAttributeName))
            .reduce((d, i) => d + i, 0);
    },
    getEntryNutrient(entry, nutrientAttributeName) {
        const food = this.$store.foodsById[entry.food_id]
        const serving = this.$store.servingsById[entry.serving_id]
        const nutrient = food[nutrientAttributeName]
        return Math.round(entry.amount * serving.grams / 100 * nutrient)
    },
    getDateAsString(datetime) {
        return datetime.toISOString().split('T')[0];
    },
    isFoodNameNrmMatching(food_name_nrm, searchTerm) {
        const terms = searchTerm.toLowerCase().split(' ')
        return terms.every(t => food_name_nrm.includes(t))
    },
}
export default new Vue({methods})
