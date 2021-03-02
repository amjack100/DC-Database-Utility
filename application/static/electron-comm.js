try {
  const { ipcRenderer } = require("electron");
  const fs = require("fs");
  const process = require("process");
  const path = require("path");
} catch (err) {}

bookmarkNames = new Array();

function loadBookmarks() {
  bookmarkNames = [];
  $("#bookmark-dropdown").empty();
  for (x of userData) {
    let num = x.num.trim();
    let name = x.name.trim();

    bookmarkNames.push(name);

    let bookmarkBtn = $("<button></button>").addClass(
      "dropdown-item",
      "bookmark"
    );

    $(bookmarkBtn).html(name);
    $(bookmarkBtn).attr({
      onclick: `preDataOps(\"${num}\", \"${name}\")`,
      href: "#",
      id: "bookmark-item",
    });

    $("#bookmark-dropdown").append(bookmarkBtn);
  }
}

// bookmarks = path.join(__dirname, "bookmarks.json");

// let rawdata = fs.readFileSync(bookmarks);
// let bookmarkstwo = JSON.parse(rawdata);
console.log("dirname");
window.onload = () => {
  console.log("[WINDOW LOADED]");

  ipcRenderer.on("user-data", (event, args) => {
    console.log("[WINDOW RECEIVED DATA]");
    console.log(args);

    userData = args;

    event.sender.send("user-data-reply", args);
  });
};

function setBookmark() {
  let name = $("#display-prName").text();
  let num = $("#embedded-data").attr("number");

  let target = {
    name: name,
    num: num,
  };

  if ($("#bookmark-toggle").html() == "Bookmarked") {
    $("#bookmark-toggle").html("Bookmark");
    ipcRenderer.send("removeBookmark", target);
  } else {
    $("#bookmark-toggle").html("Bookmarked");
    ipcRenderer.send("setBookmark", target);
  }
  userDataLoaded = false;

  // target = JSON.stringify(target);
}

function linkManager(elem) {
  filePath = $(elem).attr("data-clipboard-target");

  console.log(elem);
  console.log(filePath);
  ipcRenderer.send("closeInfoWindow", filePath);
}
