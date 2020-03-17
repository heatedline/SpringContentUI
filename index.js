$(document).ready(function() {
	
	$.ajax({
		type : 'GET',
		async : true,
		url : "http://localhost:8080/springContent/getFiles",
		dataType : 'json',
		contentType : 'application/json',
		success : function(files) {
			$("#idFileList").empty();
			$.each(files, function (index, file) {
				$("#idFileList").append('<tr>' +
								'<td>' + file.name +  '</td>' +
	 							'<td>' + file.contentLength + '</td>' +
	 							'<td>' + file.created + '</td>' +
	 							'<td>' + file.summary + '</td>' +
								'</tr>');
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
			name : f.name,
			summary : $("#summary").val()
		};

		var fileData = JSON.stringify(file);
		console.log(fileData);

		$.ajax({
			type : "POST",
			data : fileData,
			dataType : 'json',
			url : "http://localhost:8080/springContent/saveFile",
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
					url : "http://localhost:8080/springContent/setContent",
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
							url : "http://localhost:8080/springContent/getFiles",
							dataType : 'json',
							contentType : 'application/json',
							success : function(files) {
								$("#idFileList").empty();
								$.each(files, function (index, file) {
									$("#idFileList").append('<tr>' +
											'<td>' + file.name +  '</td>' +
				 							'<td>' + file.contentLength + '</td>' +
				 							'<td>' + file.created + '</td>' +
				 							'<td>' + file.summary + '</td>' +
											'</tr>');
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

});