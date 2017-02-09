import { Template } from 'meteor/templating';

Template.Radio_Field.onRendered(function onRendered() {
  this.$('.ui.radio.checkbox').checkbox();
});
