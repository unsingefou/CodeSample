function deleteEvent() {
  var spreadSheet = SpreadsheetApp.getActiveSpreadsheet();
  Browser.msgBox("running deleteEvent")
  
  var emailStatus, emailAddress, name, date, cart, block, message, subject;
  /////////////////////////////////////////////////////////////
  //Query existing schedule
  /////////////////////////////////////////////////////////////
  
  // define the sheet
  var spreadSheet = SpreadsheetApp.getActiveSpreadsheet();
  
  //Query to see if the request already exists
  // sets query columns and combines to one string
  var query1 = spreadSheet.getRange("D2"); //is a date
  var query2 = spreadSheet.getRange("F2");
  var query3 = spreadSheet.getRange("B2");
  var queryField = query1.getValue() + query2.getValue() + query3.getValue();
  
  //sets range columns and sends to seperate arrays
  var dataRange1 = spreadSheet.getRange("D3:D300");  //contains dates
  var dataRange2 = spreadSheet.getRange("F3:F300");
  var dataRange3 = spreadSheet.getRange("B3:B300");
  var range1 = dataRange1.getValues();
  var range2 = dataRange2.getValues();
  var range3 = dataRange3.getValues();
  
  //resets the result to "denied" as default
  var resultWriteRange = spreadSheet.getRange("I2");
  //resultWriteRange.setValue("denied");
  // Search through data and returns "verified" if matches entry
  for (var i=0; i < range1.length; i++) {
    if (range1[i] + range2[i] + range3[i] == queryField) {
      resultWriteRange.setValue("verified");
      ////set matching entry to "void" to avoid future conflicts
      var rowToDelete = i+3;
      Browser.msgBox(range1[i] + range2[i] + range3[i]);
      Browser.msgBox(rowToDelete);
      //deletes the previous matching event from spreadsheet, and request
      var sheet = spreadSheet.getSheets()[0];
      sheet.deleteRows(rowToDelete, 1);
    }
  }
  
  var addRemove = spreadSheet.getRange("G2").getValue();
  var status = spreadSheet.getRange("I2").getValue();
  
  //if wanting to remove and have permission to, deletes event
  if (status == "verified") {
    var date = spreadSheet.getRange("D2").getValue();
    var name = spreadSheet.getRange("C2").getValue();
    var block = spreadSheet.getRange("F2").getValue();
    var eventTitle = block + " " + name;
    
    var cart = sheet.getRange("E2").getValues();
    //name of cart from form, and name of corresponding google calendar
    var cart1 = "Bronze";   
    var calendar1 = "BronzeLaptopCart";  
    var cart2 = "Cyan";  
    var calendar2 = "CyanLaptopCart"; 
    var cart3 = "Magenta";  
    var calendar3 = "MagentaLaptopCart";
    //checks to see which cart is requested and opens corresponding calendar
    if (cart == cart1) {
      var cal = CalendarApp.openByName(calendar1);
    }
    else if (cart == cart2) { 
      var cal = CalendarApp.openByName(calendar2);
    }
    else if (cart == cart3) { 
      var cal = CalendarApp.openByName(calendar3);
    }
    //array of events for the date 
    var events = cal.getEvents(new Date(date), new Date(date + 1));
    for (var i=0; i < events.length; i++) {
      var eventFromCal = events[i].getTitle();
      Browser.msgBox(eventFromCal);
      //selects matching events and deletes
      if (eventFromCal == eventTitle) {
        events[i].deleteEvent();
        Browser.msgBox("deleted");
      }
      else {
        Browser.msgBox("not a match");
      }
    }
    //////////////////////
    //send event deleted email
    emailStatus = spreadSheet.getRange("H2").getValue();
    emailAddress = spreadSheet.getRange("B2").getValue();
    name = spreadSheet.getRange("C2").getValue();
    date = spreadSheet.getRange("D2").getValue();
    cart = sheet.getRange("E2").getValue();
    block = spreadSheet.getRange("F2").getValue();
    message = "You have successfully deleted a reservation.  The information for your deleted reservation is listed below: \n\n" + name + "\n" + date + "\n" + block + "\n\nThank you!";       // Second column + third + fourth
    subject = cart + " Cart Cancellation " + block;
    MailApp.sendEmail(emailAddress, subject, message, {noReply: true});
    spreadSheet.getRange("H2").setValue("Deleted event");
    //Make sure the cell is updated right away in case the script is interrupted
    SpreadsheetApp.flush();
    //deletes the previous matching event from spreadsheet, and request
    var sheet = spreadSheet.getSheets()[0];
    sheet.deleteRows(2, 1);
    Browser.msgBox("sent!");
  }
  else {
    Browser.msgBox("access denied");
        //////////////////////
        //send access denied email
        emailStatus = spreadSheet.getRange("H2").getValue();
        emailAddress = spreadSheet.getRange("B2").getValue();
        name = spreadSheet.getRange("C2").getValue();
        date = spreadSheet.getRange("D2").getValue();
        block = spreadSheet.getRange("F2").getValue();
        message = "Your deletion was not successful.  You do not have the right to delete this reservation or the reservation you requested does not exist.  The reservation you tried to delete is listed below: \n\n" + name + "\n" + date + "\n" + block + "\n\nThank you!";       // Second column + third + fourth
        subject = "Access Denied";
        MailApp.sendEmail(emailAddress, subject, message, {noReply: true});
        spreadSheet.getRange("H2").setValue("Access Denied");
        // Make sure the cell is updated right away in case the script is interrupted
        SpreadsheetApp.flush();
        //deletes the previous matching event from spreadsheet, and request
        var sheet = spreadSheet.getSheets()[0];
        sheet.deleteRows(2, 1);
  }
}// JavaScript Document