const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const { randomBytes } = require('crypto');
const { transport, makeANiceEmail }  = require('../mail');

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
    }
};

module.exports = Mutations;
