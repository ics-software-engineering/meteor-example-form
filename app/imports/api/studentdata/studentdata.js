import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

/* eslint-disable object-shorthand */

export const StudentData = new Mongo.Collection('StudentData');

/**
 * Create the schema for StudentData
 * See: https://github.com/aldeed/meteor-autoform#common-questions
 * See: https://github.com/aldeed/meteor-autoform#affieldinput
 */
StudentData.attachSchema(new SimpleSchema({
  name: {
    label: 'Name',
    type: String,
    optional: false,
    max: 50,
  },
  bio: {
    label: 'Bio',
    type: String,
    optional: false,
    max: 500,
  },
  hobbies: {
    label: 'Hobbies',
    type: [String],
    optional: false,
  },
  level: {
    label: 'Level',
    type: String,
    optional: false,
  },
  gpa: {
    label: 'GPA',
    type: String,
    optional: false,
  },
  majors: {
    label: 'Majors',
    type: [String],
    optional: false,
  },
}));
