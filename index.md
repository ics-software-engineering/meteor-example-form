This sample application illustrates how to manipulate user input using forms with [Meteor 1.4](http://meteor.com), [BlazeJS](http://blazejs.org/), and [Semantic UI](http://semantic-ui.com/). This involves:

* Displaying HTML forms using the [Semantic UI form classes](http://semantic-ui.com/collections/form.html).
* Creating [a set of reusable Blaze templates for the standard form controllers](), including text, textarea, checkboxes, radio buttons, and single and multiple select lists. 
* Validating form data upon submission using [Node Simple Schema](https://github.com/aldeed/node-simple-schema).
* Conditional display of page content using Reactive Dictionaries.
* Inserting new documents into Mongo based upon form data, as well as retrieving and updating documents using forms.

## Installation

After [installing Meteor](https://www.meteor.com/install) and downloading this package, cd into the apps directory and run:

```
meteor npm install
```

Next, run the system with:

```
meteor npm run start
```

That will invoke the script in the [package.json](https://github.com/ics-software-engineering/meteor-example-form/blob/master/app/package.json) to run meteor. To speed up the process, the script disables release checking.

**Note regarding bcrypt warning.** You will get the following message when you run this application:

```
Note: you are using a pure-JavaScript implementation of bcrypt.
While this implementation will work correctly, it is known to be
approximately three times slower than the native implementation.
In order to use the native implementation instead, run

  meteor npm install --save bcrypt

in the root directory of your application.
```

On some operating systems (particularly Windows), installing bcrypt is much more difficult than implied by the above message. Bcrypt is only used in Meteor for password checking, so the performance implications are negligible until your site has very high traffic. You can safely ignore this warning without any problems.

You can also run ESLint over the source code with:

```
meteor npm run lint
```


## Prerequisites

To best understand this application, it is useful to first familiarize yourself with:

* [Meteor Application Template](http://ics-software-engineering.github.io/meteor-application-template/). This sample application illustrates conventions for directory layout, naming conventions, routing, integration of Semantic UI, and coding standards. Meteor-example-form is based on this template, so we won't discuss any of these issues here.

* [Blaze Templates](http://blazejs.org/guide/spacebars.html). Read this documentation to learn about HTML spacebars and the various Javascript utilities (helpers, onCreated, onRendered, etc.).
 
* [Semantic UI Forms](http://semantic-ui.com/collections/form.html). Read this documentation to learn the CSS classes defined by Semantic UI to create nicely styled forms.

* [Validating data with Simple Schema](https://github.com/aldeed/node-simple-schema#validating-data). Actually, you'll probably need to familiarize yourself with all of Simple Schema, but the section on data validation is crucial to understanding this sample application.

* [Reactive Dict, Reactive Vars, and Session Variables](https://themeteorchef.com/snippets/reactive-dict-reactive-vars-and-session-variables/).  This application uses Reactive Dictionaries. I found this blog posting to be a very concise and useful explanation of them and how they relate to other mechanisms like Session variables.

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

## Code walkthrough

#### Defining form validation

User input should always be validated before being further processed by the system.  The canonical approach to validation in Meteor is to create a schema using Simple Schema. In this sample application, the schema is defined as part of defining the [StudentData Collection](https://github.com/ics-software-engineering/meteor-example-form/blob/master/app/imports/api/studentdata/studentdata.js).

#### Publications and subscriptions

Form processing using Semantic UI requires you to remove the autopublish package and to explicitly publish and subscribe to collections. 

For simplicity's sake, this example application publishes all of the StudentData collection in [publications.js](https://github.com/ics-software-engineering/meteor-example-form/blob/master/app/imports/startup/server/publications.js). 

This application only needs to subscribe to the collection on the Edit Student Data page, since that's the only page that needs to reference pre-existing StudentData. The subscription occurs in [edit-student-data-page#L14](https://github.com/ics-software-engineering/meteor-example-form/blob/master/app/imports/ui/pages/edit-student-data-page.js#L14).

#### Form controller templates

The heart of this sample application is the [form-controls directory](https://github.com/ics-software-engineering/meteor-example-form/tree/master/app/imports/ui/components/form-controls), which provides templates for implementation of the standard HTML form controls (text, textarea, checkboxes, radio buttons, and single/muliple selection drop-downs).

Consult the HTML files for documentation on how each control should be invoked and samples of the HTML code they produce. You can also see invocations of each of these templates in the [edit-student-data-page](https://github.com/ics-software-engineering/meteor-example-form/blob/master/app/imports/ui/pages/edit-student-data-page.html) and [create-student-data-page](https://github.com/ics-software-engineering/meteor-example-form/blob/master/app/imports/ui/pages/create-student-data-page.html).
 

#### Create Student Data

Now let's get look at the first of the two pages: Create Student Data, and start with the HTML code.

[create-student-data-page.html](https://github.com/ics-software-engineering/meteor-example-form/blob/master/app/imports/ui/pages/create-student-data-page.html) is the HTML template for accepting data for insertion into the StudentData collection. 
 
It invokes controller templates to create the Name, Bio, Hobbies, Level, GPA, and Majors form controllers. 

Note that [create-student-data-page.html#L5](https://github.com/ics-software-engineering/meteor-example-form/blob/master/app/imports/ui/pages/create-student-data-page.html#L5) augments the "ui form" class declaration with two helpers: successClass and errorClass. These helpers return the strings "success" or "error" when the form has been successfully submitted or has been found to contain errors, respectively. Otherwise (such as when the page is first displayed), they return the empty string. So, think of the page as containing three states: "empty" (i.e. just retrieved), "success" (the form data was just submitted and there were no errors), or "error" (the form data was submitted and errors were found).

Now let's turn to the Javascript side of Create Student Data.

[create-student-data-page.js#L11-L18](https://github.com/ics-software-engineering/meteor-example-form/blob/master/app/imports/ui/pages/create-student-data-page.js#L11-L18) defines the constants hobbyList, levelList, majorList, and GPAObjects. These constants are exported so that this data can be also used in the edit-student-data-page. 

[create-student-data-page.js#L21-L26](https://github.com/ics-software-engineering/meteor-example-form/blob/master/app/imports/ui/pages/create-student-data-page.js#L21-L26) shows the onCreated handler.  This handler sets up a Reactive Dictionary to hold displaySuccessMessage, indicating if we want to display the success message, and displayErrorMessages, indicating if we want to display one or more error messages. Note that they are initialized to false, indicating that we are in the third state (neither success nor failure).

[create-student-data-page.js#L28-L55](https://github.com/ics-software-engineering/meteor-example-form/blob/master/app/imports/ui/pages/create-student-data-page.js#L28-L55) shows the helper functions for this page. They alter the appearance of the page through reactive variables (either through the messageFlags reactive dict or through the reactive variables created by the Simple Schema validation mechanism).

[create-student-data-page.js#L58-L96](https://github.com/ics-software-engineering/meteor-example-form/blob/master/app/imports/ui/pages/create-student-data-page.js#L58-L96)  shows the events callback for handling the submit button event. As is usual in Meteor event processing, the first thing is to disable the default event handling. The subsequent code extracts form values from the various input types: text fields, text areas, checkboxes, radio buttons, single selection, and multiple selection.  After this, the handler creates an object called newStudentData that gathers together these values.  

This object is "cleaned" manually in order to make it correspond to the same object that will be checked by the Collection2 hook function as part of the insert process. Finally, we validate the form data and set the reactive variables appropriately.  Note that changing the reactive variable values is all that is needed to cause the page contents to be updated.  

#### Edit Student Data

The edit-student-data-page HTML and Javascript files are quite similar to their counterparts in create-student-data-page. The essential difference is that the page must initialize the form with the previously saved values. 

In the HTML code, [edit-student-data-page#L3](https://github.com/ics-software-engineering/meteor-example-form/blob/master/app/imports/ui/pages/edit-student-data-page.html#L3) shows the first difference: the use of the Template.subscriptionsReady to delay the display of the page until the data is available. 

Moving to the Javascript code, [edit-student-data-page#L6](https://github.com/ics-software-engineering/meteor-example-form/blob/master/app/imports/ui/pages/edit-student-data-page.js#L6) shows the import of the constants from create-student-data-page. This avoids having to duplicate those strings on two pages.  

[edit-student-data-page#L21-L61](https://github.com/ics-software-engineering/meteor-example-form/blob/master/app/imports/ui/pages/edit-student-data-page.js#L21-L61) shows the implementation of the helper functions to provide values into the form. Note that these helper functions implement the [Meteor "guard" design pattern](https://dweldon.silvrback.com/guards) to prevent fields from being accessed when the associated object is not available.

Finally, the submit event handler is just like the one in Create Student Data, except for [Line 105](https://github.com/ics-software-engineering/meteor-example-form/blob/master/app/imports/ui/pages/edit-student-data-page.js#L105) which calls update rather than insert.

## Screencast

Click the image below to watch a 19 minute walkthrough of this system.

[<img src="https://github.com/ics-software-engineering/meteor-example-form/raw/master/doc/meteor-example-form-youtube.png" width="600">](https://www.youtube.com/watch?v=tVH90j1IrYI)


## Miscellaneous issues

This sample application includes the insecure package.  In production settings, you will need to create Meteor methods and invoke them in the submit event handlers rather than calling the insert and update operations directly.  

