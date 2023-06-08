const Koa = require("koa")
const json = require("koa-json")
const bodyParser = require("koa-bodyparser")
const Router = require("koa-router")
const Mongoose = require("mongoose")
const AutoIncrement = require("mongoose-auto-increment")
const Swagger = require('./middlewares/swagger');
const Routes = require("./routes")
const { koaSwagger } = require("koa2-swagger-ui")
const {parsed} = require('dotenv').config();
const mongooseOptions = {
   // useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
};

Mongoose.connect('mongodb://127.0.0.1:27017/koa', mongooseOptions);
AutoIncrement.initialize(Mongoose.connection)

const app = new Koa();
const router = new Router();
Routes(router);

// Options to generate the swagger documentation
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Ticketing Service',
            version: '1.0.0',
            description: 'Api for ticketing',
        },
    },
    /** 
     * Paths to the API docs. The library will fetch comments marked 
     * by a @swagger tag to create the swagger.json document
     */
    apis: [
        './controllers/subjectController.js',
        './controllers/textController.js',
    ],
    // where to publish the document
    path: '/swagger.json',
}
const swagger = Swagger(swaggerOptions);
const swaggerUi = koaSwagger({
    routePrefix: '/doc',
    swaggerOptions: {
        url: swaggerOptions.path,
    }
});
app
    .use(json())
    .use(swagger)
    .use(swaggerUi)
    .use(bodyParser())
    .use(router.routes())
    .use(router.allowedMethods())
    .listen(parsed.PORT);