package com.core;
import java.awt.*;
import java.awt.event.*;
import java.util.ArrayList;

import javax.swing.*;
import javax.swing.text.*;


public class GUI {
	public JFrame f;
	private JPanel topPanel = new JPanel();
	private JTextPane textArea = new JTextPane();
	public JTextField inputText = new JTextField();
	private String userInput = "";
	private Player player;
	
	public JPanel sidePanel = new JPanel();
	
	public JFrame buildFrame(){	    
			    
		f = new JFrame("AMSA World");
		f.setSize(800, 600);
	    f.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
	    f.setLayout(new GridBagLayout());

	    textArea.setFocusable(false);
	    JScrollPane scrollPane = new JScrollPane(textArea);
	    scrollPane.setHorizontalScrollBarPolicy(ScrollPaneConstants.HORIZONTAL_SCROLLBAR_NEVER);
	    
	    ActionListener listener = new ActionListener() {  
	    	public void actionPerformed(ActionEvent evt) {
	    		checkInput();
	        } 
	    };
	    inputText.addActionListener(listener);
	    
	    GridBagConstraints c = new GridBagConstraints();
	    c.fill = GridBagConstraints.HORIZONTAL;
	    c.insets = new Insets(5,5,5,5);
	    c.weightx = 1.0;
	    c.gridwidth = 3;
	    c.weighty = 0.025;
	    c.gridx = 0;
	    c.gridy = 0;
	    f.add(topPanel, c);
	    
	    c.fill = GridBagConstraints.BOTH;
	    c.weighty = 1.0;
	    c.gridwidth = 2;
	    c.gridx = 0;
	    c.gridy = 1;
	    f.add(scrollPane, c);
	    
	    c.fill = GridBagConstraints.BOTH;
	    c.weighty = 1.0;
	    c.gridwidth = 1;
	    c.gridx = 2;
	    c.gridy = 1;
	    f.add(sidePanel, c);
	    sidePanel.setVisible(false);
	    
	    c.fill = GridBagConstraints.HORIZONTAL;
	    c.weighty = 0.025;
	    c.gridwidth = 3;
	    c.gridx = 0;
	    c.gridy = 2;
	    f.add(inputText, c);
	    
	    f.setVisible(true);
		
		 return f;
	}
	public  JTextField getTextField(){
		return inputText;
	}
	public  void toggleTextField(boolean value){
		inputText.setEnabled(value);
	}
	public  String getUserInput(){
		return userInput;
	}
	public  void setUserInput(String s){
		userInput = s;
	}
	public  JPanel getTopPanel(){
		return topPanel;
	}
	public  JPanel getSidePanel(){
		return sidePanel;
	}
	public  void setPlayer(Player p){
		player = p;
	}
	
	public  void appendToPane(String msg, Color c){
		if(inputText.isEnabled()){
        StyleContext sc = StyleContext.getDefaultStyleContext();
        AttributeSet aset = sc.addAttribute(SimpleAttributeSet.EMPTY, StyleConstants.Foreground, c);

        textArea.setCharacterAttributes(aset, false);
        textArea.replaceSelection(msg);
        textArea.setCaretPosition(textArea.getDocument().getLength());
		}
    }
	public void checkInput(){
		//SwingUtilities.invokeLater(new Runnable() {
		   // public void run() {
		    	String text = inputText.getText();
	    		if(!text.equals("")){
	    			appendToPane(text + "\n\n", Color.blue);
	    			inputText.setText("");
	    			if(text.startsWith("use ")){
	    				ArrayList<Item> inventory = player.getInventory();
	    				String key = text.substring(4);
	    				boolean found = false;
	    				for(Item i : inventory){
	    					if(i.getName().equalsIgnoreCase(key)){
	    						found = true;
	    						i.use();
	    						break;
	    					}
	    				}
	    				if(!found){
	    					appendToPane("Item does not exist in your iventory.\n\n", Color.black);
	    				}
	    				else{
	    					
	    				}
	    			}
	    			if(text.startsWith("inventory")){
	    				ArrayList<Item> inventory = player.getInventory();
	    				if(inventory.size() > 0){
		    				for(Item i : inventory){
		    					appendToPane(i.getName() +"\n", Color.darkGray);
		    				}
	    				}
	    				else
	    					appendToPane("Your iventory is empty.\n\n", Color.black);
	    				appendToPane("#", Color.blue);
	    			}
	    			else{
		    			userInput = text;
	    			}
	    		}
		    //}
		// });
	}
}
