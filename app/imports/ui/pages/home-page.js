import { Template } from 'meteor/templating';
import { _ } from 'meteor/underscore';

/* eslint-disable no-param-reassign */

function setDefaultFormFieldValues(instance) {
  // Name
  instance.$('#name')[0].value = 'John Deere';
  // Bio
  instance.$('#bio')[0].value = 'My bio statement';
  // Hobbies
  instance.$('#running')[0].checked = true;
  // Level
  instance.$('#senior')[0].checked = true;
  // GPA
  instance.$('.ui.selection.dropdown').dropdown('set selected', 3);
  // Majors
  // instance.$('#gpa')[0].checked = true;
}

// Put in the Semantic UI form widget initializations here.
Template.Home_Page.onRendered(function enableSemantic() {
  // Enable the single selection dropdown menu widget. (GPA)
  this.$('.ui.selection.dropdown').dropdown();
  // Enable the multiple selection dropdown widget. (Majors)
  this.$('select.ui.dropdown').dropdown();
  // Enable checkboxes (multiple selection)  (Hobbies)
  this.$('.ui.checkbox').checkbox();
  // Enable radio buttons (single selection)  (Level)
  this.$('.ui.radio.checkbox').checkbox();

  setDefaultFormFieldValues(this);
});


Template.Home_Page.events({
  'submit .student-data-form'(event) {
    event.preventDefault();
    // Text field (name
    const name = event.target.name.value;
    // Text area (bio)
    const bio = event.target.bio.value;
    // List of check boxes (Hobbies)
    const surfing = event.target.surfing.checked;
    const running = event.target.running.checked;
    const biking = event.target.biking.checked;
    const paddling = event.target.paddling.checked;
    // Radio buttons (Level)
    const level = event.target.level.value;
    // Drop down list (GPA)
    const gpa = event.target.gpa.value;
    // Multiple select list  (Majors)
    const selectedMajors = _.filter(event.target.majors.selectedOptions, (option) => option.selected);
    const majors = _.map(selectedMajors, (option) => option.value);

    console.log(name, bio, surfing, running, biking, paddling, level, gpa, majors);
  },
});

