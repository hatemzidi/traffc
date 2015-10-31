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

$searchTerm = isset($_GET['q']) ? $_GET['q'] : ''; //todo if no q then return. no need to call the db for nothing.
$counters = array();

$list = $logdb->query("SELECT latitude, longitude, asciiname, LOWER(\"country code\") AS country " .
    "FROM geoname " .
    "WHERE upper(name) LIKE '%" . strtoupper($searchTerm) . "%'" .
    "ORDER BY length(asciiname) ASC ");

$counters = $list->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($counters);

// close connection
$logdb = null;
