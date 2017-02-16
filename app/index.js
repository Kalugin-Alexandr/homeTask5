"use strict";

const Koa = require("koa");
const app = new Koa();
const Router = require("koa-router");
const bodyParser = require('koa-bodyparser');
const router = new Router();
const usersModel = require('./models/users');
const serve = require("koa-static");
const config = require("config");


/**
 * @example curl -v -X GET "http://127.0.0.1:3000/users"
 */
router.get("/users", async(ctx, next) => {
    ctx.body = await usersModel.getAll();
});

/**
 * @example curl -v -X GET "http://127.0.0.1:3000/users/1"
 */
router.get("/users/:id", async(ctx, next) => {
    ctx.body = await usersModel.getById(ctx.params.id);
});

/**
 * @example curl -v -X POST "http://127.0.0.1:3000/users" -d '{"name": "Vasya"}' -H "Content-Type: application/json"
 */
router.post('/users', bodyParser(), async(ctx, next) => {
    let userId = await usersModel.add(ctx.request.body);
    if (typeof userId === 'number') {
        ctx.status = 201;
        ctx.body = {"id": userId};
    } else {
        ctx.status = 400;
    }
});

/**
 * @example curl -v -X PUT "http://127.0.0.1:3000/users/1" -d '{"name":"Petya"}' -H "Content-Type: application/json"
 */
router.put('/users/:id', bodyParser(), async(ctx, next) => {
    try {
        await usersModel.update(ctx.params.id, ctx.request.body);
        ctx.status = 200;
    } catch (e) {
        ctx.status = 400;
    }
});

/**
 * @example curl -v -X DELETE "http://127.0.0.1:3000/users/1"
 */
router.del("/users/:id", async(ctx, next) => {
    try {
        await usersModel.remove(ctx.params.id)
        ctx.status = 204;
    } catch (e) {
        ctx.status = 400
    }
});


app.use(async(ctx, next) => {
    try {
        await next();
    } catch (e) {
        ctx.body = JSON.stringify({message: e.message});
        ctx.status = 500;
    }
});
app.use(require("koa-convert")(serve('./app/public')));
app.use(router.routes());
app.use(router.allowedMethods());

app.listen(config.server.port);

