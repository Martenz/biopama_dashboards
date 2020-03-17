
var sel_filters = {
	'wdpaid': null,
	'region': null,
	'iso3':null,
	'pame_year':null,
	'pame_methodology':null,
	'pa_type':null
};

var table_fields = ['wdpaid','region','country_name','iso3','name','desig','pame_year','pame_methodology','pa_type'];
var table_labels = {
	'wdpaid':'WDPAID',
	'region':'Region',
	'country_name':'Country',
	'iso3':'ISO-3 Code',
	'name':'Protected Area',
	'pame_design':'Designation',
	'pame_year':'Year',
	'pame_methodology':'Methodology',
	'pa_type':'Type'
};

var dt_table;


//TODO move into Dependancy with PA module.
var DOPAgetWdpaExtent = "https://rest-services.jrc.ec.europa.eu/services/d6biopamarest/d6biopama/get_wdpa_extent?format=json&wdpa_id=";
var mapPolyHostURL = "https://tiles.biopama.org/BIOPAMA_poly_2";
var mapPaLayer = "WDPA2019MayPoly";

jQuery(document).ready(function($) {
	function createDTables(){
		$('#table_assessments').show();
		dt_table = $('#table_assessments').DataTable({
			"columns" : [
				{ "data" : "wdpaid" },
				{ "data" : "region" },
				{ "data" : "iso3" },
				{ "data" : "country_name" },
				{ "data" : "pa_type" },
				{ "data" : "name" },
				{ "data" : "pame_design" },
				{ "data" : "pame_methodology" },
				{ "data" : "pame_year" }
			],
			dom: 'Bfrtip',
			buttons: [
//				'copy', 'csv', 'excel',
				{
				  extend: 'print',
				  customize: function ( win ) {
					  $(win.document.body)
						  .prepend(
							  '<p>Data Source: Global Database on Protected Area Management Effectiveness (GD-PAME) | <b>https://pame.protectedplanet.net/ </b></p>'
						  );
					  $(win.document.body).find( 'table' )
						  .addClass( 'compact row-border' )
						  .css( 'font-size', 'inherit' );
				  }
				},
				{
					extend: 'pdfHtml5',
					orientation: 'landscape',
					pageSize: 'LEGAL',
					customize: function (doc){
					  doc['header'] = 'Data Source: https://pame.protectedplanet.net/ | Global Database on Protected Area Management Effectiveness (GD-PAME)';
					}
				},
				{
					extend: 'excel',
					text: 'XLSX',
					messageTop: "Data Source: https://pame.protectedplanet.net/ | Global Database on Protected Area Management Effectiveness (GD-PAME)'"
				}
			]
		});
		$('#table_assessments_filter').prepend($('.dt-buttons.btn-group'));
		$('#spinner').hide();
	}

	Drupal.attachBehaviors($("#pame_assessments_table").get(0));
	Drupal.attachBehaviors($(".cql_filters").get(0));

	function pop_filters(data){
		//empty filters
		$.each($('.cql_filters'),function(){
		  $(this).find('option').not(':first').remove();
		});
		var filters={'region':{},'country':{},'year':{},'tool':{}, 'pa_type':{}};

		for (var key in data){
		  filters["region"][ data[key].region ] = true;
		  filters["country"][ data[key].country_name ] = data[key].iso3;
		  filters["year"][ data[key].pame_year ] = true;
		  filters["tool"][ data[key].pame_methodology ] = true;
		  filters["pa_type"][ data[key].pa_type ] = true;
		}

		//Create and append the options
		var selec_tools = document.getElementById("assessment_tools");
		var sortedMethodologies = Object.keys(filters["tool"]).sort();
		//console.log(sortedMethodologies);
		for (const key of sortedMethodologies) {
			var option = document.createElement("option");
			option.value = key;
			option.text = key;
			selec_tools.appendChild(option);
		}
		if (sel_filters.pame_methodology != null) $('#assessment_tools').val(sel_filters.pame_methodology);
		
		var select_year = document.getElementById("assessment_year");
		for (key in filters["year"]) {
			var option = document.createElement("option");
			option.value = key;
			option.text = key;
			select_year.appendChild(option);
		}
		if (sel_filters.pame_year != null) $('#assessment_year').val(sel_filters.pame_year);

		var select_region = document.getElementById("assessment_region");
		var sortedRegions = Object.keys(filters["region"]).sort();
		for (const key of sortedRegions) {
			var option = document.createElement("option");
			option.value = key;
			option.text = key;
			select_region.appendChild(option);
		}
		if (sel_filters.region != null) $('#assessment_region').val(sel_filters.region);

		var select_country = document.getElementById("assessment_country");
		var sortedCountries = Object.keys(filters["country"]).sort();
		for (const key of sortedCountries) {
			var option = document.createElement("option");
			filters["region"]
			option.value = filters["country"][key];
			option.text = key;
			select_country.appendChild(option);
		}
		if (sel_filters.iso3 != null) $('#assessment_country').val(sel_filters.iso3);

		var select_marine = document.getElementById("assessment_pa_type");
		var sortedPAtype = Object.keys(filters["pa_type"]).sort();
		for (const key of sortedPAtype) {
			var option = document.createElement("option");
			option.value = key;
			option.text = key;
			select_marine.appendChild(option);
		}
		if (sel_filters.pa_type != null) $('#assessment_pa_type').val(sel_filters.pa_type);
	}
	
	function generateRestArgs(){
		var cleanArgs = '';
		for (var propName in sel_filters) { 
			if ((sel_filters[propName] != null) || (sel_filters[propName] != undefined)) {
			  cleanArgs += '&' + propName + '=' + sel_filters[propName];
			}
		}		
		return cleanArgs;
	}
	
	function setTableData(){
		$('#spinner').show();
		
		var restArguments = generateRestArgs();
		
		var url = "https://rest-services.jrc.ec.europa.eu/services/d6biopamarest/d6biopama/get_gdpame_biopama?format=json" + restArguments;
		
		$.getJSON(url,function(response){
			var assessmentsByWDPA = ['in', 'WDPAID'];
			var currentCountries = [];
			dt_table.clear().draw();
			dt_table.rows.add(response.records).draw();
			$('#spinner').hide();

			$.each(response.records,function(idx,obj){
				var thisWdpa = parseInt(obj.wdpaid, 10);
				if(assessmentsByWDPA.indexOf(thisWdpa) === -1) assessmentsByWDPA.push(thisWdpa); //collect all wdpa IDs
				if(currentCountries.indexOf(obj.iso3) === -1) currentCountries.push(obj.iso3); //collect all countries to zoom to the group
			});

			mymap.setFilter("wdpaRegionSelected", assessmentsByWDPA);	
			mymap.setLayoutProperty("wdpaRegionSelected", 'visibility', 'visible');	
			url = 'https://rest-services.jrc.ec.europa.eu/services/d6biopamarest/d6biopama/get_bbox_for_countries_dateline_safe?iso3codes='+currentCountries.toString()+'&format=json&includemetadata=false';
			
			$.getJSON(url,function(response){
				mymap.fitBounds(jQuery.parseJSON(response.records[0].get_bbox_for_countries_dateline_safe));
			});

			$('#table_assessments tbody tr').on('click',function(){
				var wdpa = parseInt($(this).find('td:first-child').text());
				zoomToPA(wdpa)

				$('#table_assessments tbody tr').removeClass('selected');
				$(this).addClass('selected');

				mymap.setFilter("wdpaSelected", ['==', 'WDPAID', wdpa]);	
				mymap.setLayoutProperty("wdpaSelected", 'visibility', 'visible');	
				
				mymap.on('click',function(){
					mymap.setLayoutProperty("wdpaSelected", 'visibility', 'none');	
				},200);
				$('html, body').animate({
					scrollTop: $("#pame_assessments_map").offset().top - 100
				}, 1000);
			});

			pop_filters(response.records);
		});
		
	}
	function zoomToPA(wdpaid){
		$.ajax({
		  url: DOPAgetWdpaExtent+wdpaid,
		  dataType: 'json',
		  success: function(d) {
			mymap.fitBounds($.parseJSON(d.records[0].extent), {
				padding: {top: 100, bottom:100, left: 100, right: 100}
			});
		  },
		  error: function() {
			console.log("Something is wrong with the REST servce for PA bounds")
		  }
		});
	}

	mapboxgl.accessToken = 'pk.eyJ1IjoiYmxpc2h0ZW4iLCJhIjoiMEZrNzFqRSJ9.0QBRA2HxTb8YHErUFRMPZg';
	var mymap = new mapboxgl.Map({
		container: 'pame_assessments_map',
		style: 'mapbox://styles/jamesdavy/cjw25laqe0y311dqulwkvnfoc', //Andrews default new RIS v2 style based on North Star
		attributionControl: true,
		renderWorldCopies: true,
		center: [26, -6.66],
        zoom: 2,
		minZoom: 1.4,
		maxZoom: 18
	});
	var mapInteractionControls = ["touchZoomRotate", "doubleClickZoom", "keyboard", "dragPan", "dragRotate", "boxZoom", "scrollZoom"];
	mapInteractionControls.forEach(element => mymap[element].disable());

	$('#pame_assessments_map').append('<div id="help-text">Double-click to pan and zoom the map.</div>');
	$('#help-text').fadeIn();

	var mapInteractionControls = ["touchZoomRotate", "doubleClickZoom", "keyboard", "dragPan", "dragRotate", "boxZoom", "scrollZoom"];
	mymap.on("dblclick",function(){
		$('#help-text').fadeOut();
		mapInteractionControls.forEach(element => mymap[element].enable());
	})

	mymap.on("mouseout",function(){
		$('#help-text').fadeIn();
		mapInteractionControls.forEach(element => mymap[element].disable());
	});


	mymap.on('load', function () {
		
		mymap.addSource("BIOPAMA_Poly", {
			"type": 'vector',
			"tiles": [mapPolyHostURL+"/{z}/{x}/{y}.pbf"],
			"minZoom": 0,
			"maxZoom": 12,
		});
		
		mymap.addLayer({
			"id": "wdpaBase",
			"type": "fill",
			"source": "BIOPAMA_Poly",
			"source-layer": mapPaLayer,
			"minzoom": 1,
            "paint": {
                "fill-color": [
                    "match",
                    ["get", "MARINE"],
                    ["1"],
                    "hsla(173, 21%, 51%, 0.1)",
                    "hsla(87, 47%, 53%, 0.1)"
                ],
            }
		});
		
		mymap.addLayer({
			"id": "wdpaRegionSelected",
			"type": "fill",
			"source": "BIOPAMA_Poly",
			"source-layer": mapPaLayer,
			"minzoom": 1,
			"layout": {"visibility": "none"},
            "paint": {
                "fill-color": [
                    "match",
                    ["get", "MARINE"],
                    ["1"],
                    "hsla(3, 40%, 50%, 0.7)",
                    "hsla(3, 40%, 50%, 0.7)"
                ],
            }
		});
		
		mymap.addLayer({
			"id": "wdpaSelected",
			"type": "line",
			"source": "BIOPAMA_Poly",
			"source-layer": mapPaLayer,
			"layout": {"visibility": "none"},
			"paint": {
				"line-color": "#679b95",
				"line-width": 2,
			},
			"transition": {
			  "duration": 300,
			  "delay": 0
			}
		});
		
		mymap.on('click', getFeatureInfo);
		
		var url_string = new URL( window.location.href );
		for (k in sel_filters){
			if (url_string.searchParams.get(k)){
				sel_filters[k] = url_string.searchParams.get(k);
			}
		}
		createDTables();
		setTableData();
	});
	function getFeatureInfo(e){
		var feature = mymap.queryRenderedFeatures(e.point, {
			layers:["wdpaRegionSelected"],
		});
		if (feature.length !== 0){
			var url = "https://rest-services.jrc.ec.europa.eu/services/d6biopamarest/d6biopama/get_gdpame_biopama?format=json&wdpaid=" + feature[0].properties.WDPAID;
			$.getJSON(url,function(response){
				paPopupContent = '<center class="available"><i class="fas fa-2x fa-paste"></i><p>'+response.records[0].name+' ('+response.records[0].wdpaid+')</p>';
				for (var key in response.records) {
					paPopupContent += '<i>'+response.records[key].pame_methodology+' ('+response.records[key].pame_year+')</i><hr>';
				}
				paPopupContent += '</center>';
				new mapboxgl.Popup()
					.setLngLat(e.lngLat)
					.setHTML(paPopupContent)
					.addTo(mymap);	
			});
		}
	}

	$('.cql_filters').on('change', function() {
		var currentURL = document.location.href;
		var parameter = $(this).attr('param');
		var value = $(this).val();
		console.log(parameter);
		if (value == '%'){
			sel_filters[parameter] = null;
			if(currentURL.includes(parameter)) {
				currentURL = removeURLParameter(currentURL, parameter);
			}
		} else {
			sel_filters[parameter] = value;
			if(currentURL.includes('?')) {
				var currentURL = document.location.href + "&" + parameter + "=" + value;
			}else{
				var currentURL = document.location.href + "?" + parameter + "=" + value;
			}
		}
		history.pushState({}, null, currentURL);
		setTableData();
	});

	$('#reset_filters').on('click',function(){
		var currentURL = document.location.href;
		if(currentURL.includes('?')) {
			currentURL = currentURL.split('?')[0];
			history.pushState({}, null, currentURL);
		}
		var sel_filters = {
			'region':null,
			'iso3':null,
			'pame_year':null,
			'pame_methodology':null,
			'pa_type':null
		};
		setTableData();
	});
	function removeURLParameter(url, parameter) {
		var urlparts= url.split('?');   
		if (urlparts.length>=2) {

			var prefix= encodeURIComponent(parameter)+'=';
			var pars= urlparts[1].split(/[&;]/g);

			for (var i= pars.length; i-- > 0;) {    
				if (pars[i].includes(parameter)) {  
					pars.splice(i, 1);
				}
			}
			url= urlparts[0]+'?'+pars.join('&');
			return url;
		} else {
			return url;
		}
	}
	
});
