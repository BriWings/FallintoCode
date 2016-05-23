 /**
 * getTime is used by the NTP function to fetch the current time from an external NTP resource.
 * @param  {[string]} zone    
 * @param  {[string]} success 
 * @return {[string]}         
 */
$.getTime = function(zone, success) {
		var url = 'http://json-time.appspot.com/time.json?tz=' + zone + '&callback=?';
		$.getJSON(url, function(o){
			success && success(new Date(o.datetime),o);
		});
	};
// Usage: get added 4/20 ECF
$.getTime('CST', function(time){
    alert(time);
});
/**
 * Network Time Protocol function to fetch the current time from http://json-time.appspot.com
 * and verify that the current system time is within +/- 5 seconds.  If a time difference
 * occurs, this function will set the current system time to that of the fetched time.
 * 
 */
function NTP(){
	if(navigator.onLine) {
		$.getTime('America\/Chicago', function(time){
			var systemtime = new Date();
			var formattedtime = systemtime.getHours() + ':' + systemtime.getMinutes() + ':' + systemtime.getSeconds();
			var formatteddate = systemtime.getMonth()+1+'/'+systemtime.getDate()+'/'+systemtime.getFullYear();
			var ntptime = time.getHours()+ ':' + time.getMinutes() + ':' + time.getSeconds();
			var ntpdate = (time.getMonth()+1)+'/'+time.getDate()+'/'+time.getFullYear();
			var timeoffset = (Math.round((systemtime - time)/1000));
			if(timeoffset < -5 || timeoffset > 5) {
				var strTimeCommand = "cmd.exe /c time " + ntptime;
				var strDateCommand = "cmd.exe /c date " + ntpdate;
				var objWsh = new ActiveXObject("WScript.Shell");
				objWsh.Run(strTimeCommand, 0, true);
				objWsh.Run(strDateCommand, 0, true);
			}
			
		})		
	}
}

/**
 * checkRes tests the current system screen resolution to verify that it is not < 1024x768
 * @return {[boolean]} [returns true if resolution < 1024x768]
 */
function checkRes() {
	var myHeight = screen.height;
	var myWidth = screen.width;
	if (myWidth < 1024 && myHeight < 768) {
		return true;
	} else {
		return false;
	}
}

/**
 * openform is used by various forms to spawn an external IE window 
 * @param  {[string]} lnk  [URL of link to open in IE window]
 * @param  {[string]} e    [if e = ext then a new IE window will be opened]
 * @param  {[string]} vars [any additional variables to append to the URL string specified by the lnk @param]
 */
function openform(lnk, e, vars) {
	if (e == "ext") {
		newie = window.open(lnk,'','width=1014,height=700,resizable=1,top=1,left=1,status=1,location=0,menubar=0,scrollbars=1');
		return false;
	}
	else if (e == "int") {
		location.replace(lnk);
	}
}
function changelbl(lbl) {
	
	if ($('#password').val().length > 0) {
		$('#'+lbl).text('Submit');
		$('#'+lbl).addClass('ui-state-hover');
	}
	else {
		$('#'+lbl).text('Password');
		$('#'+lbl).removeClass('ui-state-hover');
	}
}

function grabpath() {
	var fullPath = (location.pathname);
	var arrPath = fullPath.split("/");
	arrPath.shift();
	arrPath.pop();
	arrPath.pop();
	var appPath = arrPath.join("/");
	appPath = appPath + "/";
	//alert(appPath);
	return appPath;
}

function grabYear() {
	var currentTime = new Date();
	var year = currentTime.getFullYear();
	return year;
}

function split( val ) {
	return val.split( /,\s*/ );
}

function extractLast( term ) {
	return split( term ).pop();
}

function getCaps(e) {
	var chkChk = $(e.target).is(":checked");
	var lblId = $(e.target).attr("id");
	var slbl = "#lbl"+lblId;
	var lblText = $(slbl).text();
	if ($(e.target).is("input:checked")) {
		$(slbl).addClass('dlogsel');
	}
	else {
		$(slbl).removeClass('dlogsel');
	}
}

function getSects(e) {
	var chkChk = $(e.target).is(":checked");
	var lblId = $(e.target).attr("id");
	var slbl = "#lbl"+lblId;
	var lblText = $(slbl).text();
	
	//$("#sectBtn").button("option", "label", "Sector (<b>"+lblText+"</b>)");
	$("#selectedSect").text(lblText);
	//$("#sector option").filter(function() {
	//	return $(this).text() == lblText; 
	//}).attr('selected', true);
	$("#sector").val(lblText);
	$("input:radio").each(function() {
		var aLbl = $(this).text();
		var cLbl = $(this).attr("id");
		var bLbl = "#lbl"+cLbl;
		
		if ($(this).is(":checked")) {
			$(bLbl).css({"color":"red"});
		}
		else {
			$(bLbl).css({"color":"yellow", "font-weight":"normal" });
		}
	});
}

function setSaved() {
	var savedSector = $("#sector").val();
	var savedUnit = $("#unit").val();
	var savedUser = $("#username").val();
	var savedVeh = $("#VehicleID").val();
	$("#selectedSect").text(savedSector);
	$("#selectedUnit").text(savedUnit);
	$("#selectedVeh").text(savedVeh);
	$("#selectedUser").text(savedUser);
}	

function fetchReloX() {
	$.ajax({
		type: "GET",
		url: "Station.xml",
		dataType: "xml",
		isLocal: true,
		success: function(xml){
			$(xml).find("description").each(function(){
				$('#Station').append('<option/>'+$(this).text()+'</option>');
			});
		},
		error: function(){alert("Error Getting RELO Sectors");}
	});
}


function fetchRelo() {
	$.ajax({
		url: "Station.xml",
		dataType: "xml",
		isLocal: true,
		async: false,
		success: function( xmlResponse ) {
			var data = $( "description", xmlResponse ).map(function() {
				return {
					value: $(this).text()
				};
			}).get();
			$( "#sectorselect" ).autocomplete({
				source: data,
				minLength: 1,
				autoFocus: true,
				select: function( event, ui ) {
					$("#Station").val(ui.item.value);
					$("#otherDialog").dialog("close");
					validatepage();
				}
			});
		}
	});
}







function fetchUnit() {
	$.ajax({
		url: "../Configuration_LoginUnits.xml",
		dataType: "xml",
		isLocal: true,
		success: function( xmlResponse ) {
			var data = $( "unit", xmlResponse ).map(function() {
				return {
					value: $( "id", this ).text()
				};
			}).get();
			$( "#unitselect" ).autocomplete({
				source: data,
				minLength: 2,
				autoFocus: true,
				
				select: function( event, ui ) {
					$("#selectedUnit").text(ui.item.value);
					$("#unit").val(ui.item.value);
					$("#unitdialog").dialog("close");
					
				}
			});
		}
	});
}

function fetchLis() {
	$.ajax({
		url: "state.xml",
		dataType: "xml",
		isLocal: true,
		success: function( xmlResponse ) {
			var data = $( "item", xmlResponse ).map(function() {
				return {
					value: $( "value", this ).text(),
					label: $( "description", this ).text()
				};
			}).get();
			$( "#StateAuto" ).autocomplete({
				source: data,
				minLength: 1,
				delay: 0,
				autoFocus: true,
				select: function( event, ui ) {
					event.preventDefault();
					$('#StateAuto').val(ui.item.label);
					$('#State').val(ui.item.value);
				},
				change: function(event, ui) {
					if (!ui.item) {
						$('#StateAuto').val('Texas');
					}
				}
			});
		}
	});
}

function fetchStates() {
	$.ajax({
		url: "state.xml",
		dataType: "xml",
		isLocal: true,
		success: function( xmlResponse ) {
			var data = $( "item", xmlResponse ).map(function() {
				return {
					value: $( "value", this ).text(),
					label: $( "description", this ).text()
				};
			}).get();
			$( "#State" ).autocomplete({
				source: function(request, response) {
					var matcher = new RegExp($.ui.autocomplete.escapeRegex(request.term), "i");
					response($.grep(data, function(value) {
						return matcher.test(value.value) || matcher.test(value.label);
					}));
				}, 
				minLength: 1,
				delay: 0,
				select: function( event, ui ) {
					event.preventDefault();
					$('#State').val(ui.item.value);
				},
				focus: function(event,ui) {
					event.preventDefault();
					$('#State').val(ui.item.value);
				},
				change: function(event,ui) {
					if(!ui.item && $('#State').val().length >2) {
						alert("Please Enter the 2 Letter State Abbreviation\n or Select the state from the list.");
						$('#State').autocomplete('search',$('#State').val());
						$('#State').select().focus();
					}
				}
			});
		}
	});
}

function fetchLit() {
	$.ajax({
		url: "VehicleType.xml",
		dataType: "xml",
		isLocal: true,
		success: function( xmlResponse ) {
			var data = $( "item", xmlResponse ).map(function() {
				return {
					value: $( "value", this ).text(),
					label: $( "description", this ).text()
				};
			}).get();
			$( "#LicType" ).autocomplete({
				source: data,
				minLength: 1,
				select: function(event,ui) {
					event.preventDefault();
					$('#LicType').val(ui.item.label);
					$('#Type').val(ui.item.value);
				},
				change: function(event,ui) {
					if (!ui.item) {
						$('#LicType').val('Passenger Car');
					}
				}
			});
		}
	});
}

function fetchUser() {
	$.ajax({
		url: "../Configuration_Users.xml",
		dataType: "xml",
		isLocal: true,
		success: function( xmlResponse ) {
			var data = $( "item", xmlResponse ).map(function() {
				return {
					value: $(this).text()
				};
			}).get();
			$( "#userselect" ).autocomplete({
				source: data,
				minLength: 1,
				autoFocus: true,
				select: function( event, ui ) {
					//alert( ui.item ? "Selected: " + ui.item.value : "Nothing selected, input was " + this.value );
					$("#selectedUser").text(ui.item.value);
					//$("#username option").filter(function() {
					//	return $(this).text() == ui.item.value;
					//}).attr('selected',true);
					$("#username").val(ui.item.value);
					$("#userdialog").dialog("close");
				}
				
			});
		}
	});
}

function fetchVeh() {
	$.ajax({
		url: "vehicle.xml",
		dataType: "xml",
		isLocal: true,
		success: function( xmlResponse ) {
			var data = $( "item", xmlResponse ).map(function() {
				return {
					value: $( "description", this ).text()
				};
			}).get();
			$( "#vehselect" ).autocomplete({
				source: data,
				minLength: 1,
				autoFocus: true,
				select: function( event, ui ) {
					$("#selectedVeh").text(ui.item.value);
					$("#VehicleID").val(ui.item.value);
					$("#vehdialog").dialog("close");
				}
			});
		}
	});
}

function fetchAddp() {
	var selp = [];
	$.ajax({
		url: "../Configuration_Users.xml",
		dataType: "xml",
		isLocal: true,
		async: false,
		success: function( xmlResponse ) {
			var data = $( "item", xmlResponse ).map(function() {
				return {
					value: $(this).text()
				};
			}).get();
			$( "#addpselect" )
				.autocomplete({
					source: data,
					minLength: 1,
					autoFocus: true,
					select: function(event, ui) {
						$("#addpselect").val('');
						var selectedp = ui.item.value.replace(/['";:,.\/?\\-]*[ ]*/gi, '');
						if (ui.item.value == $('#username').val()) {
							alert("You are ALREADY the primary user!");
							$('#addpselect').focus();
							return false;
							
						}
						if ($('#addpsel #'+selectedp).length > 0 ) {
							alert("You already have the selected person on your list.");
							$('#addpselect').focus();
							return false;
						}
						if ($('#addpsel div').length < 7) {
							$('#addpsel')
								.append($('<div id="'+selectedp+'" style="margin: 5px 0px 5px 0px;">')
									.append($('<button style="width: 100%;" id="'+selectedp+'" value="'+ui.item.value+'">'+ui.item.value+'</button>')
										.button()
										.click(function(event,ui) {
											var et = $(event.target).attr('id');
											$(this).parent().remove();
										})
									)
								)
								.append(
									$('</div>')
								);
						}
						else {
							alert("You may not select more than 7 additional personnel.");
							$('#addpselect').focus();
						}
						return false;
					}
				});
		
		}
	});
}

function fetchmodP() {
	var selp = [];
	$.ajax({
		url: "../Configuration_Users.xml",
		dataType: "xml",
		isLocal: true,
		async: false,
		success: function( xmlResponse ) {
			var data = $( "item", xmlResponse ).map(function() {
				return {
					value: $(this).text()
				};
			}).get();
			$( "#addpselect" )
				.autocomplete({
					source: data,
					minLength: 1,
					autoFocus: true,
					select: function(event, ui) {
						$("#addpselect").val('');
						var selectedp = ui.item.value.replace(/['";:,.\/?\\-]*[ ]*/gi, '');
						if (ui.item.value == $('#LoggedinUser').val()) {
							alert("You are ALREADY the primary user!");
							$('#addpselect').focus();
							return false;
							
						}
						if ($('#addpsel div:[id*="'+selectedp+'"]').length > 0 ) {
							alert("You already have the selected person on your list.");
							$('#addpselect').focus();
							return false;
						}
						if ($('#addpsel div').length < 7) {
							$('#addpsel')
								.append($('<div id="'+selectedp+'" style="margin: 5px 0px 5px 0px;">')
									.append($('<button style="width: 100%;" id="'+selectedp+'" value="'+ui.item.value+'">'+ui.item.value+'</button>')
										.button()
										.click(function(event,ui) {
											var et = $(event.target).attr('id');
											$(this).parent().remove();
										})
									)
								)
								.append(
									$('</div>')
								);
						}
						else {
							alert("You may not select more than 7 additional personnel.");
							$('#addpselect').focus();
						}
						return false;
					}
				});
		
		}
	});
}
	
function fetchOOS() {
	$.ajax({
		url: "Reason.xml",
		dataType: "xml",
		isLocal: true,
		success: function(xml){
			$(xml).find("description").each(function(i) {
				var strReason = $(this).text();
				var strReasonID = strReason.replace(/ /g, '');
				var strReasonIDI = strReasonID.replace(/\//g, '-');
				
				if (strReason.toLowerCase().indexOf("court") >= 0) {
					$('#courtdialog').append($('<button id="'+strReasonIDI+'" class="whdrops oos" type="button" style="width:300px; height: 80px; margin: 0px 5px 5px 0px;">'+strReason.toUpperCase()+'</button>'));
				}
				else if (strReason.toLowerCase().indexOf("spcl") >= 0) {
					$('#specialdialog').append($('<button id="'+strReasonIDI+'" class="whdrops oos" type="button" style="width: 300px; height: 60px; margin: 5px 5px;">'+strReason.toUpperCase()+'</button>'));
				}
				else {
					$('#oosreason').append($('<button id="'+strReasonIDI+'" class="butdrops oos" type="button" style="width: 300px; height: 80px; margin: 5px 5px;">'+strReason.toUpperCase()+'</button>'));
				}
			});
			$('#AdultDetentionCenter').after('<button id="court" type="button" style="width:300px; height: 80px; margin: 5px 5px;" class="butdrops multib">COURT</button>');
			$('#RadioShop').after('<button id="special" type="button" style="width: 300px; height: 80px; margin: 5px 5px;" class="butdrops multib">SPECIAL ASSIGNMENT</button>');
		},
		error: function(xmlResponse) {
			$('#oosreason').append("An Error has occured while fetching OUT OF SERVICE REASON CODES");
		}
	});
}
 
function fetchJax(valu){
	switch(valu) {
		case "users":
			$.ajax({
				type: "GET",
				url: "../Configuration_Users.xml",
				dataType: "xml",
				isLocal: true,
				async: false,
				success: function(xml){
					$(xml).find("item").each(function(){
						alert($("#LoggendinUser").val());
						var myId = $(this).text();
						if ($(this).text() == LUser) {
							$(this).prop('selected','selected');
							$("#Unselected").multiselect("refresh");
						}
						$("#Unselected").append('<option>'+myId+'</option>');
					});
				},
				error: function(){alert("LISTEN TO ME YOU FOOL!");}
			});
			break;
		case "caps":
			$.ajax({
				type: "GET",
				url: "Capabilities.xml",
				dataType: "xml",
				isLocal: true,
				async: false,
				success: function(xml){
					$(xml).find("description").each(function(){
						var myId = $(this).text();
						var smyId = myId.replace(/ /g, '');
						if (myId.toLowerCase().indexOf("bcso patrol") >= 0) {
							$("#capbut").append(
								$('<button id="'+smyId+'" value="'+myId+'" type="button" style="margin: 0px 10px 10px 0px; width: 205px; height: 70px;" class="bcsopatrol whdrops capbutton">'+myId+'</button>')
							)
						}
						else if (myId.toLowerCase().indexOf("patrol") >= 0) {
							$("#patcaps").append(
								$('<button id="'+smyId+'" value="'+myId+'" type="button" style="margin: 0px 10px 10px 0px; width: 205px; height: 70px;" class="whdrops capbutton">'+myId+'</button>')
							)
						}
						else {
							$("#capbut").append(
								$('<button id="'+smyId+'" value="'+myId+'" type="button" style="margin: 0px 10px 10px 0px; width: 205px; height: 70px;" class="whdrops capbutton">'+myId+'</button>')
							)
						}
					});
				}
			});
			break;
		case "sect":
			$.ajax({
				type: "GET",
				url: "../Configuration_Sectors.xml",
				dataType: "xml",
				isLocal: true,
				async: false,
				success: function(xml){
					$(xml).find("item").each(function(){
						var myId = $(this).text();
						var smyId = myId.replace(/ /g, '');
						$("#sectors").append(
							$('<button id="'+smyId+'" value="'+myId+'" type="button" style="margin: 0px 10px 10px 0px; width: 150px; height: 50px;" class="whdrops">'+sectlabel(myId)+'</button>')
						)
					});
				}
			});
			break;
		case "disp":
			$.ajax({
				type: "GET",
				url: "DispositionCodes.xml",
				dataType: "xml",
				isLocal: true,
				async: false,
				success: function(xml){
					$(xml).find("description").each(function(i) {
						var strdispo = $(this).text();
						var strdispoID = strdispo.replace(/ /g, '');
						var strdispoIDI = strdispoID.replace(/\//g, '-');
						
						if (strdispo.toLowerCase().indexOf("assist") >= 0) {
							$('#assistdialog')
								.append(
									$('<button id="'+strdispoIDI+'" type="button" class="whdrops dispbutton" style="font-size: 14pt; width:300px; height: 65px; margin: 4px 4px;">'+strdispo.toUpperCase()+'</button>')
								);
						}
						else if (strdispo.toLowerCase().indexOf("citation") >= 0) {
							$('#citdialog')
								.append(
									$('<button id="'+strdispoIDI+'" type="button" class="whdrops dispbutton" style="font-size: 14pt; width: 300px; height: 65px; margin: 4px 4px;">'+strdispo.toUpperCase()+'</button>')
								);
						}
						else if (strdispo.toLowerCase().indexOf("civil") >= 0) {
							$('#civildialog')
								.append(
									$('<button id="'+strdispoIDI+'" type="button" class="whdrops dispbutton" style="font-size: 14pt; width: 300px; height: 65px; margin: 4px 4px;">'+strdispo.toUpperCase()+'</button>')
								);
						}
						else if (strdispo.toLowerCase().indexOf("alarm") >= 0) {
							$('#alarmdialog')
								.append(
									$('<button id="'+strdispoIDI+'" type="button" class="whdrops dispbutton" style="font-size: 14pt; width: 350px; height: 65px; margin: 4px 4px;">'+strdispo.toUpperCase()+'</button>')
								);
						}
						else if (strdispo.toLowerCase().indexOf("report") >= 0) {
							$('#reportdialog')
								.append(
									$('<button id="'+strdispoIDI+'" type="button" class="whdrops dispbutton" style="font-size: 14pt; width: 300px; height: 65px; margin: 4px 4px;">'+strdispo.toUpperCase()+'</button>')
								);
						}
						else if (strdispo.toLowerCase().indexOf("warrant") >= 0) {
							$('#warrantdialog')
								.append(
									$('<button id="'+strdispoIDI+'" type="button" class="whdrops dispbutton" style="font-size: 14pt; width: 350px; height: 65px; margin: 4px 4px;">'+strdispo.toUpperCase()+'</button>')
								);
						}
						else if (strdispo.toLowerCase().indexOf("warning") >= 0) {
							$('#citdialog')
								.append(
									$('<button id="'+strdispoIDI+'" type="button" class="whdrops dispbutton" style="font-size: 14pt; width: 300px; height: 65px; margin: 4px 4px;">'+strdispo.toUpperCase()+'</button>')
								);
						}
						else {
							$('#disposition')
								.append(
									$('<button id="'+strdispoIDI+'" type="button" class="butdrops dispbutton" style="font-size: 14pt; width: 300px; height: 55px; margin: 4px 4px;">'+strdispo.toUpperCase()+'</button>')
								);
						}
						
					});
					$('#AnimalCall').after('<button id="assist" type="button" style="font-size: 14pt; width:300px; height: 55px; margin: 4px 4px;" class="butdrops multib">ASSIST</button>');
					$('#CIDFollowUp').after('<button id="citation" type="button" style="font-size: 14pt; width:300px; height: 55px; margin: 4px 4px;" class="butdrops multib">CITATION</button>');
					$('#citation').after('<button id="civil" type="button" style="font-size: 14pt; width:300px; height: 55px; margin: 4px 4px;" class="butdrops multib">CIVIL</button>');
					$('#DUP-Duplicate').after('<button id="firealarm" type="button" style="font-size: 14pt; width:300px; height: 55px; margin: 4px 4px;" class="butdrops multib">FALSE ALARM</button>');
					$('#ReferredtoCID').after('<button id="report" type="button" style="font-size: 14pt; width:300px; height: 55px; margin: 4px 4px;" class="butdrops multib">REPORT</button>');
					$('#UnabletoLocate').after('<button id="warrant" type="button" style="font-size: 14pt; width:300px; height: 55px; margin: 4px 4px;" class="butdrops multib">WARRANT</button>');
				}
			});
			break;
		case "enalt":
			$.ajax({
				url: "Respond2ndLocation.xml",
				dataType: "xml",
				isLocal: true,
				async: false,
				success: function( xmlResponse ) {
					var data = $( "item", xmlResponse ).map(function() {
						return {
							value: $( "description", this ).text()
						};
					}).get();
					$( "#location" ).autocomplete({
						source: data,
						minLength: 1,
						autoFocus: true,
						select: function( event, ui ) {
							$('#subBtn').focus();
						}
					});
				}
			});
			break;
		case "firearm":
			$.ajax({
				url: "gunmake.xml",
				dataType: "xml",
				isLocal: true,
				async: false,
				success: function( xmlResponse ) {
					var data = $( "item", xmlResponse ).map(function() {
						return {
							value: $( "description", this ).text()
						};
					}).get();
					$( "#gunmake" ).autocomplete({
						source: data,
						minLength: 2,
						autoFocus: true,
						delay: 300,
						select: function( event, ui ) {
							$('#subBtn').focus();
						}
					});
				}
			});
			break;
		case "articles":
			$.ajax({
				url: "RecordsCheckCategory.xml",
				dataType: "xml",
				isLocal: true,
				async: false,
				success: function( xmlResponse ) {
					var data = $( "item", xmlResponse ).map(function() {
						return {
							value: $( "description", this ).text()
						};
					}).get();
					$( "#CatCode" ).autocomplete({
						source: data,
						minLength: 1,
						autoFocus: true,
						delay: 0,
						select: function( event, ui ) {
							$('#subBtn').focus();
						}
					});
				}
			});
			break;
	}
}

function sectlabel(sector) {
	if (sector.indexOf('-') >= 0) {
		var newSectlab = sector.substring(0, sector.indexOf('-'));
		return newSectlab;
	}
	else {
		return sector;
	}
}

function checkUnit(unit) {
	var arrUnit = ["1a","2a","3a","4a","1b","2b","3b","4b","1c","2c","3c","4c","1d","2d","3d","4d"];
	$.each(arrUnit, function(index,arrval) {
		trimUnit = unit.toLowerCase().substr(0,2);
		
		if (arrval == trimUnit) {
			checkUnit = true;
			return false;
		}
		else {
			checkUnit = false;
		}
	});
	return checkUnit;
}

function fetchSavedXML(field) {
	var mySavedUnit;
	$.ajax({
		type: "GET",
		url: "../FormDefaults.xml",
		dataType: "xml",
		isLocal: true,
		success: function(xml){
			$(xml).find("control_id").each(function(){
				if ($(this).text() == "unit") {
					mySavedUnit = $(this).next().text();
				}
			});
		}
	});
	//alert("ajax mySavedUnit: "+mySavedUnit);
	return mySavedUnit;
}

function fetchSavedCaps(formname,field) {
	var mySavedCaps = [];
	$.ajax({
		type: "GET",
		url: "../FormDefaults.xml",
		dataType: "xml",
		isLocal: true,
		async: false,
		success: function(xml){
			$(xml).find("form_name").each(function(){
				if ($(this).text() === formname) {
					$(this).siblings().children().each(function(){
						if ($(this).text() === field) {
							mySavedCaps.push($(this).next().text());
						}
					});
				}
			});
		}
	});
	return mySavedCaps;
}

function fetchCaps(dest, pos) {
	$.ajax({
		type: "GET",
		url: "Capabilities.xml",
		dataType: "xml",
		isLocal: true,
		success: function(xmlResponse){
			var data = $( "item", xmlResponse ).map(function() {
				return {
					value: $( "description", this ).text()
				};
			}).get();
			$( dest ).autocomplete({
				source: data,
				minLength: 1,
				autoFocus: true,
				delay: 0,
				position: {my: 'top', at: 'right top', of: '#UnitName', offset: '200 0'},
				select: function(event, ui) {
					var whichAuto = event.target.id;
					whichAuto = whichAuto.substring(0,(whichAuto.length)-1);
					$('#'+whichAuto).val(ui.item.label);
				}
			});
		}
	});
}

function fetchCapas(dest, pos) {
	$.ajax({
		type: "GET",
		url: "Capabilities.xml",
		dataType: "xml",
		isLocal: true,
		success: function(xmlResponse){
			var data = $( "item", xmlResponse ).map(function() {
				return {
					value: $( "description", this ).text()
				};
			}).get();
			$( dest ).autocomplete({
				source: data,
				minLength: 1,
				autoFocus: true,
				delay: 0,
				position: {my: 'top', at: 'top', of: '#employeename'},
				open: function() {
					$('#pllblcol, #plinputcol').css({visibility:'hidden'});
				},
				select: function(event, ui) {
					var whichAuto = event.target.id;
					whichAuto = whichAuto.substring(0,(whichAuto.length)-1);
					$('#'+whichAuto).val(ui.item.label);
				},
				close: function() {
					$('#pllblcol, #plinputcol').css({visibility:'visible'});
				}
			});
		}
	});
}


function fetchLoc() {
	$.ajax({
		type: "GET",
		url: "LocationTypes.xml",
		dataType: "xml",
		isLocal: true,
		success: function(xmlResponse){
			var data = $( "item", xmlResponse ).map(function() {
				return {
					label: $( "description", this).text(),
					value: $( "value", this ).text()
				};
			}).get();
			$('#LocationTypeAuto').autocomplete({
				source: data,
				minLength: 1,
				autoFocus: true,
				delay: 0,
				select: function(event,ui) {
					event.preventDefault();
					$('#LocationTypeAuto').val(ui.item.label);
					$('#LocationTypeID').val(ui.item.value);
				},
				focus: function(event,ui) {
						event.preventDefault();
						$('#LocationTypeAuto').val(ui.item.label);
					}
			});
		}
	});
}

function fetchProblemNature() {
	$.ajax({
		type: "GET",
		url: "ProblemNature.xml",
		dataType: "xml",
		isLocal: true,
		success: function(xmlResponse){
			var data = $( "item", xmlResponse ).map(function() {
				return {
					label: $( "description", this).text()
				};
			}).get();
			$('#problemnature').autocomplete({
				source: data,
				minLength: 1,
				autoFocus: true,
				delay: 0,
				change: function(event,ui) {
					if (!ui.item) {
						this.value='';
					}
				}
			});
		}
	});
}

function fetchPnat() {
	$.ajax({
		type: "GET",
		url: "ProblemNature.xml",
		dataType: "xml",
		isLocal: true,
		success: function(xmlResponse){
			var data = $( "item", xmlResponse ).map(function() {
				return {
					label: $( "description", this).text()
				};
			}).get();
			
			$('#pnatselect').autocomplete({
				source: data,
				minLength: 1,
				autoFocus: true,
				delay: 0,
				select: function( event, ui ) {
					$("#pnatureinput").text(ui.item.value);
					$("#problemnature").val(ui.item.value);
					$("#pnatdialog").dialog("close");
				}
			});
		}
	});
}
function fetchVehmake() {
	$.ajax({
		type: "GET",
		url:  "VehicleMake.xml",
		dataType: "xml",
		isLocal: true,
		success: function(xmlResponse){
			var data = $( "item", xmlResponse ).map(function() {
				return {
					label: $( "description", this).text()
				};
			}).get();
			$('#Make').autocomplete({
				source: data,
				minLength: 1,
				autoFocus: true,
				//removed training comma 5/2/2016 - EF 
				delay: 0
				//position: {my: "top", at: "top", of: "#StateAuto"},
				/*open: function() {
					$('#rightcol').css("visibility","hidden");
				},
				close: function() {
					$('#rightcol').css("visibility","visible");
				}*/
				
			});
			//missing comma 5/2/16 syntax error - Issue is training commas - EF 
		}
  });
}

function fetchSectors(dest) {
	$.ajax({
		type: "GET",
		url: "sectors.xml",
		dataType: "xml",
		isLocal: true,
		success: function(xmlResponse){
			var data = $( "item", xmlResponse ).map(function() {
				return {
					id: $( "id", this).text(),
					label: $( "description", this).text()
				};
			}).get();
			$(dest).autocomplete({
				source: data,
				minLength: 1,
				autoFocus: true,
				delay: 0,
				select: function(event,ui) {
					$('#itemid').val(ui.item.id);
					$('.divisionlist').each(function() {
						fetchDivisions($(this),'false',ui.item.id);
						$('#level').val('sector');
					});
				}
				
			});
		}
	});	
}

function fetchDivisions(dest, pos, pid) {
	$.ajax({
		type: "GET",
		url: "divisions.xml",
		dataType: "xml",
		isLocal: true,
		success: function(xmlResponse){
			if (pid == false || pid == undefined || pid == null) {
				var data = $( "item", xmlResponse ).map(function() {
					return {
						id: $( "id", this).text(),
						label: $( "description", this).text(),
						parentlistid: $("parentlistid", this).text()
					};
				}).get();
			}
			else {
				var data = $( "item", xmlResponse ).map(function() {
					if ($("parentlistid", this).text() == pid) {
						return {
							id: $( "id", this).text(),
							label: $( "description", this).text(),
							parentlistid: $("parentlistid", this).text()
						};
					}
				}).get();
			}
			
			$(dest).autocomplete({
				source: data,
				minLength: 1,
				autoFocus: true,
				delay: 0,
				select: function (event, ui) {
					$('#itemid').val(ui.item.id);
					$('#level').val('division');
				}
				
			});
		}
	});	
}

function fetchRadio() {
	$.ajax({
		url: "../Configuration_LoginUnits.xml",
		dataType: "xml",
		isLocal: true,
		success: function( xmlResponse ) {
			var data = $( "unit", xmlResponse ).map(function() {
				return {
					value: $( "id", this ).text()
				};
			}).get();
			$( "#radioname" ).autocomplete({
				source: data,
				delay: 0,
				minLength: 2,
				autoFocus: true,
				select: function( event, ui ) {
					
				}
			});
		}
	});
}


function opendialog(dia) {
	$(dia).dialog('open');
}

function fetchBCID(user) {
	var uCode;
	$.ajax({
		type: "GET",
		url: "../Configuration_Users.xml",
		dataType: "xml",
		isLocal: true,
		async: false,
		success: function(xml){
			$(xml).find("item").each(function(){
				if ($(this).text() === user) {
					uCode = ($(this).attr('code'));
				}
			});
		}
	});
	return uCode;
}

function cacheVars(user, key, ucaps) {
	var appPath = decodeURIComponent(grabpath() + "UserData/user_temp.xml");
	try {
		var fso = new ActiveXObject("Scripting.FileSystemObject");
	}
	catch(e) {
	}
		var file = fso.CreateTextFile(appPath, true);
		file.WriteLine("<?xml version='1.0' ?>");
		file.WriteLine("<root>");
		file.WriteLine("<Officer>");
		file.WriteLine("<user>"+user+"</user>");
		file.WriteLine("<key>"+key+"</key>");
		$.each(ucaps, function(i,v) {
			file.WriteLine("<capability>"+v+"</capability>");
		});
		file.WriteLine("</Officer>");
		file.WriteLine("</root>");
		file.Close();
	
	
}
	
function pmvag(user) {
	$.ajax({
		type: "GET",
		url: "../UserData/user_temp.xml",
		dataType: "xml",
		success: function(xml) {
			$(xml).find('Officer').each(function() {
				if ($(this).children('user').text() === user) {
					hash = CryptoJS.AES.decrypt($(this).children('key').text(), fetchBCID(user));
					hash = hash.toString(CryptoJS.enc.Utf8);
				}
			});
		}
	});
	return hash;
}
function checkPreReq() {
	try {
		var app = "prereq.vbs";
		var oShell = new ActiveXObject("Wscript.Shell");
		appPath = grabpath();
		appPath = appPath + "NewForms/installers/" + app;
		appCmd = decodeURIComponent(appPath);
		oShell.Run("wscript.exe " + '"'+appCmd+'"')
		return true;
	}
	catch(e) {
		alert("You MUST click on yes to install the Prerequisites");
		window.location.reload(true);
	}
}

function checkFolderReq() {
	try {
		var app = "folders.vbs";
		var oFSO = new ActiveXObject("WScript.Shell");
		appPath = grabpath();
		appPath = appPath + "NewForms/installers/" + app;
		appCmd = decodeURIComponent(appPath);
		oFSO.run("wscript.exe " + '"'+appCmd+'"');
		return true;
	}
	catch(e) {
	}
}

function runmyapp(app,vars) {
	switch (app) {
		case "mocha":
			appCmd = "c:\\Program Files\\MochaSoft\\Mocha TN3270 for Vista\\tn3270.exe";
			break;
		default:
			appPath = grabpath();
			appCmd = decodeURIComponent(appPath + "NewForms/installers/" + app);
			break;
	}
	if (vars != "-1") {
		var args = $.map(vars,function(v) {
			var str = '"'+v+'"';
			return str;
		}).join(" ");
	}
	else {
		args = "";
	}
	var oShell = new ActiveXObject("Shell.Application");
	oShell.ShellExecute(appCmd,args,"","open","1");
}

function runcrash() {
	appPath = grabpath();
	var args = decodeURIComponent('"' + appPath + "NewForms/installers/precrash.vbs" + '"');
	var appCmd = "wscript";
	var oShell = new ActiveXObject('Shell.Application');
	oShell.ShellExecute(appCmd, args, "", "open", "1");
}

function openDoc(dtype, doc) {
	var docpath = decodeURI(grabpath() + "NewForms/docs/" + doc);
	docpath = docpath.replace('/','\\');
	if (checkFile(docpath) == false) {
		return false;
	}
	switch(dtype) {
		case "word":
			var dapp = new ActiveXObject("Word.Application");
			break;
	}
	if (dapp != null) {
		dapp.Visible=true;
		dapp.Documents.Open(docpath);
		dapp.WindowState = 2;
		dapp.WindowState = 1;
	}
}

function checkFile(f) {
	var x = new ActiveXObject("Scripting.FileSystemObject");
	if (x.FileExists(f)) {
		bCheck = true;
	}
	else {
		bCheck = false;
	}
	x = null;
	return bCheck;
}

function fetchPager() {
var selp = [];
	$.ajax({
		url: "PersonnelWithPager.xml",
		dataType: "xml",
		isLocal: true,
		success: function( xmlResponse ) {
			var data = $( "item", xmlResponse ).map(function() {
				return {
					value: $( "value", this ).text(),
					label: $( "description", this ).text() 
				};
			}).get();
			$( "#upersonnel" )
				.autocomplete({
					source: data,
					minLength: 1,
					autoFocus: false,
					select: function(event, ui) {
						event.preventDefault();
						$('#spersonnel').append('<span id="'+ui.item.value+'" class="poli" onclick="popx('+ui.item.value+');"><img class="remx" onclick="popx('+ui.item.value+');" src="../Bitmaps/red-x.png"/>'+ui.item.label+'</span>');
						$('#upersonnel').val('');
					},
					focus: function(event, ui) {
						event.preventDefault();
						$('#upersonnel').val(ui.item.label);
					}
				});
		
		},
		error: function() {alert("There was an error")}
	});
}

function popx(sid) {
	$('#'+sid).remove();
}

function charCounter(ta, sout) {
	var charcount = ta.val().length;
	if (charcount >= 400) {
		ta.val(ta.val().substring(0,400));
	}
	$(sout).text(charcount + " ");
}

function getSystemSpecs() {
	var arrSpecs = [];
	var strComputer = ".";
	var objWsh = new ActiveXObject("WScript.Shell");
	var SWBemlocator = new ActiveXObject("WbemScripting.SWbemLocator");
	var objWMIService = SWBemlocator.ConnectServer(strComputer, "/root/CIMV2");
	var strProcess = "";
	var colItems = objWMIService.ExecQuery("Select * from Win32_ComputerSystem");
	var oFso = new ActiveXObject("Scripting.FileSystemObject");
	
	
	var e = new Enumerator(colItems);
	for(; ! e.atEnd(); e.moveNext())
	{
		//arrSpecs.push("Username: "+e.item().Username);
	}

	colItems = objWMIService.ExecQuery("Select * from Win32_NetworkAdapterConfiguration where IPEnabled=true");
	e = new Enumerator(colItems);
	for(; ! e.atEnd(); e.moveNext())
	{
		arrSpecs.push(e.item().Description + " IP: "+e.item().IPAddress(0));
	}
	
	colItems = objWMIService.ExecQuery("SELECT * FROM Win32_OperatingSystem")
	e = new Enumerator(colItems);
	for(; ! e.atEnd(); e.moveNext())
	{
		arrSpecs.push("OS: "+e.item().Caption)
		arrSpecs.push("SP: "+e.item().ServicePackMajorVersion);
	}
	
	//objWMIService = SWBemlocator.ConnectServer(strComputer, "/root/SecurityCenter2") {
	//colItems = objWMIService.ExecQuery("SELECT * FROM AntiVirusProduct");
	//e = new Enumerator(colItems);
	//for(; ! e.atEnd(); e.moveNext())
	//{
	//	arrSpecs.push("AV: "+e.item().displayName)
	//	arrSpecs.push("AV ver: "+e.item().versionNumber);
	//}
	//}
	
	var NetMotionVer = objWsh.RegRead("HKEY_LOCAL_MACHINE\\SOFTWARE\\NetMotion\\Setup\\ProductVersion"); 
	arrSpecs.push("NetMotion: "+NetMotionVer);
	
	//if (oFso.FileExists(decodeURI(grabpath()+"Error.Log"))) {
	//	var f = oFso.OpenTextFile(decodeURI(grabpath()+"Error.Log",1));
	//	var fc = f.ReadAll();
	//	f.Close();
	//	arrSpecs.push(fc);
	//}
	//else {
	//	arrSpecs.push("Error Log Not Found");
	//}
	return arrSpecs;
	
}

