import React from 'react';
import PropTypes from 'prop-types'
import Autosuggest from 'react-autosuggest'
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';

class HotelSelector extends React.Component {

  componentDidMount() {
    if (this.props.hotels.length === 0) {
      this.props.getHotels()
    }
  }

  renderSuggestion(suggestion) {
    return (
      <span>{suggestion.name} - {suggestion.city}</span>
    )
  }
  getSuggestionValue(suggestion) {
    this.props.onSelectSuggestion(suggestion.id)
    this.onToggleEdit()
    return suggestion.name
  }

  escapeRegexCharacters(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  filterSuggestions(params) {
    let value = params.value
    const escapedValue = this.escapeRegexCharacters(value.trim())

    if (escapedValue === '') {
      return []
    }

    const regex = new RegExp(escapedValue, 'i');

    let filtered = this.props.hotels.filter(hotel => regex.test(hotel.name))
    this.props.onUpdateSuggestions(filtered)
  }

  onSuggestionsClearRequested() {
    this.props.onUpdateSuggestions([])
  }

  onChange(e, params){
    this.props.onInputChange(params.newValue)
  }

  onToggleEdit() {
    this.props.onToggleEdit()
    this.props.onInputChange('')
  }

  render() {
    const inputProps = {
      placeholder: "Search for Hotel",
      value: this.props.value,
      onChange: this.onChange.bind(this),
      onBlur: this.onToggleEdit.bind(this),
      autoFocus: true
    }

    //The selector can have different content based on the state
    const body = () => {
      if (this.props.isFetching){
        //currently fetching data
        return (<div></div>)
      }

      if (this.props.hotels.length === 0) {
        //no hotels in the list
        return (
          <div>(No available hotels, contact your Administrator.)</div>
        )
      }

      if(this.props.isEditing) {
        //currently in edit mode, which displays the autosuggest field
        return (
          <div>
            <span>for</span>
            <Autosuggest
              suggestions={this.props.suggestions}
              onSuggestionsFetchRequested={this.filterSuggestions.bind(this)}
              onSuggestionsClearRequested={this.onSuggestionsClearRequested.bind(this)}
              getSuggestionValue={this.getSuggestionValue.bind(this)}
              renderSuggestion={this.renderSuggestion}
              inputProps={inputProps} />
          </div>
        )
      } else {
        let selected = this.props.hotels.find(hotel => hotel.id === this.props.selectedHotelId)
        //Showing currently selected hotel name
        return (
          <div>
            <span>for</span>
            <div className='selected-hotel-name' onClick={this.onToggleEdit.bind(this)}>{selected.name}</div>
          </div>
        )
      }
    }

    return (
      <div className='hotel-selector'>
        <CSSTransitionGroup
          component="div"
          transitionName="hotel-selector"
          transitionAppear={true}
          transitionAppearTimeout={300}
          transitionEnterTimeout={300}
          transitionLeaveTimeout={300}>
          {body()}
        </CSSTransitionGroup>
      </div>
    )
  }
}

HotelSelector.propTypes = {
  isFetching: PropTypes.bool.isRequired,
  isEditing: PropTypes.bool.isRequired,
  hotels: PropTypes.array.isRequired,
  suggestions: PropTypes.array.isRequired,
  value: PropTypes.string.isRequired,
  selectedHotelId: PropTypes.string.isRequired,
  previousHotelId: PropTypes.string.isRequired,
  getHotels: PropTypes.func.isRequired,
  onInputChange: PropTypes.func.isRequired,
  onUpdateSuggestions: PropTypes.func.isRequired,
  onSelectSuggestion: PropTypes.func.isRequired,
  onToggleEdit: PropTypes.func.isRequired
}

export default HotelSelector
