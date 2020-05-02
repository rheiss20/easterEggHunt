This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

# Easter Egg Hunt
A fun application for hunting down easter eggs in a house

## Images
All images for the rooms are in the `public/images` folder. 

## Eggs
The configuration for where the eggs are and how the rooms connect are located in `src/maps.json`.  
The json is an object with more location objects. Each object should have a unique key and the following fields:
- name: used for keeping track of which eggs were found. can be arbitrary
- imageName: path to the image in the public/images folder. When built, the path will be `./images/IMAGE_NAME.png`
- up/down/left/right/elevatorUp/elevatorDown: The other locations that this location maps to. The value should be the key for the corresponding location.
    - So if you want the user to click the up arrow to go fron 1N1 to 1N2, then the 1N1 object should have `"up": "1N2"`
    - These are optional. If a location won't have a left arrow, then don't include the left property
- eggs: The array of eggs for a location. Each egg object should have the following values
    - eggX: the X coordinate of the egg
    - eggY: the Y coordinate of the egg
    - eggRadius: the radius of the egg

## Adding Eggs
To add eggs, you just need to add an egg object to the locations egg array in `src/map.json`. There is a built in tool to assist with getting the egg information.  
In `src/App.jsx`, there is a variable `HUNT_MODE` setting this to false will add extra elements to the UI to assist in getting the egg information
- A draggable red circle will be present. Drag this over the eggs you want to add.
- A slider will be at the top left of the screen. This adjusts the size of the red circle.
- A text box will be at the top left of the screen. This will contain the eggX, eggY, and eggRadius for the red circle.
Drag the red circle over the egg, adjust the radius, and copy the values in the text box into the eggs array in `maps.json`.  
Note: Be sure to set `HUNT_MODE` to true before releasing the app out to the players.

## Behavior
`src/maps.json` is loaded and parsed in `src/App.jsx`. The starting location is defaulted to the `ENTRANCE` value.  
Based on the up/down/left/right/elevatorUp/elevatorDown properties of the location, the corresponding arrows are made visible on the image. Based on the eggs array, invisible circles are placed throughout the image.  
When one of the invisible egg circles is pressed, the onClick handler for that circle increments the score, and marks itself as found in the foundEggs array. Any eggs in this array are rendered as Stars instead of invisible circles.  
Whenever an arrow is clicked, the onClick handler updates the currentLocation based on the corresponding direction clicked.  
When the submit button is clicked, the name and score are posted to the backend. There's no real security right now because this is a simple, fun little app.
