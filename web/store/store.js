const data = {
    alreadySearchedTerms: [],
    foods: [],
    days: [],
    searchTermFood: '',
    courses: {
        0: 'Celý den',
        1: 'Snídaně',
        2: 'Dopolední svačina',
        3: 'Oběd',
        4: 'Odpolední svačina',
        5: 'Večeře',
        6: 'Večeře 2'
    }
}
const computed = {
    foodIds() {
        return data.foods.map(f => f.id)
    },
    foodsById() {
        const res = {}
        data.foods.forEach(f => res[f.id] = f)
        return res
    },
    dishesById() {
        const res = {}
        data.dishes.forEach(d => res[d.id] = d)
        return res
    },
    servingsById() {
        const res = {}
        const servings = data.foods.flatMap(f => f.servings).map(s => s.serving)
        servings.forEach(s => res[s.id] = s)
        return res
    },
    usedFoods() {
        let food_ids = this.$store.days.flatMap(d => d.entries).map(e => e.food_id)
        food_ids = [...new Set(food_ids)]
        return data.foods.filter(f => food_ids.includes(f.id))
    },
}

const dateClone = JSON.parse(JSON.stringify(data))
const methods = {
    reset() {
        data.alreadySearchedTerms = []
        data.foods = []
        data.days = []
        data.searchTermFood = ''
    }
}
export default new Vue({
    data() {
        return data
    },
    computed,
    methods
})