// if you don't need any middleware and you want to go directly to the db, you can do this
const { forwardTo } = require("prisma-binding");

const Query = {
    items: forwardTo('db'),
    // async items(parent, args, ctx, info){
    //     console.log("Getting Items");
    //     const items = await ctx.db.query.items();
    //     return items
    // }
};

module.exports = Query;
