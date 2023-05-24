const methods = {
    mapDayToCalories(day) {
        this.$logger.log()
        return day.entries
            .map(entry => this.mapEntryToCalories(entry))
            .reduce((d, i) => d + i, 0);
    },
    mapDayToProteins(day) {
        return day.entries
            .map(entry => this.mapEntryToProteins(entry))
            .reduce((d, i) => d + i, 0);
    },
    mapDayToCarbs(day) {
        return day.entries
            .map(entry => this.mapEntryToCarbs(entry))
            .reduce((d, i) => d + i, 0);
    },
    mapDayToFats(day) {
        return day.entries
            .map(entry => this.mapEntryToFats(entry))
            .reduce((d, i) => d + i, 0);
    },
    mapDayToFatsPercent(day) {
        return this.mapDayToFats(day) * 9 / this.mapDayToCalories(day)
    },
    mapDayToProteinsPercent(day) {
        return this.mapDayToProteins(day) * 4 / this.mapDayToCalories(day)
    },
    mapDayToCarbsPercent(day) {
        return this.mapDayToCarbs(day) * 4 / this.mapDayToCalories(day)
    },
    mapEntryToCalories(entry, food, serving) {
        if (!food) {
            food = this.$store.foodsById[entry.food_id]
        }
        if (!serving) {
            serving = this.$store.servingsById[entry.serving_id]
        }
        this.$logger.log()
        return Math.round(entry.amount * serving.grams / 100 * food.calories);
    },
    mapEntryToProteins(entry, food, serving) {
        if (!food) {
            food = this.$store.foodsById[entry.food_id]
        }
        if (!serving) {
            serving = this.$store.servingsById[entry.serving_id]
        }
        return Math.round(entry.amount * serving.grams / 100 * food.proteins);
    },
    mapEntryToCarbs(entry, food, serving) {
        if (!food) {
            food = this.$store.foodsById[entry.food_id]
        }
        if (!serving) {
            serving = this.$store.servingsById[entry.serving_id]
        }
        return Math.round(entry.amount * serving.grams / 100 * food.carbs);
    },
    mapEntryToFats(entry, food, serving) {
        if (!food) {
            food = this.$store.foodsById[entry.food_id]
        }
        if (!serving) {
            serving = this.$store.servingsById[entry.serving_id]
        }
        return Math.round(entry.amount * serving.grams / 100 * food.fats);
    },
    mapFoodToCalories(food) {
        return Math.round(food.proteins * 4 + food.carbs * 4 + food.fats * 9);
    },
    getDateAsString(datetime) {
        return datetime.toISOString().split('T')[0];
    },
    isFoodNameNrmMatching(food_name_nrm, searchTerm) {
        const terms = searchTerm.toLowerCase().split(' ')
        return terms.every(t => food_name_nrm.includes(t))
    },
    getCurrentBrowserUrl() {
        let url = window.location.origin
        return url;
    },
    openPopupWindowCenter(url, title, w, h) {
        // Fixes dual-screen position                            Most browsers       Firefox
        const dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : window.screenX;
        const dualScreenTop = window.screenTop !== undefined ? window.screenTop : window.screenY;

        const width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
        const height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

        const systemZoom = width / window.screen.availWidth;
        const left = (width - w) / 2 / systemZoom + dualScreenLeft
        const top = (height - h) / 2 / systemZoom + dualScreenTop
        const newWindow = window.open(url, title, `
            scrollbars=yes,
            width=${w / systemZoom}, 
            height=${h / systemZoom}, 
            top=${top}, 
            left=${left}
            `
        )

        if (window.focus) newWindow.focus();

        return newWindow;
    },
    parseJwt(token) {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    }

}
export default new Vue({methods})
