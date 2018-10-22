# cs4241-FinalProject

**Submitted To:** Professor Lane Harrison and Course Staff

**Submitted By:** Alexander Antaya, Sydney Hurley, Jack Palmstrom, and Amanda Pennie

**Link to app:** https://fp-nvitr.herokuapp.com/login

## Problem Statement
There currently aren’t any effective and efficient solutions for managing and analyzing small to medium-sized events.


## Description
For our final project, we developed a web application that aims to help improve the management of events by
providing users with a well-developed user experience, an event invitation distribution network, and data analytics.
The problem is not that this technology doesn't exist; large-scale venues such as Fenway Park and Gillette Stadium use
similar technology to manage their events. The main issue here is that this type of technology is out of reach for
people coordinating small to medium-sized events due to cost and platform complexity. Keeping in mind our end user, we
will develop our solution to be secure, scalable, and easy to use.

## How to Use
To use this application, begin by creating an account. On the home page, select sign up to create an account. After creating an account you will be brought to the home page, this page will show events you are hosted and or invited to. This page should be blank initially.

Creating an Event
To create an event, access the side menu by clicking the toggle at the top left corner. Select create event and fill in details for the event. Once you create your event you will be able to invite people to your event through a uniquely generated QR code. Go to the home page and select the event you just created. This will present the QR code you can send to people you would like to invite to the event.

RSVP to an Event
For the purpose of testing this webapp, take a picture of this QR code and open this application in a new window. Create a new log in, and select RSVP for an event in the the sidebar. This will bring you to a page where you can scan the QR code you took a picture of. Click 'Scan QR Code' which will open the camera on your laptop and present the picture of the QR in front of your webcam. This will mark you as an attendee for the party and proves the functionality of this portion.

Previous Events and Event Analytics
Once the time for you event has passed, it will be stored in the 'Previous Events' tab. To view past events that you have created, click 'Previous Events' on the sidebar. This will bring you to a page of events you have previously created. Click on one of the events in this page to view analytics of the event.
This will redirect you to a dashboard with D3 generated graphs that show details of your event. These graphs outline the age of people who attended, the time they spent at your event, and the genders of attendees.
