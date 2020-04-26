$(document).ready(function() {
	function $(id) {
		return document.getElementById(id);
	}

	var uploader = new plupload.Uploader({
		runtimes : 'html5',
		drop_element : 'drop-target',
		browse_button : 'drop-target'
	});

	uploader.bind('Init', function(up, params) {
		if (uploader.features.dragdrop) {
			$('debug').innerHTML = "";
			var target = $('drop-target');

			target.ondragover = function(event) {
				event.dataTransfer.dropEffect = "copy";
			};

			target.ondragenter = function() {
				this.className = "dragover";
			};

			target.ondragleave = function() {
				this.className = "";
			};

			target.ondrop = function() {
				this.className = "";
			};
		}
	});

	uploader.bind('FilesAdded', function(up, files) {
		for (var i in files) {
			//console.log(files[i]);
			var f = files[i];
			var file = {
					name : f.name
			}
			var fileData = JSON.stringify(file);
			console.log(fileData);
			
			saveFile(fileData, f);
		}
	});

	uploader.init();
});

function saveFile(fileData, f) {
	$.ajax({
		type : "POST",
		data : fileData,
		dataType : 'json',
		url : serviceIP + "saveFile",
		contentType : "application/json; charset=utf-8",
		success : function(resp) {
			
			var fd = new FormData();
			fd.append("file", f);
			fd.append("id", resp.id);
			
			var xhr = new XMLHttpRequest();
			 
			xhr.open("POST", serviceIP + "saveDropboxContent", true);
			 
			var boundary = '---------------------------';
			boundary += Math.floor(Math.random()*32768);
			boundary += Math.floor(Math.random()*32768);
			boundary += Math.floor(Math.random()*32768);
			xhr.setRequestHeader("Content-Type", 'multipart/form-data; boundary=' + boundary);
			var body = '';
			body += '--' + boundary + '\r\n' + 'Content-Disposition: form-data; name="';
			body += "data";
			body += '"\r\n\r\n';
			body += JSON.stringify(fd);
			body += '\r\n';
			body += '--' + boundary + '--';
			xhr.onload = function() {
			}
			xhr.send(body);
			
			
			
			
		},
		error : function(error) {
			console.log(error);
		}
	});
}