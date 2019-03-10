<?php
// MongoDB 伺服器設定
$dbhost = 'localhost';
$dbname = 'test';

// 連線到 MongoDB 伺服器
$mongoClient = new MongoClient('mongodb://' . $dbhost);
$db = $mongoClient->$dbname;

// 取得 demo 這個 collection
$cDemo = $db->data_2016;

if (isset($_POST['func'])) {
	if ($_POST['func'] != "" && isset($_POST['timeVal'])) {
		$timeVal = $_POST['timeVal'];
		if ($_POST['func'] == 'init') {
			init();
		} else if ($_POST['func'] == 'reload' && isset($_POST['value']) && isset($_POST['timeVal'])){
			if ($_POST['value'] == "all") {
				init();
			} else {
				$value = $_POST['value'];
//				$timeVal = $_POST['timeVal'];
				reload();
			}
		} else if ($_POST['func'] == 'geoCode') {
			geoCode();
		}
	} else {
		echo "No value";
	}
} else {
	//echo "func No exist";
}



function init () {
	global $cDemo;
	global $timeVal;
	$timeArry = [[1420066800, 1451516400], [1451602800, 1483138800], [1483225200, 1514674800]];
	// 設定查詢條件
	$query = "function() {
		if (this.category.length > 0 && this.tv_tags.length > 0) {
			return this.disaster_tags.length > 0 && this.IsProcessed == 1 && this.neg_tags.length == 0;
		}else if (this.category.length > 0 && this.geo_tags.length > 0) {
			return this.disaster_tags.length > 0 && this.IsProcessed == 1 && this.neg_tags.length == 0;
		}else if (this.county_tags.length > 0 && this.tv_tags.length > 0) {
			return this.disaster_tags.length > 0 && this.IsProcessed == 1 && this.neg_tags.length == 0;
		}else if (this.county_tags.length > 0 && this.geo_tags.length > 0) {
			return this.disaster_tags.length > 0 && this.IsProcessed == 1 && this.neg_tags.length == 0;
		}
	}";
	
	$arr = array();
	$cursor = $cDemo->find(array('$where' => $query));
	foreach ($cursor as $doc) {
		$time1 = explode(' ', $doc["time"])[0];
		$time2 = str_replace("/", "-", $time1);
		$time = strtotime($time2);	
		
		if ($time > $timeArry[$timeVal][0] && $time < $timeArry[$timeVal][1]) {
			if (isset($doc["lat"]) && isset($doc["lng"])) {
				if ($doc["lat"] != "undefined" && $doc["lng"] != "undefined") {
					$temp = array("id" => $doc["_id"], "time" => $time2, "disaster_tags" => $doc["disaster_tags"], "titleCounty" => $doc["category"],
					 "county" => $doc["county_tags"], "village" => $doc["tv_tags"], "road" => $doc["geo_tags"], "post" => $doc["post"],
					 "lat" => $doc["lat"], "lng" => $doc["lng"], "url" => $doc["url"]);
					array_push($arr, $temp);
				}
			}
		}
	}
	echo json_encode($arr);
}

function reload () {
	global $cDemo;
	global $value;
	global $timeVal;
	$timeArry = [[1420066800, 1451516400], [1451602800, 1483138800], [1483225200, 1514674800]];
//	echo $value;
	$arr = array();
	$cursor = $cDemo->find(array('disaster_tags' => $value));
	foreach ($cursor as $doc) {
		$time1 = explode(' ', $doc["time"])[0];
		$time2 = str_replace("/", "-", $time1);
		$time = strtotime($time2);	
		if ($time > $timeArry[$timeVal][0] && $time < $timeArry[$timeVal][1]) {
			if (isset($doc["lat"]) && isset($doc["lng"])) {
				if ($doc["lat"] != "undefined" && $doc["lng"] != "undefined") {
					$temp = array("id" => $doc["_id"], "time" => $time2, "disaster_tags" => $doc["disaster_tags"], "titleCounty" => $doc["category"],
					 "county" => $doc["county_tags"], "village" => $doc["tv_tags"], "road" => $doc["geo_tags"], "post" => $doc["post"],
					 "lat" => $doc["lat"], "lng" => $doc["lng"], "url" => $doc["url"]);
					array_push($arr, $temp);
				}
			}
		}
	}
	echo json_encode($arr);
}

function geoCode () {
	global $cDemo;
	// 設定查詢條件
	$query = "function() {
		if (this.category.length > 0 && this.tv_tags.length > 0) {
			return this.disaster_tags.length > 0 && this.IsProcessed == 1 && this.neg_tags.length == 0;
		}else if (this.category.length > 0 && this.geo_tags.length > 0) {
			return this.disaster_tags.length > 0 && this.IsProcessed == 1 && this.neg_tags.length == 0;
		}else if (this.county_tags.length > 0 && this.tv_tags.length > 0) {
			return this.disaster_tags.length > 0 && this.IsProcessed == 1 && this.neg_tags.length == 0;
		}else if (this.county_tags.length > 0 && this.geo_tags.length > 0) {
			return this.disaster_tags.length > 0 && this.IsProcessed == 1 && this.neg_tags.length == 0;
		}
	}";
	
	$arr = array();
	$cursor = $cDemo->find(array('$where' => $query));
	foreach ($cursor as $doc) {
		$temp = array("id" => $doc["_id"], "time" => $doc["time"], "disaster_tags" => $doc["disaster_tags"], "titleCounty" => $doc["category"],
		 "county" => $doc["county_tags"], "village" => $doc["tv_tags"], "road" => $doc["geo_tags"], "post" => $doc["post"], "url" => $doc["post"]);
		array_push($arr, $temp);
	}
	echo json_encode($arr);
}
?>