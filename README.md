# Readme

React-video-players is a react library that lets user to not just use the default browser video player and use a prebuilt customised video player from the list of players into his project by just providing the video source link.

### Note: The project is under development and isnt in working condition

---

### How to implement into react project

Use npm or yarn to install the library into the project.

    npm install react-video-players

or
yarn add react-video-players

Import any of the video player and provide sourceUrl, and other major props. (follow documentation to know more)

This is an example to use YT player:

    import YT from react-video-players

    function  example() {
        return (
    	    <div>
    		    <YT
    			    sourceUrl="https://urlexample/video.mp4"
    			    createUrl={true}
    			/>
    		</div>
    	);
    }
    export  default  example;

---

### HOW TO CONTRIBUTE

You can contribute by designing new video players, improving existing logic or improving the documentation of the project. Create an issue if you want to work on any of this contributions

### FURTHER ADVANCEMENT

- More video players to be added
- Improving the loading time of the videos