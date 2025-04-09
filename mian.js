// ==UserScript==
// @name         Chatbox_Buddy
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  This script assists users in filling out the chatbox
// @match        https://www.instagram.com/direct/t/*
// @run-at       document-idle
// @grant        GM_xmlhttpRequest
// @connect      *
// @require      https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js
// ==/UserScript==

(function () {
    'use strict';

    // 🧩 Observer to watch DOM mutations
    const observer = new MutationObserver(function (mutations, obs) {
        const chatBox = document.querySelector("div[contenteditable='true']");
        if (chatBox) {
            console.log("Chatbox detected");
            initFloatingPanel(chatBox);
            obs.disconnect(); // stop observing once found
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();

// 🎨 Create floating panel with events, roles, and replies
function initFloatingPanel(chatBox) {
    const panel = document.createElement("div");
    panel.style.position = "fixed";
    panel.style.top = "100px";
    panel.style.right = "20px";
    panel.style.zIndex = 9999;
    panel.style.backgroundColor = "white";
    panel.style.border = "1px solid #aaa";
    panel.style.padding = "10px";
    panel.style.boxShadow = "0 0 10px rgba(0,0,0,0.2)";
    panel.style.borderRadius = "8px";
    panel.style.fontSize = "14px";
    panel.style.cursor = "move";
    panel.id = "messagePanel";

    const title = document.createElement("div");
    title.innerText = "💬 Select Event and Role:";
    title.style.marginBottom = "8px";
    title.style.fontWeight = "bold";

    const events = {
        "event1": {
            "role1": "This is event1 role1 reply",
            "role2": "This is event1 role2 reply",
            "role3": "This is event1 role3 reply"
        },
        "event2": {
            "role1": "This is event2 role1 reply",
            "role2": "This is event2 role2 reply",
            "role3": "This is event2 role3 reply"
        },
        "event3": {
            "role1": "This is event3 role1 reply",
            "role2": "This is event3 role2 reply",
            "role3": "This is event3 role3 reply"
        }
    };

    const eventSelect = document.createElement("select");
    eventSelect.style.marginBottom = "8px";
    for (const event in events) {
        const option = document.createElement("option");
        option.value = event;
        option.innerText = event;
        eventSelect.appendChild(option);
    }

    const roleSelect = document.createElement("select");
    roleSelect.style.marginBottom = "8px";
    roleSelect.disabled = true;

    const replyContainer = document.createElement("div");
    replyContainer.style.marginTop = "8px";

    eventSelect.addEventListener("change", () => {
        const selectedEvent = eventSelect.value;
        roleSelect.innerHTML = ""; // 清空角色選單
        roleSelect.disabled = false;

        for (const role in events[selectedEvent]) {
            const option = document.createElement("option");
            option.value = role;
            option.innerText = role;
            roleSelect.appendChild(option);
        }

        updateReply(); // 更新回覆訊息
    });

    roleSelect.addEventListener("change", updateReply);

    function updateReply() {
        const selectedEvent = eventSelect.value;
        const selectedRole = roleSelect.value;

        replyContainer.innerHTML = ""; // 清空回覆按鈕

        if (selectedEvent && selectedRole) {
            const reply = events[selectedEvent][selectedRole];
            const btn = document.createElement("button");
            btn.innerText = reply;
            btn.style.display = "block";
            btn.style.marginBottom = "5px";
            btn.style.width = "100%";
            btn.style.cursor = "pointer";
            btn.onclick = () => {
                fillChatbox(chatBox, reply);
            };
            replyContainer.appendChild(btn);
        }
    }

    panel.appendChild(title);
    panel.appendChild(eventSelect);
    panel.appendChild(roleSelect);
    panel.appendChild(replyContainer);
    document.body.appendChild(panel);
    makeDraggable(panel);
}

// ✍️ Fill chatbox with selected reply
function fillChatbox(chatBox, message) {
    chatBox.focus();
    document.execCommand("selectAll", false, null);
    document.execCommand("delete", false, null);
    document.execCommand("insertText", false, message);
}

// 🖱️ Make the floating panel draggable
function makeDraggable(elmnt) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

    // 確保面板使用 absolute 定位
    elmnt.style.position = "absolute";

    elmnt.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
        // 如果點擊的是下拉選單，則不啟動拖動
        if (e.target.tagName === "SELECT") {
            return;
        }

        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;

        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}
