import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

/* eslint-disable object-shorthand */

export const StudentData = new Mongo.Collection('StudentData');

/**
 * Create the schema for StudentData
 */
export const StudentDataSchema = new SimpleSchema({
  name: {
    label: 'Name',
    type: String,
    max: 50,
  },
  bio: {
    label: 'Bio',
    type: String,
    optional: true,
    defaultValue: '',
    max: 500,
  },
  hobbies: {
    label: 'Hobbies',
    type: [String],
  },
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
    type: [String],
  },
});

StudentData.attachSchema(StudentDataSchema);
