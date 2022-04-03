// Determines the number of emails that can be in the inbox before the game finishes
var INBOX_SIZE = 15;
var emailCount = 0;
var emailsInInbox = 0;
var emails;
/*  for loop that adds email to grid, uses random function to select email 
 *  currently the same email can be selected multiple times.
 *  setTimeout pauses operation of a function for a certain amount of time,
 *  in this case the addEmail function is paused for i * 1000ms. 
 */
window.onload = gameLoop();

async function gameLoop() {
  getEmails();
  while(true) {
    addEmailButton(Math.floor(Math.random() * emails.email.length));
    if (emailsInInbox > INBOX_SIZE) {
      endGame();
      break;
    }
    await new Promise(r => setTimeout(r,1000));
  }
}

/* create an array of emails, email is a structure containing different variables that are set
 *  could add a 'points' variable for highscore functionality,
 *  may be a way to implement as an object instead- i dont know js features that well 
 */
function getEmails() {
  var xhReq = new XMLHttpRequest();
  xhReq.open("GET", './emails.json', false);
  xhReq.send(null);
  emails = JSON.parse(xhReq.responseText);
}

function endGame() {
  alert("game over");
}

function removeEmail(emailPos) {
  document.getElementById("Email" + emailPos).remove();
  emailsInInbox--;
}

/** function displays email by adding the body variable from email with eID */
function displayEmail(eID){
  document.getElementById("emailTitle").innerHTML = emails.email[eID].title;
  var pfp = document.getElementById("senderpfp");
  var sender;
  if (pfp == null) {
    pfp = document.createElement("img");
    pfp.id = "senderpfp";
    pfp.className = 'avatar';
    pfp.alt = "Profile Picture"
    document.getElementById("emailSender").appendChild(pfp);
  }

  pfp.src = emails.email[eID].sender.picture;

  sender = document.getElementById("senderName");
  if (sender == null) {
    sender = document.createElement("h2");
    sender.id = "senderName";
    sender.className = "senderName";
    document.getElementById("emailSender").appendChild(sender);
  }

  sender.innerHTML = emails.email[eID].sender.name;
  
  var body = emails.email[eID].body;

  document.getElementById("titleBox").className = "emailTitleBox";

  body = body.replaceAll("\\n","<br>");
  document.getElementById("emailBody").innerHTML = body;
}

/** function adds a new email button to the sidebar when an email comes in */
function addEmailButton(eID) {
  //increases the total count of emails being displayed
  emailCount++;
  emailsInInbox++;
  //creates a new email div for the inbox
  var newGridItem = document.createElement("div");
  newGridItem.className = "grid-item";
  newGridItem.id = "Email" + emailCount;
  
  //creates a new button inside that div, setting the css, innerHTML, ID, email identifier (eID)
  // and adds an event listener that displays the email when clicked
  var newButton = document.createElement("button");
  newButton.className = "gridButton";

  
  newButton.addEventListener('click', () => displayEmail(eID));
  newButton.eID = eID;
  addButtonText(eID, newButton);

  // appends the new button to the email div and adds the email div to the inbox before the first entry
  newGridItem.appendChild(createButtonGroup(emailCount));
  newGridItem.appendChild(newButton);
  var emailList = document.getElementById("emailList");
  emailList.insertBefore(newGridItem, emailList.firstChild);
}

function addButtonText(eID, button) {
  var titleText = document.createElement("h3");
  titleText.id = "emailPreviewTitle" + emailCount;
  titleText.innerHTML = emails.email[eID].title;
  titleText.className = "titlePreview";

  var previewText = document.createElement("p");
  previewText.id = "emailPreviewPreview" + emailCount;
  var body = emails.email[eID].body;
  if (body != null && body.length > 50) {
    body = body.substring(0,50) + "...";
  }
  previewText.innerHTML = body;
  previewText.className = "emailPreview";

  var senderText = document.createElement("h2");
  senderText.id = "emailPreviewSender" + emailCount;
  senderText.innerHTML = emails.email[eID].sender.name;
  senderText.className = "senderPreview";
  
  button.appendChild(senderText);
  button.appendChild(titleText);
  button.appendChild(previewText);
}

function createButtonGroup(emailPos){
  //create container for two buttons to go side by side
  var flagButtons = document.createElement("div");
  flagButtons.className = "flagButtonGroup";

  /*create delete button*/
  var delButton = document.createElement("button");
  delButton.className = "flagButton";
  delButton.addEventListener('click', () => removeEmail(emailPos));
  delButton.innerHTML = '<img src="websiteAssets/recycle-bin.png" alt="bin picture" style="width:100%;height:100%;">';
  
  /*create save button*/
  var saveButton = document.createElement("button");
  saveButton.className = "flagButton";
  saveButton.addEventListener('click', () => console.log("place holder for save"));
  saveButton.innerHTML = '<img src="websiteAssets/floppy-disk.png" alt="save picture" style="width:100%;height:100%;">';

  flagButtons.appendChild(delButton);
  flagButtons.appendChild(saveButton);

  return flagButtons;
}
