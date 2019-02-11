// if you don't need any middleware and you want to go directly to the db, you can do this
const { forwardTo } = require("prisma-binding");
const { hasPermission } = require("../utils");

const Query = {
    items: forwardTo('db'),
    item: forwardTo('db'),
    itemsConnection: forwardTo('db'),
    async me(parent, args, ctx, info) { 
        if(!ctx.request.userId){
            return null;
        }
        return ctx.db.query.user({where: {id: ctx.request.userId}}, info);
    },
    async users (parent, args, ctx, info){
        // 1 check if logged in
        if(!ctx.request.userId){
            throw new Error("You have to be logged in to do this");
        }
        // 2 check if they have permissions to update
        hasPermission(ctx.request.user, ["ADMIN", "PERMISSIONUPDATE"]);
        // 3 fetch all users
       const users = await ctx.db.query.users({}, info);
       return users;
    }
    // async items(parent, args, ctx, info){
    //     console.log("Getting Items");
    //     const items = await ctx.db.query.items();
    //     return items
    // }
};

module.exports = Query;
