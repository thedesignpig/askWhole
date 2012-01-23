<?php
set_time_limit(50); 
$c=$_GET['l'];
//$size=strlen(join('',file($contents)));//find filesize for remote file
if(ini_get('zlib.output_compression'))ini_set('zlib.output_compression', 'Off');
header("Pragma: public"); // required
header("Expires: 0");
header('Content-Type: application/octet-stream');
header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
header("Cache-Control: private",false);
header("Content-Disposition: attachment;");
header("Content-Transfer-Encoding: binary");
//header("Content-Length: ".$size);
header("Keep-Alive: timeout=60, max=100");
readfile($c);
flush();exit(); 
?>