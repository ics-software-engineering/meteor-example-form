import { Template } from 'meteor/templating';

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
});
