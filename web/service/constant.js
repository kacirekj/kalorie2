import util from "./util.js";

const constants = {
    SEARCH_T_MIN_LEN: 3,
    FOOD_NAME_TRUNCATE: 50,
    FOOD_NAME_PADDING: null,
}

constants.FOOD_NAME_PADDING = Math.round(constants.FOOD_NAME_TRUNCATE / 2.5)
constants.REDIRECT_URI = `${util.getCurrentBrowserUrl()}` + '/login'
constants.SEZNAM_URL = `https://login.szn.cz/api/v1/oauth/auth?` +
    `client_id=d3759562806afe6d5e43b6e2508a49e11abfe112822fedb3&` +
    `scope=identity&` +
    `response_type=code&` +
    `redirect_uri=${constants.REDIRECT_URI}`

export default constants;
