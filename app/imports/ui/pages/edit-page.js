import { FlowRouter } from 'meteor/kadira:flow-router';
import { Template } from 'meteor/templating';
import { StudentData } from '../../api/studentdata/studentdata.js';
import { _ } from 'meteor/underscore';

/* eslint-disable object-shorthand, no-unused-vars */

Template.Edit_Page.helpers({
  nameValue() {
    const studentData = StudentData.findOne(FlowRouter.getParam('_id'));
    return studentData && studentData.name;
  },
  bioValue() {
    const studentData = StudentData.findOne(FlowRouter.getParam('_id'));
    return studentData && studentData.bio;
  },
  hobbyChecked(hobby) {
    const studentData = StudentData.findOne(FlowRouter.getParam('_id'));
    return studentData && _.contains(studentData.hobbies, hobby) && true;
  },
  levelChecked(level) {
    const studentData = StudentData.findOne(FlowRouter.getParam('_id'));
    return studentData && (studentData.level === level) && true;
  },
  majorSelected(major) {
    const studentData = StudentData.findOne(FlowRouter.getParam('_id'));
    return studentData && _.contains(studentData.majors, major) && true;
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

  this.autorun(() => {
    const studentData = StudentData.findOne(FlowRouter.getParam('_id'));
    this.$('.ui.selection.dropdown').dropdown('set selected', studentData.gpa);
  });
});

