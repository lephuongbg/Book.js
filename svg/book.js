var mouseDragging = false; // indicate dragging state
var mouseOffSetX = 0;      // indicate offset for proper dragging object
var dragX = 0;
var actedFlipNext = true;
// When mouse button presses
function mouseDown(evt) {
   // initiate dragging state
   mouseDragging = true;
   // reserve this for future object dragging
   var sLine = document.getElementById("symmetry-line");
   if (sLine) {
      var p = document.documentElement.createSVGPoint();
      p.x = evt.clientX;
      p.y = evt.clientY;
      var CTM = document.getElementById("symmetry-group").getScreenCTM();
      p = p.matrixTransform(CTM.inverse());
      mouseOffSetX = p.x - dragX;
   }
   
   // clear all selection to avoid dragging text bug
   if (window.getSelection) {
   if (window.getSelection().empty) {  // Chrome
      window.getSelection().empty();
   } else if (window.getSelection().removeAllRanges) {  // Firefox
      window.getSelection().removeAllRanges();
   }
   } else if (document.selection) {  // IE?
   document.selection.empty();
   }
}
// When mouse button releases
function mouseUp(evt) {
   // stop dragging state
   mouseDragging = false;
   
   if (document.getElementById("next-left-content").getAttribute("transform") == "translate(280,330)") {
      doneFlippingNext();
   }
}

// When mouse button moving
function mouseMove(evt) {
   // get current mouse position
   var p = document.documentElement.createSVGPoint();
   p.x = evt.clientX;
   p.y = evt.clientY;
   actedFlipNext = true;
   
   if (mouseDragging) {
      // get needed objects
      var sLine = document.getElementById("symmetry-line");
      var hideRightMask = document.getElementById("hideCurrentRightPage-mask");
      var nextLeft = document.getElementById("next-left-container");
      var revealLeftMask = document.getElementById("revealNextLeftPage-mask");
      var nextLeftContent = document.getElementById("next-left-content");
      
      // bring next-left-page to top
      nextLeft.parentNode.appendChild(nextLeft);
      
      // get the transformation matrix
      var CTM = document.getElementById("symmetry-group").getScreenCTM();
      
      // convert mouse position to svg coordinate
      p = p.matrixTransform(CTM.inverse());
      dragX = p.x - mouseOffSetX;
      if ( (dragX) > 0 && (dragX) < 260) {
         sLine.setAttribute("transform", "translate(" + dragX + ",0) rotate(" + 45*(dragX)/260 +")");
         hideRightMask.setAttribute("transform", "translate(" + dragX + ",0) rotate(" + 45*(dragX)/260 +")");
         nextLeftContent.setAttribute("transform", "translate(" + (dragX + 280) + ",330) rotate(" + 90*(dragX)/260 +") translate(" + dragX + ",0)");
         revealLeftMask.setAttribute("transform", "translate(" + dragX + ",0) rotate(" + 45*(dragX)/260 +")");
      } else if ( (dragX) >= 260) {
         sLine.setAttribute("transform", "translate(260,0) rotate(45)");
         revealLeftMask.removeAttribute("transform");
         hideRightMask.setAttribute("transform", "translate(260,0) rotate(45)");
         nextLeftContent.setAttribute("transform", "translate(540,330) rotate(90) translate(260,0)");
      } else {
         sLine.removeAttribute("transform");
         hideRightMask.removeAttribute("transform");
         revealLeftMask.removeAttribute("transform");
         nextLeftContent.setAttribute("transform", "translate(280,330)");
         actedFlipNext = false;
      }
   }
}
function reAttachEvent(){
   // clear all event listeners
   var oldBook = document.getElementById("book");
   var cloneBook = oldBook.cloneNode(true);
   oldBook.parentNode.replaceChild(cloneBook, oldBook);
   
   // reattach related functions to all event listeners
   var nextLeftContent = document.getElementById("next-left-content");
   var currentRightContent = document.getElementById("current-right-content");

   nextLeftContent.addEventListener("mousedown", mouseDown, false);
   nextLeftContent.addEventListener("mouseup", mouseUp, false);
   nextLeftContent.addEventListener("mousemove", mouseMove, false);
   currentRightContent.addEventListener("mousedown", mouseDown, false);
   currentRightContent.addEventListener("mouseup", mouseUp, false);
   currentRightContent.addEventListener("mousemove", mouseMove, false);
}
function doneFlippingNext(){
   // prevent trigger again
   if (actedFlipNext)
      return;
   
   // move center-line to top
   var centerLine = document.getElementById("center-line");
   centerLine.parentNode.appendChild(centerLine);
   centerLine.parentNode.insertBefore(document.getElementById("symmetry-line-container"), centerLine);
   
   /* Restructure the right pages */
   var nextRight = document.getElementById("next-right-container");
   var currentRight = document.getElementById("current-right-container");
   var previousRight = document.getElementById("previous-right-container");
   
   nextRight.parentNode.insertBefore(previousRight, nextRight);
   previousRight.parentNode.insertBefore(currentRight, previousRight);
   // next to current
   nextRight.setAttribute("id", "current-right-container");
   document.getElementById("hideCurrentRightPage-mask").setAttribute("transform", "translate(260,0) rotate(45)");
   nextRight.setAttribute("mask", "url(#hideCurrentRightPage)");
   nextRight.firstElementChild.setAttribute("id", "current-right-content");
   nextRight.firstElementChild.firstElementChild.setAttribute("id", "current-right-page");
   // previous to next
   previousRight.setAttribute("id", "next-right-container");
   previousRight.firstElementChild.setAttribute("id", "next-right-content");
   previousRight.firstElementChild.firstElementChild.setAttribute("id", "next-right-page");
   // current to previous
   currentRight.setAttribute("id", "previous-right-container");
   currentRight.removeAttribute("mask");
   currentRight.firstElementChild.setAttribute("id", "previous-right-content");
   currentRight.firstElementChild.firstElementChild.setAttribute("id", "previous-right-page");
   
   /* Restructure the left pages */
   var nextLeft = document.getElementById("next-left-container");
   var currentLeft = document.getElementById("current-left-container");
   var previousLeft = document.getElementById("previous-left-container");
   
   nextLeft.parentNode.insertBefore(previousLeft, nextLeft);
   previousLeft.parentNode.insertBefore(currentLeft, previousLeft);
   // next to current
   nextLeft.setAttribute("id", "current-left-container");
   nextLeft.removeAttribute("mask");
   nextLeft.firstElementChild.setAttribute("id", "current-left-content");
   nextLeft.firstElementChild.firstElementChild.setAttribute("id", "current-left-page");
   // previous to next
   previousLeft.setAttribute("id", "next-left-container");
   previousLeft.setAttribute("mask", "url(#revealNextLeftPage)");
   previousLeft.firstElementChild.setAttribute("id", "next-left-content");
   previousLeft.firstElementChild.firstElementChild.setAttribute("id", "next-left-page");
   // current to previous
   currentLeft.setAttribute("id", "previous-left-container");
   currentLeft.firstElementChild.setAttribute("id", "previous-left-content");
   currentLeft.firstElementChild.firstElementChild.setAttribute("id", "previous-left-page");
   
   document.getElementById("symmetry-line").setAttribute("transform", "translate(260,0) rotate(45)");
   dragX = 260;
   reAttachEvent();
   actedFlipNext = true;
}
function init() {
   var nextLeftContent = document.getElementById("next-left-content");
   var currentRightContent = document.getElementById("current-right-content");
   
   nextLeftContent.addEventListener("mousedown", mouseDown, false);
   nextLeftContent.addEventListener("mouseup", mouseUp, false);
   nextLeftContent.addEventListener("mousemove", mouseMove, false);
   currentRightContent.addEventListener("mousedown", mouseDown, false);
   currentRightContent.addEventListener("mouseup", mouseUp, false);
   currentRightContent.addEventListener("mousemove", mouseMove, false);
   
   // Initiate X state
   dragX = 260;
} 
