/*
 * Main map js file.
 * This file controls the main map.
 * First action is to create a simple map. 
 * 
 * Global variables: sourceOsm; layerOsm; map
 */

/*
 * Main map
 */
var sourceOsm = new ol.source.OSM();
var layerOsm = new ol.layer.Tile({
  source: sourceOsm
});
var sourceCountries = new ol.source.Vector({
    url: 'https://openlayers.org/en/v4.6.5/examples/data/geojson/countries.geojson',
    format: new ol.format.GeoJSON()
});
var countries = new ol.layer.Vector({
    source: sourceCountries
});
var map = new ol.Map({
    layers: [
    	layerOsm,
    	countries
    ],
    target: 'map',
    controls: ol.control.defaults({
        attributionOptions: {
            collapsible: false
        }
    }),
    view: new ol.View({
        center: [0, 0],
        zoom: 0.7
    })
});

/*
 * Route map
 */
var routeDetailsMap = new ol.Map({
    layers: [
    	layerOsm
    ],
    target: 'routeMinimap',
    controls: ol.control.defaults({
        attributionOptions: {
            collapsible: false
        }
    }),
    view: new ol.View({
        center: [0, 0],
        zoom: 0.7
    })
});

var geojsonFormat = new ol.format.GeoJSON();
var sourceShipRoute = new ol.source.Vector({
	format: new ol.format.GeoJSON(),
    id:'shipRouteSource'
});
var layerShipRoute = new ol.layer.Vector({
    source: sourceShipRoute,
    id:'shipRouteLayer',
});
routeDetailsMap.addLayer(layerShipRoute);

/*
 * Update ROUTES MAP with selected feature
 */
function updateRouteMap(feature){
	var layer;
	routeDetailsMap.getLayers().forEach(l=>{
		if(l.get('id')=='shipRouteLayer'){
			layer=l;
		}
	});
	if(typeof(layer)!='undefined'){
		if(typeof(feature)!='undefined'){
			console.log('add feature');
			layer.getSource().clear(); // First clear all vectors
			layer.getSource().addFeature(feature);
			routeDetailsMap.getView().fit(feature.getGeometry().getExtent());
			document.getElementById('detailedRouteWarning').setAttribute('visible','false');
			document.getElementById('detailedShipWarning').setAttribute('visible','false');
			document.getElementById('detailedShipInfo').setAttribute('visible','true');
			document.getElementById('detailsSeparator').setAttribute('visible','true');
			document.getElementById('detailedCrewInfo').setAttribute('visible','true');
		}else{
			// If the selected layer is nothing then we just clean the map
			layer.getSource().clear();
			document.getElementById('detailedRouteWarning').setAttribute('visible','true');
			document.getElementById('detailedShipWarning').setAttribute('visible','true');
			document.getElementById('detailedShipInfo').setAttribute('visible','false');
			document.getElementById('detailsSeparator').setAttribute('visible','false');
			document.getElementById('detailedCrewInfo').setAttribute('visible','false');
			routeDetailsMap.getView().setCenter([0,0]);
			routeDetailsMap.getView().setZoom(0.7);
		}

	}
}

/*
 * Clean MAIN MAP routes
 */

function mapClearRoutesLayer(geojson){
	// check if sourceShipRoutes exists
	var layer;
	map.getLayers().forEach(l=>{
		if(l.get('id')=='shipRoutesLayer'){
			layer=l;
		}
	});
// if we have elements then clear all features
	if(typeof(layer)!='undefined'){
		layer.getSource().clear();		
	}
}

/*
 * Add routes to main map
 */
function mapAddDataRoutesLayer(geojson){
	// check if sourceShipRoutes exists
	var layer;
	map.getLayers().forEach(l=>{
		if(l.get('id')=='shipRoutesLayer'){
			layer=l;
		}
	});
// if we have elements then clear all features and add the new ones
	if(typeof(layer)!='undefined'){
		console.log('clean features')
		layer.getSource().clear();
		layer.getSource().addFeatures((new ol.format.GeoJSON()).readFeatures(geojson,{
			dataProjection:'EPSG:4326',
	        featureProjection: 'EPSG:3857'
	    }));
		
	}else{
		var geojsonFormat = new ol.format.GeoJSON();
		var sourceShipRoutes = new ol.source.Vector({
			features: geojsonFormat.readFeatures(geojson,{
				dataProjection:'EPSG:4326',
		        featureProjection: 'EPSG:3857'
		    }),
			format: new ol.format.GeoJSON(),
		    id:'shipRoutesSource'
		});
		var layerShipRoutes = new ol.layer.Vector({
		    source: sourceShipRoutes,
		    id:'shipRoutesLayer',
		});
		map.addLayer(layerShipRoutes);
	////Create one interaction
		var select = new ol.interaction.Select({
		    condition: ol.events.condition.click, //Click interaction
		    layers:[layerShipRoutes,countries]
		    //hitTolerance:20
		  });
		map.addInteraction(select);
		select.on('select', function(e) {
			if(e.selected.length>0){
				console.log(e.selected[0]);
//				console.log(e.selected[0].getGeometry().getExtent());
				//Update minimap
				if(typeof(e.selected[0].getProperties().jb_country)!="undefined"){
					updateRouteMap(e.selected[0]);
					getShipDetails(e.selected[0].getId());
				}else{
					console.log('Selected feature is not a route.');
				}

			}
			else{
				console.log('nothing selected.');
				updateRouteMap();
			}
		  });
	}

}