<?php

//$callback = $_REQUEST["callback"];
$file = 'tchat.json';

if (isset($_GET["login"]) && isset($_GET["text"]))
{
	if (file_exists($file))
	{
		$filecontent = file_get_contents( $file );
		$messages = (array) json_decode($filecontent);
	}
	else
		$messages = array();
		
	$message = new stdClass();
	$message->login = $_GET["login"];
	$message->text = $_GET["text"];
	
	$messages[] = $message;
	
	$filecontent = json_encode($messages);
	
	$fp = fopen($file, 'w+');
	fwrite($fp, $filecontent);
	fclose($fp);
	
	echo /*$callback . "(" .*/ $filecontent /*. ")"*/;
}
else
{
	if (file_exists($file))
		echo/* $callback . "(" .*/ file_get_contents( $file ) /*. ")"*/;
	else
		echo /*$callback . "()" */ "";
}

?>