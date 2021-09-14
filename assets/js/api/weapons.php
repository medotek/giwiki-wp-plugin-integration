<?php
$url="https://seeliedb.guda.club/api/weapons.json";
////  Initiate curl
//$ch = curl_init();
//// Will return the response, if false it print the response
//curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
//// Set the url
//curl_setopt($ch, CURLOPT_URL,$url);
//// Execute
//$result=curl_exec($ch);
//// Closing
//curl_close($ch);

$result = file_get_contents($url);
// Will dump a beauty json :3
var_dump(json_decode($result, true));


