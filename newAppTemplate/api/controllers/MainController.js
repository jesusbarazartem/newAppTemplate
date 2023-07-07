/**
 * MainController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

    home: async function (req, res) {
        if (req.session && req.session.user) {
            return res.redirect('/dashboard')
        } else {
            res.view('pages/home')
        }
    },

    dashboard: async function (req, res) {
        if (!req.session || !req.session.user) {
            req.addFlash('msg', { msg: 'Sorry! your session expired, you are required to log in again', type: 'danger', icon: 'exclamation-triangle' })
            return res.redirect('/log-in')
        } else {
            let user = await User.findOne({ where: { id: req.session.user.id } })
            res.view('pages/user/dashboard', { user })
        }
    },

    settings: async function (req, res) {
        if (!req.session || !req.session.user) {
            req.addFlash('msg', { msg: 'Sorry! your session expired, you are required to log in again', type: 'danger', icon: 'exclamation-triangle' })
            return res.redirect('/log-in')
        }
        let user = await User.findOne({ id: req.session.user.id })
        res.view('pages/user/settings', { user })
    },

};

