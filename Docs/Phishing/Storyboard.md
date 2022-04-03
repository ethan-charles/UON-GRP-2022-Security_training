# Story Boarding

The current plan for the design of the phishing game is an email browser that send scenario emails, some dangerous and some safe, to see how the user reacts to them, either falling for the tricks and endangering themself or ignoring, deleting or reporting the emails and staying safe.

The aim of this game is to give the user confidence when using their email by providing experience of dangerous emails and scams.

## Potential Scenarios

| Email content | Details | Safe/Unsafe| Correct response |
|---------------|---------|------------|------------------|
|Safe Announcement email| Standard announcement from university professor| Safe | Mark as read |
|Update password request| Fake email directing the recipient to reset their password | Unsafe | Report to IT department, Don't click on the link|
|Email with attachment | Email with .exe attachment requesting the recipient download it| Unsafe| Report to IT department, Don't download the attachment|
|Microsoft Teams Notification| Email with a list of missed notifications from ms teams| Safe| Mark as read|
|Scam Email| Email trying to convince the recipient to send money to a cause | Unsafe | Ignore/Delete, Don't send money or log in with bank details|
|Prize Winner | Obvious scam with big "Click here to redeem your prize"| Unsafe | Don't click link, Delete/ignore|
|Microsoft renewal| "Your account will expire unless you log in <a>here</a>"|Unsafe| Report to IT department, Don't click the link or log in|

These potential scenarios are based on real world emails that have been received either through our university or personal emails.

![Phishing email Example](/Assets/Images/emailGame/Phishing%20email%20Example.jpg)

## Scenario Activity Diagrams

![Activity Diagrams](/Assets/Images/emailGame/Activity%20Diagram1.png)