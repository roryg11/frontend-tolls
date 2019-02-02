const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Mutations = {
   async createItem(parent, args, ctx, info){
       // TODO check if they are logged in
       const item = await ctx.db.mutation.createItem({
           data: {
               ...args
           }
       }, info);
       // info makes sure that item is returned to us, gives the queyr to the backend
       console.log(item);
       return item; 
    },
    updateItem(parent, args, ctx, info){
        const updates = {...args};
        // don't want to update the id property, so you remove it
        delete updates.id;

        return ctx.db.mutation.updateItem(
            {
                data: updates, 
                where:{
                    id: args.id
                }
            }, 
            info
        )
    },
    async deleteItem (parent, args,ctx, info){
        const where = {id: args.id}
        // find item
        const item = await ctx.db.query.item({where}, `{id title}`);
        // check if they have permission for that item
        // TODO
        return ctx.db.mutation.deleteItem({where}, info);
        // delete item
    },
    async signup(parent, args, ctx ,info) {
        // create the user
        args.email = args.email.toLowerCase();
        // hash password
        const password = await bcrypt.hash(args.password, 10);

        // create user
        const user = await ctx.db.mutation.createUser(
            {
                data: {
                    ...args,
                    password,
                    permissions: { set: ['USER']},
                }
        }, info);

        //create a sign-in JWT token
        const token = jwt.sign({userId: user.id}, process.env.APP_SECRET);
        // set the token as the cookie on the response;
        ctx.response.cookie('token', token, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 365,
        });
        // now we return the user
        return user; 
    }
};

module.exports = Mutations;
