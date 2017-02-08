import { Template } from 'meteor/templating';

Template.Checkbox_Field.onRendered(function onRendered() {
  this.$('.ui.checkbox').checkbox();
});
