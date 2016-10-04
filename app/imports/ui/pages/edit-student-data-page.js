import { ReactiveDict } from 'meteor/reactive-dict';
import { Tracker } from 'meteor/tracker';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Template } from 'meteor/templating';
import { _ } from 'meteor/underscore';
import { StudentData, StudentDataSchema } from '../../api/studentdata/studentdata.js';

/* eslint-disable object-shorthand, no-unused-vars */

const displaySuccessMessage = 'displaySuccessMessage';
const displayErrorMessages = 'displayErrorMessages';

Template.Edit_Student_Data_Page.onCreated(function onCreated() {
  this.autorun(() => {
    this.subscribe('StudentData');
  });
  this.messageFlags = new ReactiveDict();
  this.messageFlags.set(displaySuccessMessage, false);
  this.messageFlags.set(displayErrorMessages, false);
  this.context = StudentDataSchema.namedContext('Edit_StudentData_Page');
});


Template.Edit_Student_Data_Page.helpers({
  studentDataField(fieldName) {
    const studentData = StudentData.findOne(FlowRouter.getParam('_id'));
    // See https://dweldon.silvrback.com/guards to understand '&&' in next line.
    return studentData && studentData[fieldName];
  },
  hobbyChecked(hobby) {
    const studentData = StudentData.findOne(FlowRouter.getParam('_id'));
    return studentData && _.contains(studentData.hobbies, hobby) && true;
  },
  levelChecked(level) {
    const studentData = StudentData.findOne(FlowRouter.getParam('_id'));
    return studentData && (studentData.level === level) && true;
  },
  gpaSelected(gpa) {
    const studentData = StudentData.findOne(FlowRouter.getParam('_id'));
    return studentData && (studentData.gpa === gpa) && true;
  },
  majorSelected(major) {
    const studentData = StudentData.findOne(FlowRouter.getParam('_id'));
    return studentData && _.contains(studentData.majors, major) && true;
  },
  successClass() {
    return Template.instance().messageFlags.get(displaySuccessMessage) ? 'success' : '';
  },
  displaySuccessMessage() {
    return Template.instance().messageFlags.get(displaySuccessMessage);
  },
  errorClass() {
    return Template.instance().messageFlags.get(displayErrorMessages) ? 'error' : '';
  },
  displayFieldError(fieldName) {
    const errorKeys = Template.instance().context.invalidKeys();
    return _.find(errorKeys, (keyObj) => keyObj.name === fieldName);
  },
});

Template.Edit_Student_Data_Page.onRendered(function enableSemantic() {
  const template = this;
  template.subscribe('StudentData', () => {
    // Use this template.subscribe callback to guarantee that the following code executes after subscriptions OK.
    Tracker.afterFlush(() => {
      // Use Tracker.afterFlush to guarantee that the DOM is re-rendered before calling JQuery.
      template.$('select.ui.dropdown').dropdown();
      template.$('.ui.selection.dropdown').dropdown();
      template.$('select.dropdown').dropdown();
      template.$('.ui.checkbox').checkbox();
      template.$('.ui.radio.checkbox').checkbox();
    });
  });
});

Template.Edit_Student_Data_Page.events({
  'submit .student-data-form'(event, instance) {
    event.preventDefault();
    // Get name (text field)
    const name = event.target.name.value;
    // Get bio (text area).
    const bio = event.target.bio.value;
    // Get list of checked hobbies (checkboxes)
    const hobbies = [];
    _.each(['surfing', 'running', 'biking', 'paddling'], function setHobby(hobby) {
      if (event.target[hobby].checked) {
        hobbies.push(event.target[hobby].value);
      }
    });
    // Radio buttons (Level)
    const level = event.target.level.value;
    // Drop down list (GPA)
    const gpa = event.target.gpa.value;
    // Multiple select list  (Majors)
    const selectedMajors = _.filter(event.target.majors.selectedOptions, (option) => option.selected);
    const majors = _.map(selectedMajors, (option) => option.value);

    const updatedStudentData = { name, bio, hobbies, level, gpa, majors };

    // Clear out any old validation errors.
    instance.context.resetValidation();
    // Invoke clean so that newStudentData reflects what will be inserted.
    StudentDataSchema.clean(updatedStudentData);
    // Determine validity.
    instance.context.validate(updatedStudentData);

    if (instance.context.isValid()) {
      const id = StudentData.update(FlowRouter.getParam('_id'), { $set: updatedStudentData });
      instance.messageFlags.set(displaySuccessMessage, id);
      instance.messageFlags.set(displayErrorMessages, false);
    } else {
      instance.messageFlags.set(displaySuccessMessage, false);
      instance.messageFlags.set(displayErrorMessages, true);
    }
  },
});

