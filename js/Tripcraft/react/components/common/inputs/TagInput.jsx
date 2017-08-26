import React from 'react';
import PropTypes from 'prop-types'
import classNames from 'classnames'
import Select from 'react-select';
import {flatMap} from 'lodash'
import 'react-select/dist/react-select.css';
import 'stylesheets/inputs/Tagger.css'

class TagInput extends React.Component {
  componentWillMount() {
    if (this.props.options.length === 0) {
      this.props.getItems()
    }
  }

  onChange(val) {
    let values = flatMap(val, (v) => {
      return v.value
    })
    this.props.input.onChange(values)
  }

  onBlur(val) {
    this.props.input.onBlur(this.props.input.value)
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
        <Select
          className={inputClasses}
          name="form-field-name"
          value={this.props.input.value}
          options={this.props.options}
          onChange={this.onChange.bind(this)}
          // onBlur={this.onBlur.bind(this)}
          optionRenderer={this.props.optionRender}
          valueRenderer={this.props.valueRender}
          multi={true}
        />
        {meta.touched && ((meta.error && <span>{meta.error}</span>) || (meta.warning && <span>{meta.warning}</span>))}
      </div>
    )
  }
}

TagInput.propTypes = {
  label: PropTypes.string.isRequired,
  input: PropTypes.object.isRequired,
  meta: PropTypes.object.isRequired,
  required: PropTypes.bool,
  optionRender: PropTypes.func,
  valueRender: PropTypes.func
}

export default TagInput
