<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");

$url = "http://46.35.176.12/Weather_Summary_Vantage_Pro_Plus.htm";

// Cache settings
$cacheFile = __DIR__ . '/cache.htm';
$cacheTtl  = 5 * 60;

if (file_exists($cacheFile) && (time() - filemtime($cacheFile)) < $cacheTtl) {
    readfile($cacheFile);
    exit;
}

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);

$response = curl_exec($ch);

if ($response === false) {
    http_response_code(500);
    echo "cURL error: " . curl_error($ch);
    curl_close($ch);
    exit;
}


$contentType = curl_getinfo($ch, CURLINFO_CONTENT_TYPE);
if ($contentType) {
    header("Content-Type: $contentType");
}

curl_close($ch);

file_put_contents($cacheFile, $response);
echo $response;
