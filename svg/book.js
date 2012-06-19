var mouseDragging = false; // indicate dragging state
var mouseOffSetX = 0;      // indicate offset for proper dragging object
var dragX = 0;
var actedFlipNext = true;
var nextStack = 0;
var animating = false;
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
      var leftShade = document.getElementById("next-left-shade");
      var nextLeftContent = document.getElementById("next-left-content");
      var leftShadeMask = document.getElementById("revealLeftShade-mask");
      
      // Make the shade longer
      leftShade.setAttribute("y", "-345");
      leftShade.setAttribute("height", "345");
      
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
         leftShadeMask.setAttribute("transform", "translate(" + dragX + ",0) rotate(" + 90*(dragX)/260 +") translate(" + dragX + ",0)");
         revealLeftMask.setAttribute("transform", "translate(" + dragX + ",0) rotate(" + 45*(dragX)/260 +")");
         leftShade.setAttribute("transform", "translate(280,330) translate(" + dragX + ",0) rotate(" + 45*(dragX)/260 +")");
      } else if ( (dragX) >= 260) {
         sLine.setAttribute("transform", "translate(260,0) rotate(45)");
         revealLeftMask.removeAttribute("transform");
         leftShade.setAttribute("transform", "translate(280,330) translate(260,0) rotate(45)");
         hideRightMask.setAttribute("transform", "translate(260,0) rotate(45)");
         nextLeftContent.setAttribute("transform", "translate(540,330) rotate(90) translate(260,0)");
         leftShadeMask.setAttribute("transform", "translate(260,0) rotate(90) translate(260,0)");
      } else {
         sLine.removeAttribute("transform");
         hideRightMask.removeAttribute("transform");
         revealLeftMask.removeAttribute("transform");
         leftShade.setAttribute("transform", "translate(280,330)");
         nextLeftContent.setAttribute("transform", "translate(280,330)");
         leftShadeMask.removeAttribute("transform");
         // Restore the shade's size
         leftShade.setAttribute("y", "-315");
         leftShade.setAttribute("height", "315");
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
   
   /* RESTRUCTURE THE RIGHT PAGES */
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
   nextRight.lastElementChild.firstElementChild.setAttribute("id", "current-right-shade");
   // previous to next
   previousRight.setAttribute("id", "next-right-container");
   previousRight.firstElementChild.setAttribute("id", "next-right-content");
   previousRight.firstElementChild.firstElementChild.setAttribute("id", "next-right-page");
   previousRight.lastElementChild.firstElementChild.setAttribute("id", "next-right-shade");
   // current to previous
   currentRight.setAttribute("id", "previous-right-container");
   currentRight.removeAttribute("mask");
   currentRight.firstElementChild.setAttribute("id", "previous-right-content");
   currentRight.firstElementChild.firstElementChild.setAttribute("id", "previous-right-page");
   currentRight.lastElementChild.firstElementChild.setAttribute("id", "previous-right-shade");
   
   /* RESTRUCTURE THE LEFT PAGES */
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
   nextLeft.lastElementChild.removeAttribute("mask");
   nextLeft.lastElementChild.firstElementChild.setAttribute("id", "current-left-shade");
   // previous to next
   previousLeft.setAttribute("id", "next-left-container");
   previousLeft.setAttribute("mask", "url(#revealNextLeftPage)");
   previousLeft.firstElementChild.setAttribute("id", "next-left-content");
   previousLeft.firstElementChild.firstElementChild.setAttribute("id", "next-left-page");
   previousLeft.lastElementChild.setAttribute("mask", "url(#revealLeftShade)");
   previousLeft.lastElementChild.firstElementChild.setAttribute("id", "next-left-shade");
   // current to previous
   currentLeft.setAttribute("id", "previous-left-container");
   currentLeft.firstElementChild.setAttribute("id", "previous-left-content");
   currentLeft.firstElementChild.firstElementChild.setAttribute("id", "previous-left-page");
   currentLeft.lastElementChild.firstElementChild.setAttribute("id", "previous-left-shade");
   
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
   document.rootElement.addEventListener("keypress", navigate, false);
   
   document.addEventListener("keydown", navigate, false);
   // Initiate X state
   dragX = 260;
} 
function autoFlipNext() {
   animating = true;
   
   // get needed objects
   var sLine = document.getElementById("symmetry-line");
   var hideRightMask = document.getElementById("hideCurrentRightPage-mask");
   var nextLeft = document.getElementById("next-left-container");
   var revealLeftMask = document.getElementById("revealNextLeftPage-mask");
   var leftShade = document.getElementById("next-left-shade");
   var nextLeftContent = document.getElementById("next-left-content");
   var leftShadeMask = document.getElementById("revealLeftShade-mask");
      
   // bring next-left-page to top
   nextLeft.parentNode.appendChild(nextLeft);
   
   // Make the shade longer
   leftShade.setAttribute("y", "-345");
   leftShade.setAttribute("height", "345");
   
//    var animTrans = document.getElementById("animateFlipNext-translate");
//    var animRot = document.getElementById("animateFlipNext-rotate");
//    animations = new Array();
//    animations.push(sLine.appendChild(animTrans.cloneNode(false)));
//    animations.push(sLine.appendChild(animRot.cloneNode(false)));
//    animations.push(hideRightMask.appendChild(animTrans.cloneNode(false)));
//    animations.push(hideRightMask.appendChild(animRot.cloneNode(false)));
//    animTrans.setAttribute("additive", "sum");
//    animations.push(revealLeftMask.appendChild(animTrans.cloneNode(false)));
//    animations.push(revealLeftMask.appendChild(animRot.cloneNode(false)));
//    animations.push(leftShade.appendChild(animTrans.cloneNode(false)));
//    animations.push(leftShade.appendChild(animRot.cloneNode(false)));
//    animRot.setAttribute("from", "90");
//    animations.push(nextLeftContent.appendChild(animTrans.cloneNode(false)));
//    animations.push(nextLeftContent.appendChild(animRot.cloneNode(false)));
//    animations.push(nextLeftContent.appendChild(animTrans.cloneNode(false)));
//    animations.push(leftShadeMask.appendChild(animTrans.cloneNode(false)));
//    animations.push(leftShadeMask.appendChild(animRot.cloneNode(false)));
//    animations.push(leftShadeMask.appendChild(animTrans.cloneNode(false)));
//    
//    for (var i = 0; i < animations.length; i++) {
//       animations[i].beginElement();
//    }
//    setTimeout(function() {
//       leftShade.setAttribute("y", "-315");
//       leftShade.setAttribute("height", "315");
//       actedFlipNext = false;
//       doneFlippingNext();
//       animating = false;
//       for (var i = 0; i < animations.length; i++) {
//          animations[i].parentNode.removeChild(animations[i]);
//       }
//       animTrans.setAttribute("additive", "replace");
//       animRot.setAttribute("from", "45");
//       nextStack = nextStack - 1;
//       if (nextStack != 0)
//          autoFlipNext();
//    }, 1100);
   
   var time = 0;
   var increment = 10;
   var timer = setInterval(function() { time = time + increment}, increment);
   var start = time;
   var limit = dragX;
   animating = true;
   var flipper = setInterval(function () {
         if (time - start >= limit) {
            clearInterval(timer);
            sLine.removeAttribute("transform");
            hideRightMask.removeAttribute("transform");
            revealLeftMask.removeAttribute("transform");
            leftShade.setAttribute("transform", "translate(280,330)");
            nextLeftContent.setAttribute("transform", "translate(280,330)");
            leftShadeMask.removeAttribute("transform");
            leftShade.setAttribute("y", "-315");
            leftShade.setAttribute("height", "315");
            actedFlipNext = false;
            doneFlippingNext();
            clearInterval(flipper);
            animating = false;
            nextStack = nextStack - 1;
            if (nextStack != 0)
               autoFlipNext();
            return;
         }
         // Speed control
         if (dragX <= 10)
            increment = 1;
         else if (dragX <= 20)
            increment = 5;
//          else if (dragX <= 100)
//             increment = 20;
         dragX = (limit - (time - start))/300*260;
         sLine.setAttribute("transform", "translate(" + dragX + ",0) rotate(" + 45*(dragX)/260 +")");
         hideRightMask.setAttribute("transform", "translate(" + dragX + ",0) rotate(" + 45*(dragX)/260 +")");
         nextLeftContent.setAttribute("transform", "translate(" + (dragX + 280) + ",330) rotate(" + 90*(dragX)/260 +") translate(" + dragX + ",0)");
         leftShadeMask.setAttribute("transform", "translate(" + dragX + ",0) rotate(" + 90*(dragX)/260 +") translate(" + dragX + ",0)");
         revealLeftMask.setAttribute("transform", "translate(" + dragX + ",0) rotate(" + 45*(dragX)/260 +")");
         leftShade.setAttribute("transform", "translate(280,330) translate(" + dragX + ",0) rotate(" + 45*(dragX)/260 +")");
      },16);
}
function navigate(evt) {
   if (evt.keyCode == 39) {
      nextStack = nextStack + 1;
      if (!animating)
         autoFlipNext();
   }
}