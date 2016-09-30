import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

FlowRouter.route('/', {
  name: 'Create_Student_Data_Page',
  action() {
    BlazeLayout.render('App_Body', { main: 'Create_Student_Data_Page' });
  },
});

FlowRouter.route('/studentdata/:_id', {
  name: 'Edit_Student_Data_Page',
  action() {
    BlazeLayout.render('App_Body', { main: 'Edit_Student_Data_Page' });
  },
});

FlowRouter.notFound = {
  action() {
    BlazeLayout.render('App_Body', { main: 'App_Not_Found' });
  },
};
