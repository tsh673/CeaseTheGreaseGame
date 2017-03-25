// Property of Texas A&M Cease the Grease CSCE 482 Taylor Harris, Victor Martinez, Chance Eckert 

var mainMusic;

var mainState = {
    preload: function() 
	{          
		game.load.image('droplet', 'assets/droplet.png'); // Load droplet image
		game.load.image('oil', 'assets/oil.png'); // Load oil image
		game.load.image('menu', 'assets/pause.png'); // Load pause menu options image
		game.load.audio('main', ['assets/main_music.mp3', 'assets/main_music.ogg']); // Load main game music
    },

    create: function() 
	{   
		this.enter = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);this.enter.onDown.add(function() { // When enter key is pressed, game is paused
			
			game.paused = true; // Pause game 

			menu = game.add.sprite(400/2, 490/2, 'menu'); // Add pause menu options image
			menu.anchor.setTo(0.5, 0.5);

			pauseLabel = game.add.text(400/2, 490-125, 'Click outside menu to resume', { font: '30px Arial', fill: '#fff' }); // Pause menu text 
			pauseLabel.anchor.setTo(0.5, 0.5);
		}, this);

		game.input.onDown.add(unpause, self); // Input listener to unpause game when user clicks outside of the menu options
		
		function unpause(event) // Unpause game
		{
			if(game.paused) // If game is paused, find out where the click occured
			{
				var x1 = 400/2 - 270/2, x2 = 400/2 + 270/2,
					y1 = 490/2 - 180/2, y2 = 490/2 + 180/2; // Calculate the corners of the menu

				if(event.x > x1 && event.x < x2 && event.y > y1 && event.y < y2 ) // Check if the click was inside the menu
				{
					var selectionMap = ['Main Menu', 'Learn More'];

					var x = event.x - x1,
						y = event.y - y1; // Get menu local coordinates for the click
 
					var selection = Math.floor(x / 90) + 3 * Math.floor(y / 90); // Calculate the choice
					
					if(selection == 0 || selection == 1 || selection == 2) // Display the choice
					{
						//game.state.start('menu');
						pauseLabel.text = "Chosen item: " + selectionMap[0];
					}	 
					else
					{
						//game.state.start('learn');
						pauseLabel.text = "Chosen item: " + selectionMap[1];
					}		
				}
				else
				{
					menu.destroy(); // Remove pause menu options
					pauseLabel.destroy(); // Remove pause menu text

					game.paused = false; // Unpause the game
				}
			}
		};
		
		game.physics.startSystem(Phaser.Physics.ARCADE);

		this.droplet = game.add.sprite(100, 245, 'droplet'); // Display droplet at 100, 245

		game.physics.arcade.enable(this.droplet); // Add physics to droplet
		
		this.droplet.body.gravity.y = 1000; // Makes droplet fall 

		var spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR); // Jump when spacebar is pressed
		spaceKey.onDown.add(this.jump, this);
		
		this.oils = game.add.group(); 
		
		this.timer = game.time.events.loop(1500, this.addRowOfOils, this); 
  
		score = 0;	// Score initialized to zero and displayed at the top left corner of the screen
		labelScore = game.add.text(20, 20, "0", { font: "30px Arial", fill: "#ffffff" });   

		mainMusic = game.add.audio('main'); // Music
		mainMusic.play();
	},

    update: function() // This function is called 60 times per second
	{
		if (this.droplet.y < 0 || this.droplet.y > 490)
		{
			mainMusic.stop();
			game.state.start('end'); // If the droplet is out of the screen, end the game
		}
		
		game.physics.arcade.overlap(this.droplet, this.oils, this.endGame, null, this); // If the droplet and oil overlap, end the game
    },
	
	jump: function() // Make the droplet jump 
	{ 
		this.droplet.body.velocity.y = -350; // Add a vertical velocity to the droplet
	},

	endGame: function() // End the game
	{
		mainMusic.stop();
		game.state.start('end');
	},
	
	addOneOil: function(x, y) 
	{
		var oil = game.add.sprite(x, y, 'oil'); // Display oil at x, y

		this.oils.add(oil);

		game.physics.arcade.enable(oil);
		
		oil.body.velocity.x = -200; // Add velocity to the oil spill to make it move left

		oil.checkWorldBounds = true;
		oil.outOfBoundsKill = true; // Kill the oil when its out of bounds
	},
	
	addRowOfOils: function() 
	{
		var hole = Math.floor(Math.random() * 5) + 1; // Randomly choose a # between 1-5 for the hole position

		for (var i = 0; i < 8; i++)
			if (i == hole) 
				this.addOneOil(400, i * 60 + 10);
				
		score += 1;
		labelScore.text = score;  
	},
};

var gameOverState = {

	preload: function() 
	{      
		game.load.image('mainmenu', 'assets/mainmenu.png'); // Load main menu image
		game.load.image('leaderboard', 'assets/leaderboard.png'); // Load leader board image
		game.load.image('learnmore', 'assets/learnmore.png'); // Load learn more image
	},

	create: function () 
	{
		gameOverLabel = game.add.text(game.world.centerX, game.world.centerY - 190, 'GAME OVER', { font: '40px Arial', fill: '#fff' }); // Game over text
		gameOverLabel.anchor.setTo(0.5, 0.5);
		
		var mainMenuButton = game.add.button(game.world.centerX, game.world.centerY - 100, 'mainmenu', function() {game.state.start('menu');}, this, 2, 1, 0); // Main menu button
		mainMenuButton.anchor.setTo(0.5, 0.5);
			
		var leaderButton = game.add.button(game.world.centerX, game.world.centerY, 'leaderboard', getScore, this, 2, 1, 0); // Leadboard button
		leaderButton.anchor.setTo(0.5, 0.5);
			
		var learnButton = game.add.button(game.world.centerX, game.world.centerY + 100, 'learnmore', function() {game.state.start('learn');}, this, 2, 1, 0); // Learn more button
		learnButton.anchor.setTo(0.5, 0.5);
    
		word = "";
		prevLetter = "";
		letter = "";
	
		var inputLabel = stateText = game.add.text(game.world.centerX, game.world.centerY, ' ', {font: '30px Arial', fill: '#F2F2F2'}); // Display user input
		stateText.anchor.setTo(0.5, 0.5);
	
		function getScore () 
		{
			mainMenuButton.destroy();
			leaderButton.destroy();
			learnButton.destroy();
			
			initialsLabel = game.add.text(game.world.centerX, game.world.centerY - 100, 'Please enter your initials then press ENTER', { font: '20px Arial', fill: '#fff' }); // Input initials text
			initialsLabel.anchor.setTo(0.5, 0.5);
			
			game.input.keyboard.addCallbacks(self, keyDown, null, null); // Input listener for user's keyboard input 
			
			function keyDown(evt) 
			{
				if(evt.which < "A".charCodeAt(0) || evt.which > "Z".charCodeAt(0))
					return; // Skip it unless it's a-z.

				prevLetter = letter; // Save previous letter
				
				letter = String.fromCharCode(evt.which) + "."; // Add period for initials format ex: t.h.

				if(!evt.shiftKey) 
					letter = letter.toUpperCase(); 
			}
			
			this.enter2 = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);this.enter2.onDown.add(function() { // When the enter key is pressed
				localStorage.setItem(score.toString(), word); // Store initials and score for leaderboard
			
				game.state.start('leader');	// Go to leaderboard
			}, this);
		}
	},
	
	update: function () 
	{
		word = prevLetter + letter; // Used to concatenate both initials and display it on the screen
        stateText.text = word;
        stateText.visible = true;
	},
};

var leaderboardState = {
	
	preload: function() 
	{      
		game.load.image('mainmenu', 'assets/mainmenu.png'); // Load main menu image
	},
	
	create: function ()
	{
		leaderboardLabel = game.add.text(game.world.centerX, game.world.centerY - 200, 'Leaderboard', { font: '30px Arial', fill: '#fff' }); // Leaderboard text
		leaderboardLabel.anchor.setTo(0.5, 0.5);
			
		if(localStorage.length > 0)
		{
			var localStorageArray = new Array();
			for (var i = 0; i < localStorage.length; i++)
			{
				localStorageArray[i] = Number(localStorage.key(i)); // Put scores in an array so they can be sorted
			}
			localStorageArray.sort(function(a,b) { return b - a; }); // Sort scores in decreasing order

		}
			
		for (var n = 0; n < localStorageArray.length && n < 9; n++) // Iterate through every initials/score pair
		{
			scoreLabel = game.add.text(game.world.centerX, 100 + (n*30), localStorage.getItem(localStorageArray[n]) + "             " + localStorageArray[n], { font: '20px Arial', fill: '#fff' }); // Display top 9 initials and score
			scoreLabel.anchor.setTo(0.5, 0.5);
		}
			
		var mainMenuButton = game.add.button(game.world.centerX, game.world.centerY + 175, 'mainmenu', function() {game.state.start('menu');}, this, 2, 1, 0); // Main menu button
		mainMenuButton.anchor.setTo(0.5, 0.5);
	},
}

var menuState = {
	
	preload: function() 
	{      
		game.load.image('instructions', 'assets/instructions.png'); // Load instructions image
		game.load.image('leaderboard', 'assets/leaderboard.png'); // Load leader board image
		game.load.image('learnmore', 'assets/learnmore.png'); // Load learn more image
		game.load.image('play', 'assets/play.png'); // Load play image
	},
	
	create: function () 
	{    
		game.stage.backgroundColor = '#71c5cf'; //Background color blue
	
		var menuLabel = game.add.text(game.world.centerX, game.world.centerY - 200, 'The Cease the Grease Game', {font: '30px Arial', fill: '#F2F2F2'}); // Main menu text
		menuLabel.anchor.setTo(0.5, 0.5);
		
		var playButton = game.add.button(game.world.centerX, game.world.centerY - 125, 'play', function() {game.state.start('story');}, this, 2, 1, 0); // Play button
		playButton.anchor.setTo(0.5, 0.5);
		
		var instructionsButton = game.add.button(game.world.centerX, game.world.centerY - 25, 'instructions', function() {game.state.start('instructions');}, this, 2, 1, 0); // Instructions button
		instructionsButton.anchor.setTo(0.5, 0.5);
			
		var leaderButton = game.add.button(game.world.centerX, game.world.centerY + 75, 'leaderboard', function() {game.state.start('leader');}, this, 2, 1, 0); // Leadboard button
		leaderButton.anchor.setTo(0.5, 0.5);
			
		var learnButton = game.add.button(game.world.centerX, game.world.centerY + 175, 'learnmore', function() {game.state.start('learn');}, this, 2, 1, 0); // Learn more button
		learnButton.anchor.setTo(0.5, 0.5);
    },
};

var storyState = {
	
	create: function () 
	{    	
		var storyLabel = game.add.text(game.world.centerX, game.world.centerY, 'Help Drippy reach the ocean! \nTo start game click anywhere', {font: '20px Arial', fill: '#F2F2F2'}); // Story text
        storyLabel.anchor.setTo(0.5, 0.5);
		
		game.input.onDown.add(function() {game.state.start('main');}, self); // Input listener to start game on mouse click
    },
};

var learnMoreState = {
	
	preload: function() 
	{      
		game.load.image('mainmenu', 'assets/mainmenu.png'); // Load main menu image
	},
	
	create: function () 
	{    
		var learnMoreLabel = game.add.text(game.world.centerX, game.world.centerY - 200, 'About the Cease the Grease Campaign', {font: '20px Arial', fill: '#F2F2F2'}); // Learn more text
		learnMoreLabel.anchor.setTo(0.5, 0.5);
		
		var mainMenuButton = game.add.button(game.world.centerX, game.world.centerY + 175, 'mainmenu', function() {game.state.start('menu');}, this, 2, 1, 0); // Main menu button
		mainMenuButton.anchor.setTo(0.5, 0.5);
    },
};

var instructionsState = {
	
	preload: function() 
	{      
		game.load.image('mainmenu', 'assets/mainmenu.png'); // Load main menu image
	},
	
	create: function () 
	{    
		var instructionsLabel = game.add.text(game.world.centerX, game.world.centerY - 200, 'How to Play', {font: '30px Arial', fill: '#F2F2F2'}); // Instructions text
		instructionsLabel.anchor.setTo(0.5, 0.5);
		
		var mainMenuButton = game.add.button(game.world.centerX, game.world.centerY + 175, 'mainmenu', function() {game.state.start('menu');}, this, 2, 1, 0); // Main menu button
		mainMenuButton.anchor.setTo(0.5, 0.5);
    },
};

// Create a 400, 490 new Phaser game
var game = new Phaser.Game(400, 490);

//localStorage.clear();

var prevLetter = " ";
var letter = " ";
var initials = " ";
var score = 0;

game.state.add('main', mainState); 
game.state.add('end', gameOverState);
game.state.add('menu', menuState);
game.state.add('leader', leaderboardState);
game.state.add('learn', learnMoreState);
game.state.add('story', storyState);
game.state.add('instructions', instructionsState);

// Begin the game at the main menu
game.state.start('menu');