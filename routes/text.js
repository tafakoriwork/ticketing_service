const controller = require("../controllers/textController")
module.exports = router => {
    router
        .post("/text", controller.create)
        .get("/text", controller.list)
        .get("/text/:text_id", controller.get)
        .delete("/text/:text_id", controller.remove)
        .put("/text/:text_id", controller.update)
}