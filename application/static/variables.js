prButtons = "#pr-buttons";
displayName = "#display-prName";
displayNum = "#display-prNumber";
tree = "#dir-tree-content";
searchResults = "#search-results";
spinner = "#spinner";
dirInput = "#dir-input";
searchType = "#search-type";
searchInfo = "#search-info";
jumbo = "#jumbo";
searching = false;

showCap = 20;

dataBtnClses = {
  btn: "list-group-item list-group-item-action p-2",
  num: "m-0",
  name: "m-0",
};

const xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = responseDatabase;

const xhttpDisp = new XMLHttpRequest();
xhttpDisp.onreadystatechange = responseDataOps;

function numStyle() {
  $(searchInfo).show();
  $(searchType).html("&nbspnumbers...");
}

function nameStyle() {
  $(searchInfo).show();
  $(searchType).html("&nbspnames...");
}

function showSearchResults() {
  searching = true;

  $(searchResults).show("fast");
  $(jumbo).hide("fast");

  $(tree).hide("fast");

  $(displayName).html("Name");
  $(displayNum).html("Number");

  $("#bookmark-toggle").attr({ "aria-pressed": false });
  $("#bookmark-toggle").removeClass("active");
  $("#bookmark-toggle").html("Bookmark");

  if ($(displayNum).parent().is("a")) {
    $(displayNum).unwrap();
  }
}

function showTree() {
  let findBookmarks = new Promise((resolve, reject) => {
    try {
      for (x of bookmarkNames) {
        if (x == $(displayName).html()) {
          $("#bookmark-toggle").attr({ "aria-pressed": true });
          $("#bookmark-toggle").addClass("active");
          $("#bookmark-toggle").html("Bookmarked");
        }
      }
      resolve("resolve");
    } catch {
      resolve("resolve");
    }
  });

  async function setDisplay() {
    findBookmarks.then((value) => {
      $(searchResults).hide("fast");
      $(searchInfo).hide("fast");
      $(tree).show("fast");
      $(jumbo).show("fast");
    });
  }

  setDisplay();
}
function expandPath(input) {
  let projectDir = "P:\\Projects";

  let prNumber = String(input);

  let year = prNumber.substr(0, 4);
  let num = prNumber.substr(4);

  if (prNumber.includes("M")) {
    year = prNumber.substr(1, 4);
    num = prNumber.substr(5);
  }

  projectDir += `\\${year}\\${prNumber}`;

  console.log(projectDir);

  return projectDir;
}

function preDatabase(input) {
  try {
    x = Number(input);
    if (isNaN(x)) throw "Input is name";
    key = "prProject";
    numStyle();
  } catch (err) {
    key = "prName";
    nameStyle();
  }

  if (input == "") {
    defaultStyle();
  }
  if (input.includes("\\")) {
    console.log(input);
    console.log(typeof input);
    postDataOps(input);
  } else {
    postDatabase(key, (value = input));
  }
}

function postDatabase(key, value) {
  xhttp.open("POST", "/http://intranet/database/results.ASP");
  xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  let requestData = `${key}=${value}`;
  console.log(requestData);
  xhttp.send(requestData);
}

function preDataOps(number, name) {
  let data = new Object();

  data.path = expandPath(number);
  data.num = number;
  data.name = name;

  $(displayName).html(name);

  postDataOps(data);
}

function postDataOps(data) {
  showTree();
  console.log(`[DATA TYPE]`);
  console.log(typeof data);
  if (typeof data == "object") {
    var directory = data.path;
    var number = data.num;
    var name = data.name;
  } else {
    var directory = data;
    var number = "0";
    var name = "";
  }

  // Send data to /update

  xhttpDisp.open("POST", "/update");
  xhttpDisp.setRequestHeader("Content-Type", "application/json");

  console.log(`[DATA SENT TO DATAOPS] ${directory}, ${number}`);

  xhttpDisp.send(
    JSON.stringify({ directory: directory, number: number, name: name })
  );
}

function responseDatabase() {
  if (xhttp.status == 500) {
    console.log("Unable to connect to database");
    let path = $(dirInput).attr("value");
    console.log(path);
    postDataOps(path);
  }

  if ((xhttp.readyState == 3 || 4) && xhttp.status != 500) {
    let btnData = [];
    let nums = [];
    let response = xhttp.responseText;

    let test = $(response).find("tbody").toArray();
    test.shift();

    let i = 0;

    for (x of test) {
      i++;
      let subelement = x.getElementsByTagName("td");
      let realNum = subelement[0].innerHTML;
      let realName = subelement[1].innerHTML;
      let btn = $("<a></a>").addClass(dataBtnClses.btn);
      let num = $("<h5></h5>").html(realNum).addClass(dataBtnClses.num);
      let name = $("<p></p>").html(realName).addClass(dataBtnClses.name);

      $(btn).append(num, name);

      $(btn).attr({
        onclick: `preDataOps(\"${realNum}\", \"${realName}\")`,
        href: "#",
        name: "goto-p",
      });

      btnData.push({
        html: btn[0].outerHTML,
        num: Number(
          subelement[0].innerHTML.replace(/[A-Z\s]/g, "").substring(0, 4)
        ),
      });

      if (i > showCap) {
        break;
      }
      var btnDataDup = btnData;
    }

    btnDataDup.sort(function (a, b) {
      return a.num - b.num;
    });
    console.log(btnDataDup);
    $(prButtons).html(
      btnDataDup
        .reverse()
        .map(function (elem) {
          return elem.html;
        })
        .join("")
    );
  }
}

function responseDataOps() {
  if (xhttpDisp.readyState == 1) {
    start = true;
    $(spinner).show();
  }

  // First item from data response

  if (xhttpDisp.readyState == 3 && start == true) {
    existingPath = $(xhttpDisp.response).attr("directory");
    prname = $(xhttpDisp.response).attr("prname");
    prnumber = $(xhttpDisp.response).attr("prnumber");
    console.log("(RECEIVING DATA STREAM)");

    $("#current-project-name").html(prname);
    $("#current-project-num").html(prnumber);
    $(displayNum).html(existingPath);
    $(displayNum).attr("data-clipboard-target", existingPath);
    start = false;
  }

  if (xhttpDisp.readyState == 4) {
    $(spinner).hide();
  }

  if (xhttpDisp.readyState == 3 || 4) {
    $(tree).html(xhttpDisp.response);

    if ($(tree).is(":hidden") && searching == false) {
      showTree();
    }
  }
}
