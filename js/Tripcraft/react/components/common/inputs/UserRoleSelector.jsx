import React from 'react';
import PropTypes from 'prop-types'
import {forEach, find} from 'lodash'
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';

class UserRoleSelector extends React.Component {

  componentDidMount() {
    if (this.props.roles.length === 0) {
      this.props.getAllUserRoles()
    }
  }


  onChange(e) {
    var options = e.target.options;
    let selected = ['1'] //Do not allow removal of the user roles
    forEach(options, (option) => {
      if(option.selected) {
        selected.push(option.value)
      }
    })
    this.props.input.onChange(selected)
  }

  render() {
    let options = this.props.roles.map((role) => {
      return <option key={role.id} value={role.id}>{role.name}</option>
    })

    return (
      <div className='role-selector'>
        <CSSTransitionGroup
          component="div"
          transitionName="role-selector"
          transitionAppear={true}
          transitionAppearTimeout={300}
          transitionEnterTimeout={300}
          transitionLeaveTimeout={300}>
          <label>Roles</label>
          <select value={this.props.input.value} onChange={this.onChange.bind(this)} multiple>
            {options}
          </select>
        </CSSTransitionGroup>
      </div>
    )
  }
}

UserRoleSelector.propTypes = {

}

export default UserRoleSelector
