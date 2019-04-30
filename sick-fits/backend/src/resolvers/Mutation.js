const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const { randomBytes } = require('crypto');
const { transport, makeANiceEmail }  = require('../mail');
const {hasPermission} = require("../utils");
const stripe = require("../stripe");

const Mutations = {
   async createItem(parent, args, ctx, info){
       // TODO check if they are logged in
       if(!ctx.request.userId){
           throw new Error("User is not logged in");
       }
       const item = await ctx.db.mutation.createItem({
           data: {
               user: {
                   connect: {
                       id: ctx.request.userId
                   }
               },
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
        const item = await ctx.db.query.item({where}, `{id title user {id}}`);
        // check if they have permission for that item
        const ownsItem = item.user.id === ctx.request.userId;
        const hasPermission = ctx.request.user.permissions.some(permission => ["ADMIN", "DELETEITEM"].includes(permission));
    
        if(!ownsItem && !hasPermission){
          throw new Error("You don't have permission to do that");
        }
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
    },
    async signin(parent, {email, password}, ctx, info){
        // check that there's a user with that email
        const user = await ctx.db.query.user({where: {email}});
        if(!user){
            throw new Error("No user matching that password");
        }
        // check that the password is valid
        const passwordMatch = await bcrypt.compare(password, user.password);
        if(!passwordMatch){
            throw new Error("There is no account matching that email password combination");
        }

       //create a sign-in JWT token
       const token = jwt.sign({userId: user.id}, process.env.APP_SECRET);
       // set the token as the cookie on the response;
       ctx.response.cookie('token', token, {
           httpOnly: true,
           maxAge: 1000 * 60 * 60 * 24 * 365,
       });

       return user; 
        // return user
    },
    signout(parent, args, ctx, info){
        ctx.response.clearCookie('token');
        return {message: "Successfull signed out"};
    },
    async requestReset(parent, args, ctx, info){
        // 1. check to see if user is real
        const user = ctx.db.query.user({where: {email: args.email}});
        if(!user){
            throw new Error("There is no account associated with that email");
        }
        // 2. set resetToken on user
        const randomPromise = await promisify(randomBytes)(20);
        const resetToken = randomPromise.toString('hex');
        const resetTokenExpiry = Date.now() + 3600000; // basically one hour
        const res = await ctx.db.mutation.updateUser({
            where: {email: args.email},
            data: { resetToken, resetTokenExpiry }
        });
        console.log(res);
        // 3. Send the email!!
        const mailRes = await transport.sendMail({
            from: "rory@gmail.com",
            to: args.email,
            subject: "Your Password Reset",
            html: makeANiceEmail(`Your Password is Reset is here! \n\n
            <a href="${process.env.FRONTEND_URL}/reset?resetToken=${resetToken}">Click Here to Reset</a>`)
        });

        return {message: "Email has been sent"}; 
    },
    async resetPassword(parent, args, ctx, info){
        // 1. check if passwords match
        if(args.password !== args.passwordConfirmation){
            throw new Error("Passwords do not match");
        }
        // 2. check if it's a legit token
        const [user] = await ctx.db.query.users({where: 
            {
                resetToken: args.resetToken,
                resetTokenExpiry_gte: Date.now() - 3600000
            }
        });

        if(!user){
            throw new Error("This is an invalid or expired reset token");
        }

        // 4. Hash new passowrd
        const password = await bcrypt.hash(args.password, 10);
        // 5. save new password and remove the resetToken fields
        const updatedUser = await ctx.db.mutation.updateUser({
            where: {email: user.email},
            data: {
                password,
                resetToken: null,
                resetTokenExpiry: null
            }
        })
        // 6. generate JWT
        const token = jwt.sign({userId: updatedUser.id}, process.env.APP_SECRET);
        // 7. set the JWT cookie
        ctx.response.cookie('token', token, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 365,
        });

        // 8. return new user
        return updatedUser; 
    },
    async updatePermissions(parent, args, ctx, info){
        // 1. CHeck that there's a userId
        if(!ctx.request.userId){
            throw new Error("You need to be logged in to do this");
        }

        if(!ctx.request.user){
            throw new Error("You need to be logged in to do this");
        }

        hasPermission(ctx.request.user, ["ADMIN", "PERMISSIONUPDATE"]);

        const updatedUser = await ctx.db.mutation.updateUser({
            data: {
                permissions: {
                    set: args.permissions
                }
            },
            where: {
                id: args.userId
            }
        }, info); 

        return updatedUser; 
    },
    async addToCart(parent, args, ctx, info){
        // check that they are logged in
        const {userId} = ctx.request; 
        if(!userId){
            throw new Error("You need to be logged in to do this");
        }

        const [existingCartItem] = await ctx.db.query.cartItems({
            where: {
                user: { id: userId},
                item: {id: args.id}
            }
        }, info);
        // check if cartItem already exists
        if(existingCartItem){
            const updatedCartItem = await ctx.db.mutation.updateCartItem({
                where: {id: existingCartItem.id},
                data: { quantity: existingCartItem.quantity + 1}
            }, info);
            return updatedCartItem;
        } else {
            const newCartItem = await ctx.db.mutation.createCartItem({
                data: {
                    item: {
                        connect: { id: args.id }
                    },
                    user: {
                        connect: { id: userId }
                    } 
                }
            }, info);
            return newCartItem; 
        }
    },
    async removeFromCart(parent, args, ctx, info){
        // find cart item
        const cartItem = await ctx.db.query.cartItem({
            where: {
                id: args.id
            }
        }, `{ id, user {id} }`);
        if(!cartItem){
            throw new Error("This item is no longer available!");
        }

        // check that user owns cart item
        const userOwnsItem = cartItem.user.id === ctx.request.userId; 
        
        if(!userOwnsItem) {
            throw new Error("You do not have permission to do this");
        }

        return await ctx.db.mutation.deleteCartItem({
            where: {
                id: args.id
            }
        }, info);
    },
    async createOrder(parent, args, ctx, info){
        // check that user is logged in
        const { userId } = ctx.request;
        if(!userId){
            throw new Error("You must be logged in to complete this transaction");
        }

        const user = await ctx.db.query.user({where: {id: userId}}, `
        {   id
            name
            email
            cart {
                id
                quantity
                item { 
                    title 
                    price 
                    id 
                    description 
                    image
                    largeImage
                    user {
                        id
                    }
                }
            }
        }
        `)

        // recalculate the price to prevent people from altering the JS and deciding 
        // their own price
        const amount = user.cart.reduce((tally, cartItem)=>{
            return tally + (cartItem.quantity * cartItem.item.price);
        }, 0);

        console.log(amount);

        // create stripe charge
        const charge = await stripe.charges.create({
            amount, 
            source: args.token,
            currency: "usd",
        });

       // convert cartItems to order Items
        const orderItems = await user.cart.map((cartItem) =>{
            const orderItem =  {
                    ...cartItem.item, 
                    quantity: cartItem.quantity,
                    user: {
                        connect: {
                            id: cartItem.item.user.id
                        }
                    } 
                }

                delete orderItem.id;
                return orderItem;
        });

        const order = await ctx.db.mutation.createOrder({
            data: {
                orderItems: { create: orderItems },
                total: charge.amount,
                user: { connect: { id: userId } },
                charge: charge.id
            }
        });

        const cartItemIds = user.cart.map((cartItem)=> {
            return cartItem.id;
        });

        await ctx.db.mutation.deleteManyCartItems({
            where: {
                id_in: cartItemIds
            }
        }); 

        return order; 
    },
    async createGoal(parent, args, ctx, info){
        // check if user is logged in
        if(!ctx.request.userId){
            throw Error ("You must be logged in to do this!");
        }

        const goal = await ctx.db.mutation.createGoal({
            data: {
                user: {
                    connect: {
                        id: ctx.request.userId
                    }
                },
                ...args
            }
        }, info);

        return goal; 
    },
    async updateGoal(parent, args, ctx, info){
        // check if user is logged in
        if(!ctx.request.userId){
            throw Error ("You must be logged in to do this!");
        }

        console.log(args);

        const updates = {...args};
        delete updates.id;

        const updatedGoal = await ctx.db.mutation.updateGoal({
            data: updates,
            where: {
                id: args.id
            }
        }, info);

        return updatedGoal;
    },
    async deleteGoal(parent, args, ctx, info){
        const where = {id: args.id};
        // check if user is logged in
        if(!ctx.request.userId){
            throw Error ("You must be logged in to do this!");
        }

        // const goal = await ctx.db.query.goal({where: {id: args.id}}, `
        //     {
        //         id 
        //         user {
        //             id
        //         }
        //         tasks { 
        //             id 
        //             subtasks {
        //                 id
        //             } 
        //         }
        //     }`);

        // TO DO DELETE tasks associated with goal
        // TO DO DELETE subtasks associated with tasks
        return ctx.db.mutation.deleteGoal({where}, info);
    },
    async createTask(parent, args, ctx, info){
        if(!ctx.request.userId){
            throw Error ("You must be logged in to do this!");
        } 

        const { name, description } = args; 

        const task = await ctx.db.mutation.createTask(
            {
                data: {
                    goal: {
                        connect: {
                            id: args.goalId
                        }
                    },
                    name,
                    description
                }
            },
            info
        );

        return task; 
    },
    async updateTask(parent, args, ctx, info){
        if(!ctx.request.userId){
            throw Error ("You must be logged in to do this!");
        }

        const updates = {...args};
        delete updates.id;

        const updatedTask = await ctx.db.mutation.updateTask({
            data: updates,
            where: {
                id: args.id
            }
        }, info);

        return updatedTask;
    },
    async deleteTask(parent, args, ctx, info){
        if(!ctx.request.userId){
            throw Error ("You must be logged in to do this!");
        }

        const where = {id: args.id};

        return ctx.db.mutation.deleteTask({where}, info);
    },
    async createSubTask(parent, args, ctx, info){
        if(!ctx.request.userId){
            throw Error ("You must be logged in to do this!");
        }

        const { name, description, dueDate } = args;
        console.log(args);

        const task = await ctx.db.mutation.createSubTask(
            {
                data: {
                    task: {
                        connect: {
                            id: args.taskId
                        }
                    },
                    name,
                    description,
                    dueDate
                }
            },
            info
        );

        return task; 
    },
    async updateSubTask(parent, args, ctx, info){
        if(!ctx.request.userId){
            throw Error ("You must be logged in to do this!");
        }

        const { id, complete, completedAt } = args;

        const subTask = await ctx.db.mutation.updateSubTask({
            data: {
                complete,
                completedAt
            },
            where: {
                id
            }
        }, info);
        return subTask; 
    },
    async deleteSubTask(parent, args, ctx, info){
        if(!ctx.request.userId){
            throw Error ("You must be logged in to do this!");
        }

        const where = {id: args.id};
        return await ctx.db.mutation.deleteSubTask({
           where
        }, info);
    }
};

module.exports = Mutations;
