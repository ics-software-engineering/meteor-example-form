import { StudentData } from '../../api/studentdata/studentdata.js';
import { Meteor } from 'meteor/meteor';

Meteor.publish('StudentData', function publishStudentData() {
  return StudentData.find();
});
