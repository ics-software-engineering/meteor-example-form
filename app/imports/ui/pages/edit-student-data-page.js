import { ReactiveDict } from 'meteor/reactive-dict';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Template } from 'meteor/templating';
import { _ } from 'meteor/underscore';
import { StudentData, StudentDataSchema } from '../../api/studentdata/studentdata.js';
import { hobbyList, levelList, GPAObjects, majorList } from './create-student-data-page.js';

/* eslint-disable object-shorthand, no-unused-vars, no-param-reassign */

const displaySuccessMessage = 'displaySuccessMessage';
const displayErrorMessages = 'displayErrorMessages';

Template.Edit_Student_Data_Page.onCreated(function onCreated() {
  this.subscribe('StudentData');
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
  hobbies() {
    const studentData = StudentData.findOne(FlowRouter.getParam('_id'));
    const selectedHobbies = studentData && studentData.hobbies;
    return studentData && _.map(hobbyList,
            function makeHobbyObject(hobby) {
              return { label: hobby, checked: _.contains(selectedHobbies, hobby) };
            });
  },
  levels() {
    const studentData = StudentData.findOne(FlowRouter.getParam('_id'));
    const selectedLevel = studentData && studentData.level;
    return studentData && _.map(levelList,
            function makeLevelObject(level) {
              return { label: level, checked: selectedLevel === level };
            });
  },
  GPAs() {
    const studentData = StudentData.findOne(FlowRouter.getParam('_id'));
    const selectedGPA = studentData && studentData.gpa;
    return studentData && _.map(GPAObjects,
            function makeLevelObject(GPAObject) {
              if (GPAObject.value === selectedGPA) {
                GPAObject.selected = true;
              }
              return GPAObject;
            });
  },
  majors() {
    const studentData = StudentData.findOne(FlowRouter.getParam('_id'));
    const selectedMajors = studentData && studentData.majors;
    return studentData && _.map(majorList,
            function makeMajorObject(major) {
              return { label: major, selected: _.contains(selectedMajors, major) };
            });
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
});

Template.Edit_Student_Data_Page.events({
  'submit .student-data-form'(event, instance) {
    event.preventDefault();
    // Get name (text field)
    const name = event.target.Name.value;
    // Get bio (text area).
    const bio = event.target.Bio.value;
    // Get list of checked hobbies (checkboxes)
    const hobbies = [];
    _.each(hobbyList, function setHobby(hobby) {
      if (event.target[hobby].checked) {
        hobbies.push(event.target[hobby].value);
      }
    });
    // Radio buttons (Level)
    const level = event.target.Level.value;
    // Drop down list (GPA)
    const gpa = event.target.GPA.value;
    // Multiple select list  (Majors)
    const selectedMajors = _.filter(event.target.Majors.selectedOptions, (option) => option.selected);
    const majors = _.map(selectedMajors, (option) => option.value);

    const updatedStudentData = { name, bio, hobbies, level, gpa, majors };

    // Clear out any old validation errors.
    instance.context.reset();
    // Invoke clean so that newStudentData reflects what will be inserted.
    const cleanData = StudentDataSchema.clean(updatedStudentData);
    // Determine validity.
    instance.context.validate(cleanData);

    if (instance.context.isValid()) {
      const id = StudentData.update(FlowRouter.getParam('_id'), { $set: cleanData });
      instance.messageFlags.set(displaySuccessMessage, id);
      instance.messageFlags.set(displayErrorMessages, false);
    } else {
      instance.messageFlags.set(displaySuccessMessage, false);
      instance.messageFlags.set(displayErrorMessages, true);
    }
  },
});

