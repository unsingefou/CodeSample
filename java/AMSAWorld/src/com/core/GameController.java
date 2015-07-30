package com.core;
import java.lang.reflect.Constructor;
import java.lang.reflect.InvocationTargetException;
import java.util.*;

import com.worlds.Tutorial;
import com.worlds.World;

public class GameController {
	public static ArrayList<String> worldList = new ArrayList<String>();
	private static GUI mainGUI = new GUI();
	private static TextControl app = new TextControl(mainGUI);

	public static void main(String[] args){
		
		ListReader reader = new ListReader();
		worldList.addAll(reader.read());
		System.out.println(worldList.size());
		
		boolean isPlaying = true;
		
		
		mainGUI.buildFrame();
		
		Player player = createPlayer();
		mainGUI.setPlayer(player);
		app.pause(2000);
	    
		tutCheck(player);
	   
		while(isPlaying){
			worldSelection(player);
			System.out.println("Done!");
		}
		

	}
	/**Welcomes the user to the game, prompting them for their name.  Then creates a new player 
	 * based on the user input.
	 * 
	 * @param g - GUI - object coming directly from the GUI class
	 * @return Player - Instantiated (created) in the method
	 */
	public static Player createPlayer(){
		app.print("Welcome to the World Gates!  \nPlease tell me your name.\n");
		String input = app.getInput();
		app.print("Nice to meet you " + input + ".\nMy name is Hezron and I will be your guide.\n");
		Player p = new Player(input, mainGUI);		//instantiates the player object
	    return p;
	}
	
	/**Asks the user if they would like to play the tutorial world, returning the appropriate
	 * response to the question.
	 * 
	 * @return boolean - depending on the user response
	 */
	public static void tutCheck(Player p){
		app.print("Would you like me to show you how to play?\n");
		String input = app.getInput();
		
		//array for all possible yes responses
		String[] response = {"y", "yes", "yea", "yeah", "yup"};
	
		for(String r : response){		
			if(input.equalsIgnoreCase(r)){
				Tutorial tut = new Tutorial(mainGUI);
				tut.play(p);
			}
		}
	}
	/**Creates a new world based on String parameter provided.  Checks for classes which 
	 * having the matching String.
	 * 
	 * @param n - String - The name of the world, corresponding to the class name.
	 * @param p - player - The player that will enter the world
	 * @return World object - The newly created world.
	 */
	public static World createWorld(String className, Player p){
		World world;
		try {
			//searches for the matching class, and instantiates it
			/*world = (World) Class.forName(className).newInstance(); 
			world.play(p);	*/		//calls the play method of the world, essentially staring it
			Class c = Class.forName(className);
			Constructor construct = c.getConstructor(GUI.class);
			world = (World)construct.newInstance(mainGUI);
			world.play(p);
			
		} catch (InstantiationException e) {
			e.printStackTrace();
			world = null;
		} catch (IllegalAccessException e) {
			e.printStackTrace();
			world = null;
		} catch (ClassNotFoundException e) {
			e.printStackTrace();
			world = null;
		} catch (NoSuchMethodException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			world = null;
		} catch (SecurityException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			world = null;
		} catch (IllegalArgumentException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			world = null;
		} catch (InvocationTargetException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			world = null;
		}
		return world;
	}
	public static void worldSelection(Player p){
		app.print("So, " + p.getName() + ", you are ready to enter one of the world gates.\n");
		app.print("Which world would you like to enter?\n");
		String userInput = app.getInput();
		if(userInput.equalsIgnoreCase("random")){
			Random rand = new Random();
			int num = rand.nextInt(worldList.size());
			for(int i = 0; i<4; i++){
				app.print("Selecting...\n");
				app.pause(500);
			}
			String worldName = worldList.get(num);
			app.print(worldName + " has been selected.\n\n");
			app.pause(1000);
			World tempWorld = createWorld("com.worlds." + worldName, p);
			if(tempWorld == null)
				app.print("I'm sorry, the name listed in worldList.txt and the class name do not " +
						"match.  Please resolve the conflict and try again\n");
		}
		else if(worldList.contains(userInput)){
			for(int i = 0; i<4; i++){
				app.print("Creating...\n");
				app.pause(500);
			}
			app.print(userInput + " has been created.\n\n");
			app.pause(1000);
			World tempWorld = createWorld("com.worlds." + userInput, p);
			if(tempWorld == null)
				app.print("I'm sorry, the name listed in worldList.txt and the class name do not " +
						"match.  Please resolve the conflict and try again\n");
		}
		else{
			app.print("I'm sorry, that world does not exist, please try again.\n");
			app.pause(500);
		}
	}
}
