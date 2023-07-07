/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

const MainController =    require("../api/controllers/MainController");
const SessionController = require("../api/controllers/SessionController");
const UserController =    require("../api/controllers/UserController");

module.exports.routes = {

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` your home page.            *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/

  'GET /':                          MainController.home,
  'GET /sign-up':                   SessionController.signUp,
  'GET /log-in':                    SessionController.logIn,
  'GET /log-out':                   SessionController.logOut,

  /** POST Actions for Public Functions */
  'POST /sign-up-form':             SessionController.signUpForm,
  'POST /log-in-form':              SessionController.logInForm,

  /** GET Actions for Pivate Functions */
  'GET /dashboard':                 MainController.dashboard,
  'GET /settings':                  MainController.settings,

  /** POST Actions for Pivate Functions */
  'POST /update-user-avatar':       UserController.updateUserAvatar,
  'POST /update-user-info':         UserController.updateUserInfo,

  /***************************************************************************
  *                                                                          *
  * More custom routes here...                                               *
  * (See https://sailsjs.com/config/routes for examples.)                    *
  *                                                                          *
  * If a request to a URL doesn't match any of the routes in this file, it   *
  * is matched against "shadow routes" (e.g. blueprint routes).  If it does  *
  * not match any of those, it is matched against static assets.             *
  *                                                                          *
  ***************************************************************************/


};
