<?php
	$folder = $_GET['folder'];

	$iterator = new DirectoryIterator('../client/content/'.$folder);

	foreach ($iterator as $entry) {
		if (!$entry->isDir())
			$contentFolder[] = $entry->getFilename();
	}

	$result = array('content' => $contentFolder);

	echo json_encode($result);
?>