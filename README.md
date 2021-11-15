Hobby ReactJS project.
Emulates a Rubik's cube.


This project started as a means to practice my React skills by emulating a Rubik's cube - a toy which has interested me for many years.
As I was nearing the end of what I had set out for this project, I decided to try my hand at a full stack app. 
I accomplished this using MongoDB to save and load move sequences. I am quite happy with the state of this project, I feel it helped solidify my React knowledge while learning something new. 
I am excited to move on to my next projects. Stay tuned!



![Demo](https://user-images.githubusercontent.com/56170988/141828491-75d86287-539f-417f-a064-2da36b9edc7f.mp4)

This project requires a MongoDB database, configurable in the backend/.env folder.
	The following fields should be here:
		SAVES_DB_URI : the URI to your MongoDB
		SAVES_NS  : the collection name in your database
		PORT=5000 : the backend port

Build instructions (requires .env file setup as mentioned above):
	terminal one: cd ./frontend; npm start
	terminal two: cd ./backend; nodemon .server
	goto in browser: http://localhost:3000/
