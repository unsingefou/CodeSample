package com.worlds;
import com.core.GUI;
import com.core.HealthPotion;
import com.core.Player;
import com.core.TextControl;

public class Tutorial extends World{
	
	public Tutorial(GUI g){
		super(g);
		
	}
	
	/**This is the entry point for this world.  After instantiating the world, call this 
	 * method with a player object to enter this world.
	 * 
	 * @param p - Player object to be used in this world.
	 * @return Player - player object after the world has been completed.
	 */
	public Player play(Player p) {
		player = p;
		
		inventoryEncounter();
		rabbitEncounter();
		endEncounter();
		
		return player;
	}
	
	/**Walks the user through the process of accessing and using
	 * items from the players inventory
	 * 
	 */
	public void inventoryEncounter(){		
		app.print("Alright, let's get started.\n");
		app.pause(500);
		app.print("Like every good hero, you have health, mana, and sanity.  Your stats are always at the top " +
				"of this window.  Becareful as you adventure, if your health reaches zero, " +
				"you will no longer be able to continue!\n");
		app.pause(5000);
		app.print(player.getName() + "!  Look out for that......\n");
		app.pause(3000);
		app.print("....falling donkey.\n");
		player.changeHealth(-50);
		app.pause(3000);
		app.print("That was unexpected!\n");
		app.pause(3000);
		app.print("There is a medium health potion over on the table.  Type \"take medium health potion\" to pick it up.\n");
		String input = "";
		while(true){
			input = app.getInput();
			if(input.equalsIgnoreCase("take medium health potion"))
				break;
			else
				app.print("That's not right, try again.\n");
		}
		player.addToInventory(new HealthPotion("Medium Health Potion"));
		app.print("At any time type \"inventory\" to view the items you have.\n");
		app.print("Type \"use Medium Health Potion\" to drink the potion in your inventory.\n");
		while(true){
			input = app.getInput();
			if(input.equalsIgnoreCase("use medium health potion"))
				break;
			else
				app.print("Come on, you don't want to keel over here, do you?\n");
		}
		app.print("Excellent work!  I can see you are a natural.\n");
		app.pause(4000);
	}
	
	/**Sample combat illustrating how to attack.  The attack though can change based on the
	 * commands required
	 */
	public void rabbitEncounter(){
		app.print("Oh no!  Here comes that infamous terrifying rabbit, HareGotha!\n");
		app.pause(2000);
		for(int i = 0; i < 3; i++){
			app.special("*hop*\n\"ROAR!\"\n");
			app.pause(2000);
		}
		app.print("You had better make quick work of this vicious fella.\n");
		String input = "";
		while(true){
			app.print("Type \"attack rabbit\" to take down the little puff ball!\n");
			input = app.getInput();
			if(!input.equals("attack rabbit")){
				player.changeHealth(-5);
				app.print("Watch out, he is nibbling on your leg!\n");
				app.pause(1000);
			}
			else{
				double num = Math.random();
				if(num > 0.25){
					break;
				}else{
					player.changeHealth(-5);
					app.print("You missed!\nBetter try again before you become rabbit feed!\n");
				}
			}
		}
		app.pause(1000);
		app.special("*Cloud of fur explodes into the air.*\n");
		app.print("You did it!  Good work!\n");
		app.pause(2000);
		app.print("Some of commands you will encounter can be tricky.  Pay attention to the prompts " +
				"and remember to becareful as you explore.\n");
		app.pause(5000);
	}
	
	/**Provides an exit point from this world.
	 * 
	 */
	public void endEncounter(){
		String input = "";
		while(!input.equals("ready")){
			app.print("You are currently at the world gates, a realm between worlds.  " +
					"If you know the name of the world you would like to enter, you can type it " +
					"in when prompted, or try \"random\" to explore ventures untold.\n");
			app.pause(6000);
			app.print("I have nothing more to teach you.  I suspect you will be a great adventurer.\n");
			app.pause(4000);
			app.print("Type \"ready\" when you are ready to move on.\n");
			input = app.getInput();
		}
	}

}
