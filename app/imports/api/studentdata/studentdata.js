import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

/* eslint-disable object-shorthand */

export const StudentData = new Mongo.Collection('StudentData');

/**
 * Create the schema for StudentData
 */
export const StudentDataSchema = new SimpleSchema({
  name: {
    label: 'Name',
    type: String,
  },
  bio: {
    label: 'Bio',
    type: String,
    optional: true,
    defaultValue: '',
  },
  hobbies: {
    label: 'Hobbies',
    type: Array,
  },
  'hobbies.$': String,
  level: {
    label: 'Level',
    type: String,
  },
  gpa: {
    label: 'GPA',
    type: String,
  },
  majors: {
    label: 'Majors',
    type: Array,
  },
  'majors.$': String,
});

StudentData.attachSchema(StudentDataSchema);
