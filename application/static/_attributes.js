const dirInputSet = {
  placeholder: "Project name or ID",
  class: "form-control m-4",
  type: "text",
  name: "search_input",
  onkeyup: "preDatabase(this.value)",
  onfocus: "showSearchResults()",
};

$("#dir-input").attr(dirInputSet);

const bookmarkSet = {
  class: "btn btn-block btn-secondary dropdown-toggle",
  type: "button",
  "data-offset": "-325,0",
  onclick: "loadBookmarks()",
  "data-toggle": "dropdown",
  "aria-haspopup": "true",
  "aria-expanded": "false",
};

$("#triggerId").attr(bookmarkSet);

const dropdownMenuSet = {
  class: "dropdown-menu",
  "aria-labelledby": "triggerId",
};

$("#bookmark-dropdown").attr(dropdownMenuSet);

const displayPrNumberSet = {
  "data-clipboard-target": "",
  href: "javascript:void(0)",
  class: "col m-4 lead text-truncate",
  onclick: "linkManager(this)",
};

$("#display-prNumber").attr(displayPrNumberSet);

const bookmarkToggleSet = {
  type: "button",
  onclick: "setBookmark()",
  class: "btn btn-outline-primary btn-sm col p-0 m-4 active",
  "data-toggle": "button",
  "aria-pressed": "true",
  autocomplete: "off",
};

$("#bookmark-toggle").attr(bookmarkToggleSet);
