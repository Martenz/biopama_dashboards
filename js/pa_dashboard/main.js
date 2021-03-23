/* MAIN SCRIPOT TO LOAD CARDS APPLICATIONS */

var data_table;
var re =  new RegExp('_','g');

Number.prototype.round = function(places) {
  return +(Math.round(this + "e+" + places)  + "e-" + places);
}

// remove data from the table completely (or if just hide use the definition below in the datatables options ...)
//var columns_table = ["iso3", "pa_n", "land_area", "population", "prot_terrestrial_area_km2", "prot_marine_area_km2", "perc_prot_terr", "perc_mar_terr"];
//use complete fields, hiding columns after with datatables options
var columns_table = ["country","country_area","pa_n", "land_area", "population", "prot_terrestrial_area_km2", "prot_marine_area_km2", "perc_prot_terr", "perc_mar_terr", "terr_tot", "mar_tot"];

function empty_table(new_id){
  var card = '<div id="'+new_id+'-card" class="card">';
	  card += '<div class="card-header">';
	  card += ' <div class="row">';
	  card += '  <div class="col-sm-12">';
	  card += '   <h1><a class="reg_link" href="/region/'+new_id.replace(' ','_')+'" target="_blank">'+new_id.replace(re,' ').toUpperCase()+'</a> coverage</h1>';
	  card += '  </div>';
	  card += '  </div>';
	  card += ' <div class="row">';
//	  card += '  <div class="col-sm-4" id="'+new_id+'-pie-chart" style="height: 10rem;"></div>';
	  card += '  <div class="col-sm-6" id="'+new_id+'-pie-chart-t" style="height: 10rem;"></div>';
	  card += '  <div class="col-sm-6" id="'+new_id+'-pie-chart-m" style="height: 10rem;"></div>';
	  card += ' </div>';
	  card += '</div>';
	//  card += '<div class="card-body"><i class="fas fa-2x fa-caret-square-up open-table open-table-close"></i>';
	  card += '<div class="card-body">';
	//  card += '<i class="fas fa-2x fa-caret-square-up open-table"></i>';
	  card += '<table id="'+new_id+'" class="table display globalk" style="width:100%"><thead><tr></tr></thead><tbody></tbody><tfoot><tr></tr></tfoot></table>';
	  card +='</div></div>';
  return card;
}

jQuery.fn.dataTable.Api.register( 'sum()', function ( ) {
    return this.flatten().reduce( function ( a, b ) {
        if ( typeof a === 'string' ) {
            a = a.replace(/[^\d.-]/g, '') * 1;
        }
        if ( typeof b === 'string' ) {
            b = b.replace(/[^\d.-]/g, '') * 1;
        }

        return a + b;
    }, 0 );
} );

jQuery(document).ready(function($) {

  var global_protection = {'marine':0,'terrestrial':0,'not_prot':0,'tot_mari':0,'tot_terr':0,'pas':0};
  var last = false;
  
 /// draw piechart for only marine or terrestrial
  
  function draw_apie_chart(idelem,prot=0,unprot=0,labels=['val','bkg'],p_color='#8eb4b1'){
    var dom = document.getElementById(idelem);
    var myChart = echarts.init(dom);

    //...withouth marine
    var perc = ( 100.0* (prot) / (prot + unprot) ).toFixed(1).toString() + ' %';

    $('#'+idelem).prepend('<h1 style="position:absolute;right:0;top:0;color:'+p_color+';">'+perc+'</h1>');
    var app = {};
    option = null;
    app.title = 'Protection Coverage';

    option = {
        color:[
          p_color, //main color
          '#ddd'], // background
        tooltip: {
            show: true,
            trigger: 'item',
            formatter: "{d}%"//"{a} <br/>{b}: {c} ({d}%)"
        },
        legend: {
            show: true,
            orient: 'vertical',
            x: '0%',
            y: '0%',
            data:[
              labels[0],
              labels[1]
            ]
        },
        series: [
            {
                name:'Coverage',
                type:'pie',
                radius: ['20%', '60%'],
                avoidLabelOverlap: true,
                label: {
                    normal: {
                        show: false,
                        position: 'left',
                        textStyle: {
                            fontSize: '15',
                            fontWeight: 'bold'
                        }
                    },
                    emphasis: {
                        show: false,
                        textStyle: {
                            fontSize: '15',
                            fontWeight: 'bold'
                        }
                    }
                },
                labelLine: {
                    normal: {
                        show: true
                    }
                },
                data:[
                    {value:prot, name: labels[0]},
                    {value:unprot, name: labels[1]},
                ]
            }
        ]
    };
    ;
    if (option && typeof option === "object") {
        myChart.setOption(option, true);
    }
  };

///  

  function draw_pie_chart(idelem,prot_m=0,prot_t=0,not_prot=0,label=''){
    var dom = document.getElementById(idelem);
    var myChart = echarts.init(dom);

    //...with Marine... missing the total area of Marine to compute correctly TODO
    //var perc = ( 100.0* (prot_t + prot_m) / (not_prot + prot_t + prot_m ) ).toFixed(1).toString() + ' %';

    //...withouth marine
    var perc = ( 100.0* (prot_t + prot_m ) / (not_prot + prot_t + prot_m ) ).toFixed(1).toString() + ' %';

    $('#'+idelem).prepend('<h1 style="position:absolute;left:0;top:0;color:#70c17e;">'+perc+'</h1>');
    var app = {};
    option = null;
    app.title = 'Protection Coverage';

    option = {
        color:[
          '#8eb4b1',  //marine
          '#8FBF4B', //terrestrial
          '#ddd'], // not protected
        tooltip: {
            show: true,
            trigger: 'item',
            formatter: "{d}%"//"{a} <br/>{b}: {c} ({d}%)"
        },
        legend: {
            show: false,
            orient: 'vertical',
            x: '0%',
            y: '0%',
            data:[
              'Marine Protected',
              'Terrestrial Protected',
              'Not Protected',
            ]
        },
        series: [
            {
                name:'Coverage',
                type:'pie',
                radius: ['20%', '60%'],
                avoidLabelOverlap: true,
                label: {
                    normal: {
                        show: true,
                        position: 'right',
                        textStyle: {
                            fontSize: '15',
                            fontWeight: 'bold'
                        }
                    },
                    emphasis: {
                        show: true,
                        textStyle: {
                            fontSize: '15',
                            fontWeight: 'bold'
                        }
                    }
                },
                labelLine: {
                    normal: {
                        show: true
                    }
                },
                data:[
                    {value:prot_m, name:'Marine Protected'},
                    {value:prot_t, name:'Terrestrial Protected'},
                    {value:not_prot, name:'Not Protected'},
                ]
            }
        ]
    };
    ;
    if (option && typeof option === "object") {
        myChart.setOption(option, true);
    }
  };

  function draw_table(new_id,data,last=false){
      var tab_html = $(empty_table(new_id));
      $('#globalk-tables').append(tab_html);

      setTimeout(function(){
        var headers = Object.keys(data[0]);
		console.log(headers);
        $.each(headers, function(idx,val){
          var re = new RegExp('_','g');
		  var re2 = new RegExp('2','g');
		  
		  //adding only selected columns
		  if (columns_table.indexOf(val) > -1) {
			$('#'+new_id+' thead tr').append('<th>'+val.replace(re,' ').replace(re2,'<sup>2</sup>')+'</th>')
		  }
        });
        $.each(data,function(idx,record){
            var tr ='<tr>';
            $.each(record,function(key,val){
				
				//adding only selected columns
				if (columns_table.indexOf(key) > -1) {
          if(key=="country"){
            if ('iso2'in record){
              tr+='<td><a href="/country/'+record['iso2']+'" target="_blank">'+val+'</a></td>';
            }else{
              tr+='<td>'+val+'</td>';
            }
          }else{
            tr+='<td>'+val+'</td>';
          }
				}
            });
            tr+='</tr>';
            $('#'+new_id+' tbody').append(tr);
        });

      if ( ! $.fn.DataTable.isDataTable( '#'+new_id ) ) {
        $('#'+new_id).DataTable({
          dom: 'Bfrtip',
		  "columnDefs": [
            {
                "targets": [ 6 ],
                "visible": false,
                "searchable": false
            },
            {
                "targets": [ 7 ],
                "visible": false
            }
        ],
          buttons: [
              'print','excel','copy','csv'
          ],
          "paging": false,
          "searching": false,
          drawCallback: function () {
            var api = this.api();
            var region = new_id.replace(re,' ').toUpperCase();
            var n_country = api.rows().count();//Math.round(api.column( 1, {page:'current'} ).data().sum());
			var n_pas = Math.round(api.column( 1, {page:'current'} ).data().sum());
            var land = Math.round(api.column( 2, {page:'current'} ).data().sum());
            var pop = Math.round(api.column( 3, {page:'current'} ).data().sum());
            var prot_t = Math.round(api.column( 4, {page:'current'} ).data().sum());
            var prot_m = Math.round(api.column( 5, {page:'current'} ).data().sum());

            var tot_terr = Math.round(api.column( 6, {page:'current'} ).data().sum());
            var tot_mari = Math.round(api.column( 7, {page:'current'} ).data().sum());


//            var prot_tot = Math.round(api.column( 7, {page:'current'} ).data().sum());
//            var footer = '<td>'+region+'</td><td>'+n_country.toString()+' countries</td><td>-</td><td>'+pop.toString();
            var footer = '<td>'+n_country.toString()+' countries</td>';
			footer += '<td>'+n_pas.toString()+' PA</td>';
            footer += '<td>'+land.toString()+'</td>';
			footer += '<td>'+pop.toString()+'</td>';
            footer += '<td>'+prot_m.toString()+' km<sup>2</sup></td>';
            footer += '<td>'+prot_t.toString()+' km<sup>2</sup></td>';
//            footer += '<td>'+tot_terr.toString()+' km2</td>';
//            footer += '<td>'+tot_mari.toString()+' km2</td>';
            footer += '<td>'+(prot_t / tot_terr *100.).round(1).toString()+' %</td>';
            footer += '<td>'+(prot_m / tot_mari *100.).round(1).toString()+' %</td>';
            $( api.table().footer() ).html(footer);

            //draw pie chart based on totals computed
//            draw_pie_chart(new_id+'-pie-chart',prot_m,prot_t, land - (prot_t + prot_m));
            draw_apie_chart(new_id+'-pie-chart-t',prot_t, tot_terr - (prot_t),labels=['Terrestrial','Not Protected'],p_color='#90c14f');
            draw_apie_chart(new_id+'-pie-chart-m',prot_m, tot_mari - (prot_m),labels=['Marine','Not Protected'],p_color='#8eb4b1');


//            global_protection['marine']+= land;
//            global_protection['land']+= land;
//            global_protection['prot']+= prot_t;
            global_protection['marine']+= prot_m;
            global_protection['terrestrial']+= prot_t;
            global_protection['tot_mari']+= tot_mari;
            global_protection['tot_terr']+= tot_terr;
            global_protection['not_prot']+= land - (prot_t + prot_m);
            global_protection['pas']+= n_pas;

            if (last){
              setTimeout(function(){
                console.log(global_protection);
                
//				draw_pie_chart('ACP-pie-chart',global_protection["marine"],global_protection["prot"],global_protection["land"] - global_protection["prot"]);
//				draw_pie_chart('ACP-pie-chart',global_protection["marine"],global_protection["terrestrial"], global_protection["not_prot"]);

				draw_apie_chart('ACP-pie-chart-t',global_protection["terrestrial"], global_protection["tot_terr"] - global_protection["terrestrial"],labels=['Terrestrial','Not Protected'],p_color='#90c14f');
				draw_apie_chart('ACP-pie-chart-m',global_protection["marine"], global_protection["tot_mari"] - global_protection["marine"],labels=['Marine','Not Protected'],p_color='#8eb4b1');

				
                var global_prot_terr = Math.round((parseInt(global_protection["terrestrial"])/1000)).toLocaleString();
                var global_prot_mari = Math.round((parseInt(global_protection["marine"])/1000)).toLocaleString();
                var global_prot_pas_coverage = Math.round((parseInt(global_protection["marine"] + global_protection["terrestrial"])/1000)).toLocaleString();
                var global_prot_pas = parseInt(global_protection["pas"]).toLocaleString();
                
                var table_html = $("<table class='table table-sm table-hover pas_recap_table' id='pas_recap'></table>");            
                table_html.append('<tr class="pas_theader"><td>PAs</td><td>n<sup>o</sup></td><td>Coverage (1000 x km<sup>2</sup>)</td></tr>')
                table_html.append('<tr><td></td><td>'+global_prot_pas+'</td><td>'+global_prot_pas_coverage+'</td></tr>');
                table_html.append('<tr><td></td><td></td><td>'+global_prot_terr+' (Terrestrial)</td></tr>');
                table_html.append('<tr><td></td><td></td><td>'+global_prot_mari+' (Marine)</td></tr>');
                //$('#ACP-card .col-sm-7').append(table_html);

                var text_html = $('<div class="pas_summary_text"></div>');
                text_html.append('<p><b>'+global_prot_pas+'</b> Protected Areas <br><b>'+global_prot_pas_coverage+' </b><small>[1000 km<sup>2</sup>]</small></p>');
                text_html.append('<p>Terrestial <b>'+global_prot_terr+'</b> <small>[1000 km<sup>2</sup>]</small><br>Marine  <b>'+global_prot_mari+'</b> <small>[1000 km<sup>2</sup>]</small></p>');
                $('#ACP-card .col-sm-7').prepend(text_html);

              },200);
            }
          }
      });
     };
   },200);

	  //hide body table 
      //$('#'+new_id+'-card .card-body tbody').hide();

      $('#'+new_id+'-card .card-body .open-table').on('click',function(){
        $('#'+new_id+'-card .card-body tbody').slideToggle();
        $(this).toggleClass('open-table-close');
      });
  }

  Drupal.attachBehaviors($("#globalk-tables"));
  Drupal.attachBehaviors($("#data-sources"));

 var sources = [
   {"source":"The World Bank",
   "url":"https://data.worldbank.org/indicator/ag.lnd.totl.k2",
   "data":"[2018] Land area (sq. km)",
   "icon":"https://data.worldbank.org/assets/images/logo-wb-header-en.svg"
 },
 {"source":"The World Bank",
 "url":"https://data.worldbank.org/indicator/SP.POP.TOTL?view=chart",
 "data":"[2018] Population, total",
 "icon":"https://data.worldbank.org/assets/images/logo-wb-header-en.svg"
},
{"source":"Dopa-services",
"url":"https://rest-services.jrc.ec.europa.eu/services/d6dopa40/administrative_units/get_country_all_inds",
"data":"ACP Protected Area Marine/Terrestrial (sq. km)",
"icon":"https://dopa-explorer.jrc.ec.europa.eu/sites/default/files/dopa_logo_wo3.png"
},
{"source":"Protected Planet ®",
"url":"https://www.protectedplanet.net",
"data":"Protected Areas",
"icon":"/modules/custom/biopama_dashboards/images/protected-planet-logo.png",
"icon_style":""
},
];

var regions = {};

 var rest_url = "https://rest-services.jrc.ec.europa.eu/services/d6biopamarest/d6biopama/get_tmp_acp_pa_stat?format=json";
 var data_tables= $.getJSON( rest_url ,function(data){
   //console.log(data.records);
   $.each(data.records,function(idx,obj){
     regions[obj['region']] = [];
   });
   $.each(data.records,function(idx,obj){
     regions[obj['region']].push(obj);
   });
   var ri=0;
   var last_r = 6;
   $.each(regions,function(key, val){
     ri+=1;
     if (ri == last_r){
//       alert('duccio');
       draw_table(key.toLowerCase().replace(' ','_'),val,last=true);
     }else{
       draw_table(key.toLowerCase().replace(' ','_'),val);
     }
     //console.log(val);
   });
 })

 $.each(sources,function(idx,obj){
   $('#data-sources').append('\
   <div class="card">\
    <div class="card-body">\
     <div class="row">\
      <div class="col-sm-2" style="'+obj['icon_style']+'"><img src="' + obj['icon'] + '" width="100%"></div>\
      <div class="col-sm-10"><span style="color:#8eb4b1;">'+obj['data']+' Source: </span><a href="'+obj['url']+'"><div class="btn btn-light">' +obj['source']+ '</div></a></div>\
     </div>\
    </div>\
   </div>');

 });

});
