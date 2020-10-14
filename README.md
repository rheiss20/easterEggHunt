Play the game here:
https://rheiss20.github.io/easterEggHunt/

Should now work on mobile!

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

# Easter Egg Hunt
A fun application for hunting down easter eggs in a house... With a twist.

## Images
All images for the rooms are in a corresponding `public/images/subfolder`. 

## Eggs
The configuration for where the eggs are and how the rooms connect are located in `src/maps.json`.  
The json is an object with more location objects. Each object should have a unique key and the following fields:
- name: used for keeping track of where you currently are; can be arbitrary
- imageName: path to the image in the public/images/subfolder folder. When built, the path will be `./images/IMAGE_NAME.png`
- up/down/left/right/turnLeft/turnRight/goBack/turnAround/mystery/quiz: whether or not a navigation icon is present on a screen or not
    - transferTo: the other location(s) that this location will transfer you to to. The value should be the key for the corresponding location.
        - so if you want the user to click the turnRight arrow to go from LIVINGROOM to LAUNDRYHALL, then the LIVINGROOM object should have `"transferTo": "LAUNDRYHALL"`
    - arrowX: the X coordinate of the nav icon
    - arrowY: the Y coordinate of the nav icon
- [These are optional. If a location won't have a turnLeft arrow, then don't include the turnLeft property]
- eggs: The array of eggs for a location. Each egg object should have the following values:
    - eggX: the X coordinate of the egg
    - eggY: the Y coordinate of the egg
    - eggRadius: the radius of the invisible circle that the user clicks in order to acquire the egg

## Adding Eggs
To add eggs, you just need to add an egg object to the locations egg array in `src/map.json`. There is a built in tool to assist with placing the click detection for each and navigation icon. 
In `src/App.jsx`, there is a variable `HUNT_MODE` setting this to false will add extra elements to the UI to assist in element placement. It can also be accessed by entering your name as "CHEAT_nohunt".
- A draggable red circle will be present. Drag this over the eggs you want to add.
- A slider will be at the top left of the screen. This adjusts the size of the red circle.
- A text box will be at the top left of the screen. This will contain the eggX, eggY, and eggRadius for the red circle.
NOTE: You must be have the app running in its full desktop version in order to place the eggs in the right place! These values will automatically scale with the app. 
Drag the red circle over the egg, adjust the radius, and copy the values in the text box into the eggs array in `maps.json`. If you are using this for nav icon placement, then minus the eggX value by 30 in order to place it in the right place.  
Note: Be sure to set `HUNT_MODE` to true before releasing the app out to the players.

## Adding Navigation Icons
Its the same way as adding the eggs, except you are actually adding it over the image rather than placing an invisible circle over an image that is part of the background.

## Behavior
`src/maps.json` is loaded and parsed in `src/App.jsx`. The starting location is defaulted to the `ENTRANCE` value.  
Based on the up/down/left/right/turnLeft/turnRight/goBack/turnAround/mystery/quiz properties of the location, the corresponding arrows are made visible on the image. Based on the eggs array, invisible circles are placed throughout the image.  
When one of the invisible egg circles is pressed, the onClick handler for that circle increments the score, and marks itself as found in the foundEggs array. Any eggs in this array are rendered as Stars instead of invisible circles.  
Whenever an arrow is clicked, the onClick handler updates the currentLocation based on the corresponding direction clicked.  
When the submit button is clicked, the name and score are reported back to the user via an alert message. There is no backend to speak of yet, but perhaps there might be someday. 
