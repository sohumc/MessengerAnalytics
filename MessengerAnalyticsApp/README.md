# Facebook Messenger Analytics

Run analytics on your FB Messenger conversations. 

## Installation

Export your message data from Facebook, and then place it in the MessengerAnalyticsApp/data folder of the project
Once inside the MessengerAnalyticsApp folder run the following commands
```sh
$env:FLASK_APP = "MessengerAnalyticsApp"
flask init-db
flask load-db
flask run
```
The Flask backend server should be running now.

Now go to the MessengerAnalyticsApp/front-end-dashboard
```sh
cd front-end-dashboard
npm install
npm start
```
Done!

