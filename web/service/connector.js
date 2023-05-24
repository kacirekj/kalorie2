const methods = {
    async getFoods(ids, name_nrm_contains) {
        console.log(ids, name_nrm_contains)
        this.$logger.log(ids, name_nrm_contains)
        const params = {
            params: {
                ids: ids,
                name_nrm_contains: name_nrm_contains ? name_nrm_contains.split(' ') : null,
            }
        }
        const response = await axios.get('/api/foods', params)
        return response.data
    },
    async upsertFoods(foods) {
        this.$logger.log(foods)
        const response = await axios.post('/api/foods', foods)
        return response.data
    },
    async deleteFoods(food) {
        this.$logger.log(food)
        const response = await axios.delete(`/api/foods/${food.id}`)
        return response.data
    },
    async getDays() {
        this.$logger.log()
        let response = await axios.get('/api/days')
        return response.data
    },
    async upsertDays(days) {
        const result = await axios.post('/api/days', days)
        return result.data
    },
    async deleteDay(day) {
        const result = await axios.delete('/api/days/' + day.id)
        return result.data
    },
    async login(code, redirect_uri) {
        this.$logger.log(code, redirect_uri)
        const url = '/api/login?code=' + code + '&redirect_uri=' + redirect_uri
        const result = await axios.get(url)
        return result.data
    },
}
export default new Vue({methods: methods})
