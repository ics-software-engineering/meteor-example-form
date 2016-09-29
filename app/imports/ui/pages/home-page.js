import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { _ } from 'meteor/underscore';
import { ValidationError } from 'meteor/mdg:validation-error';
import { StudentData, StudentDataSchema } from '../../api/studentdata/studentdata.js';

/* eslint-disable no-param-reassign */

const displaySuccessMessage = 'displaySuccessMessage';


Template.Home_Page.onCreated(function onCreated() {
  this.messageFlags = new ReactiveDict();
});

Template.Home_Page.helpers({
  displaySuccessMessage() {
    const instance = Template.instance();
    console.log('in helper displaySuccessMessage', displaySuccessMessage);
    return instance.messageFlags.get(displaySuccessMessage);
  },
  successClass() {
    const instance = Template.instance();
    console.log('in helper successClass', displaySuccessMessage);
    return instance.messageFlags.get(displaySuccessMessage) ? 'success' : '';
  },
});

Template.Home_Page.onRendered(function enableSemantic() {
  const instance = this;
  instance.$('select.ui.dropdown').dropdown();
  instance.$('.ui.selection.dropdown').dropdown();
  instance.$('select.dropdown').dropdown();
  instance.$('.ui.checkbox').checkbox();
  instance.$('.ui.radio.checkbox').checkbox();
});


Template.Home_Page.events({
  'submit .student-data-form'(event) {
    event.preventDefault();
    // Get name (text field)
    const name = event.target.name.value;
    // Get bio (text area).
    const bio = event.target.bio.value;
    // Get hobbies (checkboxes, zero to many)
    const hobbies = [];
    _.each(['surfing', 'running', 'biking', 'paddling'], function setHobby(hobby) {
      if (event.target[hobby].checked) {
        hobbies.push(event.target[hobby].value);
      }
    });
    // Get level (radio buttons, exactly one)
    const level = event.target.level.value;
    // Get GPA (single selection)
    const gpa = event.target.gpa.value;
    // Get Majors (multiple selection)
    const selectedMajors = _.filter(event.target.majors.selectedOptions, (option) => option.selected);
    const majors = _.map(selectedMajors, (option) => option.value);

    const newStudentData = { name, bio, hobbies, level, gpa, majors };
    try {
      console.log('about to validate', newStudentData);
      // const result = StudentDataSchema.validate(newStudentData);
      const result = StudentData.simpleSchema().namedContext().validate(newStudentData, { modifier: false });
      console.log('after validation', result);
      const id = StudentData.insert(newStudentData);
      console.log('in event submit', displaySuccessMessage, id);
      Template.instance().messageFlags.set(displaySuccessMessage, id);
    } catch (err) {
      console.log('validation not ok', err);
    }
  },
});

