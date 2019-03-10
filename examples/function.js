var species;
window.species = "all";
var time;
window.time = 0;
var count = 0;
window.day = 2015;

google.maps.event.addDomListener(window, 'load', loadData("mongo.php", load, "func=init&timeVal=" + window.time));

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

//var _gaq = _gaq || [];
//_gaq.push(['_setAccount', 'UA-12846745-20']);
//_gaq.push(['_trackPageview']);
//
//(function() {
//	var ga = document.createElement('script');
//	ga.type = 'text/javascript';
//	ga.async = true;
//	ga.src = ('https:' === document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
//	var s = document.getElementsByTagName('script')[0];
//	s.parentNode.insertBefore(ga, s);
//})();

var prev_infowindow;
var map;

//初始化
function load(xhttp) {
//	console.log(xhttp.responseText)
	var center = new google.maps.LatLng(23.974093, 120.979903);
	window.prev_infowindow = false;
	window.map = new google.maps.Map(document.getElementById('map'), {
		zoom: 8,
		center: center,
		mapTypeId: google.maps.MapTypeId.ROADMAP,
		mapTypeControlOptions: {
			style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
			position: google.maps.ControlPosition.TOP_RIGHT
		},
		fullscreenControl: true,
	});
	//搜尋功能
	searchMap();
	//散佈圖
	distribution(xhttp);
}

//search Function
function searchMap() {
	var input = /** @type {!HTMLInputElement} */ (
		document.getElementById('pac-input'));

	var types = document.getElementById('type-selector');
	map.controls[google.maps.ControlPosition.TOP_CENTER].push(input);
	map.controls[google.maps.ControlPosition.TOP_CENTER].push(types);

	var autocomplete = new google.maps.places.Autocomplete(input);
	autocomplete.bindTo('bounds', map);

	var infowindow = new google.maps.InfoWindow();
	var marker = new google.maps.Marker({
		map: map,
		anchorPoint: new google.maps.Point(0, -29)
	});

	autocomplete.addListener('place_changed', function() {
		infowindow.close();
		marker.setVisible(false);
		var place = autocomplete.getPlace();
		if(!place.geometry) {
			// User entered the name of a Place that was not suggested and
			// pressed the Enter key, or the Place Details request failed.
			window.alert("No details available for input: '" + place.name + "'");
			return;
		}

		// If the place has a geometry, then present it on a map.
		if(place.geometry.viewport) {
			map.fitBounds(place.geometry.viewport);
		} else {
			map.setCenter(place.geometry.location);
			map.setZoom(17); // Why 17? Because it looks good.
		}
		marker.setIcon( /** @type {google.maps.Icon} */ ({
			url: place.icon,
			size: new google.maps.Size(71, 71),
			origin: new google.maps.Point(0, 0),
			anchor: new google.maps.Point(17, 34),
			scaledSize: new google.maps.Size(35, 35)
		}));
		marker.setPosition(place.geometry.location);
		marker.setVisible(true);

		var address = '';
		if(place.address_components) {
			address = [
				(place.address_components[0] && place.address_components[0].short_name || ''),
				(place.address_components[1] && place.address_components[1].short_name || ''),
				(place.address_components[2] && place.address_components[2].short_name || '')
			].join(' ');
		}

		infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + address);
		infowindow.open(map, marker);
	});

	// Sets a listener on a radio button to change the filter type on Places
	// Autocomplete.
	function setupClickListener(id, types) {
		var radioButton = document.getElementById(id);
		radioButton.addEventListener('click', function() {
			autocomplete.setTypes(types);
		});
	}

	setupClickListener('changetype-all', []);
	setupClickListener('changetype-establishment', ['establishment']);
	setupClickListener('changetype-geocode', ['geocode']);
}

//like&dislike Function

function likeBtn(id) {
	var BtnID = id.slice(7);
	var cookieName = window.day + "&" + BtnID;
	if(readCookie(cookieName)) {} else {
		createCookie(cookieName, 1);
		console.log($("button>span").text())
		$("#" + id + ">span").html(function(i, val) {
			console.log(id)
			return val * 1 + 1;
		});
	}
}

function dislikeBtn(id) {
	var BtnID = id.slice(10);
	var cookieName = window.day + "&" + BtnID;
	if(readCookie(cookieName)) {} else {
		createCookie(cookieName, 1);
		$("#" + id + ">span").html(function(i, val) {
			console.log(id)
			return val * 1 + 1;
		});
	}
}

function createCookie(name, days) {
	var expires = '',
		date = new Date();
	if(days) {
		date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
		expires = '; expires=' + date.toGMTString();
	}
	document.cookie = name + '=' + expires + '; path=/';
	console.log(document.cookie)
}

function readCookie(name) {
	var nameEQ = name,
		allCookies = document.cookie.split(';'),
		i,
		cookie;
	for(i = 0; i < allCookies.length; i += 1) {
		cookie = allCookies[i];
		while(cookie.charAt(0) === ' ') {
			cookie = cookie.substring(1, cookie.length);
		}
		if(cookie.indexOf(nameEQ) === 0) {
			return cookie.substring(nameEQ.length, cookie.length);
		}
	}
	return null;
}

function eraseCookie(name) {
	createCookie(name, '', -1);
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
setTimeout(function() {
	window.location.reload(1);
}, 300000);

function disasterSpeciesValue(value, time) {
	console.log(value)
	window.species = value;
	if (time != undefined) {
		window.time = time;
	}
	loadData("mongo.php", distribution, "func=reload&value=" + window.species + "&timeVal=" + window.time);
}

var AddressAry;
var markers;
var markerCluster;

function distribution(xhttp) {
	//清除圖層
	if(!(typeof(markers) == "undefined")) {
		markerCluster.clearMarkers();
		for(i=0; i<markers.length; i++){
	        markers[i].setMap(null);
	    }
	}
	
	if (xhttp != null) {
		var data = JSON.parse(xhttp.responseText);
		console.log(data)
		markers = [];
		var infoWindowArray = [];
		var num = data.length;
		window.AddressAry = [];
	
		for (i = 0; i < data.length; i++) {
	//		console.log(data[i].lat)
			var latLng = new google.maps.LatLng(data[i].lat, data[i].lng);
	//		console.log(latLng)
			var count = 0;
	
			//檢查座標點是否一樣
			if(AddressAry.length != 0) {
				//console.log("array not 0")
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
					var newLat = latLng.lat() + (Math.random() - .5) / 1500; // * (Math.random() * (max - min) + min);
					var newLng = latLng.lng() + (Math.random() - .5) / 1500; // * (Math.random() * (max - min) + min);
					latLng = new google.maps.LatLng(newLat, newLng);
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
			var contentString = '<div id="content">' +
				//'<p>' + dataContent.id + '</p>' +
				'<p style="font-size:large; font-weight:bold;">時間 : <span style="font-weight:normal;">' + data[i].time + '</span></p>' +
				'<p style="font-size:large; font-weight:bold;">事件 : <span style="font-weight:normal;">' + data[i].disaster_tags + '</span></p>' +
	//			'<p>地點 : ' + dataContent.geo_keyword + '</p>' +
				'<p style="font-size:large; font-weight:bold;">描述 : <span style="font-weight:normal;">' + data[i].post + '</span></p>' +
				'<p style="font-size:large; font-weight:bold;">出處 : <a style="font-weight:normal;" href="'+ data[i].url +'" target="_blank">' + data[i].url + '</a></p>' +
				'</div>' +
				'<div style="text-align:center;">' +
				'<button type="button" id="likeBtn' + i + '" onclick="likeBtn(this.id)"><i class="fa fa-thumbs-up"></i>Like<span>0</span></button>' +
				'<button type="button" id="dislikeBtn' + i + '" onclick="dislikeBtn(this.id)"><i class="fa fa-thumbs-down"></i>Dislike<span>0</span></button>' +
				'</div>';
			//alert(address)
			var infowindow = new google.maps.InfoWindow({
				content: contentString
			});
			var marker = new google.maps.Marker({
				position: address
			});
			
			markers.push(marker);
			//console.log(markers[i])
			infoWindowArray.push(infowindow);
			markers[i].addListener('click', function() {
				if(prev_infowindow)
					prev_infowindow.close();
				prev_infowindow = infoWindowArray[markers.indexOf(this)];
				infoWindowArray[markers.indexOf(this)].open(map, this);
			});
		}
		markerCluster = new MarkerClusterer(map, markers, {
			imagePath: '../images/m'
		});
	}
	//更換熱度圖
	if (heatmap != null) {
		heatmapReload();
	}
}

//定位六都
function locate(lat, lng) {
	map.panTo(new google.maps.LatLng(lat, lng));
	map.setZoom(13);
}

//分布圖開關
$("#distributionSwitch").click(function() {
	if($("#distributionSwitch").prop("checked")) {
		disasterSpeciesValue(window.species, window.time);
	} else {
		distribution(null);
	}
});


var heatmap;
//heatMap更換
function heatmapReload() {
	console.log(AddressAry)
	heatmap.setMap(null);
	heatmap = new google.maps.visualization.HeatmapLayer({
	    data: AddressAry,
	    dissipating: false,
	    radius: 0.05,
	    map: map
    });
    heatmap.setMap(map);
}
//heatMap開關
$("#heatMapSwitch").click(function() {
	if(!heatmap) {
		heatmap = new google.maps.visualization.HeatmapLayer({
		    data: AddressAry,
		    dissipating: false,
		    radius: 0.05,
		    map: map
	    });
	}
	if($("#heatMapSwitch").prop("checked")) {
		heatmap.setMap(null);
		heatmap.setMap(map);
	} else {
		heatmap.setMap(null);
		heatmap = undefined;
	}
});

//圖表
function tauchart () {
	//清空modal
	$(".modal-body").html("");
	var xhttp = new XMLHttpRequest();
	var countyArry = [['台北市', '台北'], ['新北市', '新北'], ['桃園市', '桃園'], ['台中市', '台中'], ['台南市', '台南'], ['高雄市', '高雄'],
					 ['基隆市', '基隆'], ['新竹市', '新竹'], ['嘉義市', '嘉義'], ['新竹縣'], ['苗栗縣', '苗栗'], ['彰化縣', '彰化'],
					 ['南投縣', '南投'], ['雲林縣', '雲林'], ['嘉義縣'], ['屏東縣', '屏東'], ['宜蘭縣', '宜蘭'], ['花蓮縣', '花蓮'],
					 ['台東縣', '台東'], ['澎湖縣', '澎湖']];
	xhttp.onreadystatechange = function() {
		if(xhttp.readyState == 4 && xhttp.status == 200) {
			var data = JSON.parse(xhttp.responseText);
			console.log(data)
			var disasterKind = [];
			
			//找出災情種類
			for (i = 0; i < data.length; i++) {
				for (j = 0; j < data[i].disaster_tags.length; j++) {
					var disaster = data[i].disaster_tags[j];
					if (disasterKind.indexOf(disaster) == -1) {
						disasterKind.push(disaster);
					}
				}
			}
			
			var disasterSort = [];
			for (i = 0; i < disasterKind.length; i++) {
				var disasterCount = 0;
				for (j = 0; j < data.length; j ++) {
					if (data[j].disaster_tags[0] == disasterKind[i]) {
						disasterCount = disasterCount + 1;
					}
				}
				disasterSort.push({
					disaster: disasterKind[i],
					count: disasterCount
				})
			}
			
			//排序災情數量
			function compare(a,b) {
			  if (a.count < b.count)
			    return 1;
			  if (a.count > b.count)
			    return -1;
			  return 0;
			}
//			console.log(disasterSort.sort(compare))
			console.log(disasterKind)
//			console.log(countyArry)
			var countyDisasterCount = [];
			for (a = 0; a < countyArry.length; a++) {
				//只取5個
				for (b = 0; b < 4; b++) {
					var count = 0;
					for (c = 0; c < countyArry[a].length; c++) {
						for (d = 0; d < data.length; d++) {
							for (e = 0; e < data[d].disaster_tags.length; e++) {
								//有county優先
								if (data[d].county.length != 0 && countyArry[a][c] == data[d].county && disasterSort.sort(compare)[b].disaster == data[d].disaster_tags[e]) {
									count = count + 1;
								} else if (data[d].titleCounty != null) {
									var county = data[d].titleCounty.split(" ")[0]
									if (countyArry[a][c] == county && disasterSort.sort(compare)[b].disaster == data[d].disaster_tags[e]) {
										count = count + 1;
									}
								}
							}
						}
					}
					countyDisasterCount.push({
						county: countyArry[a][0],
						災種: disasterKind[b],
						count: count
					})
				}
				
			}
			console.log(countyDisasterCount)
			
			var chart = new tauCharts.Chart({
				guide: {
				  x: {label:'縣市'},  // custom label for X axis
				  y: {label:'數量'},    // custom label for Y axis
				  padding: {b:40,l:40,t:10,r:10},   // chart paddings
				},
				data: countyDisasterCount,
				type: 'bar',           
				x: "county",
				y: 'count',
				color: '災種',
				plugins: [
					tauCharts.api.plugins.get('legend')(),
					tauCharts.api.plugins.get('tooltip')({})
				],
			});
			chart.renderTo('#bar');
		}
	};
	xhttp.open("POST", "mongo.php", true);
	xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhttp.send("func=init&timeVal=" + window.time);
}

document.getElementById("dateSlider").oninput = function() {
	switch (parseInt(this.value)) {
		case 0:
			var day = "2015年";
			window.day = 2015;
			disasterSpeciesValue(window.species, 0);
			break;
		case 1:
			var day = "2016年";
			window.day = 2016;
			disasterSpeciesValue(window.species, 1);
			break;
		case 2:
			var day = "2017年";
			window.day = 2017;
			disasterSpeciesValue(window.species, 2);
			break;
	}
	console.log(day)
	document.getElementById("demo").innerHTML = day;
	document.getElementById("date-on-map").innerHTML = day;
}