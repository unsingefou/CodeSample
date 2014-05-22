function queryAndUpdate() {  
  var sheet = SpreadsheetApp.getActiveSpreadsheet();
  
  
  var emailStatus, emailAddress, name, date, cart, block, message, subject;
  
  /////////////////////////////////////////////////////////////
  //Query existing calendar
  /////////////////////////////////////////////////////////////

  //name of cart from form, and name of corresponding google calendar
  var cart1 = "Bronze";   
  var calendar1 = "BronzeLaptopCart";  
  var cart2 = "Cyan";  
  var calendar2 = "CyanLaptopCart"; 
  var cart3 = "Magenta";  
  var calendar3 = "MagentaLaptopCart";  
  
  var cart = sheet.getRange("E2").getValue();
  //checks to see which cart is requested a opens corresponding calendar
  if (cart == cart1) {
    var cal = CalendarApp.openByName(calendar1);
  }
  else if (cart == cart2) { 
    var cal = CalendarApp.openByName(calendar2);
  }
  else if (cart == cart3) { 
    var cal = CalendarApp.openByName(calendar3);
  }
  Browser.msgBox(cal);
  var date = sheet.getRange("D2").getValue();
  var block = sheet.getRange("F2").getValue();
  //array of events for the date 
  var events = cal.getEvents(new Date(date), new Date(date + 1));
  Browser.msgBox(events);
  for (var i=0; i < events.length; i++) {
    var eventFromCal = events[i].getTitle();
    Browser.msgBox(eventFromCal);
    
  //////////////////////////////////////////////
  //If there is a conflict, send conflict email
  //If there is not a conflict, book and send confirmation email
  //////////////////////////////////////////////
  
    //searches for matching block in event title
    if (eventFromCal.indexOf(block) != -1){
      var sheet = SpreadsheetApp.getActiveSheet();
      sheet.getRange("I2").setValue("Conflict");
    }
  }
  if (sheet.getRange("I2").getValue() != "Conflict") {
    sheet.getRange("I2").setValue("Approved");
  }
  var status = sheet.getRange("I2").getValue();
  if (status == "Approved"){
    //add event to the calendar
    var sheet = SpreadsheetApp.getActiveSheet();
    var block = sheet.getRange("F2").getValue();
    var date = sheet.getRange("D2").getValue();
    var name = sheet.getRange("C2").getValue();
    cal.createAllDayEvent((block + " " + name), new Date(date));
    
    //send confirmation email
    emailStatus = sheet.getRange("H2").getValue();
    emailAddress = sheet.getRange("B2").getValue();
    name = sheet.getRange("C2").getValue();
    date = sheet.getRange("D2").getValue();
    cart = sheet.getRange("E2").getValue();
    block = sheet.getRange("F2").getValue();
    message = "Congratulations!  You have successfully made a reservation.  Your information is listed below: \n\n" + name + "\n" + date + "\n" + block + "\n\nThank you!";
    subject = cart + " Cart Confirmation " + block;
    MailApp.sendEmail(emailAddress, subject, message, {noReply: true});
    sheet.getRange("H2").setValue("Confirmation");
    // Make sure the cell is updated right away in case the script is interrupted
    SpreadsheetApp.flush();  
  }
  else {
    //send conflict email
      emailStatus = sheet.getRange("H2").getValue();
      emailAddress = sheet.getRange("B2").getValue();
      name = sheet.getRange("C2").getValue();
      date = sheet.getRange("D2").getValue();
      cart = sheet.getRange("E2").getValue();  
      block = sheet.getRange("F2").getValue();
      message = "Oh no!  Your reservation is in direct conflict with an already existing reservation.  Please check the calendar.  Your information is listed below: \n\n" + name + "\n" + date + "\n" + block + "\n\nThank you!";       // Second column + third + fourth
      subject = cart + " Cart Conflict " + block;
      MailApp.sendEmail(emailAddress, subject, message, {noReply: true});
      sheet.getRange("G2").setValue("Conflict");
      // Make sure the cell is updated right away in case the script is interrupted
      SpreadsheetApp.flush();
      sheet.deleteRows(2, 1);
  }
}// JavaScript Document