# Notes on migration to node-simple-schema

Following the directions in [meteor-collection2](https://github.com/aldeed/meteor-collection2), I removed the old versions of simple schema and added the new ones. After a failure, I realized I needed to remove some other packages first. Here is what I ended up doing:

```
meteor remove fabienb4:autoform-semantic-ui
meteor remove aldeed:autoform
meteor remove aldeed:simple-schema aldeed:collection2
meteor add aldeed:collection2-core@2.0.0
meteor npm install --save simpl-schema
```
I verified that aldeed:simple-schema was not in .meteor/.versions; this took the removal of a few packages. 

Next, I changed the import statement in api/studentdata/studentdata.js, and changed the schema specification for the fields containing an array to the new syntax.

