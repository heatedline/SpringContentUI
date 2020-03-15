$(document).ready(function() {

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
			data: fileData,
            dataType: 'json',
			url : "http://localhost:8080/springContent/saveFile",
			contentType: "application/json; charset=utf-8",
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
					},
					error : function(jqXHR, exception) {
						console.log("error");
					}
				});
			},
			error : function(jqXHR, exception) {
				console.log("error");
			}
		});

	});

});