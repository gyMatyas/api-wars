dom = {
    page: 1,

    createPlanetsTable: function (planets) {
        let tableHTML = `<thead>
                            <tr>
                                <th>Name</th>
                                <th>Diameter</th>
                                <th>Climate</th>
                                <th>Terrain</th>
                                <th>Surface Water Percentage</th>
                                <th>Population</th>
                            </tr>
                        </thead>`;
        for (let i = 0; i < planets.length; i++) {
            tableHTML += `<tr>
                            <td>${planets[i].name}</td>
                            <td>${planets[i].diameter}</td>
                            <td>${planets[i].climate}</td>
                            <td>${planets[i].terrain}</td>
                            <td>${planets[i].surface_water}</td>`
            if (planets[i].population !== 'unknown') {
                tableHTML += `<td>${parseInt(planets[i].population).toLocaleString()} people</td>`
            }
            else {
                tableHTML += `<td>${planets[i].population}</td>`
            }
            tableHTML += `</tr>`
        }
        return tableHTML
    },

    getPlanetsAjaxCall: function () {
        $.ajax({
            url: `https://swapi.co/api/planets/?page=${dom.page}`,
            dataType: "json",
            type: "GET"
        }).done(
            function (data) {
                console.log("Ajax length: " + data.results.length);
                $('#planetsTable').html(dom.createPlanetsTable(data.results));
                dom.bindPrevButtonFunction();
                dom.bindNextButtonFunction(data.results.length);
            })
    },

    bindNextButtonFunction: function (length) {
        $('#next').unbind('click');
        console.log("Page: " + dom.page);
        console.log("Function length: " + length)
        if (length === 10) {
            $('#next').removeAttr("disabled");
            $('#next').bind('click', function () {
                dom.page += 1;
                dom.getPlanetsAjaxCall();
            })
        } else { $('#next').attr("disabled", "disabled") };
    },

    bindPrevButtonFunction: function () {
        $('#previous').unbind('click');
        if (dom.page > 1) {
            $('#previous').removeAttr("disabled");
            $('#previous').bind('click', function() {
                dom.page --;
                dom.getPlanetsAjaxCall();
            })
        }
        else { $('#previous').attr("disabled","disabled") };
    }

}