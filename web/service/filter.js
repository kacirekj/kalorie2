import logger from "./logger.js" // Filters can't have "this"

const filters = {
    czechDate(dateStr) {
        logger.log()
        const now = Date.parse(new Date().toISOString().split('T')[0]); // only date
        const date = Date.parse(dateStr);
        const diffDays = Math.floor((now - date) / 86400000);
        if (diffDays === -1) {
            return 'Zítra'
        } else if (diffDays === -2) {
            return 'Pozítří'
        } else if (diffDays <= -3 && diffDays >= -4) {
            return 'Za ' + -diffDays + ' dny'
        } else if (diffDays <= -5) {
            return 'Za ' + -diffDays + ' dní'
        } else if (diffDays === 0) {
            return 'Dnes'
        } else if (diffDays === 1) {
            return 'Včera'
        } else if (diffDays <= 7) {
            return 'Před ' + diffDays + ' dny'
        } else {
            return (new Date(date)).toLocaleDateString("cs")
        }
    },
    truncate(str, length) {
        logger.log()
        if(!str) {
            return 'diven'
        }
        if (str.length < length - 3) {
            return str
        } else {
            return str.substring(0, length).trim() + '...'
        }
    },
    czechAmount(amount) {
        logger.log()
        if (amount < 1) {
            return `${amount} kusu`
        } else if (amount === 1) {
            return `${amount} kus`
        } else if (amount >= 2 && amount <= 4) {
            return `${amount} kusy`
        } else {
            return `${amount} kusů`
        }
    },
    czechCourse(course_id) {
        logger.log()
        if (course_id == 1) {
            return `Snídaně`
        } else if (course_id == 2) {
            return `Svačina`
        } else if (course_id == 3) {
            return `Oběd`
        } else if (course_id == 4) {
            return `2. svačina`
        } else if (course_id == 5) {
            return `Večeře`
        } else if (course_id == 6) {
            return `2. večeře`
        } else {
            return 'Celý den'
        }
    },
    round(num) {
        return Math.round(num )
    },
    roundNutri(num) {
        if(!num) {
            return 0
        }
        const num_r0 = Math.round(num)
        return num_r0;
    },
    formatPercent(num) {
        if(isNaN(num)) { // todo: There should be check in Util methods
            return 0
        }
        return Math.round(num * 100) / 1
    }
}
export default filters