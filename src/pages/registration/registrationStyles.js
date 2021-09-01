import React from 'react'
import {createUseStyles} from 'react-jss'


export const registrationStyles = createUseStyles({
  registration: {
    width: '100%',
    float: 'left'
  },
  registrationBody: {
    width: '80%',
    float: 'right',
    margin: '0 auto',
  },
  eventPicker: {
    width: '100%',
    float: 'inherit'
  },
  eventPickerBody: {
    width: '100%',
    float: 'inherit'
  },
  eventPickerLabel: {
    textAlign: "left",
    // width: '40%',
    height: 'auto',
    wordWrap: "break-word"
  },
  sessionPicker: {
    width: '60%',
  },
  sessionPickerLabel: {
    width: '100%',
    float: 'left',
  },
  sessionPickerDropdownLabel: {
    width: '100%',
    float: 'center',
  },
});


export const personStyles = createUseStyles({
  person: {
    width: '100%'
  },
  personBody: {
    width: '100%',
    float: 'left',
    border: 'none',
  },
  personForm: {
    width: '100%',
    float: 'left',
  },
  personDataHeader: {
    marginTop: 20,
  },
  personInputGroup: {
    width: '100%',
    float: 'left',
  },
  personInputLabel: {
    width: '100%',
    float: 'left',
  },
  documentTypeDropdown: {
    width: '100%',
  },
  documentTypeDropdownLabel: {
    width: '100%',
    "text-align": 'center',
  },
  personInput: {
    width: '60%',
    float: 'left',
  },
  documentTypeButtons: {
    float: 'right',
    marginTop: 20,
  },
  questions: {
    width: '100%',
  },
  question: {
    width: '100%',
  },
  questionLabel: {
    width: '5%',
  },
  questionText: {
    width: '80%',
  },
});


export const peopleStyles = createUseStyles({
  confirmation: {
    border: "none",
  },
});
