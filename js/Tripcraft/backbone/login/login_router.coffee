Controller = require ("./login_controller")

class LoginRouter extends Marionette.AppRouter

  appRoutes: {
    "": "login",
    "login": "login",
    "unathorized": "unathorized"
  }
  controller: new Controller()

module.exports = new LoginRouter()
