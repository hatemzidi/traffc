<?php
/**
 * Created by IntelliJ IDEA.
 * User: h.zidi
 * Date: 29/01/2015
 * Time: 16:28
 */

$dbfolder = 'data/';
$dbname = 'traffc.sq3';

//connect
$logdb = new PDO("sqlite:" . $dbfolder . $dbname);


$searchTerm = isset($_GET['q']) ? $_GET['q'] : '';
$counters = array();


$list = $logdb->query("SELECT latitude, longitude, asciiname, LOWER(\"country code\") AS country " .
    "FROM geoname " .
    "WHERE name LIKE '%$searchTerm%'" .
    "ORDER BY asciiname");

$counters = $list->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($counters);

// close connection
$logdb = null;
