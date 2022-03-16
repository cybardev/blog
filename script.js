/**
 * Script to control the functionality of the Blog tool
 *
 * CSCI-2356 Project: Phase 1
 *
 * @author Mohak Shrivastava (A00445470)
 * @author Nayem Imtiaz (A00448982)
 * @author Naziya Tasnim (A00447506)
 * @author Sheikh Saad Abdullah (A00447871)
 */

/**
 * Alias to create DOM object with specified selector
 *
 * @author Sheikh Saad Abdullah (A00447871)
 * @param {String} selector selector of the element
 * @returns DOM Object of first element with specified selector
 */
const $ = (selector) => document.querySelector(selector);

/**
 * Alias to create Array of DOM objects with specified selector
 *
 * @author Sheikh Saad Abdullah (A00447871)
 * @param {String} selector selector of the elements
 * @returns Array of DOM Objects of elements with specified selector
 */
const $_ = (selector) => document.querySelectorAll(selector);

const NUM_POSTS = 3; // number of blog posts
const ERR_INDEX = -1; // placeholder index value
const storageAvailable = typeof Storage !== "undefined"; // check for browser support of storage

// log error if storage is unavailable
if (!storageAvailable) {
    console.error("Local storage unavailable.");
}

// load blog list into local storage
window.onload = () => {
    if (storageAvailable) {
        let arr = [];
        let data = JSON.parse(localStorage.getItem("blogs")) || [];
        for (let i = 0; i < NUM_POSTS; i++) {
            if (typeof data[i] === "undefined") {
                arr[i] = {
                    name: `Blog ${i + 1}`,
                    content: "",
                    published: false,
                };
            }
        }
        localStorage.setItem("blogs", JSON.stringify(arr));
        console.log(JSON.parse(localStorage.getItem("blogs")));
    }
};

// global data store for Alpine.js
const staticData = {
    /** ---------------------------- Blog List ----------------------------
     * Database to store the list of blogs and publication states
     *
     * @author Sheikh Saad Abdullah (A00447871)
     * -------------------------------------------------------------------- */

    /** ---------------------------- Edit Group ---------------------------
     * Variables and functions to control the behaviour
     * of the group of toggle switches and list of blog posts displayed
     *
     * @author Mohak Shrivastava (A00445470)
     * @author Nayem Imtiaz (A00448982)
     * @author Sheikh Saad Abdullah (A00447871)
     * -------------------------------------------------------------------- */

    editOn: false, // whether a blog is being edited
    currentlyEditing: ERR_INDEX, // index of the blog being edited

    /**
     * Saves the blog post content to the database
     *
     * @author Nayem Imtiaz (A00448982)
     * @author Sheikh Saad Abdullah (A00447871)
     * @returns string to populate text area with
     */
    save() {
        if (storageAvailable) {
            const index = this.currentlyEditing;
            const data = {
                name: $(`#bl-name-${index + 1}`).value,
                content: $("#editbox").value,
                published: $(`#bl-publish-${index + 1}`).checked,
            };
            localStorage.setItem(`blog${index}`, JSON.stringify(data));
        }
    },

    /**
     * Populate the text area with the currently editing blog content
     *
     * @author Nayem Imtiaz (A00448982)
     * @returns string to populate text area with
     */
    getEditText() {
        return this.currentlyEditing < 0
            ? ""
            : JSON.parse(localStorage.getItem(`blog${this.currentlyEditing}`))
                  .content;
    },

    /**
     * Enable or disable the editing of a blog post
     *
     * @author Mohak Shrivastava (A00445470)
     * @param {Object} elem DOM object of the switched edit toggle
     * @param {Integer} index index of the toggle switch
     */
    editText(elem, index) {
        $_(".bl-name-text")[index].disabled = this.editOn;

        this.editOn = !this.editOn;
        this.currentlyEditing = index;

        $_(".bl-edit-toggle").forEach((el) => {
            if (!el.checked) {
                el.style.visibility = elem.checked ? "hidden" : "visible";
            }
        });

        if (!this.editOn) {
            this.kbdFocus = $("#editbox");
        }
    },

    /** ----------------------------- Keyboard ----------------------------
     * Variables and functions to control behaviour of the Keyboard
     *
     * @author Naziya Tasnim (A00447506)
     * -------------------------------------------------------------------- */

    kbdFocus: null, // text field to focus
    shiftOn: false, // state of the shift key

    /**
     * Adds a character to the text area
     *
     * @author Naziya Tasnim (A00447506)
     * @param {String} selection character to add to text area
     */
    addChar(selection) {
        // DOM object of the text area
        let words = this.kbdFocus ? this.kbdFocus : $("#editbox");

        // Get the value from the id'ed field
        let currChars = words.value;

        if (selection === "del") {
            // Set the id'ed field to a shortened string
            words.value = currChars.substring(0, currChars.length - 1);
        } else {
            // handle shift toggle
            if (this.shiftOn) {
                selection = selection.toUpperCase();
                this.shiftOn = !this.shiftOn;
            }
            // Set the id'ed field to the longer string
            words.value = currChars.concat(selection);
        }
    },

    // special keys
    sp: {
        shift: "shift",
        delete: "delete",
        return: "return",
        space: "space",
    },

    // alphanumeric and punctuation keys
    glyphs: [
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "0",
        "q",
        "w",
        "e",
        "r",
        "t",
        "y",
        "u",
        "i",
        "o",
        "p",
        "a",
        "s",
        "d",
        "f",
        "g",
        "h",
        "j",
        "k",
        "l",
        '"',
        "z",
        "x",
        "c",
        "v",
        "b",
        "n",
        "m",
        ".",
        "?",
        ",",
    ],
};
