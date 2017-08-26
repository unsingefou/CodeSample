import React from 'react';

const AjaxButton = ({label, isFetching, onClick, disabled}) => {
  let buttonLabel = label
  if(isFetching) {
    buttonLabel = <i className="fa fa-spinner"></i>
  }

  return (
    <button className="btn-primary btn" disabled={disabled} onClick={onClick}>{buttonLabel}</button>
  )
}

export default AjaxButton
