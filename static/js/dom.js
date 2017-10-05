dom = {

    page: 1,

    pagePlanets: null,

    createPlanetsTable: function (planets) {
        dom.modalEventHandler();
        let tableHTML = `<thead>
                            <tr>
                                <th>Name</th>
                                <th>Diameter</th>
                                <th>Climate</th>
                                <th>Terrain</th>
                                <th>Surface Water Percentage</th>
                                <th>Population</th>
                                <th>Residents</th>
                            </tr>
                        </thead>`;
        for (let i = 0; i < planets.length; i++) {
            tableHTML += `<tr id="planet-${i}">
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
            if (planets[i].residents.length > 0) {
                tableHTML += `<td class="residentsCol"><button class="btn btn-dark" data-planet="${i}" data-toggle="modal" data-target="#residentsModal">${planets[i].residents.length} residents</button></td>`
            }
            else {
                tableHTML += '<td>No known residents</td>'
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
                dom.pagePlanets = data.results;
                $('#planetsTable').html(dom.createPlanetsTable(dom.pagePlanets));
                dom.buttons.bindPrevButtonFunction();
                dom.buttons.bindNextButtonFunction(dom.pagePlanets.length);
            })
    },

    buttons: {

        bindNextButtonFunction: function (length) {
            $('#next').unbind('click');
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
                $('#previous').bind('click', function () {
                    dom.page--;
                    dom.getPlanetsAjaxCall();
                })
            }
            else { $('#previous').attr("disabled", "disabled") };
        }
    },

    getResidentsForPlanet: function (planetId) {
        $('#modal-body').html(`<table id="modalTable" class=" table table-bordered table-responsive">
                                    <tr>
                                        <th>Name</th>
                                        <th>Height</th>
                                        <th>Mass</th>
                                        <th>Skin color</th>
                                        <th>Hair color</th>
                                        <th>Eye color</th>
                                        <th>Birth year</th>
                                        <th>Gender</th>
                                    </tr>
                                </table>`);
        for (let j = 0; j < dom.pagePlanets[planetId].residents.length; j++) {
            $.getJSON(`${dom.pagePlanets[planetId].residents[j]}`, function (resident) {
                $('#modalTable').append(`<tr>
                                            <td>${resident.name}</td>
                                            <td>${resident.height}</td>
                                            <td>${resident.mass}</td>
                                            <td>${resident.skin_color}</td>
                                            <td>${resident.hair_color}</td>
                                            <td>${resident.eye_color}</td>
                                            <td>${resident.birth_year}</td>
                                            <td>${resident.gender}</td>
                                        </tr>`)
            })
        }
    },

    modalEventHandler: function () {
        $('#residentsModal').off('show.bs.modal');
        $('#residentsModal').on('show.bs.modal', function (event) {
            var button = $(event.relatedTarget);
            console.log(button.data('planet'));
            var planetId = parseInt(button.data('planet'));
            dom.getResidentsForPlanet(planetId)
        });
    }


}