import React from 'react';
import PropTypes from 'prop-types'
import classNames from 'classnames'
import 'stylesheets/inputs/inputs.css'

class CheckboxInput extends React.Component {

  onChange(e) {
    this.props.input.onChange(e.target.checked)
  }

  render() {
    const {meta} = this.props
    let labelClasses = classNames(
      {
        'required': this.props.required,
        'error': meta.error && meta.touched
      }
    )
    let inputClasses = classNames(
      {
        'error': meta.error && meta.touched
      }
    )

    return (
      <div>
        <label className={labelClasses}>{this.props.label}</label>
        <input {...this.props.input} type='checkbox' className={inputClasses}
          onChange={this.onChange.bind(this)}
          checked={this.props.input.value}
          onBlur={this.onChange.bind(this)}/>
        {meta.touched && ((meta.error && <span>{meta.error}</span>) || (meta.warning && <span>{meta.warning}</span>))}
      </div>
    )
  }
}

CheckboxInput.propTypes = {
  label: PropTypes.string.isRequired,
  input: PropTypes.object.isRequired,
  meta: PropTypes.object.isRequired,
  required: PropTypes.bool
}

export default CheckboxInput
