// Create our 'main' state that will contain the game
var mainState = {
    preload: function() { 
        // This function will be executed at the beginning     
        // That's where we load the images and sounds 
		// Load the droplet sprite
		game.load.image('droplet', 'assets/droplet.png'); 
		
		game.load.image('oil', 'assets/oil.png');
		
	//	game.load.image('fish', 'assets/fish.png');
    },

    create: function() { 
        // This function is called after the preload function     
        // Here we set up the game, display sprites, etc. 
		// Change the background color of the game to blue
		game.stage.backgroundColor = '#71c5cf';

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
		
	//	this.fishes = game.add.group(); 
		
		this.timer = game.time.events.loop(1500, this.addRowOfOils, this); 
    
	//	this.timer = game.time.events.loop(1500, this.addRowOfFishes, this);
	
		this.score = 0;
		this.labelScore = game.add.text(20, 20, "0", 
			{ font: "30px Arial", fill: "#ffffff" });   
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
			
	//	game.physics.arcade.overlap(
	//		this.droplet, this.fishes, this.restartGame, null, this);
    },
	
	// Make the droplet jump 
	jump: function() {
		// Add a vertical velocity to the droplet
		this.droplet.body.velocity.y = -350;
	},

	// Restart the game
	restartGame: function() {
		// Start the 'main' state, which restarts the game
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
/*
	addOneFish: function(x, y) {
		// Create a fish at the position x and y
		var fish = game.add.sprite(x, y, 'fish');

		// Add the fish to our previously created group
		this.fishes.add(fish);

		// Enable physics on the fish 
		game.physics.arcade.enable(fish);

		// Add velocity to the fish to make it move left
		fish.body.velocity.x = -200; 

		// Automatically kill the fish when it's no longer visible 
		fish.checkWorldBounds = true;
		fish.outOfBoundsKill = true;
	},
*/
	addRowOfOils: function() {
		// Randomly pick a number between 1 and 5
		// This will be the hole position
		var hole = Math.floor(Math.random() * 5) + 1;

		// Add the 6 oil spills 
		// With one big hole at position 'hole' and 'hole + 1'
		//for (var i = 0; i < 8; i++)
		//	if (i != hole && i != hole + 1) 
		//		this.addOneOil(400, i * 60 + 10);   
		
		for (var i = 0; i < 8; i++)
			if (i == hole) 
				this.addOneOil(400, i * 60 + 10);
				
		this.score += 1;
		this.labelScore.text = this.score;  
	},
/*	
	addRowOfFishes: function() {
		// Randomly pick a number between 1 and 5
		// This will be the hole position
		var hole2 = Math.floor(Math.random() * 5) + 1;

		// Add the 6 oil spills 
		// With one big hole at position 'hole' and 'hole + 1'
		//for (var i = 0; i < 8; i++)
		//	if (i != hole && i != hole + 1) 
		//		this.addOneOil(400, i * 60 + 10);   
		
		for (var i = 0; i < 8; i++)
			if (i == hole2) 
				this.addOneFish(400, i * 60 + 20);
				
		this.score += 1;
		this.labelScore.text = this.score;  
	},
*/
};

// Initialize Phaser, and create a 400px by 490px game
var game = new Phaser.Game(400, 490);

// Add the 'mainState' and call it 'main'
game.state.add('main', mainState); 

// Start the state to actually start the game
game.state.start('main');