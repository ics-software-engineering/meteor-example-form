import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { _ } from 'meteor/underscore';
import { ValidationError } from 'meteor/mdg:validation-error';
import { StudentData, StudentDataSchema } from '../../api/studentdata/studentdata.js';
import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';



/* eslint-disable no-param-reassign */

const displaySuccessMessage = 'displaySuccessMessage';

const testSchema = new SimpleSchema({
  name: {
    label: 'Name',
    type: String,
    max: 5,
  },
});

export const testCollection = new Mongo.Collection('TestCollection');

testCollection.attachSchema(testSchema);

console.log('starting up client');

const schemaContext = testSchema.namedContext('testContext');

const goodObject = { name: 'foo' };
const badObject = { name: 'foobar' };

console.log('validate good object4', schemaContext.validate(goodObject));
console.log('validate bad object', schemaContext.validate(badObject));

const testit = StudentDataSchema.namedContext('testit');

console.log('validate bad object against studentdataschema', testit.validate(badObject));


Template.Home_Page.onCreated(function onCreated() {
  this.messageFlags = new ReactiveDict();

});

Template.Home_Page.helpers({
  displaySuccessMessage() {
    const instance = Template.instance();
    return instance.messageFlags.get(displaySuccessMessage);
  },
  successClass() {
    const instance = Template.instance();
    return instance.messageFlags.get(displaySuccessMessage) ? 'success' : '';
  },
});

Template.Home_Page.onRendered(function enableSemantic() {
  const instance = this;
  instance.$('select.ui.dropdown').dropdown();
  instance.$('.ui.selection.dropdown').dropdown();
  instance.$('select.dropdown').dropdown();
  instance.$('.ui.checkbox').checkbox();
  instance.$('.ui.radio.checkbox').checkbox();
});


Template.Home_Page.events({
  'submit .student-data-form'(event, instance) {
    event.preventDefault();
    // Get name (text field)
    const name = event.target.name.value;
    // Get bio (text area).
    const bio = event.target.bio.value;
    // Get hobbies (checkboxes, zero to many)
    const hobbies = [];
    _.each(['surfing', 'running', 'biking', 'paddling'], function setHobby(hobby) {
      if (event.target[hobby].checked) {
        hobbies.push(event.target[hobby].value);
      }
    });
    // Get level (radio buttons, exactly one)
    const level = event.target.level.value;
    // Get GPA (single selection)
    const gpa = event.target.gpa.value;
    // Get Majors (multiple selection)
    const selectedMajors = _.filter(event.target.majors.selectedOptions, (option) => option.selected);
    const majors = _.map(selectedMajors, (option) => option.value);

    const newStudentData = { name, bio, hobbies, level, gpa, majors };

    // const testit2 = StudentDataSchema.namedContext('testit2');
    //
    // console.log('validate bad object against studentdataschema2', testit2.validate(badObject));

    console.log('reset validation');
    const contextName = `context-${new Date()}`;
    console.log(contextName);
    const context = StudentDataSchema.namedContext(contextName);
    context.resetValidation();
    console.log('before cleaning', newStudentData);
    StudentDataSchema.clean(newStudentData);
    console.log('after cleaning', newStudentData);
    const isValid = context.validate(newStudentData);
    console.log('schema validity result', isValid);
    // // try {
    //   console.log('about to validate', newStudentData);
    //   // const result = StudentDataSchema.validate(newStudentData);
    //   const result = StudentData.simpleSchema().namedContext().validate(newStudentData, { modifier: false });
    //   console.log('after validation', result);
    //   const id = StudentData.insert(newStudentData);
    //   console.log('in event submit', displaySuccessMessage, id);
    //   Template.instance().messageFlags.set(displaySuccessMessage, id);
    // } catch (err) {
    //   console.log('validation not ok', err);
    // }
  },
});

