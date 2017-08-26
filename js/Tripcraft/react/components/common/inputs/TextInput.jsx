import React from 'react';
import PropTypes from 'prop-types'
import classNames from 'classnames'
import 'stylesheets/inputs/inputs.css'

class TextInput extends React.Component {

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
        <input {...this.props.input} type={this.props.type} className={inputClasses}/>
        {meta.touched && ((meta.error && <span>{meta.error}</span>) || (meta.warning && <span>{meta.warning}</span>))}
      </div>
    )
  }
}

TextInput.propTypes = {
  label: PropTypes.string.isRequired,
  input: PropTypes.object.isRequired,
  meta: PropTypes.object.isRequired,
  required: PropTypes.bool
}

export default TextInput
