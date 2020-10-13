$(document).ready(function() {
	
	$("#videoModal").draggable({
	      handle: ".modal-header"
	});

	$('#videoModal').on('shown.bs.modal', function () {
	  $('#video1')[0].play();
	});

	$('#videoModal').on('hidden.bs.modal', function () {
	  $('#video1')[0].pause();
	});
	
	$.ajax({
		type : 'GET',
		async : true,
		url : serviceIP + "getFiles",
		dataType : 'json',
		contentType : 'application/json',
		success : function(files) {
			$("#idFileList").empty();
			$.each(files, function (index, file) {
				var type;
				if(file.mimeType == "audio/mp3" || file.mimeType == "audio/mpeg") {
					type = "audio/mpeg";
					$("#idFileList").append('<tr>' +
							'<td>' + file.name +  '</td>' +
 							'<td>' + file.contentLength + '</td>' +
 							'<td>' + file.created + '</td>' +
 							'<td> <audio controls><source src=' + serviceIP + 'audioVideoFiles/' + file.id + ' type=' + type + '></audio> </td>' +
							'</tr>');
				} else if(file.mimeType == "video/mp4"){
					$("#idFileList").append('<tr>' +
							'<td>' + file.name +  '</td>' +
 							'<td>' + file.contentLength + '</td>' +
 							'<td>' + file.created + '</td>' +
 							'<td> <a onclick="playVideo('+ file.id + ')" class="anchorButton" data-toggle="modal" data-target="#videoModal">&#9658;</a> </td>' +
							'</tr>');
				} else {
					$("#idFileList").append('<tr>' +
							'<td>' + file.name +  '</td>' +
 							'<td>' + file.contentLength + '</td>' +
 							'<td>' + file.created + '</td>' +
 							'<td> <button type="button" class="btn btn-primary" onclick="openDocModal(' + file.id + ')" data-toggle="modal" data-target="#docModal">Open</button> </td>' +
							'</tr>');
				}
			});
			
			$("audio").on("play", function() {
		        $("audio").not(this).each(function(index, audio) {
		            audio.pause();
		        });
		    });
		},
		error : function(error) {
			console.log(error);
		}
	});
	
	$('#customFile').change(function() {
		var i = $(this).prev('label').clone();
		var file = $('#customFile')[0].files[0].name;
		$(this).prev('label').text(file);
	});
	
	$("#idSubmit").off().on('click', function() {

		var f = $('input[type=file]')[0].files[0];
		var file = {
			name : f.name
		};

		var fileData = JSON.stringify(file);
		console.log(fileData);

		$.ajax({
			type : "POST",
			data : fileData,
			dataType : 'json',
			url : serviceIP + "saveFile",
			contentType : "application/json; charset=utf-8",
			success : function(resp) {
				console.log(resp);
				var form = $("#idFileUploadForm")[0];
				var fd = new FormData(form);
				fd.append("id", resp.id);
				console.log(fd);
				$.ajax({
					type : "POST",
					enctype : 'multipart/form-data',
					url : serviceIP + "setContent",
					data : fd,
					processData : false, // prevent jQuery from automatically
					// transforming the data into a query string
					contentType : false,
					cache : false,
					success : function(data) {
						console.log(data);
						$.ajax({
							type : 'GET',
							async : true,
							url : serviceIP + "getFiles",
							dataType : 'json',
							contentType : 'application/json',
							success : function(files) {
								$("#idFileList").empty();
								$.each(files, function (index, file) {
									var type;
									if(file.mimeType == "audio/mp3" || file.mimeType == "audio/mpeg") {
										type = "audio/mpeg";
										$("#idFileList").append('<tr>' +
												'<td>' + file.name +  '</td>' +
					 							'<td>' + file.contentLength + '</td>' +
					 							'<td>' + file.created + '</td>' +
					 							'<td> <audio controls><source src=' + serviceIP + 'audioVideoFiles/' + file.id + ' type=' + type + '></audio> </td>' +
												'</tr>');
									} else if(file.mimeType == "video/mp4"){
										$("#idFileList").append('<tr>' +
												'<td>' + file.name +  '</td>' +
					 							'<td>' + file.contentLength + '</td>' +
					 							'<td>' + file.created + '</td>' +
					 							'<td> <a onclick="playVideo('+ file.id + ')" class="anchorButton" data-toggle="modal" data-target="#videoModal">&#9658;</a> </td>' +
												'</tr>');
									} else {
										$("#idFileList").append('<tr>' +
												'<td>' + file.name +  '</td>' +
					 							'<td>' + file.contentLength + '</td>' +
					 							'<td>' + file.created + '</td>' +
					 							'<td> <button type="button" class="btn btn-primary" onclick="openDocModal(' + file.id + ')" data-toggle="modal" data-target="#docModal">Open</button> </td>' +
												'</tr>');
									}
								});
								
								$("audio").on("play", function() {
							        $("audio").not(this).each(function(index, audio) {
							            audio.pause();
							        });
							    });
							},
							error : function(error) {
								console.log(error);
							}
						});
					},
					error : function(error) {
						console.log(error);
					}
				});
			},
			error : function(error) {
				console.log(error);
			}
		});

	});
	

	$('#idSearchField').keypress(function(event){
		var keycode = (event.keyCode ? event.keyCode : event.which);
		if(keycode == '13'){
			if($(this).val() != "") {
				$.ajax({
					type : 'GET',
					async : true,
					url : serviceIP + "search?searchTerm=" + $(this).val(),
					dataType : 'json',
					contentType : 'application/json',
					success : function(files) {
						$("#idFileList").empty();
						$.each(files, function (index, file) {
							var type;
							if(file.mimeType == "audio/mp3") {
								type = "audio/mpeg";
								$("#idFileList").append('<tr>' +
										'<td>' + file.name +  '</td>' +
			 							'<td>' + file.contentLength + '</td>' +
			 							'<td>' + file.created + '</td>' +
			 							'<td> <audio controls><source src=' + serviceIP + 'audioVideoFiles/' + file.id + ' type=' + type + '></audio> </td>' +
										'</tr>');
							} else if(file.mimeType == "video/mp4"){
								$("#idFileList").append('<tr>' +
										'<td>' + file.name +  '</td>' +
			 							'<td>' + file.contentLength + '</td>' +
			 							'<td>' + file.created + '</td>' +
			 							'<td> <a onclick="playVideo('+ file.id + ')" class="anchorButton" data-toggle="modal" data-target="#videoModal">&#9658;</a> </td>' +
										'</tr>');
							} else {
								$("#idFileList").append('<tr>' +
										'<td>' + file.name +  '</td>' +
			 							'<td>' + file.contentLength + '</td>' +
			 							'<td>' + file.created + '</td>' +
			 							'<td> NA </td>' +
										'</tr>');
							}
						});
						
						$("audio").on("play", function() {
					        $("audio").not(this).each(function(index, audio) {
					            audio.pause();
					        });
					    });
					},
					error : function(error) {
						console.log(error);
					}
				});
			} else {
				alert("Search parameter cannot be empty!");
			}
		}
		event.stopPropagation();
	});
	
	
});

function traverseFileTree(item, path) {
	  path = path || "";
	  if (item.isFile) {
	    // Get file
	    item.file(function(file) {
	      console.log("File:", path + file.name);
	    });
	  } else if (item.isDirectory) {
	    // Get folder contents
	    var dirReader = item.createReader();
	    dirReader.readEntries(function(entries) {
	      for (var i=0; i<entries.length; i++) {
	        traverseFileTree(entries[i], path + item.name + "/");
	      }
	    });
	  }
	}

function searchToggle(obj, evt){
    var container = $(obj).closest('.search-wrapper');
    if(!container.hasClass('active')){
        container.addClass('active');
        evt.preventDefault();
    } else if(container.hasClass('active') && $(obj).closest('.input-holder').length == 0){
        container.removeClass('active');
        // clear input
        container.find('.search-input').val('');
    }
}

function playVideo(id) {
	$("#idVideoModalBody").html('');
	$('<video controls id="video1" style="width: 100%; height: auto; margin: 0 auto; frameborder: 0;"> ' +
			'<source src=' + serviceIP + 'audioVideoFiles/' + id + ' type="video/mp4"> ' +
	  '</video>').appendTo("#idVideoModalBody");
}

function openDocModal(id) {
	$("#idDocModalBody").html('');
	PDFObject.embed(serviceIP + "documentFiles/" + id, "#idDocModalBody");
}