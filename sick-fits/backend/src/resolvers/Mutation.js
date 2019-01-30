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
    }
};

module.exports = Mutations;
