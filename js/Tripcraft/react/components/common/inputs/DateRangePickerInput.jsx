import React from 'react';
import PropTypes from 'prop-types'
import classNames from 'classnames'
import moment from 'moment'
import {concat, omit} from 'lodash';
import {DateRangePicker} from 'react-dates'
import 'react-dates/lib/css/_datepicker.css';
import 'stylesheets/inputs/DatePicker.css'

class DateRangePickerInput extends React.Component {

  constructor(props) {
    super(props)
    this.parseDates(props)

    this.ignoredProps = [
      'names',
      'label',
      'required'
    ]
    this.datePickerProps = omit(this.props, concat(this.ignoredProps, this.props.names))
    this.momentFormat = 'YYYY-MM-DD'
    this.state = {
      focusedInput: null
    }
  }

  componentWillReceiveProps(nextProps) {
    this.parseDates(nextProps)
  }

  parseDates(props) {
    const startValue = props[this.props.names[0]].input.value
    this.startDate = moment(startValue)
    if (!this.startDate.isValid()) {
      this.startDate = null
    }

    const endValue = props[this.props.names[1]].input.value
    this.endDate = moment(endValue)
    if (!this.endDate.isValid()) {
      this.endDate = null
    }
  }

  onDatesChange(dates) {
    let startDate = null
    if (dates.startDate) {
      startDate = dates.startDate.format(this.momentFormat)
    }
    this.props[this.props.names[0]].input.onChange(startDate)

    let endDate = null
    if(dates.endDate) {
      endDate = dates.endDate.format(this.momentFormat)
    }
    this.props[this.props.names[1]].input.onChange(endDate)
  }

  onClose(dates) {
    let startDate = dates.startDate
    let endDate = dates.endDate

    if (this.props.required) {
      if (startDate === null) {
        startDate = moment()
        this.props[this.props.names[0]].input.onChange(startDate.format(this.momentFormat))

        endDate = startDate.add(1, 'days')
        this.props[this.props.names[1]].input.onChange(endDate.format(this.momentFormat))
      } else if (endDate === null) {
        endDate = startDate.add(1, 'days')
        this.props[this.props.names[1]].input.onChange(endDate.format(this.momentFormat))
      }
    } else {
      if (startDate === null && endDate !== null) {
        endDate = null
        this.props[this.props.names[1]].input.onChange(null)
      } else if (startDate !== null && endDate === null) {
        endDate = startDate.add(1, 'days')
        this.props[this.props.names[1]].input.onChange(endDate.format(this.momentFormat))
      }
    }
  }

  render() {
    let labelClasses = classNames(
      {
        'required': this.props.required,
      }
    )

    return (
      <div>
        <label className={labelClasses}>{this.props.label}</label><br />
        <DateRangePicker
          {...this.datePickerProps}
          startDate={this.startDate} // momentPropTypes.momentObj or null,
          endDate={this.endDate} // momentPropTypes.momentObj or null,
          onDatesChange={this.onDatesChange.bind(this)} // PropTypes.func.isRequired,
          focusedInput={this.state.focusedInput} // PropTypes.oneOf([START_DATE, END_DATE]) or null,
          onFocusChange={focusedInput => this.setState({ focusedInput })}
          onClose={this.onClose.bind(this)} // PropTypes.func.isRequired,
        />
      </div>
    )
  }
}

DateRangePickerInput.PropTypes = {
  names: PropTypes.arrayOf(function(props, propName, componentName) {
    return new Error(
      `The ${componentName} component requires 2 form field names supplied to the ${propName } prop.
      Validation failed.'`
    )
  }),
  required: PropTypes.bool
}

DateRangePickerInput.defaultProps = {
  // for a list of all possible props: https://github.com/airbnb/react-dates
  startDateId: 'start-date',
  startDatePlaceholderText: 'MM/DD/YYYY',
  endDateId: 'end-date',
  endDatePlaceholderText: 'MM/DD/YYYY',
  numberOfMonths: 2,
  displayFormat: () => moment.localeData().longDateFormat('L'),
  monthFormat: 'MMMM YYYY',
  hideKeyboardShortcutsPanel: true
}

export default DateRangePickerInput
