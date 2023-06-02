const methods = {

    // Foods

    async getFoods(ids, name_nrm_contains) {
        this.$logger.log(ids, name_nrm_contains)
        const response = await this.call({
            method: 'GET',
            url: '/api/foods',
            params: {
                ids: [...new Set(ids)],
                name_nrm_contains: name_nrm_contains ? name_nrm_contains.split(' ') : null,
            }
        })
        return response.data
    },
    async upsertFoods(foods) {
        this.$logger.log(foods)
        const response = await this.call({
            method: 'POST',
            url: '/api/foods',
            data: foods
        })
        return response.data
    },
    async deleteFoods(food) {
        this.$logger.log(food)
        const response = await this.call({
            method: 'DELETE',
            url: `/api/foods/${food.id}`
        })
        return response.data
    },


    // Days

    async getDays() {
        this.$logger.log()
        let response = await this.call({
            method: 'GET',
            url: '/api/days'
        })
        return response.data
    },
    async upsertDays(days) {
        const result = await this.call({
            method: 'POST',
            url: '/api/days',
            data: days
        })
        return result.data
    },
    async deleteDay(day) {
        const result = await this.call({
            method: 'DELETE',
            url: '/api/days/' + day.id
        })
        return result.data
    },


    // Dishes

    async getDishes() {
        this.$logger.log()
        const response = await this.call({
            method: 'GET',
            url: '/api/dishes',
            params: {
            }
        })
        return response.data
    },


    // Auth

    async login(code, redirect_uri) {
        this.$logger.log(code, redirect_uri)
        const result = await this.call({
            method: 'GET',
            url: '/api/login?code=' + code + '&redirect_uri=' + redirect_uri
        })
        return result.data
    },
    async call(params) {
        const auth = this.$util.getToken() ? 'Bearer ' + this.$util.getToken() : null
        return axios({
            ...params,
            headers: {
                'Authorization': auth,
                'Session-Id': this.$util.getSessionId(),
            }
        })
    }
}
export default new Vue({methods: methods})
