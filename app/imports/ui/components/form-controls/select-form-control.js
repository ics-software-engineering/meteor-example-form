import { Template } from 'meteor/templating';

Template.Select_Form_Control.onRendered(function onRendered() {
  this.$('select.dropdown').dropdown();
});
