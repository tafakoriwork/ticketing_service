const controller = require("../controllers/subjectController")
module.exports = (router) => {
    router
        .post('/subject/create', controller.create)
        .get('/subject/:user_id', controller.list)
}
