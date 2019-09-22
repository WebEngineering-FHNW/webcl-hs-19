// starting the all test suite asynchronously while exposing the total count of tests to the user
// This is in an extra file such that the allTests can be bundled directly from the suite into a synchronous bundle

import './allTestsSuite.js'

import { total } from "./test/test.js"

document.getElementById('grossTotal').innerText = "" + total + " Tests";
