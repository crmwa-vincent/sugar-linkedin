$(document).ready(function () {
    $("#showConnections").click(function (e) {
        var access_code = $("#authCode").val();
        if(!access_code){
            var params = {
                "response_type": "code",
                "client_id": "757irf9rbxfacq",
                "redirect_uri": "http://sugar-linkedin.dev/index.php?entryPoint=linkedInCallback",
                "state": "test"
            };

            var url = "https://www.linkedin.com/uas/oauth2/authorization" + "?" + $.param(params);
            return window.open(url, "popupWindow", "width=600,height=600,scrollbars=yes,resizable=0");
        }
        $.ajax({
            type: "GET",
            dataType: 'jsonp',
            url: "https://api.linkedin.com/v1/people/~/connections",
            data: {
                "oauth2_access_token": access_code,
                "format": "jsonp",
                "start": 0,
                "count": 10
            },
            success: function (e) {
                var connections = "";

                if (e.hasOwnProperty("values")) {
                    if (e.values.length > 0) {
                        connections = "<table id='linkedinConsTable'>";
                        $.each(e.values, function (index, value) {
                            connections += "<tr>";
                            connections += "<td>" + "<img src=" + value.pictureUrl + "></img><td>";
                            connections += "<td>" + value.firstName + " " + value.lastName + "<br/>" + value.headline + "<td>";
                            connections += "</tr>";
                        });
                        connections += "</table><a start=" + e._count + " page=1 " + " count=10 id='showMoreConnections' href='#'>Show more connections</a>";
                    }
                }

                var linkedin = $("#linkedinData");
                linkedin.html(connections);
                linkedin.dialog({
                    minHeight: 0,
                    create: function () {
                        $(this).css("maxHeight", 400);
                    }
                });
            }
        });
    })

    $(document).on('click', "a#showMoreConnections", function (event) {
        var page = parseInt($(this).attr("page"));
        var start = parseInt($(this).attr("start"));
        var access_code = $("#authCode").val();

        $.ajax({
            type: "GET",
            async:false,
            dataType: 'jsonp',
            url: "https://api.linkedin.com/v1/people/~/connections",
            data: {
                "oauth2_access_token": access_code,
                "format": "jsonp",
                "start": start,
                "count": 10
            },
            success: function (e) {
                var connections = "";
                var showMoreConnections = $("#showMoreConnections");
                if (e.hasOwnProperty("values")) {
                    if (e.values.length > 0) {
                        $.each(e.values, function (index, value) {
                            connections += "<tr>";
                            connections += "<td>" + "<img src=" + value.pictureUrl + "></img><td>";
                            connections += "<td>" + value.firstName + " " + value.lastName + "<br/>" + value.headline + "<td>";
                            connections += "</tr>";
                        });
                        $('#linkedinConsTable tr:last').after(connections);
                        showMoreConnections.attr({
                            "start": e._start + 10,
                            "page": parseInt(page) + 1
                        });
                    }
                } else {
                    showMoreConnections.css("display", "none");
                }
            }
        });
    });

});