// ==UserScript==
// @name         Chatbox_Buddy
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  This script assists users in filling out the chatbox
// @match        https://t.corp.amazon.com/*
// @run-at       document-idle
// @grant        GM_xmlhttpRequest
// @connect      *
// @require      https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js
// ==/UserScript==

const events = {
    "option1": {
        "event1": {
            "task1": "This is rely option1, event1, task1 reply on IG",
            "task2": "This is rely option1, event1, task2 reply on IG"
        },
        "event2": {
            "task1": "This is rely option1, event2, task1 reply on IG",
            "task2": "This is rely option1, event2, task2 reply on IG"
        }
    },
    "option2": {
        "event1": {
            "task1": "This is rely option2, event1, task1 reply on IG",
            "task2": "This is rely option2, event1, task2 reply on IG"
        },
        "event2": {
            "task1": "This is rely option2, event2, task1 reply on IG",
            "task2": "This is rely option2, event2, task2 reply on IG"
        }
    },
    "option3": {
        "event1": {
            "task1": "This is rely option3, event1, task1 reply on IG",
            "task2": "This is rely option3, event1, task2 reply on IG"
        },
        "event2": {
            "task1": "This is rely option3, event2, task1 reply on IG",
            "task2": "This is rely option3, event2, task2 reply on IG"
        }
    }
};

(function () {
    'use strict';

    // Add CSS styles
    const style = document.createElement("style");
    style.innerHTML = `
        .chat-buddy-panel {
            background-color: #333;
            color: white;
            border: 1px solid #555;
            position: fixed;
            top: 100px;
            right: 20px;
            z-index: 9999;
            padding: 10px;
            box-shadow: 0 0 10px rgba(0,0,0,0.5);
            border-radius: 8px;
            font-size: 14px;
            cursor: move;
        }
        .chat-buddy-title {
            margin-bottom: 8px;
            font-weight: bold;
        }
        .chat-buddy-dropdown {
            margin-bottom: 8px;
            background-color: #444;
            color: white;
            border: 1px solid #555;
        }
        .chat-buddy-button {
            background-color: #444;
            color: white;
            border: 1px solid #555;
            cursor: pointer;
            margin-bottom: 5px;
            width: 100%;
        }
        .chat-buddy-reply-container {
            margin-top: 8px;
        }
    `;
    document.head.appendChild(style);

    const observer = new MutationObserver((mutations, obs) => {
        const communicationBox = document.getElementById("communication");

        if (communicationBox) {
            console.log("Communication box detected");
            initFloatingPanel(communicationBox);
            obs.disconnect(); // Stop observing once the element is found and handled
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();

function initFloatingPanel(communicationBox) {
    const panel = document.createElement("div");
    panel.classList.add("chat-buddy-panel");

    const title = document.createElement("div");
    title.classList.add("chat-buddy-title");
    title.innerText = "💬 Select Event, Role, and Task:";

    const eventSelect = createOrUpdateDropdown(null, Object.keys(events), "Select Event");
    const roleSelect = createOrUpdateDropdown(null, [], "Select Role", true);
    const taskSelect = createOrUpdateDropdown(null, [], "Select Task", true);
    const replyContainer = document.createElement("div");
    replyContainer.classList.add("chat-buddy-reply-container");

    // Reset roleSelect, taskSelect, and replyContainer when a new event is selected
    handleDropdownChange(eventSelect, roleSelect, (selectedEvent) => {
        return events[selectedEvent] ? Object.keys(events[selectedEvent]) : [];
    }, "Select Role", [taskSelect, replyContainer]);

    // Reset taskSelect and replyContainer when a new role is selected
    handleDropdownChange(roleSelect, taskSelect, (selectedRole) => {
        const selectedEvent = eventSelect.value;
        return events[selectedEvent] && events[selectedEvent][selectedRole]
            ? Object.keys(events[selectedEvent][selectedRole])
            : [];
    }, "Select Task", [replyContainer]);

    taskSelect.addEventListener("change", () => {
        const selectedEvent = eventSelect.value;
        const selectedRole = roleSelect.value;
        const selectedTask = taskSelect.value;

        replyContainer.innerHTML = "";
        if (selectedEvent && selectedRole && selectedTask) {
            const reply = events[selectedEvent][selectedRole][selectedTask];
            if (typeof reply === "string") {
                const btn = document.createElement("button");
                btn.classList.add("chat-buddy-button");
                btn.innerText = reply;
                btn.onclick = () => fillChatbox(communicationBox, reply);
                replyContainer.appendChild(btn);
            } else {
                console.error("Reply is not a string:", reply);
            }
        }
    });

    panel.appendChild(title);
    panel.appendChild(eventSelect);
    panel.appendChild(roleSelect);
    panel.appendChild(taskSelect);
    panel.appendChild(replyContainer);
    document.body.appendChild(panel);
    makeDraggable(panel);
}

function createOrUpdateDropdown(select, options, placeholder, disabled = false) {
    if (!select) {
        select = document.createElement("select");
        select.classList.add("chat-buddy-dropdown");
    }
    select.innerHTML = "";
    select.disabled = disabled;

    const placeholderOption = document.createElement("option");
    placeholderOption.innerText = placeholder;
    placeholderOption.disabled = true;
    placeholderOption.selected = true;
    select.appendChild(placeholderOption);

    options.forEach(option => {
        const opt = document.createElement("option");
        opt.value = option;
        opt.innerText = option;
        select.appendChild(opt);
    });

    return select;
}

function handleDropdownChange(parentSelect, childSelect, optionsGetter, placeholder, resetElements = []) {
    parentSelect.addEventListener("change", () => {
        const selectedValue = parentSelect.value;
        const options = optionsGetter(selectedValue);

        // Reset the child dropdown
        createOrUpdateDropdown(childSelect, options, placeholder, options.length === 0);

        // Reset additional elements (e.g., replyContainer, other dropdowns)
        resetElements.forEach(element => {
            if (element.tagName === "SELECT") {
                createOrUpdateDropdown(element, [], "Select", true);
            } else {
                element.innerHTML = ""; // Clear content for non-dropdown elements
            }
        });
    });
}

function makeDraggable(elmnt) {
    let offsetX = 0, offsetY = 0, startX = 0, startY = 0;

    elmnt.onmousedown = (e) => {
        if (e.target.tagName === "SELECT") return;
        e.preventDefault();
        startX = e.clientX;
        startY = e.clientY;

        document.onmousemove = (e) => {
            e.preventDefault();
            offsetX = startX - e.clientX;
            offsetY = startY - e.clientY;
            startX = e.clientX;
            startY = e.clientY;

            elmnt.style.top = (elmnt.offsetTop - offsetY) + "px";
            elmnt.style.left = (elmnt.offsetLeft - offsetX) + "px";
        };

        document.onmouseup = () => {
            document.onmousemove = null;
            document.onmouseup = null;
        };
    };
}

function fillChatbox(chatBox, message) {
    chatBox.focus();
    document.execCommand("insertText", false, message);
}
