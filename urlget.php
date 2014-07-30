<?php
header("access-control-allow-origin: *");
if($_GET['url'])
{
  $url=$_GET['url'];
  echo file_get_contents($url);//loading the URL data.
}
?>
