import { FlowRouter } from 'meteor/kadira:flow-router';
import { Template } from 'meteor/templating';
import { StudentData } from '../../api/studentdata/studentdata.js';
import { _ } from 'meteor/underscore';

/* eslint-disable object-shorthand, no-unused-vars */

Template.Edit_Page.helpers({
  nameValue() {
    const studentData = StudentData.findOne(FlowRouter.getParam('_id'));
    return studentData.name;
  },
  bioValue() {
    const studentData = StudentData.findOne(FlowRouter.getParam('_id'));
    return studentData.bio;
  },
  hobbyChecked(hobby) {
    const studentData = StudentData.findOne(FlowRouter.getParam('_id'));
    return _.contains(studentData.hobbies, hobby) && true;
  },
  levelChecked(level) {
    const studentData = StudentData.findOne(FlowRouter.getParam('_id'));
    return (studentData.level === level) && true;
  },
  gpaSelected(gpa) {
    const studentData = StudentData.findOne(FlowRouter.getParam('_id'));
    return (studentData.gpa === gpa) && true;
  },
  majorSelected(major) {
    const studentData = StudentData.findOne(FlowRouter.getParam('_id'));
    return _.contains(studentData.majors, major) && true;
  },

});

Template.Edit_Page.onRendered(function enableSemantic() {
  // Enable the single selection dropdown menu widget. (GPA)
  this.$('.ui.selection.dropdown').dropdown();
  // Enable the multiple selection dropdown widget. (Majors)
  this.$('select.ui.dropdown').dropdown();
  // Enable checkboxes (multiple selection)  (Hobbies)
  this.$('.ui.checkbox').checkbox();
  // Enable radio buttons (single selection)  (Level)
  this.$('.ui.radio.checkbox').checkbox();
});

Template.Edit_Page.events({
  'submit .student-data-form'(event) {
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

    console.log('update', name, bio, hobbies, level, gpa, majors);
    const id = StudentData.update(FlowRouter.getParam('_id'), { name, bio, hobbies, level, gpa, majors });
    console.log(id);
  },
});



