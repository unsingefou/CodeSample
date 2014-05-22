 package com.worlds;

import java.util.*;

import com.core.Bucket;
import com.core.GUI;
import com.core.Item;
import com.core.Player;
import com.core.TextControl;

/**
* @author jlevis
* 
*/
public class DemoWorld extends World{
	boolean attackedDragon = false;
	
	public DemoWorld(GUI g){
		super(g);
	}
	
	public Player play(Player p){
		player = p;
		firstEncounter();
		fireEncounter();
		challenge();
		winSequence();
		lastEncounter();
		
		return player;
	}
	public void firstEncounter(){
		app.print("A sign says \"Welcome to the World of Fire and Ash!\"\n" +
				"As you look around you note that Fire and ash explains it all.  " +
				"The road goes to the north and south.  Which direction would you like to go?\n");
		String input = "";
		input = app.getInput();
		while(true){
			if(input.equals("south") || input.equals("north"))
				break;
			app.print("You can't go that way, try again.\n");
			input = app.getInput();
		}
	}
	public void fireEncounter(){
		app.print("You walk right into a fire pit!\n");
		player.changeHealth(-25);
		app.pause(1000);
		app.print("Suddenly, an old man appears at the edge, extending his hand to you, " +
				"right through the flames.\n");
		String input = app.getInput();
		while(true){
			List<String> options = Arrays.asList("take hand", "take his hand", "grab hand", "grab his hand");
			if(options.contains(input))
				break;
			player.changeHealth(-25);
			app.print("The old man stares at you with hand extended.  Maybe you should take it.\n");
			input = app.getInput();
		}
		app.pause(1000);
		app.print("The old man heaves you out of the flames.");
		app.pause(2000);
		app.print("He begins to speak while dusting your off.\n");
		app.pause(2000);
		app.quote("The bad news is that you are a little burned.\n");
		app.pause(2000);
		app.quote("However, I happen to be a great healer.  Allow me to  " +
				"bless you with my Healing Aura.\n");
		app.pause(3000);
		while(player.getHealth()<100){
			player.changeHealth(5);
			app.pause(500);
		}
		app.pause(1000);
		app.quote("There, you are looking much better.  Still a little crispy, but at least " +
				"you aren't on fire any longer.\n");
		app.pause(4000);
	}
	public void challenge(){
		app.print("A crowd begins to form around you.  The old man's face remains very stern as " +
				"he continues to speak.\n");
		app.pause(4000);
		app.quote("I am the protector of this world.  You look like a " +
				"great warrior.  We could use your services.  A great fire dragon has been tormenting " +
				"the people, burning villages and causing chaos.   Will you help us?  " +
				"Will you defeat this dragon?\n");
		String input = "";
		while(true){
			input = app.getInput();
			if(input.equals("yes")){
				app.pause(1000);
				mazeEncounter();
				break;
			}
			else if(input.equals("no")){
				battleMan();
				break;
			}
			app.print("The old man looks displeased.\n");
			app.pause(1000);
			app.quote("Yes or no, anything else comes from the devil!\n");
		}
	}
	public void mazeEncounter(){
		app.quote("Brave warrior, the vile beast waits somewhere inside the ancient labyrinth. " +
				"You must find your way there and slay the monster!\n");
		app.pause(5000);
		app.print("The old man leads you just inside entrace of the labyrinth.\n");
		app.quote("Go now and godspeed!\n");
		app.pause(4000);
		app.print("You look ahead, uncertain of the future.\n");
		app.pause(4000);
		west();
	}
	public void west(){
		app.print("The old man stands to the side.  The are two paths, one to the North " +
				"and the other to the South.  Where would you like to go?\n");
		String input = "";
		while(true){
			input = app.getInput();
			if(input.equals("north")){
				northWest();
				break;
			}
			else if(input.equals("south")){
				southWest();
				break;
			}
			else{
				app.print("That path is not an option.\n");
			}
				
		}
	}
	public void northWest(){
		app.print("The are two paths, one to the East " +
				"and the other to the South.  Where would you like to go?\n");
		String input = "";
		while(true){
			input = app.getInput();
			if(input.equals("east")){
				north();
				break;
			}
			else if(input.equals("south")){
				west();
				break;
			}
			else{
				app.print("That path is not an option.\n");
			}
				
		}
	}
	public void north(){
		app.print("The are two paths, one to the South " +
				"and the other to the West.  Where would you like to go?\n");
		String input = "";
		while(true){
			input = app.getInput();
			if(input.equals("south")){
				mid();
				break;
			}
			else if(input.equals("west")){
				northWest();
				break;
			}
			else{
				app.print("That path is not an option.\n");
			}
				
		}
	}
	public void mid(){
		String message = "An empty bucket sits on the ground next to the fountain.  ";;
		ArrayList<Item> tempI = (ArrayList<Item>)player.getInventory();
		for(Item i : tempI){
			if(i.getName().contains("bucket")){
				 message = "";
				 break;
			}
		}
		Item bucket = new Bucket("empty bucket", gui);
		app.print("You find yourself in a beautiful courtyard.  At the center is a large fountain " +
				"flowing with water.  " + message + "Smoke " +
				"rises from the South-East of your current position.  " +
				"The are two paths out of the courtyard, one to the North " +
				"and the other to the East.  What would you like to do?\n");
		String input = "";
		while(true){
			input = app.getInput();
			if(input.equals("north")){
				north();
				break;
			}
			else if(input.equals("east")){
				east();
				break;
			}
			else if(input.contains("take") && input.contains("bucket")){
				player.addToInventory(bucket);
			}
			else if(input.contains("fill") && input.contains("bucket")){
				((Bucket) bucket).fill();
			}
			else{
				app.print("That path is not an option.\n");
			}
		}
	}
	public void east(){
		app.print("The are three paths, North, South, and West.  Where would you like to go?\n");
		String input = "";
		while(true){
			input = app.getInput();
			if(input.equals("north")){
				northEast();
				break;
			}
			else if(input.equals("south")){
				southEast();
				break;
			}
			else if(input.equals("west")){
				mid();
				break;
			}
			else{
				app.print("That path is not an option.\n");
			}
				
		}
	}
	public void southEast(){
		if(!attackedDragon)
			app.print("As you round the corner, you see the massive fire dragon.  It hasn't noticed your " +
					"approach.  This may be an opportune time to attack.  The path only returns North " +
					"from here.  Where would you like to go?\n");
		else{
			app.print("This time the fire dragon sees you approach.  The embers " +
					"start billowing inside of the beast.\n");
			attackDragon();
		}
		String input = "";
		while(true){
			input = app.getInput();
			if(input.equals("north")){
				east();
				break;
			}
			else if(input.contains("attack")){
				attackDragon();
				break;
			}
			else{
				app.print("That is not a valid option.\n");
			}
				
		}
	}
	public void northEast(){
		app.print("You have arrived at a dead end.  The path only heads South, back from the " +
				"direction you came.  Where would you like to go?\n");
		String input = "";
		while(true){
			input = app.getInput();
			if(input.equals("south")){
				east();
				break;
			}
			else{
				app.print("That path is not an option.\n");
			}
				
		}
	}
	public void southWest(){
		app.print("The are two paths, one to the North " +
				"and the other to the East.  Where would you like to go?\n");
		String input = "";
		while(true){
			input = app.getInput();
			if(input.equals("north")){
				west();
				break;
			}
			else if(input.equals("east")){
				south();
				break;
			}
			else{
				app.print("That path is not an option.\n");
			}
				
		}
	}
	public void south(){
		app.print("You have arrived at a dead end.  The path only heads West, back from the " +
				"direction you came.  Where would you like to go?\n");
		String input = "";
		while(true){
			input = app.getInput();
			if(input.equals("west")){
				southWest();
				break;
			}
			else{
				app.print("That path is not an option.\n");
			}
				
		}
	}
	public void attackDragon(){
		ArrayList<Item> tempI = (ArrayList<Item>)player.getInventory();
		Item bucket = null;
		for(Item i : tempI){
			if(i.getName().equals("full bucket")){
				bucket = i;
				bucket.setcanUse(true);
			}
		}
		
		if(!attackedDragon){
			app.print("You tip toe quietly up behind the dragon.\n");
			app.pause(2000);
			for(int i = 0; i < 3; i++){
				app.special("tip...toe...\n");
				app.pause(1000);
			}
			app.print("You crouch down, ready to make your attack.\n");
			app.pause(4000);
			app.print("Suddenly, the fire dragon spins on you, opening it's mouth widely.  " +
					"You see embers glowing deep inside the throat of the beast.\n");
			app.pause(5000);
			attackedDragon = true;
		}
		while(true){
			app.print("It's not to late to flee, use an item, or maybe you can roll to the left or right, " +
					"out of the line of fire.\n");
			app.pause(4000);
			app.print("You have a split second to decide what to do.\n");
			int sTime = (int) System.currentTimeMillis();
			String input = app.getInput();
			int eTime = (int) System.currentTimeMillis();
			int dif = eTime - sTime;
			if(dif < 5000){
				if(input.contains("left") || input.contains("right")){
					rolledAway();
				}
				else if(input.contains("flee")){
					app.print("You flee from the dragon as it prepares to blast you with fire.\n");
					app.pause(2000);
					app.print("As the distance increases, you realize that the beast hasn't followed you.\n");
					app.pause(2000);
					east();
					break;
				}
				else if(input.equals("use full bucket")){
					//System.out.println("You win!");
					break;
				}
				else if(input.contains("water")){
					app.print("That didn't work, but you somehow managed to dodge the flame.\n");
					app.pause(3000);
				}
				else{
					if(bucket != null)
						bucket.setcanUse(false);
					burnedByDragon();
				}
			}
			else{
				if(bucket != null)
					bucket.setcanUse(false);
				burnedByDragon();
			}
		}

	}
	public void rolledAway(){
		app.print("You roll to the side just in time, narrowly escaping the flames.\n");
		app.pause(3000);
		app.quote("If only I had water, maybe I can douse his flame.\n");
		app.pause(3000);
		app.print("You think to yourself out loud.\n");
		app.pause(2000);
		app.print("The dragon finds you again, ember throat glowing red hot.\n");
		app.pause(2000);
	}
	public void burnedByDragon(){
		String[] bodyParts = {"left hand", "right shoulder", "big toe", "right knee", "ear", "nose"};
		Random rand = new Random();
		int num = rand.nextInt(bodyParts.length);
		String part = bodyParts[num];
		app.print("Your eyes grow wide as you realize that your reaction is too slow.\n");
		app.pause(3000);
		app.print("Fire erupts from the mouth of the dragon.  You try to evade " +
				"the flow of liquid flame, but your " + part + " is burned badly.\n");
		player.changeHealth(-30);
		app.pause(5000);
		/*app.print("As you hold your " + part + " in pain, the fire dragon wraps it's " +
				"claws around you.\n");
		app.pause(4000);
		app.print("With a huge puff of smoke, the beast heaves you into the air.\n");
		app.pause(5000);
		app.print("You fall to the ground in a painful heap of smoke and ash.\n");
		player.changeHealth(-20);
		app.pause(4000);
		app.print("It appears that you are in another section of the labyrinth.  With " +
				"great effort, you rise to your feet.\n");
		app.pause(4000);
		south();*/
	}
	public void winSequence(){
		app.print("Liquid fire begins spewing from the dragon's mouth.  Yet, somehow, you are able" +
				"to lauch the water deep in to it's throat.\n");
		app.pause(3000);
		app.special("hiss");
		for(int i = 0; i < 20; i ++){
			app.special("s");
			app.pause(100);
		}
		app.special("s\n");
		app.pause(3000);
		app.print("Steam pours from the dragons mouth.  And in one giant puff of ash, it collapses" +
				"to the ground smoldering.\n");
		app.pause(4000);
		app.print("You rip a scale from the dragon's hide and then begin your journey out of the labyrinth.\n");
		app.pause(4000);
		app.print("Making your way through the village, all of the pepole watch you warily.\n");
		app.pause(4000);
		app.print("The old man meets you at the center of town.  You lift the scale high into the air.\n");
		app.pause(4000);
		for(int i = 0; i<3; i++){
			app.special("Hooray!\n");
			app.pause(1000);
		}
		app.quote("Thank you for saving our village.  We are forever indebted to you.  Pleaes accept this gold " +
				"as a demonstration of our gratitude.\n");
		app.pause(4000);
		app.print("The old man hands you a large bag full of gold coin.\n");
		app.pause(4000);
		player.changeGold(500);
		app.pause(1000);
		app.print("You bow your head to him.\n");
		app.pause(4000);
		app.quote("The land of Fire and Ash will sing songs and tell poems of your epic adventure.\n");
		app.pause(4000);
		app.print("The old man leads you to the edge of town.\n");
		app.pause(4000);
		app.print("Farewell great warrior.  May the fortunes be ever in your favor.\n");
		app.pause(4000);
	}
	public void battleMan(){
		app.print("The old man's expression of plea dissolves into a contorted " +
				"blend of furry and anger.\n");
		app.pause(4000);
		app.quote("How dare you refuse to help us in our time of need.  I see there is nothing " +
				"but a haughty spirit inside of you.  Now you will meet your demise.\n");
		app.pause(4000);
		app.print("The crowd spreads out, creating a circle around the two of you.  The old man " +
				"begins to spin his staff in large circles in from of him.\n");
		app.pause(4000);
		app.print("He seems more than ready to fight.  A fight or flight response is " +
				"welling up inside of you.  Do you fight or flight?\n");
		String input = "";
		while(true){
			input = app.getInput();
			if(input.contains("fight")){
				app.print("You dash unexpectantly, hopping to catch the old man off guard.\n");
				app.pause(4000);
				app.print("The old man easily dodges your attack and brings his staff right " +
						"down on your head.\n");
				player.changeHealth(-25);
				app.pause(3000);
				app.print("Your vision begins to blur.  The last thing that you see is the old " +
						"man standing over you, a grin breaking across his lips.\n");
				app.pause(5000);
				
				morning();
				break;
			}
			else if(input.contains("flight")){
				app.print("Feeling a little intimidated, you turn and run straight for the entrance " +
						"of a very large labyrinth.\n");
				app.pause(4000);
				app.print("The old man chases you, following you into maze.\n");
				app.pause(4000);
				app.print("You turn to face him, ready to engage your elderly opponent, but the old man " +
						"has stopped and leans on his staff, almost smiling.\n");
				app.pause(4000);
				app.quote("So, you have had a change of heart.  Very well, the fire dragon lives somewhere " +
						"inside of this labyrinth.  Go and slay the beast and honor will be restored to you.\n");
				app.pause(4000);
				west();
				break;
			}
			else{
				app.print("That is not a valid biological response.\n");
			}
		}		
	}
	public void morning(){
		app.print("With great effort, you slowly lift your eyes.  Your head is throbbing.\n");
		app.pause(3000);
		app.print("There is a figure silohuetted against a rising sun.\n");
		app.pause(3000);
		app.print("The figured shifts out of the light and you recognize the familiar face " +
				"of the old man.\n");
		app.pause(3000);
		app.quote("Good morning.  I am pleased to see that you are awake.  Now are you ready to face" + 
			" that ghastly fire dragon?\n");
		String input = "";
		input = app.getInput();
		if(input.contains("y") || input.contains("Y")){
			app.quote("Fantastic!  Roll out of bed then.  Come on, let's go!\n");
			app.pause(3000);
			mazeEncounter();
		}
		else{
			app.print("The old man shrugs and then swiftly brings his staff down yet again on your head.\n");
			player.changeHealth(-5);
			app.pause(3000);
			app.print("Your vision blurs as you collapse back down into the soft warm bed.\n");
			app.pause(5000);
			morning();
		}
	}
	public void lastEncounter(){
		String input = "";
		while(!input.equals("end")){
			app.print("Type \"end\" to leave the World of Fire and Tinder.\n");
			input = app.getInput();
		}
	}
}
