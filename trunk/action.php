<?php
	
function escape($v){
	
	$v = str_replace(" ","\ ",$v);
	$v = str_replace("'","\'",$v);
	return $v;
	
}

$dest =  escape($_REQUEST['dest']);
$source =  escape($_REQUEST['sourc']);

if ($_REQUEST['force']) {
	
	$args =  'f';
	
}else{
	
	$args =  '';
	
}

function relocate($source, $dest, $args) {
	
	if(isset($source) && isset($dest)) {
		
		echo ("Success: ln -s".$args." ".$dest." ".$source."");
		return(shell_exec("ln -s".$args." ".$dest." ".$source.""));
		
	}
	
	return false;
}

echo relocate($source, $dest, $args);
	
?>