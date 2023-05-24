const methods = {
    getFood(id) {
        this.$logger.log(id)
        this.$action.fetchFoodWhereId(id)
        return this.$store.foodsById[id]
    },
    searchFoods(searchTerm, useUsedFoodsOnly) {
        this.$logger.log(searchTerm)

        if(searchTerm.length < this.$constant.SEARCH_T_MIN_LEN || useUsedFoodsOnly) {
            return this.getFoodsWhereNameNrmContains(searchTerm, true)
                .sort((a, b) => a.name.localeCompare(b.name));
        }

        this.$action.fetchFoodsWhereNameNrmContainsToStore(searchTerm)
        return this.getFoodsWhereNameNrmContains(searchTerm, false)
            .sort((a, b) => a.name.localeCompare(b.name));
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