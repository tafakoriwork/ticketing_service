const controller = require("../controllers/subjectController")
module.exports = (router) => {
    router
        .post('/subject/create', controller.create)
        .get('/subject/list', controller.list)
}
