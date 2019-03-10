var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function() {
	if(xhttp.readyState == 4 && xhttp.status == 200) {
		var data = JSON.parse(xhttp.responseText);
		var latlngArry = [];
		var idArry = [];
		console.log(data)
	
		for(i = 0; i < data.length; i++) {
			if(data[i].county.length != 0) {
				var address = data[i].county + data[i].village + data[i].road;
				//			console.log(address)
			} else if(data[i].titleCounty.length != 0) {
				var address = data[i].titleCounty + data[i].village + data[i].road;
				//			console.log(address)
			}
			//使用ajax同步
			$.ajax({
			  url: "https://maps.googleapis.com/maps/api/geocode/json?address=" + address + "&region=tw&key=AIzaSyD_mthYTkoz9FEjqQ_2x5tJaasDmTwwsbo",
			  dataType: 'json',
			  async: false,
			  success: function(result) {
			    if (result.results[0] == undefined) {
					var lat = undefined;
					var lng = undefined;
				}else {
					var lat = result.results[0].geometry.location.lat;
					var lng = result.results[0].geometry.location.lng;
				}
//				console.log(latlng)
				latlngArry.push({lat:lat, lng:lng});
			  }
			});
			var id = data[i].id.$id;
			idArry.push(id);
		}
		
		for (j = 0; j < data.length; j++) {
			var xhttp2 = new XMLHttpRequest();
			xhttp2.onreadystatechange = function() {
				if(xhttp2.readyState == 4 && xhttp2.status == 200) {
					console.log(xhttp2.responseText)
				}
			};
//			console.log(latlngArry)
//			console.log(latlngArry[j])
			xhttp2.open("POST", "LatLng.php", true);
			xhttp2.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
//			xhttp2.send('lat="' + latlngArry[j].lat + '"&lng=' +latlngArry[j].lng + '"&id="' + idArry[j] +'"');
			xhttp2.send("lat=" + latlngArry[j].lat + "&lng=" + latlngArry[j].lng + "&id=" + idArry[j]);
			console.log(idArry[j] + latlngArry[j].lat + latlngArry[j].lng)
		}
	}
};
xhttp.open("POST", "mongo.php", true);
xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
xhttp.send("func=geoCode&timeVal=2015");
