// Require some modules
var monthNames = require('./months.json');
window.jQuery = window.$ = require('../../bower_components/jquery/dist/jquery.min.js');
require('../../bower_components/semantic-ui/dist/semantic.min.js');

// Require Electron modules
var clipboard = require('clipboard');
var remote = require('remote');

// Set up some variables
var browserWindow = remote.getCurrentWindow();

/**
 * BROWSER HEIGHT
 *
 * The document and browser window height are a little different between
 * different OSs. So, to fix that, we start off with the window height a little
 * short. Then we resize the window to the height of the document so it's just
 * right.
 */
// Get the height difference between the document and the window
var diff = $(document).height() - $(window).height();
// Get the browser height and width
var browserSize = browserWindow.getSize();
// Resize the browser height
browserWindow.setSize(browserSize[0], browserSize[1] + diff);

/**
 * CLIPBOARD BUTTONS
 *
 * Set up the buttons.
 */
var $buttons = $('.button');
// Initialize popups
$buttons.popup({position: 'top center'});
// Get todays date in the required format
var date = getDateString();
// Build video title
$buttons.each(function (index, el) {
    var $button = $(el);
    var time = $button.data('time');
    var title = 'Sunday Morning, ' + time + ', ' + date;
    // Set button text
    $button.data('content', title);
});
// Set up click event copy to clipboard
$buttons.on('click', function () {
    var $button = $(this);
    // Copy the video title to the clipboard
    clipboard.writeText($button.data('content'));
    // Jiggle the button to indicate success
    $button.transition('jiggle');
});

/**
 * Builds a date string the way we want it for the video title.
 * @example January 1st, 2015
 * @return string
 */
function getDateString() {
    var today = new Date();
    var month = monthNames[today.getMonth()];
    var day = getOrdinal(today.getDate());
    var year = today.getFullYear();
    return month + ' ' + day + ', ' + year;
}

/**
 * Converts a number to its ordinal value.
 * @example 1 becomes "1st"
 * @param  int n number to be converted
 * @return string
 */
function getOrdinal(n) {
    var s=["th","st","nd","rd"],
        v=n%100;
    return n+(s[(v-20)%10]||s[v]||s[0]);
}