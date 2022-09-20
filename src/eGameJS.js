// Determines the number of emails that can be in the inbox before the game finishes
var INBOX_SIZE = 10;
var emailCount = 0;
var emailsInInbox = 0;
var emails;
var safeLength;
var score = 0;
var timer, senderTimer;// variables to hold the different setTimer functions so they can be stopped
var timeLeft = 100; // seconds
let slideIndex = 1;
var emailFeedback = [];

var goodAudio = new Audio('websiteAssets/ding.mp3');
var badAudio = new Audio('websiteAssets/Wrong-answer-sound-effect.mp3');


// calls startup when the window is loaded.
window.onload = startup();

/** function is called when the window is loaded.
 * displays a hidden div which will be used to show the tutorial.
 * when the start button is pressed gameLoop() is called to start the game,
 * and the div is hidden again.
 */
async function startup() {
  getEmails();
  showSlides(1);
  var popup = document.getElementById("popup-background");
  popup.style.display = "block";
  document.getElementById("popup-button").addEventListener('click', function () {
    popup.style.display = "none";
    startTimer();
    gameLoop();
  }, false);

}

/**  The game loop is the timer that continuously loops throughout the game
 *  sending emails preview buttons into the inbox after a varying delay.
 *  after all the emails are gone or the emails fill the inbox the loop breaks
 *  and the game is over
 */
async function gameLoop() {
  var i = 0;
  addEmailButton();
  addEmailButton();
  while (true) {
    addEmailButton();
    document.getElementById("inboxText").innerHTML = "Inbox " + emailsInInbox + "/" + INBOX_SIZE;
    if (emailsInInbox > INBOX_SIZE) {
      endGame("Your inbox overflowed!");
      break;
    } else if (noEmailsLeft()) {
      //endGame("You opened all emails");
      break;
    }
    await new Promise(r => senderTimer = setTimeout(r, getNextTimeOut(i)));
  }
}

/**
 *  calculates the timeout in ms between when the previous and the 
 *  next email should be delivered into the inbox. The function uses an
 *  exponential equation to decrease the timeout the more emails have been sent
 */
function getNextTimeOut(i) {
  return 6000 * Math.exp(-0.2 * i);
  //7e^{(-0.2x)}
}

/**
 * returns whether there are no emails left to send by checking both list's length
 */
function noEmailsLeft() {
  if (emails.safe.length != 0) {
    return false;
  } else if (emails.scam.length != 0) {
    return false;
  }
  console.log("no emails left");
  return true;
}

/** 
 * creates an object of emails by executing an XMLHttpRequest to read the emails.json
 * file from the source files. The emails object is stored in the same format as the
 * emails are stored in the json file
 */
function getEmails() {
  var xhReq = new XMLHttpRequest();
  xhReq.open("GET", './emails.json', false);
  xhReq.send(null);
  emails = JSON.parse(xhReq.responseText);
  safeLength = emails.safe.length - 1;
}

/**
 * shows an end game popup, displaying the final score and
 * reason for the game to have ended
 */
function endGame(reason) {
  //stops the timer from running
  clearTimeout(senderTimer);
  clearInterval(timer);
  // gets the popup values
  var popup = document.getElementById("popup-background");
  var popupButton = document.getElementById("popup-button");
  var box = document.getElementById("popup");

  // displays the score
  popup.style.display = "block";
  box.innerHTML = "<h1>GAME OVER!</h1><h2>" + reason + "</h2><h3>Your score is: " + score + "</h3><br>";
  popupButton.innerHTML = "play again";

  // if the feedback array is not empty create a feedback header on the endgame popup and fill it with all the feedback
  // contained in the array
  if (emailFeedback.length != 0) {
    var feedbackH = document.createElement("h3");
    feedbackH.innerHTML = "Feedback";
    box.appendChild(feedbackH);
  }
  emailFeedback.forEach((text) => {
    var feedback = document.createElement("p");
    feedback.innerHTML = text;
    box.appendChild(feedback);
  });

  box.appendChild(document.createElement("br"));


  //adds high score inputs to the popup allowing the user to add their initials to the leaderboard
  var highscoreDiv = document.createElement("div");
  var highscoreTitle = document.createElement("h3");
  highscoreTitle.innerHTML = "Submit a high score";
  highscoreDiv.appendChild(highscoreTitle);

  var initials = document.createElement("textarea");
  initials.className = "initials";
  initials.addEventListener('input', () => {
    // limits initials to 3 characters
    if (initials.value.length > 3) {
      initials.value = initials.value.substring(0, 3);
    }
  })

  var initialsH = document.createElement("p");
  initialsH.innerHTML = "initials:";
  highscoreDiv.appendChild(initialsH);
  highscoreDiv.appendChild(initials);
  highscoreDiv.appendChild(document.createElement("br"));

  //submits the highscore
  var submit = document.createElement("button");
  submit.addEventListener("click", () => {
    submit.disabled = true;
    if (initials.value.length != 0) {
      sendHighScore(initials.value);
    }
  })
  submit.innerText = "Submit Highscore";
  highscoreDiv.appendChild(submit);

  box.appendChild(highscoreDiv);
  box.appendChild(document.createElement("br"));


  // adds a play again button
  var newdiv = document.createElement("div");
  newdiv.style.width = "100%";
  box.appendChild(newdiv);

  var newButton = document.createElement("button");
  newButton.addEventListener('click', () => location.reload());
  newButton.innerHTML = 'play again';

  var homeButton = document.createElement("button");
  homeButton.addEventListener('click', () => location.href ="index.html");
  homeButton.innerHTML = 'home';

  newdiv.appendChild(newButton);
  newdiv.appendChild(homeButton);
}

/**
 * Updates the score counter after every email is marked as either safe
 * or scam and any time an attachment or link is pressed 
 */
function updateScore(points) {
  score += points;
  document.getElementById('sn-score').innerHTML = "score: " + score;
}

/** takes an email object and its location in the inbox,
 *  if the email is a scam points are awarded, positive feedback is give,
 *  and the email is removed from the inbox.
 *  otherwise points are subtracted negative feedback is given and the email is removed.
 */
function delEmail(email, emailPos) {
  if (isScam(email.id)) {
    updateScore(15);
    feedback(true);
  } else {
    updateScore(-10);
    feedback(false);
  }
  removeEmail(emailPos);
}

/** takes an email object and its location in the inbox,
 *  if the email is safe points are awarded, positive feedback is give,
 *  and the email is removed from the inbox.
 *  otherwise points are subtracted negative feedback is given and the email is removed.
 */
function savEmail(email, emailPos) {
  if (isScam(email.id)) {
    updateScore(-15);
    feedback(false);
    if (email.feedback != null) {
      emailFeedback.push(email.feedback);
    }
  } else {
    updateScore(15);
    feedback(true);
  }
  removeEmail(emailPos);
}

/**
 * removes an email from the inbox and from the email viewer after it has
 * been marked as either safe or scam
 */
function removeEmail(emailPos) {
  document.getElementById("Email" + emailPos).remove();
  document.getElementById("emailView").className = "emailViewB";
  emailsInInbox--;
  document.getElementById("inboxText").innerHTML = "Inbox " + emailsInInbox + "/" + INBOX_SIZE;
  if (noEmailsLeft() && emailsInInbox == 0) {
    endGame("You opened all emails");
  }
}

/** 
 * Displays an email's contents in the email viewer by reading the values from
 * the email object passed into the function
 */
function displayEmail(email, emailPos) {

  // sets the email viewer title to the email's title
  document.getElementById("emailTitle").innerHTML = email.title;
  var pfp = document.getElementById("senderpfp");
  var sender = document.getElementById("senderName");
  var senderEmail = document.getElementById("senderEmail");
  var body = email.body;

  // sets the sender details to the contents of the email.sender object 
  pfp.src = email.sender.picture;
  sender.innerText = email.sender.name;

  var attachment = email.attachment;

  // fetches the attachment button and replaces it with a clone of itself
  // which removes any event listeners from the button which would all stack up otherwise 
  var attachmentBtn = document.getElementById("emailAttachment");
  attachmentBtn.replaceWith(attachmentBtn.cloneNode(true));
  attachmentBtn = document.getElementById("emailAttachment");

  // adds an event listener that calls the clickAttachment function if
  // the attachment is clicked
  attachmentBtn.addEventListener('click', function () {
    clickAttachment(email);
  }, false);

  // sets the attachment name
  var attachmentName = document.getElementById("attachmentName");
  attachmentName.innerText = attachment;

  // if the attachment is not null or empty and contains a file extension 
  // then selects the file image that will be displayed in the attachment
  // else sets the attachment to be hidden
  var attachIcon = attachIcon = document.getElementById("emailAttachmentID");
  if (!(attachment == null) && !(attachment == "") && attachment.includes(".")) {
    if (attachment.endsWith(".pdf")) {
      attachIcon.src = "attachmentIcons/pdf.png";
    } else if (attachment.endsWith(".docx")) {
      attachIcon.src = "attachmentIcons/docx.png";
    } else if (attachment.endsWith(".html")) {
      attachIcon.src = "attachmentIcons/html.png";
    } else if (attachment.endsWith(".jar")) {
      attachIcon.src = "attachmentIcons/jar.png";
    } else if (attachment.endsWith(".pptx")) {
      attachIcon.src = "attachmentIcons/pptx.png";
    } else if (attachment.endsWith(".txt")) {
      attachIcon.src = "attachmentIcons/txt.png";
    } else {
      attachIcon.src = "attachmentIcons/exe.png";
    }
    attachmentBtn.style.visibility = "visible";
  } else {
    attachmentBtn.style.visibility = "hidden";
  }

  var emailButtons = createButtonGroup(email, emailPos);
  var title = document.getElementById("emailTitle");
  title.prepend(emailButtons);


  // sets the sender's email in the email viewer to the email's sender's email address
  senderEmail.innerHTML = "&lt" + email.sender.email + "&gt";

  // replaces any new line characters with <br> tags to be displayed as new lines
  body = body.replaceAll("\\n", "<br>");

  document.getElementById("emailBody").innerHTML = body;
  document.getElementById("emailView").className = "emailViewNB";


  // loops through all anchor tags in the email body,
  // setting their event listener to not take the user to the link location
  // and instead (if the link is not disabled) run the clickAttachment function
  var a = document.querySelectorAll("#emailBody>a");
  a.forEach((ele, ind) => {
    ele.addEventListener("click", (e) => {
      e.preventDefault();
      if (ele.attributes.disabled == null) {
        clickAttachment(email);
      }
    })
  })
}

/** 
 * creates and adds a random new email preview button to the inbox when an email
 * comes in
 */
function addEmailButton(email) {
  // selects the email that should be displayed
  if (email == null) {
    email = chooseEmail();
  }
   

  // ensures the email exists
  if (email == null) {
    console.log("email was null");
    return;
  }


  // increases the total count of emails being displayed
  emailCount++;
  emailsInInbox++;

  email.count = emailCount;

  // creates a new email grid item for the inbox
  var newGridItem = document.createElement("div");
  newGridItem.className = "grid-item";
  newGridItem.id = "Email" + emailCount;

  // creates a new button inside that grid item, setting the class to a grd button
  var newButton = document.createElement("button");
  newButton.className = "gridButton";

  // adds an event listener that displays the email when clicked
  newButton.addEventListener('click', () => {
    displayEmail(email, email.count);
    
  });
  addButtonText(email, newButton);

  // appends the new button to the email div and adds the email div to the inbox before the first entry
  newGridItem.appendChild(createButtonGroup(email, emailCount));
  newGridItem.appendChild(newButton);

  // works out if the email is in the safe or scam array in the emails object
  // and removes it from that array so it wont be used again
  var emailList = document.getElementById("emailList");
  emailList.prepend(newGridItem);
  if (emails.safe.indexOf(email) == -1) {
    emails.scam.splice(emails.scam.indexOf(email), 1);
  } else {
    emails.safe.splice(emails.safe.indexOf(email), 1);
  }
}

/** creates a preview text to go in the button made in addEmailButton()
 * does this by adding the name of the sender, the title of the email as well as
 * the first 50 characters of the body of the email.
 */
function addButtonText(email, button) {
  //creates the title element using the title from the email object
  var titleText = document.createElement("h3");
  titleText.id = "emailPreviewTitle" + emailCount;
  titleText.innerHTML = email.title;
  titleText.className = "titlePreview";

  //gets the first 50 characters from the email body
  var previewText = document.createElement("p");
  previewText.id = "emailPreviewPreview" + emailCount;
  var body = email.body;
  if (body != null && body.length > 50) {
    body = body.substring(0, 50) + "...";
  }
  previewText.textContent = body;
  previewText.className = "emailPreview";

  //gets the sender name from the email object
  var senderText = document.createElement("h2");
  senderText.id = "emailPreviewSender" + emailCount;
  senderText.innerHTML = email.sender.name;
  senderText.className = "senderPreview";

  //adds all of the new containers to the email button
  button.appendChild(senderText);
  button.appendChild(titleText);
  button.appendChild(previewText);
}

/** function which selects the email to be added from the list of safe emails and the list of scam emails.
 * does this by using a random number generator to select if the email will be a scam or not,
 * and then selects a random email from that array.
*/
function chooseEmail() {
  var r = Math.round(Math.random());
  if (emails.safe.length == 0) {
    r = 1
  } else if (emails.scam.length == 0) {
    r = 0
  }
  if (r == 0) {
    //safe email chosen
    var e = Math.floor(Math.random() * emails.safe.length);
    return emails.safe[e];
  } else {
    //scam email chosen
    var e = Math.floor(Math.random() * emails.scam.length);
    return emails.scam[e];
  }
}

/**
 * helper function for addEmailButton() which creates two new buttons and adds them to a container.
 * these buttons are used to delete or save the email.
 * the container is returned and added to the email button.
*/
function createButtonGroup(email, emailPos) {
  //create container for two buttons to go side by side
  var flagButtons = document.createElement("div");
  flagButtons.className = "flagButtonGroup";

  /*create delete button*/
  var delButton = document.createElement("button");
  delButton.className = "flagButton";
  // sets its function to delete the email specified
  delButton.addEventListener('click', () => delEmail(email, emailPos));
  // adds an image to the inside of the button
  delButton.innerHTML = '<img src="websiteAssets/phish.png" alt="bin picture" style="width:100%;height:100%;">';

  /*create save button*/
  var saveButton = document.createElement("button");
  saveButton.className = "flagButton";
  // sets its function to save the email specified
  saveButton.addEventListener('click', () => savEmail(email, emailPos));
  // adds an image to the inside of the button
  saveButton.innerHTML = '<img src="websiteAssets/open.png" alt="save picture" style="width:100%;height:100%;">';

  // adds the two new buttons to the flagButton group
  flagButtons.appendChild(delButton);
  flagButtons.appendChild(saveButton);

  return flagButtons;
}

/**
 * function called when a user presses either an attachment or a link.
 * if the email is a scam points are deducted and the game ends, otherwise bonus points
 * are awarded. feedback is given for both options.
*/
function clickAttachment(email) {
  if (email.interacted == null) {
    email.interacted = true;
  } else {
    return;
  }
  if (isScam(email.id)) {
    feedback(false);
    updateScore(-80);
    endGame("You downloaded a file from a scam email!");
    if (email.feedback != null) {
      emailFeedback.push(email.feedback);
    }
  } else {
    feedback(true);
    updateScore(50);
  }
}

/**
 * function that provides feeback to user in the form of a text popup and a sound cue,
 * if the function i called with true the feedback is positive, otherwise its negative.
 * the functions make a div appear for a set amount of time and sets its text.
 * it also uses Howler.JS to create a sound cue but this is not implemented at the moment.
*/
function feedback(bool) {
  var correct = ["good job", "well done", "correct", "perfect", "nice job"];
  var incorrect = ["unlucky", "nice try", "wrong", "incorrect", "try again"];
  var box = document.getElementById("feedback");
  var text = document.getElementById("feedback-text");

  if (bool) {
    goodAudio.play();
    text.innerHTML = correct[Math.floor(Math.random() * correct.length)];
    text.style.color = "green";
  } else {
    badAudio.play();
    text.innerHTML = incorrect[Math.floor(Math.random() * incorrect.length)];
    text.style.color = "red";
  }
  box.style.display = "block";
  setTimeout(function () {
    box.style.display = "none";
  }, 3000);

}

/**
 * function that take an email and returns a boolean depending if it is a scam or not,
 * does so by checking if an id is over a set value, if it is it is a scam, if not it is safe.
 */
function isScam(id) {
  console.log(id);
  if (id > safeLength) {
    return true;
  } else {
    return false;
  }
}

/**
 * sends a fetch request to the server with a new score and initials to be considered for
 * the highscore leaderboard
 */
function sendHighScore(initials) {
  var data = JSON.stringify({
    "newScore": score,
    "newName": initials
  });
  var error = false;
  try {
    fetch("scores.php", {
      method: "post",
      body: data,
      redirect: "manual"
    }).then(function (response) {
      return response.text();
    }).then(function (text) {
      if (text != "" && text != null) {
      displayHighScore(text);
      }
    });
  } catch (e) {
    error = true;
    console.log(e.message);
  }
}

/**
 * displays each highscore in a table
 */
function displayHighScore(text) {
  // gets the list of highscores as a json response from the fetch request
  var json = JSON.parse(text);

  var popup = document.createElement("div");
  var title = document.createElement("h2");
  title.textContent = "HIGHSCORES";

  popup.appendChild(title);
  popup.className = "minipopup";

  // creates and populates a table with each highscore returned by the high score list
  var table = document.createElement("table");
  for (var i = 0; i < json.length; i++) {
    var row = document.createElement("tr");
    var name = document.createElement("td");
    var score = document.createElement("td");

    name.textContent = json[i][0];
    score.textContent = json[i][1];
    row.appendChild(name);
    row.appendChild(score);
    table.appendChild(row);
  }
  popup.appendChild(table);

  // adds a close button to the new high score list
  var closebutton = document.createElement("button");
  closebutton.innerText = "Close"
  closebutton.addEventListener("click", () => {
    popup.remove();
  })

  popup.appendChild(closebutton);

  document.getElementById("main").appendChild(popup);
}

/**
 * update timer is called every seccond and subtracts 1 from the time remaining on the timer,
 * it then displays the timer to the screen and ends the game when out of time.
 */
function updateTimer() {
  timeLeft = timeLeft - 1;
  //calculate the time (from secconds) into minutes and remaining secconds
  var minutes = Math.floor(timeLeft / 60)
  var seconds = timeLeft - minutes * 60;

  // if the secconds are below 10 add a leading 0
  if (seconds < 10) {
    seconds = "0" + seconds;
  }

  // if the time is less than 5 make the display colour of the timer red
  // if out of time end the game
  if (timeLeft >= 0 && timeLeft <= 5) {
    document.getElementById('timer').style.color = 'red';
    document.getElementById('timer').innerHTML = minutes + ":" + seconds;
  } else if (timeLeft >= 0) {
    document.getElementById('timer').innerHTML = minutes + ":" + seconds;
  }
  else {
    endGame("You ran out of time!");
  }
}

// called at start of game loop, calls the updateTimer function every seccond 
function startTimer() {
  timer = setInterval(updateTimer, 1000);
  updateTimer();
}

// function used to change slides in the tutorial. used by buttons made in the html
function plusSlides(n) {
  showSlides(slideIndex += n);
}

function currentSlide(n) {
  showSlides(slideIndex = n);
}

//
function showSlides(n) {
  let i;
  let slides = document.getElementsByClassName("mySlides");
  let dots = document.getElementsByClassName("dot");

  //if statments to make the slides loop round 
  if (n > slides.length){ 
    slideIndex = 1
  }
  if (n < 1){
    slideIndex = slides.length
  }

  //sets all the slides and there respective dot markers to be invisible
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  // makes the current slide and dot marker visable
  slides[slideIndex - 1].style.display = "block";
  dots[slideIndex - 1].className += " active";
}
