import React from 'react';
import PropTypes from 'prop-types'
import classNames from 'classnames'
import moment from 'moment'
import {omit} from 'lodash';
import {SingleDatePicker} from 'react-dates'
import 'react-dates/lib/css/_datepicker.css';
import 'stylesheets/inputs/DatePicker.css'

class DatePickerInput extends React.Component {

  constructor(props) {
    super(props)

    this.parseDates(props)

    this.datePickerProps = omit(this.props, [
      'input',
      'meta',
      'label',
      'required'
    ])
    this.momentFormat = 'YYYY-MM-DD'
    this.state = {
      focused: false
    }
  }

  componentWillReceiveProps(nextProps) {
    this.parseDates(nextProps)
  }

  parseDates(props) {
    const dateValue = props.input.value
    this.date = moment(dateValue)
    if (!this.date.isValid()) {
      this.date = null
    }
  }

  onDateChange(moment) {
    let date = null
    if (moment !== null) {
      date = moment.format(this.momentFormat)
    }
    this.props.input.onChange(date)
  }

  onClose() {
    if(this.props.required) {
      let date = moment(this.props.input.value)
      if (!date.isValid()) {
        this.props.input.onChange(moment().format(this.momentFormat))
      }
    }
  }

  render() {
    let labelClasses = classNames(
      {
        'required': this.props.required
      }
    )

    return (
      <div>
        <label className={labelClasses}>{this.props.label}</label><br />
        <SingleDatePicker
          {...this.datePickerProps}
          date={this.date} // momentPropTypes.momentObj or null
          onDateChange={this.onDateChange.bind(this)} // PropTypes.func.isRequired
          focused={this.state.focused} // PropTypes.bool
          onFocusChange={({ focused }) => this.setState({ focused })} // PropTypes.func.isRequired
          onClose={this.onClose.bind(this)}
        />
      </div>
    )
  }
}
DatePickerInput.PropTypes = {
  required: PropTypes.bool
}

DatePickerInput.defaultProps = {
  // for a list of all possible props: https://github.com/airbnb/react-dates
  id: 'date',
  placeholder: 'MM/DD/YYYY',
  numberOfMonths: 1,
  isDayHighlighted: () => {},
  displayFormat: () => moment.localeData().longDateFormat('L'),
  monthFormat: 'MMMM YYYY',
  hideKeyboardShortcutsPanel: true
}

export default DatePickerInput
