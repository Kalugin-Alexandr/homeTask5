"use strict";

const router = require("koa-router")();


router.get('/users', async (ctx, next) => {
   ctx.body = '/users';
});

module.exports = {
    routes: router.routes,
    allowedMethods: router.allowedMethods
};
