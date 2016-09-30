This sample application illustrates how to manipulate user input using forms with [Meteor 1.4](http://meteor.com), [BlazeJS](http://blazejs.org/), and [Semantic UI](http://semantic-ui.com/).

## Prerequisites

To best understand this application, it is useful to first familiarize yourself with:

* [Meteor Application Template](http://ics-software-engineering.github.io/meteor-application-template/). This sample application illustrates conventions for directory layout, naming conventions, routing, integration of Semantic UI, and coding standards. Meteor-example-form is based on this template, so we won't discuss any of these issues here.

* [Blaze Templates](http://blazejs.org/guide/spacebars.html). Read this documentation to learn about HTML spacebars and the various Javascript utilities (helpers, onCreated, onRendered, etc.).
 
* [Semantic UI Forms](http://semantic-ui.com/collections/form.html). Read this documentation to learn the CSS classes defined by Semantic UI to create nicely styled forms.

* [Validating data with Simple Schema](https://github.com/aldeed/meteor-simple-schema#validating-data). Actually, you'll probably need to familiarize yourself with all of Simple Schema, but the section on data validation is crucial to understanding this sample application.

* [Reactive Dict, Reactive Vars, and Session Variables](https://themeteorchef.com/snippets/reactive-dict-reactive-vars-and-session-variables/).  This application uses Reactive Dictionaries. I found this blog posting to be a very concise and useful explanation of them and how they relate to other mechanisms like Session variables.

## Preinstalled packages

This application requires two additional packages beyond the base packages and those already added for meteor-application-template:

```
aldeed:collection2             2.10.0  Automatic validation of insert and update operations on the client and server.
reactive-dict                  1.1.8  Reactive dictionary
```

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

For arcane reasons, form processing using Semantic UI requires you to remove the autopublish package and to explicitly publish and subscribe to collections. 

For simplicity's sake, this example application publishes all of the StudentData collection in [publications.js](https://github.com/ics-software-engineering/meteor-example-form/blob/master/app/imports/startup/server/publications.js). 

This application only needs to subscribe to the collection on the Edit Student Data page, since that's the only page that needs to reference pre-existing StudentData.  Unfortunately, the subscription process is not at all straightforward: take a look at [edit-student-data-page.js#L74-L83](https://github.com/ics-software-engineering/meteor-example-form/blob/master/app/imports/ui/pages/edit-student-data-page.js#L74-L83) .

Ugh. The basic issue is this:  Semantic UI needs to invoke JQuery to initialize its fancy Javascript selection drop down processing apparatus. And JQuery needs the DOM to be rendered to work correctly.  Plus, we need to wait for the StudentData collection to be available.  Since Meteor is reactive, we normally don't worry about DOM manipulation and so forth, but Semantic UI forces us to worry about it because they require us to call JQuery. This solution (arrived at after much failed experimentation) is to subscribe to the data with a callback that sets another callback to be invoked after Tracker completes its rendering of the DOM. 

The bright side of this? I believe this code snippet illustrates a general solution to the problem of "How do I integrate a third party library that depends upon JQuery into my Meteor app"? Maybe.

(If you think you know of a more simple way to handle this issue, please let me know or issue a pull request.)

#### Create Student Data

Now let's get look at the first of the two pages: Create Student Data, and start with the HTML code.

[create-student-data-page.html](https://github.com/ics-software-engineering/meteor-example-form/blob/master/app/imports/ui/pages/create-student-data-page.html) is the HTML template for accepting data for insertion into the StudentData collection. 
 
This looks like fairly standard [Semantic UI Form](http://semantic-ui.com/collections/form.html) code. 

Note that [create-student-data-page.html#L5](https://github.com/ics-software-engineering/meteor-example-form/blob/master/app/imports/ui/pages/create-student-data-page.html#L5) augments the "ui form" class declaration with two helpers: successClass and errorClass. These helpers return the strings "success" or "error" when the form has been successfully submitted or has been found to contain errors, respectively. Otherwise (such as when the page is first displayed), they return the empty string. So, think of the page as containing three states: "empty" (i.e. just retrieved), "success" (the form data was just submitted and there were no errors), or "error" (the form data was submitted and errors were found).

[create-student-data-page.html#L13-L17](https://github.com/ics-software-engineering/meteor-example-form/blob/master/app/imports/ui/pages/create-student-data-page.html#L13-L17) illustrates how error notifications are inserted. If the helper displayNameFieldError returns truthy, then the div is included in the page. There are two more of these error helpers: displayLevelFieldError and displayGpaFieldError.

[create-student-data-page.html#L121-L125](https://github.com/ics-software-engineering/meteor-example-form/blob/master/app/imports/ui/pages/create-student-data-page.html#L121-L125) shows a similar approach to the error fields, but this time the notification displayed indicates that the form data was valid and a new StudentData document was created and can now be edited on the other page. 

Now let's turn to the Javascript side of Create Student Data.

[create-student-data-page.js#L11-L16](https://github.com/ics-software-engineering/meteor-example-form/blob/master/app/imports/ui/pages/create-student-data-page.js#L11-L16) shows the onCreated handler.  This handler sets up a Reactive Dictionary to hold displaySuccessMessage, indicating if we want to display the success message, and displayErrorMessages, indicating if we want to display one or more error messages. Note that they are initialized to false, indicating that we are in the third state (neither success nor failure).

[create-student-data-page.js#L18-L40](https://github.com/ics-software-engineering/meteor-example-form/blob/master/app/imports/ui/pages/create-student-data-page.js#L18-L40) shows the helper functions for this page. They alter the appearance of the page through reactive variables (either through the messageFlags reactive dict or through the reactive variables created by the Simple Schema validation mechanism).

[create-student-data-page.js#L42-L49](https://github.com/ics-software-engineering/meteor-example-form/blob/master/app/imports/ui/pages/create-student-data-page.js#L42-L49) shows the onRendered callback function which is responsible for loading the Semantic UI javascript to make the form elements look good. Because there are no subscriptions on this page, the code is straightforward (in constrast to the code required for the Edit Student Data page).


[create-student-data-page.js#L51-L89](https://github.com/ics-software-engineering/meteor-example-form/blob/master/app/imports/ui/pages/create-student-data-page.js#L51-L89)  shows the events callback for handling the submit button event. As is usual in Meteor event processing, the first thing is to disable the default event handling. The following code provides examples of how to extract form values from the various input types: text fields, text areas, checkboxes, radio buttons, single selection, and multiple selection.  After this, the handler creates an object called newStudentData that gathers together these values.  

This object is "cleaned" manually in order to make it correspond to the same object that will be checked by the Collection2 hook function as part of the insert process. Finally, we validate the form data and set the reactive variables appropriately.  Note that changing the reactive variable values is all that is needed to cause the page contents to be updated.  

#### Edit Student Data

The Edit Student Data HTML and Javascript has a lot of duplicated code.  This is intentional for pedagogical reasons: I think it is easier to figure out how form processing works when the code for creation and updating are shown in isolation. That said, when you create your own production code, you will probably want to refactor out a "component" to eliminate redundancy.

In the HTML code, [edit-student-data-page#L3](https://github.com/ics-software-engineering/meteor-example-form/blob/master/app/imports/ui/pages/edit-student-data-page.html#L3) shows the first difference: the use of the Template.subscriptionsReady to delay the display of the page until the data is available. 

The other significant difference on this page is the invocation of helper functions to provide values for all of the form values. 

Moving to the Javascript code, [edit-student-data-page#L14-L16](https://github.com/ics-software-engineering/meteor-example-form/blob/master/app/imports/ui/pages/edit-student-data-page.js#L14-L16) shows how to set up the subscription to the StudentData collection. In reality, this page does not need the entire StudentData collection, only the specific document referenced in the URL, so a more efficient solution would be a subscription that only retrieves a single document. But this approach was chosen as the simplest one since the focus is on form processing.

[edit-student-data-page#L24-L70](https://github.com/ics-software-engineering/meteor-example-form/blob/master/app/imports/ui/pages/edit-student-data-page.js#L24-L70) show the helper functions. Several of these refer to the URL to determine the id of the StudentData document of interest, then return a value appropriate to setting a form field value.  The remainder replicate the validation handlers from the Create Student Data page.

[edit-student-data-page#L72-L85](https://github.com/ics-software-engineering/meteor-example-form/blob/master/app/imports/ui/pages/edit-student-data-page.js#L72-L85) shows that in the case of this page where we have subscriptions, the Semantic UI Javascript initialization code must be in a Tracker.afterFlush callback which is itself in an onRendered callback. Wow.

Finally, the submit event handler is identical to the one in the Create Student Data page except for [edit-student-data-page#L119](https://github.com/ics-software-engineering/meteor-example-form/blob/master/app/imports/ui/pages/edit-student-data-page.js#L119) which calls update rather than insert.

## Screencast

Click the image below to watch a 19 minute walkthrough of this system.

[<img src="https://github.com/ics-software-engineering/meteor-example-form/raw/master/doc/meteor-example-form-youtube.png" width="600">](https://www.youtube.com/watch?v=cEoPDdY-iW4)


## Miscellaneous issues

This sample application includes the insecure package.  In production settings, you will need to create Meteor methods and invoke them in the submit event handlers rather than calling the insert and update operations directly.  

This code represents my best understanding of form processing for Meteor 1.4 and Semantic UI, but there may be better ways to do it. Please contact me (or issue a pull request) with your suggestions; they are appreciated.





















