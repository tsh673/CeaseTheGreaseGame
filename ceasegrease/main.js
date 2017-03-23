// Create our 'main' state that will contain the game
var mainMusic;

var mainState = {
    preload: function() { 
        // This function will be executed at the beginning     
        // That's where we load the images
		// Load the droplet sprite
		game.load.image('droplet', 'assets/droplet.png'); 
		
		game.load.image('oil', 'assets/oil.png');
		
		game.load.image('menu', 'assets/pause.png');
		
		//Load main game music
		game.load.audio('main', ['assets/main_music.mp3', 'assets/main_music.ogg']);
    },

    create: function() { 
        // This function is called after the preload function     
        // Here we set up the game, display sprites, etc. 
		// Change the background color of the game to blue
		game.stage.backgroundColor = '#71c5cf';

		// Pause screen code
		this.enter = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);this.enter.onDown.add(function() {
			// When the enter button is pressed, we pause the game
			game.paused = true;

			// Then add the menu
			menu = game.add.sprite(400/2, 490/2, 'menu');
			menu.anchor.setTo(0.5, 0.5);

			// And a label to illustrate which menu item was chosen. (This is not necessary)
			choseLabel = game.add.text(400/2, 490-125, 'Click outside menu to resume', { font: '30px Arial', fill: '#fff' });
			choseLabel.anchor.setTo(0.5, 0.5);
		}, this);

		// Add a input listener that can help us return from being paused
		game.input.onDown.add(unpause, self);
		
		// And finally the method that handles the pause menu
		function unpause(event){
			// Only act if paused
			if(game.paused){
				// Calculate the corners of the menu
				var x1 = 400/2 - 270/2, x2 = 400/2 + 270/2,
					y1 = 490/2 - 180/2, y2 = 490/2 + 180/2;

				// Check if the click was inside the menu
				if(event.x > x1 && event.x < x2 && event.y > y1 && event.y < y2 ){
					// The choicemap is an array that will help us see which item was clicked
					var chosemap = ['Main Menu', 'Learn More'];

					// Get menu local coordinates for the click
					var x = event.x - x1,
						y = event.y - y1;

					// Calculate the choice 
					var chose = Math.floor(x / 90) + 3*Math.floor(y / 90);

					// Display the choice
					if(chose == 0 || chose == 1 || chose == 2)
						choseLabel.text = 'Chosen item: ' + chosemap[0];
					else
						choseLabel.text = 'Chosen item: ' + chosemap[1];
				}
				else{
					// Remove the menu and the label
					menu.destroy();
					choseLabel.destroy();

					// Unpause the game
					game.paused = false;
				}
			}
		};
		
		// Set the physics system
		game.physics.startSystem(Phaser.Physics.ARCADE);

		// Display the droplet at the position x=100 and y=245
		this.droplet = game.add.sprite(100, 245, 'droplet');

		// Add physics to the droplet
		// Needed for: movements, gravity, collisions, etc.
		game.physics.arcade.enable(this.droplet);

		// Add gravity to the droplet to make it fall
		this.droplet.body.gravity.y = 1000;  

		// Call the 'jump' function when the spacekey is hit
		var spaceKey = game.input.keyboard.addKey(
						Phaser.Keyboard.SPACEBAR);
		spaceKey.onDown.add(this.jump, this);
		
		// Create an empty group
		this.oils = game.add.group(); 
		
		this.timer = game.time.events.loop(1500, this.addRowOfOils, this); 
  
		this.score = 0;
		this.labelScore = game.add.text(20, 20, "0", 
			{ font: "30px Arial", fill: "#ffffff" });  

		//Music
			mainMusic = game.add.audio('main');
			mainMusic.play();
	},

    update: function() {
        // This function is called 60 times per second    
        // It contains the game's logic
	    // If the droplet is out of the screen (too high or too low)
		// Call the 'restartGame' function
		if (this.droplet.y < 0 || this.droplet.y > 490)
			this.restartGame();
		
		game.physics.arcade.overlap(
			this.droplet, this.oils, this.restartGame, null, this);
    },
	
	// Make the droplet jump 
	jump: function() {
		// Add a vertical velocity to the droplet
		this.droplet.body.velocity.y = -350;
	},
	// Restart the game
	restartGame: function() {
		// Start the 'main' state, which restarts the game
		mainMusic.stop();
		game.state.start('main');
	},
	
	addOneOil: function(x, y) {
		// Create a oil spill at the position x and y
		var oil = game.add.sprite(x, y, 'oil');

		// Add the oil spill to our previously created group
		this.oils.add(oil);

		// Enable physics on the oil spill 
		game.physics.arcade.enable(oil);

		// Add velocity to the oil spill to make it move left
		oil.body.velocity.x = -200; 

		// Automatically kill the oil spill when it's no longer visible 
		oil.checkWorldBounds = true;
		oil.outOfBoundsKill = true;
	},
	addRowOfOils: function() {
		// Randomly pick a number between 1 and 5
		// This will be the hole position
		var hole = Math.floor(Math.random() * 5) + 1;

		for (var i = 0; i < 8; i++)
			if (i == hole) 
				this.addOneOil(400, i * 60 + 10);
				
		this.score += 1;
		this.labelScore.text = this.score;  
	},
};

// Initialize Phaser, and create a 400px by 490px game
var game = new Phaser.Game(400, 490);

// Add the 'mainState' and call it 'main'
game.state.add('main', mainState); 

// Start the state to actually start the game
game.state.start('main');