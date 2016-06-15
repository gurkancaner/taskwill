// Import Tinytest from the tinytest Meteor package.
import { Tinytest } from "meteor/tinytest";

import { name } from "meteor/gurkancaner:authorization";



// Write your tests here!
// Here is an example.
Tinytest.add('authorization working test', function (test) {
  test.equal(Role.isWorking(), true);
});
