/*
 * Generic map functions.
 * This functions should work on all maps.
 */
function mapZoomIn(map,factor){
	if(typeof(map)=='undefined'){
		console.error('map should be specified.');
	}
	if(typeof(factor)=='undefined'){
		var factor=0.5;
	}
	var view=map.getView();
	view.setZoom(view.getZoom()+factor);
}
function mapZoomOut(map,factor){
	if(typeof(map)=='undefined'){
		console.error('map should be specified.');
	}
	if(typeof(factor)=='undefined'){
		var factor=0.5;
	}
	var view=map.getView();
	view.setZoom(view.getZoom()-factor);
}
function mapPanDown(map,factor){
	if(typeof(map)=='undefined'){
		console.error('map should be specified.');
	}
	if(typeof(factor)=='undefined'){
		if(map.getView().getZoom()<5){
			var factor=500000;//500 km
		}else if(map.getView().getZoom()>=5 ||map.getView().getZoom()<7){
			var factor=250000;//250 km
		}else if(map.getView().getZoom()>=7){
			var factor=100000;//100 km
		}
	}
	var view=map.getView();
	var centerCoord=view.getCenter();	
	view.setCenter([centerCoord[0], centerCoord[1]+factor])
}
function mapPanUp(map,factor){
	if(typeof(map)=='undefined'){
		console.err('map should be specified.');
	}
	if(typeof(factor)=='undefined'){
		if(map.getView().getZoom()<5){
			var factor=500000;//500 km
		}else if(map.getView().getZoom()>=5 ||map.getView().getZoom()<7){
			var factor=250000;//250 km
		}else if(map.getView().getZoom()>=7){
			var factor=100000;//100 km
		}
	}
	var view=map.getView();
	var centerCoord=view.getCenter();	
	view.setCenter([centerCoord[0], centerCoord[1]-factor])
}
function mapPanRight(map,factor){
	if(typeof(map)=='undefined'){
		console.error('map should be specified.');
	}
	if(typeof(factor)=='undefined'){
		if(map.getView().getZoom()<5){
			var factor=500000;//500 km
		}else if(map.getView().getZoom()>=5 ||map.getView().getZoom()<7){
			var factor=250000;//250 km
		}else if(map.getView().getZoom()>=7){
			var factor=100000;//100 km
		}
	}
	var view=map.getView();
	var centerCoord=view.getCenter();	
	view.setCenter([centerCoord[0]+factor, centerCoord[1]])
}
function mapPanLeft(map,factor){
	if(typeof(map)=='undefined'){
		console.error('map should be specified.');
	}
	if(typeof(factor)=='undefined'){
		if(map.getView().getZoom()<5){
			var factor=500000;//500 km
		}else if(map.getView().getZoom()>=5 ||map.getView().getZoom()<7){
			var factor=250000;//250 km
		}else if(map.getView().getZoom()>=7){
			var factor=100000;//100 km
		}
	}
	var view=map.getView();
	var centerCoord=view.getCenter();	
	view.setCenter([centerCoord[0]-factor, centerCoord[1]])
}