View = require ("./views/login_view")
UnauthorizedView = require ("./views/unauthorized_view.coffee")

class LoginController extends Marionette.Object
  login: (test) ->
    if !MainApp.userSession.hasSession()
      MainApp.regionManager.getRegion('regionContent').show(new View())
      MainApp.navigationController.hideNavigation()
    else
      MainApp.navigate('management/hotels')

  unathorized: () ->
    MainApp.regionManager.getRegion('regionContent').show(new UnauthorizedView())

module.exports = LoginController
