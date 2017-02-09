import { _ } from 'meteor/underscore';
import { Template } from 'meteor/templating';

/**
 * fieldError is used by both Create_Student_Data_Page and Edit_Student_Data_Page, so we register it globally.
 */
Template.registerHelper('fieldError', (fieldName) => {
  const invalidKeys = Template.instance().context.invalidKeys();
  const errorObject = _.find(invalidKeys, (keyObj) => keyObj.name === fieldName);
  return errorObject && Template.instance().context.keyErrorMessage(errorObject.name);
});
