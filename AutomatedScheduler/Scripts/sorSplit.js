// JavaScript Document
function sortSplit() {
  //sort data to make more recent submission first
  var range = SpreadsheetApp.getActiveSheet();
  range.sort(1, false); // Sort descending by column A
  
  var currentDate = new Date();
  var otherDate = range.getRange("D2").getValue();
  //subtracts the dates, in milliseconds, and rounds
  var millisDiff = otherDate.getTime() - currentDate.getTime();
  var daysDiff = millisDiff/1000/60/60/24;
  var roundedDays = Math.round(daysDiff);
  Browser.msgBox(daysDiff)
  //-.6 to make sure it's after the last block of the day
  if (daysDiff < -.6) {
    Browser.msgBox("passed date");
    var sheet = SpreadsheetApp.getActiveSheet();
    var emailAddress = sheet.getRange("B2").getValue();
    var name = sheet.getRange("C2").getValue();
    var date = sheet.getRange("D2").getValue();
    var cart = sheet.getRange("E2").getValue();
    var block = sheet.getRange("F2").getValue();
    var message = "Oh Boy!  The date you requested has already passed.  Please check the calendar and try your request again.  Your information is listed below: \n\n" + name + "\n" + date + "\n" + cart + "\n"  + block + "\n\nSorry!";       // Second column + third + fourth
    var subject = "Error Date Already Passed";
    MailApp.sendEmail(emailAddress, subject, message, {noReply: true});
    sheet.deleteRows(2, 1);
  }   
  
  else { 
    ////////////////////////////////////
    //Cut cells with multiple entries into seperate strings
    //and create new row with copied data
    ////////////////////////////////////
    
    var spreadSheet = SpreadsheetApp.getActiveSpreadsheet();
    //cell to check for multiple entries
    var entry = spreadSheet.getRange("F2");
    var entryString = entry.getValue();
    //split after comma into array
    var arraySplit = entryString.split(", ");
    //runs only if array has more than one entry
    if (arraySplit.length > 1) {
      Browser.msgBox(arraySplit.length);
      //places one entry in original block
      spreadSheet.getRange("F2").setValue(arraySplit[0]);
      //copy extra data
      var timestamp = spreadSheet.getRange("A2").getValue();
      var user = spreadSheet.getRange("B2").getValue();
      var name = spreadSheet.getRange("C2").getValue();
      var date = spreadSheet.getRange("D2").getValue();
      var cart = spreadSheet.getRange("E2").getValue();
      var addRemoveStatus = spreadSheet.getRange("G2").getValue();
      //check to see if its an add or remove request
      var addRemove = spreadSheet.getRange("G2").getValue();
      if (addRemove == "Remove") {
        deleteEvent();
      }
      else {
        queryAndUpdate();
      }
      
      //insert rows with new data for each entry in array except first
      for (var i=1; i < arraySplit.length; i++) {  
        Browser.msgBox(arraySplit[i]);
        SpreadsheetApp.getActiveSheet().insertRowBefore(2);
        spreadSheet.getRange("F2").setValue(arraySplit[i]);
        spreadSheet.getRange("A2").setValue(timestamp);
        spreadSheet.getRange("B2").setValue(user);
        spreadSheet.getRange("C2").setValue(name);
        spreadSheet.getRange("D2").setValue(date);
        spreadSheet.getRange("E2").setValue(cart);
        spreadSheet.getRange("G2").setValue(addRemoveStatus);
        var addRemove = spreadSheet.getRange("G2").getValue();
        if (addRemove == "Remove") {
          deleteEvent();
        }
        else {
          queryAndUpdate();
        }
      }
    }
    else {
      var addRemove = spreadSheet.getRange("G2").getValue();
      if (addRemove == "Remove") {
        deleteEvent();
      }
      else {
        queryAndUpdate();
      }
    }
  }
}