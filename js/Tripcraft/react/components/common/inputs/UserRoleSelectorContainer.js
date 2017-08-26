import { connect } from 'react-redux'
import {getAllUserRoles} from 'actions/UserRoles.js'
import UserRoleSelector from './UserRoleSelector.jsx'

const mapStateToProps = (state, ownProps) => {
  return {
    roles: state.userRoles.roles
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onChange: (roles) => {
      ownProps.input.onChange(roles)
    },
    getAllUserRoles: () => {
      dispatch(getAllUserRoles())
    }
  }
}

const UserRoleSelectorContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(UserRoleSelector)

export default UserRoleSelectorContainer
