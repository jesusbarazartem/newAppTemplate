/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

    /**Post Requests */
    updateUserAvatar: async function (req, res) {
        if (!req.session || !req.session.user) {
            req.addFlash('msg', { msg: 'Sorry! your session expired, you are required to log in again', type: 'danger', icon: 'exclamation-triangle' })
            return res.redirect('/log-in')
        }

        req.file('avatar').upload({}, async (error, files) => {   // Fuction uplaod permits to upload files from the browser to the server. First argument its an object that permits to specify the quantity of files (We are not specifying anything for now). The second is a function that its called the file is uploaded. When we send the file sub 0 this containts the file that was uploaded

            if (files && files[0]) {                            // We ask if exits the array of files, and at least the is one file
                let upload_path = files[0].fd                   // 'File Descriptor' indicates where is was loaded. fd is a Sails function that put the files in temp folder, we implement a library called FS, needs to be imported and required
                let ext = path.extname(upload_path)             // Then we take the ext name, we implement a library called PATH, needs to be imported and required 

                await fs.createReadStream(upload_path).pipe(fs.createWriteStream(path.resolve(sails.config.appPath, `assets/images/usersAvatars/${req.session.user.id}${ext}`)))                             // Route start from directory where it is Sails, where we define the folder path and then we asign the id as the file name, and the extension of the file

                await User.update({ id: req.session.user.id }, { avatar: `${req.session.user.id}${ext}` }) // Finally we update the registry in the database by First: selecting the foto, Second: update contenido with the new file name and extension, Finally: change active to true. The first argument represents the row we want to update, the second parameter represents what we want to update
                req.addFlash('msg', { msg: 'Foto Agregada con Exito', type: 'success', icon: 'check' })
                return res.redirect('/settings')
            }
        })
    },

    updateUserInfo: async function (req, res) {
        if (!req.session || !req.session.user) {
            req.addFlash('msg', { msg: 'Sorry! your session expired, you are required to log in again', type: 'danger', icon: 'exclamation-triangle' })
            return res.redirect('/log-in')
        }

        const name = req.body.name;
        const email = req.body.email.toLowerCase();
        const password = req.body.password;
        const passwordCheck = req.body.passwordCheck;
        const salt = await bcrypt.genSalt(10);

        let user = await User.findOne({ id: req.body.id });
        if (user && user.emailAddress != email) {
            let compare = await User.findOne({ emailAddress: email })
            req.addFlash('msg', { msg: 'Sorry! This user is already taken', type: 'danger', icon: 'exclamation-triangle' })
            return res.redirect('/sign-up');
        }

        if (password != passwordCheck) {
            req.addFlash('msg', { msg: 'Sorry! Password Check DOES NOT MATCH', type: 'danger', icon: 'exclamation-triangle' })
            return res.redirect('/sign-up');
        }

        else {
            const hashedPassword = await bcrypt.hash(req.body.password, salt);
            await User.update({ id: req.session.user.id }, {
                emailAddress: email,
                fullName: name,
                password: hashedPassword
            })
            req.addFlash('msg', { msg: 'You have updated your User Information', type: 'success', icon: 'info' })
            return res.redirect('/settings')
        };
    },
};

