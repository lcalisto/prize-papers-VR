/* 
 * Globals and configuration parameters
 */
or_countriesList=null;
jb_countriesList=null;
je_countriesList=null;
APIendpoint='../prize-papers-api/';


/* 
 * First lets load all needed js files. (kind of a import statement) This way we organize the code in a better way
 */
var modules=['js/ctlPanel.js','js/maps.js','js/mapFunctions.js']
modules.forEach(url=>{
	var script = document.createElement("script");
	script.src = url; 
	document.head.appendChild(script); 
});


 // Get all countries, For the moment lets hardcode so the app gets faster

var countries = {"data": {"jb_countries": ["Guatemala", "Libya", "Turkey", "Germany", "France", "RUSSIA SCAN", "Turks and Caicos", "unknown Africa", "Sao Tome and Principe", "Jamaica", "Sint Eustatius", "Ecuador", "St Vincent and Grenadines", "Grenada", "Denmark", "Lithuania", "Bangladesh", "Curacao", "Netherlands", "Gambia", "Barbados", "Nigeria", "Sint Maarten", "Scotland", "Egypt", "Suriname", "Guyana", "Sierra Leone", "Bahamas", "Bermuda", "Virgin Islands", "Argentina", "Angola", "Northern Ireland", "Cuba", "Ghana", "Sao Miguel, Azores, Portugal", "Gabon", "Brazil", "Senegal", "Israel", "Falkland Islands", "Chile", "USA", "Terceira", "Finland", "Mexico", "Russia scan", "Sri Lanka", "England", "Latvia", "Estonia", "Venezuela", "Peru", "Algeria", "Uruguay", "Spain", "St Kitts and Nevis", "GERMANY", "Ireland", "Haiti", "Wales", "La Reunion", "Portugal", "Ilha do Faial, Azores, Portugal", "Dominica", "Cape Verde Islands", "Congo", "Puerto Rico", "Trinidad and Tobago", "Canada", "China", "Panama", "South Africa", "Mauritius", "Poland", "Antigua", "Honduras", "Canary Islands", "Tunisia", "Italy", "Sweden", "French Guyana", "Malta", "Greece", "India", "Yemen", "Montserrat", "Philippines", "Morocco", "Greenland", "Indonesia", "Belgium", "unknown West Indies", "Martinique", "Guadeloupe", "Madeira, Azores, Portugal", "Norway"], "je_countries": ["Turkey", "Libya", "Germany", "France", "RUSSIA SCAN", "Turks and Caicos", "x", "unknown Africa", "Jamaica", "Sint Eustatius", "St Vincent and Grenadines", "Grenada", "Denmark", "Syria", "Curacao", "Bangladesh", "Netherlands", "Barbados", "Nigeria", "Guinea", "Sint Maarten", "Scotland", "Guyana", "Suriname", "Sierra Leone", "Bermuda", "Bahamas", "Virgin Islands", "Benin", "Argentina", "Angola", "Oman", "Northern Ireland", "Cuba", "Brazil", "Sao Miguel, Azores, Portugal", "Senegal", "USA", "Mozambique", "Mexico", "Russia SCAN", "Finland", "England", "Latvia", "Estonia", "Venezuela", "Peru", "Algeria", "Uruguay", "Spain", "Saint-Barthelemy", "St Kitts and Nevis", "GERMANY", "Ireland", "Haiti", "Wales", "La Reunion", "Portugal", "Ilha do Faial, Azores, Portugal", "Dominica", "Trinidad and Tobago", "Puerto Rico", "Canada", "South Africa", "Mauritius", "Antigua", "Poland", "Honduras", "Canary Islands", "Tunisia", "Sweden", "Italy", "French Guyana", "Malta", "India", "Philippines", "Morocco", "Indonesia", "Belgium", "unknown West Indies", "Martinique", "Guadeloupe", "unknown Medit", "unknown Baltic", "Madeira, Azores, Portugal", "Norway"], "or_countries": ["England", "Latvia", "Estonia", "Montenegro", "Germany", "Venezuela", "Peru", "France", "RUSSIA SCAN", "x", "unknown Africa", "Uruguay", "Jamaica", "Spain", "Sint Eustatius", "St Kitts and Nevis", "St Vincent and Grenadines", "GERMANY", "Ireland", "Haiti", "Wales", "Grenada", "Denmark", "Lithuania", "Curacao", "Netherlands", "Portugal", "Gambia", "Scotland", "Puerto Rico", "Canada", "Suriname", "South Africa", "Bermuda", "Bahamas", "Mauritius", "Poland", "Virgin Islands", "Argentina", "Canary Islands", "Croatia", "Tunisia", "Northern Ireland", "Sweden", "Italy", "Cuba", "French Guyana", "Malta", "Greece", "India", "Brazil", "Philippines", "Morocco", "Senegal", "Indonesia", "Belgium", "USA", "Martinique", "Guadeloupe", "Russia Scan", "Finland", "Mexico", "Norway"]}};

or_countriesList=countries.data.or_countries;
jb_countriesList=countries.data.jb_countries;
je_countriesList=countries.data.je_countries;


function getShipDetails(shipGid){
	if (shipGid.toString().length>0){
		//Construct the URL for GET request
		var url=APIendpoint+'ship?gid='+shipGid.toString();
		///////////////////// Fetch function /////////////////////////////////
		fetch(url,{
			method: "GET",
			mode: "cors"
		}).then(response => {
			return response.json();
		}).then(data => {
			displayShipDetails(data);
			
		}).catch(err => {
			console.warn('Could not get routes data from server');
			console.warn(err);
		});
		/////////////////////////////////////////////////////
	}else{
		console.log('Id not set. Request is not made.')
	}
}
function displayShipDetails(data){
	var totalRoute=(new ol.format.GeoJSON()).readFeature(data.shipdata[0].jb_takenloc_je_line,{
		dataProjection:'EPSG:4326',
        featureProjection: 'EPSG:3857'
    });
	var jb_point=(new ol.format.GeoJSON()).readFeature(data.shipdata[0].jb_point,{
		dataProjection:'EPSG:4326',
        featureProjection: 'EPSG:3857'
    });
	var takenloc_point=(new ol.format.GeoJSON()).readFeature(data.shipdata[0].takenloc_point,{
		dataProjection:'EPSG:4326',
        featureProjection: 'EPSG:3857'
    });
	var je_point=(new ol.format.GeoJSON()).readFeature(data.shipdata[0].je_point,{
		dataProjection:'EPSG:4326',
        featureProjection: 'EPSG:3857'
    });
	var jb_takenloc_line=(new ol.format.GeoJSON()).readFeature(data.shipdata[0].jb_takenloc_line,{
		dataProjection:'EPSG:4326',
        featureProjection: 'EPSG:3857'
    });
	var takenloc_je_line=(new ol.format.GeoJSON()).readFeature(data.shipdata[0].takenloc_je_line,{
		dataProjection:'EPSG:4326',
        featureProjection: 'EPSG:3857'
    });
	updateRouteMap(totalRoute,jb_point,takenloc_point,je_point,jb_takenloc_line,takenloc_je_line);
	// Display crew data
	var crew=data.shipdata[0].crew_agg;
	displayCrewDetails(crew);
	//Set the title
	var title=data.shipdata[0].shipname;
	document.getElementById("shidDetailsTitle").setAttribute('value',title);
	//Set other details
	var value="";
	if(data.shipdata[0].or_country!=""){
		value +="Origin: "+data.shipdata[0].or_place+' ('+data.shipdata[0].or_country+")\n\n";
	}
	if(data.shipdata[0].jb_country!=""){
		value +="Journey begin: "+data.shipdata[0].jb_place+' ('+data.shipdata[0].jb_country+")\n\n";
	}
	if(data.shipdata[0].je_country!=""){
		value +="Journey end: "+data.shipdata[0].je_place+' ('+data.shipdata[0].je_country+")\n\n";
	}
	if(data.shipdata[0].shiptakenlocation!=""){
		value +="Taken location: "+data.shipdata[0].shiptakenlocation+"\n\n";
	}
	if(data.shipdata[0].shipage!=""&&data.shipdata[0].shipage!=null){
		value +="Ship age: "+data.shipdata[0].shipage+"\n\n";
	}
	if(data.shipdata[0].shipconstrplace!=""){
		value +="Construction place: "+data.shipdata[0].shipconstrplace+"\n\n";
	}
	if(data.shipdata[0].shiptonnage!=""&&data.shipdata[0].shiptonnage!=null){
		value +="Weight: "+data.shipdata[0].shiptonnage+" tons \n\n";
	}
	if(data.shipdata[0].shipdateedtf!=""){
		value +="Date of capture: "+data.shipdata[0].shipdateedtf+"\n\n";
	}
	if(data.shipdata[0].shipcrewtot!=""&&data.shipdata[0].shipcrewtot!=null){
		value +="Crew number: "+data.shipdata[0].shipcrewtot+"\n\n";
	}
	if(data.shipdata[0].shipcrewnat!=""){
		value +="Crew nationality: "+data.shipdata[0].shipcrewnat+"\n\n";
	}
	if(data.shipdata[0].shipownres!=""){
		value +="Owner residency: "+data.shipdata[0].shipownres+"\n\n";
	}
	if(data.shipdata[0].shipcomments!=""){
		value +="Comments: "+data.shipdata[0].shipcomments+"\n\n";
	}
	document.getElementById("shidDetailsText").setAttribute('value',value);
}
function displayCrewDetails(crew){
	var value="";
	crew.forEach(c=>{
		if(c.occuptitle!=""){
			value+=c.occuptitle+':\n';
		}
		
		if(c.crewfirstname!="" && c.crewlastname!=""){
			value+=c.crewfirstname+' '+c.crewlastname;
		}
		if(c.crewrank!=''){
			value+=' ('+c.crewrank+')';
		}
		if(c.crewage!=''&& c.crewage!=null){
			value+=' with '+c.crewage+" years old";
		}
		if(c.crewmarstat!="" && c.crewmarstat!="No data on form"){
			value+='; '+c.crewmarstat;
		}
		if(c.crewfamstat!=""){
			if(c.crewfamstat=="Family"){
				value+="; with family";
			}else{
				value+='; family status: '+c.crewfamstat;
			}
		}
		if(c.crewplaceres!=''){
			value+='; resident in '+c.crewplaceres;
		}
		value+='.\n\n';
	});
	document.getElementById("crewDetailsText").setAttribute('value',value);
}
function hideCtlPanel(){
	document.getElementById("panelYears").setAttribute('visible','false');
	document.getElementById("panelOR").setAttribute('visible','false');
	document.getElementById("panelJB").setAttribute('visible','false');
	document.getElementById("panelJE").setAttribute('visible','false');
	if(document.getElementById('ctlHideIcon') != null){
		var parent=document.getElementById("ctlHideIcon").parentEl;
		parent.removeChild(document.getElementById("ctlHideIcon"));
		var showIcon=document.createElement("a-gui-icon-button");
		showIcon.setAttribute('width','0.55');
		showIcon.setAttribute('height','0.55');
		showIcon.setAttribute('id','ctlShowIcon');
		showIcon.setAttribute('onclick','showCtlPanel()');
		showIcon.setAttribute('icon','eye');
		showIcon.setAttribute('position','0.57 0 0');
		parent.appendChild(showIcon);
	}
}
function showCtlPanel(){
	document.getElementById("panelYears").setAttribute('visible','true');
	document.getElementById("panelOR").setAttribute('visible','true');
	document.getElementById("panelJB").setAttribute('visible','true');
	document.getElementById("panelJE").setAttribute('visible','true');
	if(document.getElementById('ctlShowIcon') != null){
		var parent=document.getElementById("ctlShowIcon").parentEl;
		parent.removeChild(document.getElementById("ctlShowIcon"));
		var hideIcon=document.createElement("a-gui-icon-button");
		hideIcon.setAttribute('width','0.55');
		hideIcon.setAttribute('height','0.55');
		hideIcon.setAttribute('id','ctlHideIcon');
		hideIcon.setAttribute('onclick','hideCtlPanel()');
		hideIcon.setAttribute('icon','eye-disabled');
		hideIcon.setAttribute('position','0.57 0 0');
		parent.appendChild(hideIcon);
	}
}
function closeInfoPanel(){
	if(document.getElementById('infoPanel') != null){
		var parent=document.getElementById("infoPanel").parentEl;
		parent.removeChild(document.getElementById("infoPanel"));
	}
}

function createInfoPanel(){
	var infoImg=document.createElement("a-image");
	infoImg.setAttribute('src','#ion-information-circled');
	infoImg.setAttribute('height','0.15');
	infoImg.setAttribute('width','0.15');
	infoImg.setAttribute('position','0 0.3 0.01');
	var infoText=document.createElement("a-text");
	infoText.setAttribute('wrap-count','50');
	infoText.setAttribute('align','center');
	infoText.setAttribute('baseline','top');
	infoText.setAttribute('value','This VR enviroment was build under for the prize papers data. \n \
			It aims to be a geodata exploration tool with VR capabilities. \n\n \
			For more information follow us in GitHub or contact the autor: \n\n\
			Luis Calisto (l.f.calisto@utwente.nl) \n\
			https://github.com/lcalisto/prize-papers-VR-explorer \n\
			');
	//infoText.setAttribute('color','white');
	infoText.setAttribute('color','grey');
	infoText.setAttribute('width','1.4');
	infoText.setAttribute('position','0 0.17 0.01');
	var okButton=document.createElement("a-gui-button");
	okButton.setAttribute('width','0.2');
	okButton.setAttribute('height','0.07');
	//If user clicks ok then we load the inverted globe
	okButton.setAttribute('onclick','closeInfoPanel()');
	okButton.setAttribute('value','ok');
	okButton.setAttribute('position','0 -0.3 0');
	okButton.setAttribute('font-family','Arial');
	okButton.setAttribute('font-size','15px');
	okButton.setAttribute('margin','0 0 0.02 0.00');
	var aPlane=document.createElement("a-plane");
	aPlane.setAttribute('position','0 1.7 -1');
	//aPlane.setAttribute('color','#464d47');
	aPlane.setAttribute('color','##cecece');
	aPlane.setAttribute('height','0.8');
	aPlane.setAttribute('width','1.5');
	aPlane.setAttribute('id','infoPanel');
	aPlane.setAttribute('visible','true');
	aPlane.appendChild(infoImg);
	aPlane.appendChild(infoText);
	aPlane.appendChild(okButton);
	document.getElementById("mainScene").appendChild(aPlane);
}

function createRightMapControls(camera){
	var zoomInButton=document.createElement("a-gui-icon-button");
	zoomInButton.setAttribute('width','0.5');
	zoomInButton.setAttribute('height','0.5');
	zoomInButton.setAttribute('onclick','mapZoomIn(routeDetailsMap);');
	zoomInButton.setAttribute('icon','plus-round');
	zoomInButton.setAttribute('position','0 1.5 0');
	zoomInButton.setAttribute('margin','0 0 0.05 0');
	var zoomOutButton=document.createElement("a-gui-icon-button");
	zoomOutButton.setAttribute('width','0.5');
	zoomOutButton.setAttribute('height','0.5');
	zoomOutButton.setAttribute('onclick','mapZoomOut(routeDetailsMap);');
	zoomOutButton.setAttribute('icon','minus-round');
	zoomOutButton.setAttribute('position','0 0.9 0');
	zoomOutButton.setAttribute('margin','0 0 0 0');
	var panLeftButton=document.createElement("a-gui-icon-button");
	panLeftButton.setAttribute('width','0.5');
	panLeftButton.setAttribute('height','0.5');
	panLeftButton.setAttribute('onclick','mapPanLeft(routeDetailsMap);');
	panLeftButton.setAttribute('rotation','0 0 90');
	panLeftButton.setAttribute('icon','android-arrow-up');
	panLeftButton.setAttribute('margin','0 0.4 0 0');
	panLeftButton.setAttribute('position','-0.4 0 0');
	var panRightButton=document.createElement("a-gui-icon-button");
	panRightButton.setAttribute('width','0.5');
	panRightButton.setAttribute('height','0.5');
	panRightButton.setAttribute('onclick','mapPanRight(routeDetailsMap);');
	panRightButton.setAttribute('rotation','0 0 -90');
	panRightButton.setAttribute('icon','android-arrow-up');
	panRightButton.setAttribute('margin','0 0 0 0');
	panRightButton.setAttribute('position','0.4 0 0');
	var panUpButton=document.createElement("a-gui-icon-button");
	panUpButton.setAttribute('width','0.5');
	panUpButton.setAttribute('height','0.5');
	panUpButton.setAttribute('onclick','mapPanDown(routeDetailsMap);');
	panUpButton.setAttribute('icon','android-arrow-up');
	panUpButton.setAttribute('position','0 0.3 0');
	var panDownButton=document.createElement("a-gui-icon-button");
	panDownButton.setAttribute('width','0.5');
	panDownButton.setAttribute('height','0.5');
	panDownButton.setAttribute('onclick','mapPanUp(routeDetailsMap);');
	panDownButton.setAttribute('icon','android-arrow-down');
	panDownButton.setAttribute('position','0 -0.3 0');
	var entity=document.createElement("a-entity");
	entity.setAttribute('id','topRightMapControlers');
	entity.setAttribute('position','2.890 0.400 -0.71');
	entity.setAttribute('rotation','0 -70 0');
	entity.setAttribute('scale','0.3 0.3 0.3');
	entity.appendChild(zoomInButton);
	entity.appendChild(zoomOutButton);
	entity.appendChild(panLeftButton);
	entity.appendChild(panRightButton);
	entity.appendChild(panUpButton);
	entity.appendChild(panDownButton);
	document.getElementById("rightMainContainer").appendChild(entity);
}
function destroyRightMapControls(){
	if(document.getElementById('topRightMapControlers') != null){
		var parent=document.getElementById("topRightMapControlers").parentEl;
		parent.removeChild(document.getElementById("topRightMapControlers"));
	}
}
function addBarChart(){
	var entity=document.createElement("a-entity");
	entity.setAttribute('id','barChart');
	entity.setAttribute('barchart','\
							xsteps:20;\
				    		ysteps:5;\
							width:20;\
							height:;\
							depth:0.5;\
							color:#00FF00;\
							gridson:true;\
							title:Top 10 places with more taken ships.;\
							src:#barsdata');
	entity.setAttribute('position','2.870 -0.95 -0.560');
	entity.setAttribute('rotation','0 118 0');
	entity.setAttribute('scale','0.09 0.08 -0.09');// Because scale is negative in leftMainContainer then we need to compensate the charts in negative Z
	document.getElementById("leftMainContainer").appendChild(entity);
}

function destroyBarChart(){
	if(document.getElementById('barChart') != null){
		var parent=document.getElementById("barChart").parentEl;
		parent.removeChild(document.getElementById("barChart"));
	}
}










