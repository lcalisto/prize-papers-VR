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
    style: function(a){
    	return new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: 'blue',
                width: 2
              })
        })
    } 
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
		    style: function(a){
		    	return new ol.style.Style({
		            stroke: new ol.style.Stroke({
		                color: 'brown',
		                width: 2
		              })
		        })
		    } 
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
/*
 * Transform main map into inverted globe
 */
function toInvertedGlobe(toCamera){
	//destroy the info panel
	if(document.getElementById("infoPanelCheck") != null){
		document.getElementById("infoPanelCheck").parentEl.removeChild(document.getElementById("infoPanelCheck"));
	}
	//destroy globe icon and create a new one
	if(document.getElementById('ctlGlobeIcon') != null){
		var parent=document.getElementById("ctlGlobeIcon").parentEl;
		document.getElementById("ctlGlobeIcon").parentEl.removeChild(document.getElementById("ctlGlobeIcon"));
		var mapIcon=document.createElement("a-gui-icon-button");
		mapIcon.setAttribute('width','0.55');
		mapIcon.setAttribute('height','0.55');
		mapIcon.setAttribute('id','ctlMapIcon');
		mapIcon.setAttribute('onclick','createPlanePanelCheck()');
		mapIcon.setAttribute('icon','android-map');
		mapIcon.setAttribute('position','-0.57 0 0');
		parent.appendChild(mapIcon);
	}
	console.log('to inverted globe');
	//hide the check panel
	var mainMap=document.getElementById('mainMap');
	//mainMap.setAttribute('visible',"false");
	mainMap.setAttribute('geometry',"primitive:sphere;thetaStart:0;thetaLength:180;radius:40;");
	mainMap.setAttribute('height',"4");
	mainMap.setAttribute('width',"4");
	mainMap.setAttribute('ol',"pixToVRRatio:200");
	mainMap.setAttribute('rotation',"0 -120 0");
	map.getView().setZoom(2);
	document.getElementById('imageground').setAttribute('visible',"false");
	//if true we attach all planes into camera position.
	if(toCamera){
		document.getElementById('camera').appendChild(document.getElementById('leftMainContainer'));
		document.getElementById('leftMainContainer').setAttribute('position',"0 0 -1");
		document.getElementById('camera').appendChild(document.getElementById('detailedRouteWarning'));
		document.getElementById('detailedRouteWarning').setAttribute('position',"2.3 0.57 -2.6");
		document.getElementById('camera').appendChild(document.getElementById('rightMainContainer'));
		document.getElementById('rightMainContainer').setAttribute('position',"0 0 -1");
		//document.getElementById('camera').appendChild(document.getElementById('loadingCtlPanel'));
		//document.getElementById('loadingCtlPanel').setAttribute('position',"0 0 -1");
	}
}

/*
 * Transform main map into inverted globe
 */
function toPanelBased(){
	//destroy the info panel
	if(document.getElementById("infoPanelCheck") != null){
		document.getElementById("infoPanelCheck").parentEl.removeChild(document.getElementById("infoPanelCheck"));
	}
	//destroy globe icon and create a new one
	if(document.getElementById('ctlMapIcon') != null){
		var parent=document.getElementById("ctlMapIcon").parentEl;
		document.getElementById("ctlMapIcon").parentEl.removeChild(document.getElementById("ctlMapIcon"));
		var mapIcon=document.createElement("a-gui-icon-button");
		mapIcon.setAttribute('width','0.55');
		mapIcon.setAttribute('height','0.55');
		mapIcon.setAttribute('id','ctlGlobeIcon');
		mapIcon.setAttribute('onclick','createInvertedPanelCheck()');
		mapIcon.setAttribute('icon','android-globe');
		mapIcon.setAttribute('position','-0.57 0 0');
		parent.appendChild(mapIcon);
	}
	console.log('back to planes');
	var mainMap=document.getElementById('mainMap');
	//mainMap.setAttribute('visible',"false");
	mainMap.setAttribute('geometry',"primitive: cylinder; openEnded: true; thetaStart:140; thetaLength: 80;radius:3; height:2;");
	mainMap.setAttribute('height',"2");
	mainMap.setAttribute('width',"4.188790205");
	mainMap.setAttribute('ol',"pixToVRRatio:150");
	mainMap.setAttribute('rotation',"0 0 0");
	map.getView().setZoom(0.7);
	document.getElementById('imageground').setAttribute('visible',"true");
	//Reposition the elements in their initial position
	document.getElementById('mainScene').appendChild(document.getElementById('leftMainContainer'));
	document.getElementById('leftMainContainer').setAttribute('position',"0 1.7 0");
	document.getElementById('mainScene').appendChild(document.getElementById('detailedRouteWarning'));
	document.getElementById('detailedRouteWarning').setAttribute('position',"2.3 2.2 -1.6");
	document.getElementById('mainScene').appendChild(document.getElementById('rightMainContainer'));
	document.getElementById('rightMainContainer').setAttribute('position',"0 1.7 0");
	//document.getElementById('camera').appendChild(document.getElementById('loadingCtlPanel'));
	//document.getElementById('loadingCtlPanel').setAttribute('position',"0 0 -1");
}
function createInvertedPanelCheck(){
	console.log('to inverted');
	var globeImg=document.createElement("a-image");
	globeImg.setAttribute('src','#ion-android-globe');
	globeImg.setAttribute('height','0.15');
	globeImg.setAttribute('width','0.15');
	globeImg.setAttribute('position','0 0.12 0.01');
	var warnText=document.createElement("a-text");
	warnText.setAttribute('wrap-count','35');
	warnText.setAttribute('align','center');
	warnText.setAttribute('baseline','top');
	warnText.setAttribute('value','Change to inverted globe mode?');
	warnText.setAttribute('color','#D3D3D3');
	warnText.setAttribute('width','0.7');
	warnText.setAttribute('position','0 0.03 0.01');
	var okButton=document.createElement("a-gui-button");
	okButton.setAttribute('width','0.2');
	okButton.setAttribute('height','0.07');
	//If user clicks ok then we load the inverted globe
	okButton.setAttribute('onclick','toInvertedGlobe(true)');
	okButton.setAttribute('value','ok');
	okButton.setAttribute('position','0.15 -0.1 0');
	okButton.setAttribute('font-family','Arial');
	okButton.setAttribute('font-size','15px');
	okButton.setAttribute('margin','0 0 0.02 0.00');
	var cancelButton=document.createElement("a-gui-button");
	cancelButton.setAttribute('width','0.2');
	cancelButton.setAttribute('height','0.07');
	//If user clicks cancel we destroy this panel
	cancelButton.setAttribute('onclick','document.getElementById("infoPanelCheck").parentEl.removeChild(document.getElementById("infoPanelCheck"));');
	cancelButton.setAttribute('value','cancel');
	cancelButton.setAttribute('position','-0.15 -0.1 0');
	cancelButton.setAttribute('font-family','Arial');
	cancelButton.setAttribute('font-size','15px');
	cancelButton.setAttribute('margin','0 0 0.02 0.00');
	var aPlane=document.createElement("a-plane");
	aPlane.setAttribute('position','0 1.7 -0.5');
	aPlane.setAttribute('color','#464d47');
	aPlane.setAttribute('height','0.4');
	aPlane.setAttribute('width','0.7');
	aPlane.setAttribute('id','infoPanelCheck');
	aPlane.setAttribute('visible','true');
	aPlane.appendChild(globeImg);
	aPlane.appendChild(warnText);
	aPlane.appendChild(okButton);
	aPlane.appendChild(cancelButton);
	document.getElementById("mainScene").appendChild(aPlane);
}
function createPlanePanelCheck(){
	console.log('to panel based');
	var globeImg=document.createElement("a-image");
	globeImg.setAttribute('src','#ion-android-map');
	globeImg.setAttribute('height','0.15');
	globeImg.setAttribute('width','0.15');
	globeImg.setAttribute('position','0 0.12 0.01');
	var warnText=document.createElement("a-text");
	warnText.setAttribute('wrap-count','35');
	warnText.setAttribute('align','center');
	warnText.setAttribute('baseline','top');
	warnText.setAttribute('value','Change to panels mode?');
	warnText.setAttribute('color','#D3D3D3');
	warnText.setAttribute('width','0.7');
	warnText.setAttribute('position','0 0.03 0.01');
	var okButton=document.createElement("a-gui-button");
	okButton.setAttribute('width','0.2');
	okButton.setAttribute('height','0.07');
	//If user clicks ok then we load the inverted globe
	okButton.setAttribute('onclick','toPanelBased()');
	okButton.setAttribute('value','ok');
	okButton.setAttribute('position','0.15 -0.1 0');
	okButton.setAttribute('font-family','Arial');
	okButton.setAttribute('font-size','15px');
	okButton.setAttribute('margin','0 0 0.02 0.00');
	var cancelButton=document.createElement("a-gui-button");
	cancelButton.setAttribute('width','0.2');
	cancelButton.setAttribute('height','0.07');
	//If user clicks cancel we destroy this panel
	cancelButton.setAttribute('onclick','document.getElementById("infoPanelCheck").parentEl.removeChild(document.getElementById("infoPanelCheck"));');
	cancelButton.setAttribute('value','cancel');
	cancelButton.setAttribute('position','-0.15 -0.1 0');
	cancelButton.setAttribute('font-family','Arial');
	cancelButton.setAttribute('font-size','15px');
	cancelButton.setAttribute('margin','0 0 0.02 0.00');
	var aPlane=document.createElement("a-plane");
	aPlane.setAttribute('position','0 1.7 -0.5');
	aPlane.setAttribute('color','#464d47');
	aPlane.setAttribute('height','0.4');
	aPlane.setAttribute('width','0.7');
	aPlane.setAttribute('id','infoPanelCheck');
	aPlane.setAttribute('visible','true');
	aPlane.appendChild(globeImg);
	aPlane.appendChild(warnText);
	aPlane.appendChild(okButton);
	aPlane.appendChild(cancelButton);
	document.getElementById("mainScene").appendChild(aPlane);
}
