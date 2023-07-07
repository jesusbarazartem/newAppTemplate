/**
 * SessionController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const bcrypt = require('bcrypt');

module.exports = {

    /**GET Requests */
    signUp: async function (req, res) {
        res.view('pages/sign-up')
    },

    logIn: async function (req, res) {
        res.view('pages/log-in')
    },

    logOut: async function (req, res) {
        req.session.user = undefined;
        req.addFlash('msg', { msg: 'You have Loged Out our system', type: 'warning', icon: 'sign-out' })
        return res.redirect('/');
    },

    /**Post Requests */
    signUpForm: async function (req, res) {

        const name = req.body.name;
        const email = req.body.email.toLowerCase();
        const password = req.body.password;
        const passwordCheck = req.body.passwordCheck;
        const salt = await bcrypt.genSalt(10);

        let user = await User.findOne({ emailAddress: email });
        if (user) {
            req.addFlash('msg', { msg: 'Sorry! This user is already taken', type: 'danger', icon: 'exclamation-triangle' })
            return res.redirect('/sign-up');
        }

        if (password != passwordCheck) {
            req.addFlash('msg', { msg: 'Sorry! Password Check DOES NOT MATCH', type: 'danger', icon: 'exclamation-triangle' })
            return res.redirect('/sign-up');
        }

        else {
            const hashedPassword = await bcrypt.hash(req.body.password, salt);
            let user = await User.create({
                emailAddress: email,
                fullName: name,
                password: hashedPassword,
                isActivated: true
            })
            req.addFlash('msg', { msg: 'New Account Created! You can now Log In', type: 'success', icon: 'info' })
            return res.redirect('/log-in')
        };
    },

    logInForm: async function (req, res) {

        const email = req.body.email.toLowerCase()
        const user = await User.findOne({ emailAddress: email });


        if (!user) {
            req.addFlash('msg', { msg: 'We are Sorry! This user does not exist', type: 'danger', icon: 'exclamation-triangle' })
            return res.redirect('/log-in')
        }

        if (!user.isActivated) {
            req.addFlash('msg', { msg: 'We are Sorry! This account is not Active', type: 'danger', icon: 'exclamation-triangle' })
            return res.redirect('/log-in')
        }

        const match = await bcrypt.compare(req.body.password, user.password);

        if (!match) {
            req.addFlash('msg', { msg: 'We are Sorry! The Password is Invalid!', type: 'danger', icon: 'exclamation-triangle' })
            return res.redirect('/log-in')
        }

        if (user && user.isActivated && match) {
            req.session.user = user;
            req.session.admin = undefined;
            req.addFlash('msg', { msg: 'You have Loged In Succesfully', type: 'success', icon: 'check' })
            return res.redirect('/dashboard')
        }
    }

};

