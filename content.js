function modify() {
  var elements = document.getElementsByClassName("js-navigation-container js-active-navigation-container")[0];
  for (var i = 0; i < elements.children.length; i++) {
    var element = elements.children[i];
    var openedBy = element.getElementsByClassName("opened-by")[0];
    var author = openedBy.getElementsByClassName("Link--muted")[0].innerText;
    console.log(author);
    let imageURL = `https://github.com/${author}.png`;
    var doChecksPassed = true;
    var borderClass = "blue-border";
    if (element.getElementsByClassName("octicon-check").length > 0) { // PR merged
      borderClass = "green-border";
    } else if (element.getElementsByClassName("octicon-x").length > 0) { // PR closed
      doChecksPassed = false;
      borderClass = "red-border";
    }

    const approvalElement = openedBy.nextElementSibling.getElementsByClassName("Link--muted tooltipped tooltipped-s")[0];
    var isApproved = false;
    if (approvalElement !== undefined && approvalElement !== null) {
      const approval = approvalElement.innerHTML.trim();
      isApproved = approval.includes("Approved");
    }

    var statusText = "";
    var textColorClass = "blue-text";

    if (isApproved && doChecksPassed) {
      statusText = "Ready to merge";
      textColorClass = "green-text";
    } else if (isApproved) {
      statusText = "Checks failed";
      textColorClass = "red-text";
    } else {
      statusText = "Waiting for review";
      textColorClass = "blue-text";
    }

    let status = `<span class="${textColorClass} capsule d-inline-block mr-1 ml-1">${statusText}</span>`;
    const lastChild = element.children[0].getElementsByClassName("Link--primary v-align-middle no-underline h4 js-navigation-open markdown-title")[0];
    lastChild.insertAdjacentHTML("afterEnd", status);

    var icon = `<div class="flex-shrink-0 pt-2 pl-3"><img src="${imageURL}" alt="Description" class="circle ${borderClass}"></img></div>`;
    element.children[0].getElementsByClassName("flex-shrink-0 pt-2 pl-3")[0].insertAdjacentHTML("afterEnd", icon);
  }
}

var targetNode = document.getElementsByClassName('d-none d-md-inline-flex')[0];
var config = {childList: true};

// Running modification only after child list of PR is modified
var callback = function(mutationsList, observer) {
  if (mutationsList[0].type === 'childList') {
    modify()
  }
};

var observer = new MutationObserver(callback);
observer.observe(targetNode, config);