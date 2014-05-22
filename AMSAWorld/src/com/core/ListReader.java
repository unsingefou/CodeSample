package com.core;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Scanner;

public class ListReader {
	private ArrayList<String> tempList = new ArrayList<String>();
	/**
	 * @param args
	 */
	public List<String> read(){
		InputStream resourceAsStream = this.getClass().getResourceAsStream("worldList.txt");
		Scanner scanner = new Scanner(resourceAsStream);
		scanner.useDelimiter(",\\r\\n");
		String token;
		while(scanner.hasNext()){
			token = scanner.next();
			//System.out.println(token);
			tempList.add(token);
		}
		scanner.close();
		return tempList;
	}

}
