This sample application illustrates how to manipulate user input using forms with [Meteor 1.4](http://meteor.com), [BlazeJS](http://blazejs.org/), and [Semantic UI](http://semantic-ui.com/).

## Prerequisites

To best understand this application, it is useful to first familiarize yourself with:

* [Meteor Application Template](http://ics-software-engineering.github.io/meteor-application-template/). This sample application illustrates conventions for directory layout, naming conventions, routing, and coding standards. Meteor-example-form is based on this template, but we won't discuss these issues here.

* [Blaze Templates](http://blazejs.org/guide/spacebars.html). Read this documentation to learn about HTML spacebars and the various Javascript utilities (helpers, onCreated, onRendered, etc.).
 
* [Semantic UI Forms](http://semantic-ui.com/collections/form.html). Read this documentation to learn the CSS classes defined by Semantic UI to create nicely styled forms.

* [Validating data with Simple Schema](https://github.com/aldeed/meteor-simple-schema#validating-data). Actually, you'll probably need to familiarize yourself with all of Simple Schema, but the section on data validation is crucial to understanding this sample application.

## UI Walkthrough

The home page of this application presents the Create Student Data page:

![](https://github.com/ics-software-engineering/meteor-example-form/raw/master/doc/create-student-data-page.png)

If you try pressing submit without entering any data, then validation will fail on the required fields and error messages are displayed:

![](https://github.com/ics-software-engineering/meteor-example-form/raw/master/doc/create-student-data-page-error.png)

After correctly filling out the form and pressing submit, the page creates an entry in the StudentData collection and provides a URL to the Update Student Data page:

![](https://github.com/ics-software-engineering/meteor-example-form/raw/master/doc/create-student-data-page-success.png)

Clicking on the link brings up the other page in this application, Edit Student Data, which obtains the id of a Student Data document from the URL, retrieves it from the StudentData collection, and fills out the form with this document's fields so they can be updated:

![](https://github.com/ics-software-engineering/meteor-example-form/raw/master/doc/update-student-data-page.png)

A successful update is indicated like this:

![](https://github.com/ics-software-engineering/meteor-example-form/raw/master/doc/update-student-data-page-success.png)


I won't show it here, but if you violate any validation on this update page, then it will show the same error messages as on the Create Student Data page.




