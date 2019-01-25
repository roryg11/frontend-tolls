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
    }
};

module.exports = Mutations;
