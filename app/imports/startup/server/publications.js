import { Meteor } from 'meteor/meteor';
import { StudentData } from '../../api/studentdata/studentdata.js';

Meteor.publish('StudentData', function publishStudentData() {
  return StudentData.find();
});
