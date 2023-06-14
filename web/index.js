/**
 *  Import
 */

// Components
import course from "./component/course.js"
import day from "./component/day.js"
import dish from "./component/dish.js";
import entry from "./component/entry.js"
import food from './component/food.js'
import foodSearch from "./component/foodSearch.js"
import ingredient from "./component/ingredient.js"
import modal from './component/modal.js'
import searchbox from "./component/searchbox.js";

// Services
import connector from "./service/connector.js";
import constant from "./service/constant.js";
import filter from "./service/filter.js";
import logger from './service/logger.js'
import model from './service/model.js'
import util from './service/util.js'

// Store
import action from './store/action.js'
import getter from "./store/getter.js";
import mutator from "./store/mutator.js";
import store from './store/store.js'

// Views
import appView from './view/appView.js'
import dayView from './view/dayView.js'
import dishView from './view/dishView.js'
import foodView from './view/foodView.js'
import foodDetailView from './view/foodDetailView.js'
import homeView from "./view/homeView.js";
import loginView from "./view/loginView.js";
import toolsView from "./view/toolsView.js";


/**
 *  Bind
 */

// Components
Vue.component('course', course)
Vue.component('day', day)
Vue.component('dish', dish)
Vue.component('entry', entry)
Vue.component('food', food)
Vue.component('foodsearch', foodSearch)
Vue.component('ingredient', ingredient)
Vue.component('modal', modal)
Vue.component('searchbox', searchbox)

// Services
Vue.prototype.$connector = connector
Vue.prototype.$constant = constant
Vue.prototype.$filter = filter
Vue.prototype.$logger = logger
Vue.prototype.$model = model
Vue.prototype.$util = util

// Store
Vue.prototype.$action = action
Vue.prototype.$getter = getter
Vue.prototype.$mutator = mutator
Vue.prototype.$store = store

// Views
Vue.component('appView', appView)
const routes = [
    {path: '/', component: homeView},
    {path: '/days', component: dayView},
    {path: '/dishes', component: dishView},
    {path: '/dishes/:id', component: foodDetailView},
    {path: '/foods', component: foodView},
    {path: '/foods/:id', component: foodDetailView},
    {path: '/tools', component: toolsView},
    {path: '/login', component: loginView},
]

// Global mixin
Vue.mixin({
    filters: filter,
})

// Create app
const App = {
    el: '#vueApp',
    router: new VueRouter({mode: 'history', routes: routes}),
}

window.addEventListener('load', () => {
    new Vue(App);
})
