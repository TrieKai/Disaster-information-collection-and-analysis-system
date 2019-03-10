<?php
function fun_cn2db() {
	$dbServer = 'localhost';
	$dbUserName = 'root';
	$dbPassword = '';
	$dbDatabase = 'disaster';
	$mysqli = mysqli_connect($dbServer, $dbUserName, $dbPassword, $dbDatabase);
	mysqli_set_charset($mysqli, 'utf8');
	header('Content-Type: text/html; charset=utf-8');
//	if (!$mysqli) {
//	    die("Connection failed: " . mysqli_connect_error());
//	    echo "Connected failed!";
//	}
//	echo "Connected successfully!";
	
	return $mysqli;
}
	
?>