/*
 * Main map js file.
 * This file controls the main map.
 * First action is to create a simple map. 
 * 
 * Global variables: sourceOsm; layerOsm; map
 */
var sourceOsm = new ol.source.OSM();
var layerOsm = new ol.layer.Tile({
  source: sourceOsm
});
var map = new ol.Map({
    layers: [
    	layerOsm
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
function mapAddDataRoutesLayer(geojson){
	// check if sourceShipRoutes exists
	var layer;
	map.getLayers().forEach(l=>{
		if(l.get('id')=='shipRoutesLayer'){
			layer=l;
		}
	});
	console.log(layer);
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
		    layers:[layerShipRoutes]
		  });
		map.addInteraction(select);
		select.on('select', function(e) {
			if(e.selected.length>0){
				console.log(e.selected[0].getGeometry().getExtent());
			}
			else{
				
			}
		  });
	}

}