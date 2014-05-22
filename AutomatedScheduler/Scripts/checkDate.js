// JavaScript Document
function checkDate() {
  var spreadSheet = SpreadsheetApp.getActiveSpreadsheet();
  
  //identifies inputDate and date range to search through
  var currentDate = new Date();
  var dateArray = spreadSheet.getRange("D3:D300").getValues();
  //array to store the rows to delete based up on date comparison
  var rowsToDelete = [];
  //compares each date in the array
  Browser.msgBox(dateArray.length);
  for (var i=0; i < dateArray.length; i++) {
    if (dateArray[i] != ""){
      var num = i+3;
      var row = "D" + num;
      var otherDate = spreadSheet.getRange(row).getValue();
      //Browser.msgBox(num);
      //subtracts the dates, in milliseconds, and rounds
      var millisDiff = otherDate.getTime() - currentDate.getTime();
      var daysDiff = millisDiff/1000/60/60/24;
      var roundedDays = Math.round(daysDiff);
      if (roundedDays < -2) {
        Browser.msgBox("old date");
        rowsToDelete.push(num); 
      }
    }
  }
  for (var i=0; i < rowsToDelete.length; i++) {
    //deletes the old entries from the spreadsheet
    //var adjust is needed because as rows are deleted the numbers change
    var adjust = rowsToDelete[i]-i;
    var sheet = spreadSheet.getSheets()[0];
    Browser.msgBox("deleted row" + adjust);
    sheet.deleteRows(adjust, 1);
  }
  Browser.msgBox("done");
}