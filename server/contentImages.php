<?php
	$iterator = new DirectoryIterator('../client/images');

	foreach ($iterator as $entry) {
		if (!$entry->isDir())
			$contentFolder[] = 'client/images/'.$entry->getFilename();
	}

	$result = array('content' => $contentFolder);

	echo json_encode($result);
?>