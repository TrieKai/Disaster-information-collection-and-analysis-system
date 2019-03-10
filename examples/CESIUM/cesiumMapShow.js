var viewer = new Cesium.Viewer('cesiumContainer', {
});
//關閉下方LOGO
viewer._cesiumWidget._creditContainer.style.display="none";

var terrainProvider = new Cesium.CesiumTerrainProvider({
    url : '//assets.agi.com/stk-terrain/world'
});
viewer.terrainProvider = terrainProvider;

var species;
window.species = "all";
var time;
window.time = 0;
var count = 0;

loadData("../mongo.php", load, "func=init&timeVal=" + window.time);

function loadData(url, cfunc, data) {
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if(xhttp.readyState == 4 && xhttp.status == 200) {
			cfunc(xhttp);
		}
	};
	xhttp.open("POST", url, true);
	xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhttp.send(data);
	console.log(data)
}

//初始化
function load(xhttp) {
//	console.log(xhttp.responseText)
	/*設定視野*/
	viewer.camera.flyTo({
		destination: Cesium.Cartesian3.fromDegrees(120.888047, 20.014644, 500000.0),
		orientation: {
			heading: 0.0,
			pitch: Cesium.Math.toRadians(-50.0),
			roll: 0.0
		}
	});
	//散佈圖
	distribution(xhttp);
}

//SideBar
$('#slide-submenu').on('click', function() {
	$(this).closest('.list-group').fadeOut('slide', function() {
		$('.mini-submenu').fadeIn();
	});
});

$('.mini-submenu').on('click', function() {
	$(this).next('.list-group').toggle('slide');
	$('.mini-submenu').hide();
})

//刷新頁面
//setTimeout(function() {
//	window.location.reload(1);
//}, 300000);

function disasterSpeciesValue(value, time) {
	console.log(value)
	window.species = value;
	if (time != undefined) {
		window.time = time;
	}
	loadData("../mongo.php", distribution, "func=reload&value=" + window.species + "&timeVal=" + window.time);
}

var AddressAry;

function distribution(xhttp) {
	//清除圖層
	viewer.dataSources.removeAll(); 
	
	if (xhttp != null) {
		var data = JSON.parse(xhttp.responseText);
		console.log(data)
		var infoWindowArray = [];
		var num = data.length;
		window.AddressAry = [];
		var dataSource = new Cesium.CustomDataSource();
		var terrainSamplePositions =[];
		
		for (i = 0; i < data.length; i++) {
			terrainSamplePositions.push(Cesium.Cartographic.fromDegrees(data[i].lng, data[i].lat));
		}
		
		var promise = Cesium.sampleTerrain(terrainProvider, 11, terrainSamplePositions);
		Cesium.when(promise, function(updatedPositions) {
			for (i = 0; i < data.length; i++) {
				var latLng = Cesium.Cartesian3.fromDegrees(data[i].lng, data[i].lat, terrainSamplePositions[i].height);
				
				var count = 0;
				//檢查座標點是否一樣
				if(AddressAry.length != 0) {
					for(i = 0; i < AddressAry.length; i++) {
						//console.log(i)
						var existinglatlng = AddressAry[i];
		
						//if a marker already exists in the same position as this marker
						if(latLng.equals(existinglatlng)) {
							count = count + 1;
							//console.log("found equal one")
						}
					}
					if(count > 0) {
						//update the position of the coincident marker by applying a small multipler to its coordinates
						var newLat = data[i].lat + (Math.random() - .5) / 1500; // * (Math.random() * (max - min) + min);
						var newLng = data[i].lng + (Math.random() - .5) / 1500; // * (Math.random() * (max - min) + min);
						latLng = Cesium.Cartesian3.fromDegrees(newLng, newLat);
						AddressAry.push(latLng);
						//console.log(latLng)
					} else {
						AddressAry.push(latLng);
					}
				} else {
					//console.log("first entering")
					AddressAry.push(latLng);
				}
				
				var address = AddressAry[i];
				var pinBuilder = new Cesium.PinBuilder();
				// Set a label's rightToLeft after init
				Cesium.Label.enableRightToLeftDetection = true;
				var bluePin = dataSource.entities.add({
					name : data[i].id.$id,
					description : '<p>時間: ' + data[i].time + '</p>'+
								  '<p>事件: ' + data[i].disaster_tags + '</p>'+
								  '<p>描述: ' + data[i].post + '</p>'+
								  '<p>出處: <a href="'+ data[i].url +'" target="_blank">' + data[i].url + '</a></p>',
					position : address,
					billboard : {
						image : pinBuilder.fromColor(Cesium.Color.RED, 48).toDataURL(),
						verticalOrigin : Cesium.VerticalOrigin.BOTTOM
					},
				});
			}
		});
	    viewer.dataSources.add(dataSource);
	}
}

//定位六都
function locate(lat, lng) {
	viewer.camera.flyTo({
		destination: Cesium.Cartesian3.fromDegrees(lng, lat, 7000.0),
		orientation: {
			heading: 0.0,
			pitch: Cesium.Math.toRadians(-50.0),
			roll: 0.0
		}
	});
}

//分布圖開關
$("#distributionSwitch").click(function() {
	if($("#distributionSwitch").prop("checked")) {
		disasterSpeciesValue(window.species, window.time);
	} else {
		distribution(null);
	}
});

document.getElementById("dateSlider").oninput = function() {
	switch (parseInt(this.value)) {
		case 0:
			var day = "2015年";
			disasterSpeciesValue(window.species, 0);
			break;
		case 1:
			var day = "2016年";
			disasterSpeciesValue(window.species, 1);
			break;
		case 2:
			var day = "2017年";
			disasterSpeciesValue(window.species, 2);
			break;
	}
	console.log(day)
	document.getElementById("demo").innerHTML = day;
}
