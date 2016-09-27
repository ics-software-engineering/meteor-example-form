import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { _ } from 'meteor/underscore';
import { StudentData } from '../../api/studentdata/studentdata.js';

/* eslint-disable no-param-reassign */

const showCreatedMessage = 'showCreatedMessage';

Template.Edit_Page.onCreated(function onCreated() {
  this.autorun(() => {
    this.subscribe('StudentData');
  });
  this.dict = new ReactiveDict();
});

// Put in the Semantic UI form widget initializations here.
Template.Home_Page.onRendered(function enableSemantic() {
  // Enable the single selection dropdown menu widget. (GPA)
  // this.$('.ui.selection.dropdown').dropdown();
  // Enable the multiple selection dropdown widget. (Majors)
  this.$('select.ui.dropdown').dropdown();
  // Enable checkboxes (multiple selection)  (Hobbies)
  // this.$('.ui.checkbox').checkbox();
  // Enable radio buttons (single selection)  (Level)
  // this.$('.ui.radio.checkbox').checkbox();
});


Template.Home_Page.events({
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

    console.log('insert', name, bio, hobbies, level, gpa, majors);
    const id = StudentData.insert({ name, bio, hobbies, level, gpa, majors });
    console.log(id);
  },
});

