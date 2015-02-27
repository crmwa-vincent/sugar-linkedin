$(document).ready(function () {
    $("#showConnections").click(function (e) {
        var linkedinId = $(this).attr("linkedinid");
        var accessToken = $(this).attr("accesstoken");
        $.ajax({
            type: "GET",
            dataType: 'jsonp',
            url: "https://api.linkedin.com/v1/people/"+ linkedinId +"/connections",
            data: {
                "oauth2_access_token": accessToken,
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

                if (connections == "") {
                    connections = "No connections.";
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

        $.ajax({
            type: "GET",
            async:false,
            dataType: 'jsonp',
            url: "https://api.linkedin.com/v1/people/tggFBJqHaG/connections",
            data: {
                "oauth2_access_token": "AQVswsDh3-XiISseyYaHbI_GZn_7YsOgGE4W3m6yZvY8z4hF5quc3AhZm2W6tsXfUvNXPLv5PQ9dzPEJFDZxX7hvJbpQDHe48yZI2_gBMt8J3_uWmKlEX2s9coFlFkDY_sNV85rF0KEmWaq3ML8vvRLlmb4IfP9PTFCi7LqGlDBR3CaUxn4",
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