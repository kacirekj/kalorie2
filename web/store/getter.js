const methods = {
    getFood(id) {
        this.$logger.log(id)
        this.$action.fetchFoodWhereId(id)
        return this.$store.foodsById[id]
    },
    searchFoods(searchTerm, useUsedFoodsOnly, omitInactiveFoods = true) {
        this.$logger.log(searchTerm)

        let result
        if (searchTerm.length < this.$constant.SEARCH_T_MIN_LEN || useUsedFoodsOnly) {
            result = this.getFoodsWhereNameNrmContains(searchTerm, true)
        } else {
            this.$action.fetchFoodsWhereNameNrmContainsToStore(searchTerm) // Async! This method shall be used only in Computed!
            result = this.getFoodsWhereNameNrmContains(searchTerm, false)
        }

        return result
            .sort((a, b) => a.name.localeCompare(b.name))
            .filter(f => omitInactiveFoods ? f.inactive !== true : true);
    },
    getFoodsWhereNameNrmContains(searchTerm, useUsedFoodsOnly) {
        this.$logger.log(searchTerm, useUsedFoodsOnly)

        let collectionToLook = []
        if (useUsedFoodsOnly) {
            collectionToLook = this.$store.usedFoods;
        } else {
            collectionToLook = this.$store.foods
        }

        const storedFoodsResult = collectionToLook
            .filter(f => this.$util.isFoodNameNrmMatching(f.name_nrm, searchTerm) || f.id == searchTerm)
            .sort((a, b) => (a.name).localeCompare((b.name)))

        return storedFoodsResult;
    },
}
export default new Vue({methods})