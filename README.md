# Team 43 Project
# UoN - Security Training

## We’re all under attack! Can you help?

![avatar](Assets/Images/advert+poster/poster.png)

## Contributors: 

| **Name**        | **Email  Address**       |
| --------------- | ------------------------ |
| Salman Alshayeb | Psysa6@nottingham.ac.uk  |
| Ben Jessel      | psybj2@nottingham.ac.uk  |
| Dewei  Wang     | scydw1@nottingham.ac.uk  |
| Leo  Meyler     | psylm10@nottingham.ac.uk |
| Rafi Brooks     | rafibrooks1@hotmail.com  |
| Yichen Lu       | scyyl15@nottingham.ac.uk |


## Design:

[Textual Analysis](Assets/Images/../Vpp%20Projects/textual%20analysis1.jpg)

[Textual Analysis Table](Assets/Images/../Vpp%20Projects/../Vpp%20Projects/textual%20analysis1%20table.jpg)

[Use Case Diagram](Assets/Images/../Vpp%20Projects/Use%20Case%20Diagram1.png)

[Personas](Docs/r&d/personas.md)

[Cyber Threat research](Docs/r&d/securityTrainingAreas.md)

[Phishing Game Storyboard & Activity Diagram](Docs/Phishing/Storyboard.md)

[Initial Phishing Game description](Docs/Phishing/Phishing_Emails.md)

[Password Strength Game Idea](Docs/password/password.md)

[Website Design](Docs/wireframe/design1.md)

## Code:

To run the code using local host, ensure you have php installed on your device (and that it is added to the environment variables path if you are using windows).

From the command line run:
```
php -S localhost:8000 -n -t "<path to the src folder>" 
```

Then, using a web browser of your choice, visit localhost:8000 and you should be redirected to the website homepage

[Src Folder](src)
### Homepage

[Index.html](src/index.html)

[style.css](src/css/style.css)

### Topics

[Usernames and Passwords](src/passwords.html)

[Phishing](src/phishing.html)

[Removable Media](src/RemovableM.html)

[Social Media](src/SocialM.html)

### Phishing Game

[Phishing Game](src/phishingGame.html) - the html page used to run the game

[Phishing Game Styles](src/phishingGame.css) - the css file used to set the game styles

[Phishing Game Javascript](src/eGameJS.js) - backend javascript that makes the phishing game function

[High Score php Script](src/scores.php) - php script that handles writing high-scores to a csv file and returning the high-score table

[High Score List](src/scores.csv) - csv file storing the high-scores

[Email Manager](src/manageEmails.html) - email manager file (containing inline javascript)

[Email Manager Styles](src/manageEmails.css) - css file used to set the email manager styles

[Emails json](src/emails.json) - json file used to store the email contents
## Final Report:

[FinalReport.docx](https://projects.cs.nott.ac.uk/comp2002/2021-2022/team43_project/-/blob/final-report/team43-FinalReport.docx)