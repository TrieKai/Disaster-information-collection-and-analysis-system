<?php
// MongoDB 伺服器設定
$dbhost = 'localhost';
$dbname = 'test';

// 連線到 MongoDB 伺服器
$mongoClient = new MongoClient('mongodb://' . $dbhost);
$db = $mongoClient->$dbname;

// 取得 demo 這個 collection
$cDemo = $db->data_2016;

if (isset($_POST['lat']) && isset($_POST['lng']) && isset($_POST['id'])) {
	if ($_POST['lat'] != "" && $_POST['lat'] != "" && $_POST['id'] != "") {
		$lat = $_POST['lat'];
		$lng = $_POST['lng'];
		$id = $_POST['id'];
		
		$cDemo->update(
		  array("_id" => new MongoId($id)),
		  array('$set' => array("lat" => $lat, "lng" => $lng))
		);
	} else {
		echo "No value";
	}
} else {
	echo "No exist";
}
?>
