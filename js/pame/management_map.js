
var sel_filters = {
	'wdpaid': null,
	'region': null,
	'iso3':null,
	'pame_year':null,
	'pame_methodology':null,
	'pa_type':null
};

const null_filters = {
	'title': null,
	'year' : null,
	'country' : null,
	'region' : null
}

var filters_sel = null_filters;

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

var pa_docs = {};


//TODO move into Dependancy with PA module.
var DOPAgetWdpaExtent = "https://rest-services.jrc.ec.europa.eu/services/d6biopamarest/d6biopama/get_wdpa_extent?format=json&wdpa_id=";
var mapPolyHostURL = "https://tiles.biopama.org/BIOPAMA_poly_2";
var mapPaLayer = "WDPA2019MayPoly";

jQuery(document).ready(function($) {
	
	Drupal.attachBehaviors($(".view-pame-management").get(0));

	
	function addwdpas(parameters = ''){
		$('#spinner').show();
		
		var url = "/rest/pame/management_plans?format=json" + parameters;		
		
 		$.getJSON(url,function(response){
			var assessmentsByWDPA = ['in', 'WDPAID'];
			var currentCountries = [];

			$.each(response,function(idx,obj){
				var thisWdpa = parseInt(obj.wdpa_id, 10);
				//console.log(thisWdpa);
				if(assessmentsByWDPA.indexOf(thisWdpa) === -1) assessmentsByWDPA.push(thisWdpa); //collect all wdpa IDs
				if(currentCountries.indexOf(obj.iso3) === -1) currentCountries.push(obj.iso3); //collect all countries to zoom to the group
			});

			mymap.setFilter("wdpaRegionSelected", assessmentsByWDPA);	
			mymap.setLayoutProperty("wdpaRegionSelected", 'visibility', 'visible');	
			url = 'https://rest-services.jrc.ec.europa.eu/services/d6biopamarest/d6biopama/get_bbox_for_countries_dateline_safe?iso3codes='+currentCountries.toString()+'&format=json&includemetadata=false';
			
			$.getJSON(url,function(response){
				mymap.fitBounds(jQuery.parseJSON(response.records[0].get_bbox_for_countries_dateline_safe));
			});

			$('#spinner').hide();

		});
 
	    $('#spinner').hide();

 
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

		addwdpas();
	});
	function getFeatureInfo(e){
	/*	var feature = mymap.queryRenderedFeatures(e.point, {
			layers:["wdpaRegionSelected"],
		});
		if (feature.length !== 0){

			paPopupContent = '<center class="available"><i class="fas fa-2x fa-paste"></i>';
			
			for (var key in feature) {

				feature_wdpaid = feature[key].properties.WDPAID;
					paPopupContent += '<p>'+pa_docs[feature_wdpaid].title+' <code>'+pa_docs[feature_wdpaid].wdpaid+'</code> - ';
					paPopupContent += pa_docs[feature_wdpaid].year + '</p>';
				}
				paPopupContent += '</center>';
			
			new mapboxgl.Popup()
					.setLngLat(e.lngLat)
					.setHTML(paPopupContent)
					.addTo(mymap);	
			
		}*/

		var feature = mymap.queryRenderedFeatures(e.point, {
			layers:["wdpaRegionSelected"],
		});
		if (feature.length !== 0){
			var url = "/rest/pame/management_plans?format=json&wdpaid=" + feature[0].properties.WDPAID;
			var paPopupContent = '';
			$.getJSON(url,function(response){
				paPopupContent = '<center class="available"><i class="fas fa-2x fa-paste"></i><p>'+response[0].title+' ('+response[0].wdpa_id+')</p>';
				response.forEach(buildDocList);
				
				function buildDocList(item, index) {
					paPopupContent += '<i>'+response[index].publication_year+' ('+response[index].field_docuement+')</i><hr>';
				};
/* 				for (var key in response) {
					paPopupContent += '<i>'+response[0].publication_year+' ('+response[0].field_docuement+')</i><hr>';
				} */
				paPopupContent += '</center>';
				new mapboxgl.Popup()
					.setLngLat(e.lngLat)
					.setHTML(paPopupContent)
					.addTo(mymap);	
			});
		}



	}

	Drupal.behaviors.pamewdpazoom = {
		attach: function (context, settings) {

		$('.pame-wdpaid').once('updated-view').on('click',function(){
			var wdpaid = $(this).html();
			zoomToPA(wdpaid);
		})
				
	}};

    function filter_map_onfilters(elem){
			parameters = '';

			var filter_name = $(elem).attr('name');
			var filter_val = $(elem).val();

			filters_sel [filter_name] = filter_val;

			//region, country, year , title
			for (fkey in filters_sel){
				if (filters_sel[fkey] != null){
					parameters += '&' + fkey + '=' + filters_sel[fkey];
				}
			}
			
			addwdpas(parameters);

	}

	
	$('#pame_managements_filters select').on('change',function(){
			filter_map_onfilters($(this));
	})

	$('#pame_managements_filters input').on('input',function(){
			filter_map_onfilters($(this));
	})

	$('#edit-reset').attr('type','button');
	$('#edit-reset').html('Reset');
	$('#edit-reset').on('click',function(){
		parameters = ''
		$('#pame_managements_filters input[type="text"]').val('');
		$('#pame_managements_filters select').val('All');
		addwdpas(parameters);
		filters_sel = null_filters;
		$('#pame_managements_filters select').change();
	});

	
});
