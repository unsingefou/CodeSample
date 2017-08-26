import React from 'react';
import PropTypes from 'prop-types'
import { Redirect} from 'react-router-dom'

class AuthComponent extends React.Component {

  render() {
    if(!this.props.authenticated) {
      return  <Redirect to="/"/>
    }

    return (
      <div>
        {this.props.children}
      </div>
    )
  }
}

AuthComponent.propTypes = {
  authenticated: PropTypes.bool.isRequired,
}

export default AuthComponent
