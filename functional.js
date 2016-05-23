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
