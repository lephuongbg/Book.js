var mouseDragging = false; // indicate dragging state
var mouseOffSetX = 0;      // indicate offset for proper dragging object
var dragX = 0;
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
}

// When mouse button moving
function mouseMove(evt) {
   // get current mouse position
   var p = document.documentElement.createSVGPoint();
   p.x = evt.clientX;
   p.y = evt.clientY;
   
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
      if ( (p.x-mouseOffSetX) > 0 && (p.x-mouseOffSetX) < 260) {
         sLine.setAttribute("transform", "translate(" + dragX + ",0) rotate(" + 45*(p.x-mouseOffSetX)/260 +")");
         hideRightMask.setAttribute("transform", "translate(" + dragX + ",0) rotate(" + 45*(p.x-mouseOffSetX)/260 +")");
         nextLeftContent.setAttribute("transform", "translate(" + (p.x - mouseOffSetX + 280) + ",330) rotate(" + 90*(p.x-mouseOffSetX)/260 +") translate(" + dragX + ",0)");
         revealLeftMask.setAttribute("transform", "translate(" + dragX + ",0) rotate(" + 45*(p.x-mouseOffSetX)/260 +")");
      } else if ( (p.x-mouseOffSetX) >= 260) {
         sLine.setAttribute("transform", "translate(260,0) rotate(45)");
         revealLeftMask.setAttribute("transform", "translate(260,0) rotate(45)");
         hideRightMask.setAttribute("transform", "translate(260,0) rotate(45)");
         nextLeftContent.setAttribute("transform", "translate(540,330) rotate(90) translate(260,0)");
      } else {
         sLine.setAttribute("transform", "");
         hideRightMask.setAttribute("transform", "");
         revealLeftMask.setAttribute("transform", "");
         nextLeftContent.setAttribute("transform", "translate(280,330)");
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
function beginRightPageHoverEffect(){
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
