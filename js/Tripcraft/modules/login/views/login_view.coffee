class LoginView extends Marionette.View

  template: "login/login_view"

  events:
    'click #submit_login': 'login'

  onRender: () ->

  login: (e) ->
    e.preventDefault()
    data = Backbone.Syphon.serialize(this)
    MainApp.authenticator.authUser(data).then(@authSuccess).fail(@authFailure)

  authSuccess: (response) ->
    MainApp.userSession.createSession(response)
    MainApp.navigationController.setModules()
    MainApp.navigate('management/hotels')

  authFailure: (response) ->
    console.log(response)

module.exports = LoginView
