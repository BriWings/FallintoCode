// HTMLQuery client utilities
//
// These utilities are currently used for encapsulating dynamic list
// generation functionality.  This functionality includes:
//
// * Assigning a name to the control.
// * The source from which to populate the combo / list with.
// * Specifying a stylesheet that controls the type of combo or list box that is generated.
// * The size of the list box.
// * Whether or not a selection is mandatory (for combos, having an 'empty' selection / value).
//   Note that this has an impact not just on functionality, but also on appearance (an asterisk,
//   or whatever).
// * Whether or not a listbox supports multiple selections.
// * Support for 'savelast' functionality in the combo or select box(es).
// * support for combo boxes that are 'chained' together (eg states & cities).
//
// More notes:
//
// * This routine can be used for both combo boxes and list boxes.
// * If 'mandatory is set to true, there is no empty / blank item at the top of the control.
// * The listname parameter is used for both the name and id of the control.
// * The source and style is used for the stylesheet and XML source that is used to generate 
//   the control and data to populate it.
// * The mandatory parameter is used to determine whether there is a 'blank' row for the control.
// * The parent parameter determines the parent of a 'chained' control.
// * Savelast determines whether the 'savelast' functionality is set for the control.
// * Size is simply the size (in rows) of the control.
// * Multiple is used to show if multiple items can be selected on a listbox.  This is automatically
//   set to false if the size is 1.
// * Print is set to true to initialize print functionality on the handheld.

function GenerateSelectBox(listname, source, style, mandatory, parent, savelast, size, multiple, print)
{
	var xslt = new ActiveXObject("Msxml2.XSLTemplate");
	var xslDoc = new ActiveXObject("Msxml2.FreeThreadedDOMDocument");
	var xslProc;
	
	xslDoc.async = false;
	xslDoc.load(style.src);
	xslt.stylesheet = xslDoc;
	var xmlDoc = new ActiveXObject("Msxml2.DOMDocument");
	xmlDoc.async = false;
	xmlDoc.load(source.src);
	xslProc = xslt.createProcessor();
	xslProc.input = xmlDoc;
	if (size <= 1)
		multiple = false;
	xslProc.addParameter("listname", listname);
	xslProc.addParameter("mandatory", mandatory);
        xslProc.addParameter("parent", parent);
	xslProc.addParameter("savelast", savelast);
	xslProc.addParameter("size", size);
	xslProc.addParameter("multiple", multiple);
        xslProc.addParameter("print", print);
	xslProc.transform();

	return xslProc.output;
}

function GenerateComboBox(listname, source, style)
{
	var xslt = new ActiveXObject("Msxml2.XSLTemplate");
	var xslDoc = new ActiveXObject("Msxml2.FreeThreadedDOMDocument");
		var xslProc;
	
	xslDoc.async = false;
	xslDoc.load(style.src);
	xslt.stylesheet = xslDoc;
	var xmlDoc = new ActiveXObject("Msxml2.DOMDocument");
	xmlDoc.async = false;
	xmlDoc.load(source.src);
	xslProc = xslt.createProcessor();
	xslProc.input = xmlDoc;
	xslProc.addParameter("listname", listname);
	xslProc.transform();

	return xslProc.output;
}

function GenerateListBox(listname, size, source, style)
{
	var xslt = new ActiveXObject("Msxml2.XSLTemplate");
	var xslDoc = new ActiveXObject("Msxml2.FreeThreadedDOMDocument");
		var xslProc;
	
	xslDoc.async = false;
	xslDoc.load(style.src);
	xslt.stylesheet = xslDoc;
	var xmlDoc = new ActiveXObject("Msxml2.DOMDocument");
	xmlDoc.async = false;
	xmlDoc.load(source.src);
	xslProc = xslt.createProcessor();
	xslProc.input = xmlDoc;
	xslProc.addParameter("listname", listname);
        xslProc.addParameter("size", size);
	xslProc.transform();

	return xslProc.output;
}

// The below routines are used for client validation of data entry.
function PrepareValidation(formname)
{
	// First, we check for mandatory fields.  For any
	// mandatory fields not already 'colored', we set
	// the background color.
	var i = 0;
	
	for (i = 0; i < formname.elements.length; i++)
	{
		if (formname.elements[i].mandatory != null)
		{
			if (formname.elements[i].getAttribute('mandatory', 0) == 'true')
				formname.elements[i].style.backgroundColor = 'black';
		}
	}		
}


// What should the default functions *really* be?
function SetDefaultDateRange(start, end)
{
	// We're getting dates one day apart.
	var today = new Date();

	start.value = (today.getMonth() + 1) + '/' + (today.getDate() - 1) + '/' + today.getYear();
	end.value = (today.getMonth() + 1) + '/' + today.getDate() + '/' + today.getYear();
}

function SetDefaultDate(start)
{
	var today = new Date();
	start.value = (today.getMonth() + 1) + '/' + today.getDate() + '/' + today.getYear();
}

function SetDefaultTimeRange(start, end)
{
	start.value = '00:00';
	end.value = '23:59';
}


/*
date.js: useful extensions to the JavaScript Date object.
Copyright (C) 1999-2000 Jan Wessely <info@jawe.net>

This program is free software; you can redistribute it and/or
modify it under the terms of the GNU General Public License
Version 2 as published by the Free Software Foundation.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 59 Temple Place - Suite 330, Boston, MA  02111-1307, USA
or browse to http://www.gnu.org/copyleft/gpl.html.

created: 25 June 1998
last modified: 17 Jan 2000
*/

// literals *******************************************************************

// used as param unit in Date.add()
Date.MILLI = 1;
Date.SECOND = Date.MILLI * 1000;
Date.MINUTE = Date.SECOND * 60;
Date.HOUR = Date.MINUTE * 60;
Date.DAY = Date.HOUR * 24;
Date.MONTH = -1;
Date.YEAR = -2;

Date.DAYS_IN_MONTH = new Array(31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);

// methods ********************************************************************

function _Date_toCanonString()
{
	return this.getFullYear() +
			 _pad(this.getMonth() + 1) + 
			 _pad(this.getDate());
}

function _Date_getFullYear()
{
	var y = this.getYear();
	if(y < 100 && y > 0)
		y += 1900;
	return y;
}

function _Date_setFullYear(val)
{
	this.setYear(val);
}

function _Date_compareTo(other)
{
	return Date.compare(this, other);
}

function _Date_isLeapYear()
{
	return Date.leapYear(this.getFullYear());
}

function _Date_add(date, unit, amount)
{
	return Date.addDate(this, date, unit, amount);
}

function _Date_getDaysInMonth()
{
	return Date.daysInMonth(this.getFullYear(), this.getMonth());
}

// utility functions **********************************************************

function _isLeapYear(year)
{
	return (year % 4 == 0 && year % 100 != 0) || year % 400 == 0;
}

function _compareDate(d1, d2)
{
	return (new Date(d1)).getTime() - (new Date(d2)).getTime();
}

function _addDate(date, unit, amount)
{
	if(unit == Date.MONTH)
		date.setMonth(date.getMonth() + amount);
	else if(unit == Date.YEAR)
		date.setFullYear(date.getFullYear() + amount);
	else
		date.setTime(date.getTime() + unit * amount);
	return date;
}

function _getDaysInMonth(year, month)
{
	return month == 1 && Date.leapYear(year) ? 29 : Date.DAYS_IN_MONTH[month];
}

function _pad(n)
{
	return (n < 10 ? "0" : "") + n;
}

// initialization *************************************************************

Date.prototype.toCanonString = _Date_toCanonString;
if(!Date.prototype.getFullYear)
{
	Date.prototype.getFullYear = _Date_getFullYear;
	Date.prototype.setFullYear = _Date_setFullYear;
}
Date.prototype.isLeapYear = _Date_isLeapYear;
Date.prototype.compareTo = _Date_compareTo;
Date.prototype.add = _Date_add;
Date.prototype.getDaysInMonth = _Date_getDaysInMonth;

Date.leapYear = _isLeapYear;
Date.compare = _compareDate;
Date.addDate = _addDate;
Date.daysInMonth = _getDaysInMonth;


////////

/**
 * DHTML date validation script. Courtesy of SmartWebby.com (http://www.smartwebby.com/dhtml/)
 */
// Declaring valid date character, minimum year and maximum year
var dtCh= "/";
var minYear=1900;
var maxYear=2100;

// Declaring valid time character
var timeCh = ":";

function isInteger(s){
	var i;
    for (i = 0; i < s.length; i++){   
        // Check that current character is number.
        var c = s.charAt(i);
        if (((c < "0") || (c > "9"))) return false;
    }
    // All characters are numbers.
    return true;
}

function stripCharsInBag(s, bag){
	var i;
    var returnString = "";
    // Search through string's characters one by one.
    // If character is not in bag, append to returnString.
    for (i = 0; i < s.length; i++){   
        var c = s.charAt(i);
        if (bag.indexOf(c) == -1) returnString += c;
    }
    return returnString;
}

function daysInFebruary (year){
	// February has 29 days in any year evenly divisible by four,
    // EXCEPT for centurial years which are not also divisible by 400.
    return (((year % 4 == 0) && ( (!(year % 100 == 0)) || (year % 400 == 0))) ? 29 : 28 );
}
function DaysArray(n) {
	for (var i = 1; i <= n; i++) {
		this[i] = 31
		if (i==4 || i==6 || i==9 || i==11) {this[i] = 30}
		if (i==2) {this[i] = 29}
   } 
   return this
}

function isDate(dtStr){
	var daysInMonth = DaysArray(12)
	var pos1=dtStr.indexOf(dtCh)
	var pos2=dtStr.indexOf(dtCh,pos1+1)
	var strMonth=dtStr.substring(0,pos1)
	var strDay=dtStr.substring(pos1+1,pos2)
	var strYear=dtStr.substring(pos2+1)
	strYr=strYear
	if (strDay.charAt(0)=="0" && strDay.length>1) strDay=strDay.substring(1)
	if (strMonth.charAt(0)=="0" && strMonth.length>1) strMonth=strMonth.substring(1)
	for (var i = 1; i <= 3; i++) {
		if (strYr.charAt(0)=="0" && strYr.length>1) strYr=strYr.substring(1)
	}
	month=parseInt(strMonth)
	day=parseInt(strDay)
	year=parseInt(strYr)
	if (pos1==-1 || pos2==-1){
		alert("The date format should be : mm/dd/yyyy")
		return false
	}
	if (strMonth.length<1 || month<1 || month>12){
		alert("Please enter a valid month")
		return false
	}
	if (strDay.length<1 || day<1 || day>31 || (month==2 && day>daysInFebruary(year)) || day > daysInMonth[month]){
		alert("Please enter a valid day")
		return false
	}
	if (strYear.length != 4 || year==0 || year<minYear || year>maxYear){
		alert("Please enter a valid 4 digit year between "+minYear+" and "+maxYear)
		return false
	}
	if (dtStr.indexOf(dtCh,pos2+1)!=-1 || isInteger(stripCharsInBag(dtStr, dtCh))==false){
		alert("Please enter a valid date")
		return false
	}
return true
}

function isTime(timeStr)
{
	// The following should accept a one- or two- digit hour, optionally followed by two-digit minutes
	if( timeStr != "" && ! /^([01]?[0-9]|[2][0-3])(:[0-5][0-9])?$/.test(timeStr) )
	{
		alert("Please enter a valid time value");;
		return false;
	}
	return true;
}

function ValidateForm(){
	var dt=document.frmSample.txtDate
	if (isDate(dt.value)==false){
		dt.focus()
		return false
	}
    return true
 }

/**
 * DHTML date validation script. Courtesy of SmartWebby.com (http://www.smartwebby.com/dhtml/)
 */
// Declaring valid date character, minimum year and maximum year
var dtCh= "/";
var minYear=1900;
var maxYear=2100;

function isInteger(s){
	var i;
    for (i = 0; i < s.length; i++){   
        // Check that current character is number.
        var c = s.charAt(i);
        if (((c < "0") || (c > "9"))) return false;
    }
    // All characters are numbers.
    return true;
}

function stripCharsInBag(s, bag){
	var i;
    var returnString = "";
    // Search through string's characters one by one.
    // If character is not in bag, append to returnString.
    for (i = 0; i < s.length; i++){   
        var c = s.charAt(i);
        if (bag.indexOf(c) == -1) returnString += c;
    }
    return returnString;
}

function daysInFebruary (year){
	// February has 29 days in any year evenly divisible by four,
    // EXCEPT for centurial years which are not also divisible by 400.
    return (((year % 4 == 0) && ( (!(year % 100 == 0)) || (year % 400 == 0))) ? 29 : 28 );
}
function DaysArray(n) {
	for (var i = 1; i <= n; i++) {
		this[i] = 31
		if (i==4 || i==6 || i==9 || i==11) {this[i] = 30}
		if (i==2) {this[i] = 29}
   } 
   return this
}

function isDate(dtStr){
	var daysInMonth = DaysArray(12)
	var pos1=dtStr.indexOf(dtCh)
	var pos2=dtStr.indexOf(dtCh,pos1+1)
	var strMonth=dtStr.substring(0,pos1)
	var strDay=dtStr.substring(pos1+1,pos2)
	var strYear=dtStr.substring(pos2+1)
	strYr=strYear
	if (strDay.charAt(0)=="0" && strDay.length>1) strDay=strDay.substring(1)
	if (strMonth.charAt(0)=="0" && strMonth.length>1) strMonth=strMonth.substring(1)
	for (var i = 1; i <= 3; i++) {
		if (strYr.charAt(0)=="0" && strYr.length>1) strYr=strYr.substring(1)
	}
	month=parseInt(strMonth)
	day=parseInt(strDay)
	year=parseInt(strYr)
	if (pos1==-1 || pos2==-1){
		alert("The date format should be : mm/dd/yyyy")
		return false
	}
	if (strMonth.length<1 || month<1 || month>12){
		alert("Please enter a valid month")
		return false
	}
	if (strDay.length<1 || day<1 || day>31 || (month==2 && day>daysInFebruary(year)) || day > daysInMonth[month]){
		alert("Please enter a valid day")
		return false
	}
	if (strYear.length != 4 || year==0 || year<minYear || year>maxYear){
		alert("Please enter a valid 4 digit year between "+minYear+" and "+maxYear)
		return false
	}
	if (dtStr.indexOf(dtCh,pos2+1)!=-1 || isInteger(stripCharsInBag(dtStr, dtCh))==false){
		alert("Please enter a valid date")
		return false
	}
return true
}

function ValidateForm(){
	var dt=document.frmSample.txtDate
	if (isDate(dt.value)==false){
		dt.focus()
		return false
	}
    return true
 }



/******************************************************************************
Function for the search listbox/combobox string (same as implemented in windows forms).
******************************************************************************/
function SmartSelect(sInput, oSelect)
{
 var sInput = String(sInput).toUpperCase();
 var iLength = sInput.length;

 if (iLength <= 0)
  return -1;

 var oOptions = oSelect.options;
 var i, diff, bFound, sTemp;

 var iHigh = oOptions.length - 1;
 var iLow = 0;
 var iCurrent = Math.floor((iHigh + 1) / 2);

 bFound = false;
 do
 {
  // Get the current option
  sTemp = oOptions(iCurrent).text.toUpperCase();
  var sSubstr = sTemp.substr(0, iLength);

  if (sSubstr < sInput)
  {
   // Search the upper half of the branch
   iLow = iCurrent + 1;
  }
  else if (sSubstr > sInput)
  {
   // Search the lower half of the branch
   iHigh = iCurrent - 1;
  }
  else
  {
   bFound = true;
   break;
  }

  // Pick the middle of the branch again
  iCurrent = Math.floor(iLow + ((iHigh + 1) - iLow) / 2);

 } while (iHigh >= iLow)

 // Is there a better prefix match?
 if (iLength < sTemp.length)
 {
  // Store the current old value
  var iOld = iCurrent--;

  // Now go back until we find one that doesn't match the prefix
  while (iCurrent >= 0)
  {
   // Gone too far -- the prefix no longer matches.
   if (oOptions(iCurrent).text.toUpperCase().substr(0, iLength) != sInput)
    break;

   iOld = iCurrent--;
  }

  iCurrent = iOld;
 }

 if (bFound)
  return iCurrent;
 else
  return -1;
}

function DumbSelect(sInput, oSelect)
{
 var sInput = String(sInput).toUpperCase();
 var iLength = sInput.length;

 if (iLength <= 0)
  return -1;

 var oOptions = oSelect.options;
 var nElements = oOptions.length;

 for (var iCurrent = 0; iCurrent < nElements; iCurrent++)
 {
  if (oOptions(iCurrent).text.substr(0, iLength).toUpperCase() == sInput)
  {
   break;
  }
 }

 if (iCurrent < nElements)
  return iCurrent;
 else
  return -1;
}

function BinarySearch()
{
 var i = SmartSelect(document.all("binary").value, document.all("list"));
 document.all("list").selectedIndex = i;
}

function LinearSearch()
{
 var i = DumbSelect(document.all("linear").value, document.all("list"));
 document.all("list").selectedIndex = i;
}

var sSearched = "";
var dLastKeyPressedTime = 0;
var oLastListbox = null;
function SearchListBox(listbox, event)
{
	var d = new Date();
	if(d.getTime() -dLastKeyPressedTime > 1500 || listbox != oLastListbox) // search string is deleted after 1.5 seconds
	{
		sSearched = "";
	}
	sSearched += String.fromCharCode(event.keyCode);
	var i = DumbSelect(sSearched, listbox); // slow, but doesn't care if the items are sorted
	//var i = SmartSelect(sSearched, listbox); // fast, but assumes the items are sorted
	if (i!=-1) // do nothing if can't find the string
	{
		listbox.selectedIndex = i;
	}
	d = new Date();
	dLastKeyPressedTime = d.getTime();
	oLastListbox = listbox;
	event.returnValue=false; // cancel the event so the listbox will not scroll by itself
}

/******************************************************************************
End of Function for the search listbox/combobox string
******************************************************************************/

/*******************************************************************************
Function to limit the input in TextArea 
******************************************************************************/
function CheckTextAreaLength(limitField, limitNum)
{	
	//Compare the input length with the allowed length. If it exceeds then
	//limit the text to max allowed and raise an alert. 
	if (limitField.value.length > limitNum)
	{
		limitField.value = limitField.value.substring(0, limitNum);
		alert (limitField.name + ' Text has reached the maximum length.');
	}
}



