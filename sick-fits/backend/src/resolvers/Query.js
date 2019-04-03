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
    },
    async order(parent, args, ctx, info){
        // are they logged in?
        if(!ctx.request.userId){
            throw new Error("You need to be logged in to view orders");
        }

        // do they have permission to view this order? 
        const order = await ctx.db.query.order({where: {id: args.id}}, info);
        const ownsOrder = order.user.id === ctx.request.userId;
        const hasPermission = ctx.request.user.permissions.includes("ADMIN");
        if(!ownsOrder || !hasPermission){
            throw new Error("You do not have permission to view this order");
        }

        return order;
    },
    async orders(parent, args, ctx, info){
        // are they logged in?
        const {userId}  = ctx.request; 
    
        if(!userId){
            throw new Error("You need to be logged in to view orders");
        }

        const orders = await ctx.db.query.orders({
            where: {
                user: {
                    id: userId
                }
            }
        }, info);
        
        return orders;
    },
    async goals(parent, args, ctx, info){
        const {userId} = ctx.request;
        if(!userId){
            throw new Error("You need to be logged in to view your goals!");
        }

        const goals = await ctx.db.query.goals({
            where: {
                user: {
                    id: userId
                }
            }
        }, info);

        return goals; 
    },
    async goal(parent, args, ctx, info) {
        const {userId} = ctx.request;
        if(!userId){
            throw new Error("You need to be logged in to view your goals!");
        }

        const goal = await ctx.db.query.goal({where: {id: args.id}}, info);

        return goal;
    }
};

module.exports = Query;
