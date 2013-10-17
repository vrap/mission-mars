<?php


$dataURL = $_POST['dataURL'];

$parts = explode(',', $dataURL);  
$data = $parts[1];  
$data = base64_decode($data);  

file_put_contents('assets/img/textures/rock3.png', $data); 