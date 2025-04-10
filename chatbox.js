// ==UserScript==
// @name         Chatbox_Buddy
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  This script assists users in filling out the chatbox
// @match        https://t.corp.amazon.com/*
// @run-at       document-idle
// @grant        GM_xmlhttpRequest
// @connect      *
// @require      https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js
// @require      https://raw.githubusercontent.com/Thanatos-AKA/Chatbox_Buddy/refs/heads/main/Functions.js
// ==/UserScript==

(function () {
    'use strict';

    // 🧩 Observer to watch DOM mutations
    const observer = new MutationObserver(function (mutations, obs) {
    const chatBox = document.querySelector("div[contenteditable='true']");
    const communicationBox = document.querySelector("#communication");
    if (chatBox || communicationBox) {
        console.log("Chatbox or communication textarea detected");
        initFloatingPanel(chatBox || communicationBox);
        obs.disconnect(); // stop observing once found
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();

const events = {
    "Shredding tt": {
        "step1": "TPE Cluster SSD Shredding Requirement - 1st Nov, 2024 to Dec 31st, 2025 https://t.corp.amazon.com/P163509837/overview \n DAP: https://approvals.amazon.com/Approval/Details/32582057?ref_=pe_40497452_484050462 \n Red Media Moves Within of a Fence Line :https://approvals.amazon.com/Approval/Details/32869290 \n [tracking tt title][link]",
        "step2": "This is event2 role2 reply from git",
        "step3": "This is event2 role3 reply from git"
    },
    "Master tt": {
        "step1": "TPE62 SSD-SHREDDING-Phiston on [day]-[month] 2025: [link]",
        "step2": "This is event2 role2 reply from git",
        "step3": "This is event2 role3 reply from git"
    },
    "event3": {
        "role1": "This is event3 role1 reply from git",
        "role2": "This is event3 role2 reply from git",
        "role3": "This is event3 role3 reply from git"
    }
};

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
