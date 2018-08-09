document.getElementById('ctlPanel').addEventListener('loaded', function () {
	// once the ctlPanel is loaded we can get data according to initial selections.
	console.log('Loading initial data');
	getAPIUserSelData();
	//Button to change mode cannot have onclick function on index.html. Needs to be dinamic. Otherwise it acumulates the functions.
	document.getElementById('ctlGlobeIcon').setAttribute('onclick','createInvertedPanelCheck()');
	document.getElementById('ctlHideIcon').setAttribute('onclick','hideCtlPanel()');
	createInfoPanel();
});
document.getElementById('leftMainContainer').addEventListener('loaded', function () {
	// once the leftMainContainer is loaded we can add the barchart.
	addBarChart()
	
});


function onYearBtn(start,end,componentID){
	console.log(start);
	//console.log(end);
	//console.log(componentID);
	//var checked=document.getElementById(componentID).components['gui-toggle'].data.checked;
}

//To turn toogle on and off:
//document.getElementById('ctlFilterBtn').emit("check")

function onMapSettingsBtn(){
}
function onShipOrCountry(evt){
	console.log(evt);
}
/*
 * Function to get data according to user selection
 */
function getAPIUserSelData(){
	var selectedYears=getActiveYears();
	var selectedCountries=getActiveCountries(true,true,true);
	var temp_countries=[];
	var or_countriesApiRequest='';
	var jb_countriesApiRequest='';
	var je_countriesApiRequest='';

	// Get a list with all the selected countries including "others"
	var temp_countries=[];
	if(or_countriesList.length>0){
		temp_countries=or_countriesList.slice(0); // Clone the countries list into a new one
		selectedCountries.or_countries.forEach(a=>{
			temp_countries.forEach(b=>{
				if(a.toLowerCase()==b.toLowerCase()){
					var i = temp_countries.indexOf(b);
					if(i != -1) {
						temp_countries.splice(i, 1);
					}
					if(or_countriesApiRequest.length>0){
						or_countriesApiRequest+=',';
					}
					or_countriesApiRequest+=b;
				}
			});
			if(a.toLowerCase()=='others'){
				if(or_countriesApiRequest.length>0){
					or_countriesApiRequest+=',';
				}
				['France','USA','Germany','Netherlands','England','Sweden','Portugal'].forEach(d=>{
					var i = temp_countries.indexOf(d);
					if(i != -1) {
						temp_countries.splice(i, 1);
					}
				});
				temp_countries.forEach(c=>{
					or_countriesApiRequest+=c;
					or_countriesApiRequest+=',';
				});
			}
		});
	}
	if(jb_countriesList.length>0){
		temp_countries=jb_countriesList.slice(0); // Clone the countries list into a new one.
		selectedCountries.jb_countries.forEach(a=>{
			temp_countries.forEach(b=>{
				if(a.toLowerCase()==b.toLowerCase()){
					var i = temp_countries.indexOf(b);
					if(i != -1) {
						temp_countries.splice(i, 1);
					}
					if(jb_countriesApiRequest.length>0){
						jb_countriesApiRequest+=',';
					}
					jb_countriesApiRequest+=b;
				}
			});
			if(a.toLowerCase()=='others'){
				if(jb_countriesApiRequest.length>0){
					jb_countriesApiRequest+=',';
				}
				['France','USA','Germany','Netherlands','England','Sweden','Portugal'].forEach(d=>{
					var i = temp_countries.indexOf(d);
					if(i != -1) {
						temp_countries.splice(i, 1);
					}
				});
				temp_countries.forEach(c=>{
					jb_countriesApiRequest+=c;
					jb_countriesApiRequest+=',';
				});
			}
		});
	}
	if(je_countriesList.length>0){
		temp_countries=je_countriesList.slice(0); // Clone the countries list into a new one.
		selectedCountries.je_countries.forEach(a=>{
			temp_countries.forEach(b=>{
				if(a.toLowerCase()==b.toLowerCase()){
					var i = temp_countries.indexOf(b);
					if(i != -1) {
						temp_countries.splice(i, 1);
					}
					if(je_countriesApiRequest.length>0){
						je_countriesApiRequest+=',';
					}
					je_countriesApiRequest+=b;
				}
			});
			if(a.toLowerCase()=='others'){
				if(je_countriesApiRequest.length>0){
					je_countriesApiRequest+=',';
				}
				['France','USA','Germany','Netherlands','England','Sweden','Portugal'].forEach(d=>{
					var i = temp_countries.indexOf(d);
					if(i != -1) {
						temp_countries.splice(i, 1);
					}
				});
				temp_countries.forEach(c=>{
					je_countriesApiRequest+=c;
					je_countriesApiRequest+=',';
				});
			}
		});
	}
	// perform API request if we have years.
	if(or_countriesApiRequest.length<1 || jb_countriesApiRequest.length<1 || je_countriesApiRequest.length<1){
		console.log('Could not perform request. No selected group countries.');
		//Clean all layers from all maps and exit
		mapClearRoutesLayer();
		cleanRouteMap();
		return null
	}
	if(selectedYears.start!=Infinity && selectedYears.end!=-Infinity){
		//First lets clear all map data!
		mapClearRoutesLayer();
		//Then construct the URL for GET request
		var url=APIendpoint+'ships'
		if (or_countriesApiRequest.length>1){
			if(url.substr(url.length - 5)=='ships'){
				url+='?';
			}else{
				url+='&';
			}
			url+='or_country='+or_countriesApiRequest
		}
		if (jb_countriesApiRequest.length>1){
			if(url.substr(url.length - 5)=='ships'){
				url+='?';
			}else{
				url+='&';
			}
			url+='jb_country='+jb_countriesApiRequest
		}
		if (je_countriesApiRequest.length>1){
			if(url.substr(url.length - 5)=='ships'){
				url+='?';
			}else{
				url+='&';
			}
			url+='je_country='+je_countriesApiRequest
		}
		if(url.substr(url.length - 5)=='ships'){
			url+='?';
		}else{
			url+='&';
		}
		url+='startyear='+selectedYears.start
		if(url.substr(url.length - 5)=='ships'){
			url+='?';
		}else{
			url+='&';
		}
		url+='endyear='+selectedYears.end
		
		///////////////////// Fetch function /////////////////////////////////
		document.getElementById('ctlPanel').setAttribute('visible',false);
		document.getElementById('loadingCtlPanel').setAttribute('visible',true);
		fetch(url,{
			method: "GET",
			mode: "cors"
		}).then(response => {
			return response.json();
		}).then(data => {
			mapAddDataRoutesLayer(data);
			document.getElementById('ctlPanel').setAttribute('visible',true);
			document.getElementById('loadingCtlPanel').setAttribute('visible',false);
			
		}).catch(err => {
			console.warn('Could not get routes data from server');
			console.warn(err);
			document.getElementById('ctlPanel').setAttribute('visible',true);
			document.getElementById('loadingCtlPanel').setAttribute('visible',false);
		});
		/////////////////////////////////////////////////////
	}else{
		console.log('Could not perform request. No selected years.');
		//Clean all layers from all maps
		mapClearRoutesLayer();
		cleanRouteMap();
	}
	
	
}
/*
 * Function to return selected years
 */
function getActiveYears(){
	var yearToogles=document.querySelectorAll('[id^=ctlYear]');
	var years={};
	var yearsValues=[];
	var yearsStart=[];
	var yearsEnd=[];
	yearToogles.forEach(toogle=>{
		if(toogle.components['gui-toggle'].data.checked){
			var yearObj={};
			var yearValue=toogle.getAttribute('value');
			var valYears=yearValue.split(' - ');
			var startYear=valYears[0].replace('..','').replace(' ','');
			var endYear=valYears[1].replace('..','').replace(' ','');
			yearObj.start=startYear;
			yearObj.end=endYear;
			yearObj.value=yearValue;
			yearsStart.push(Number(startYear));
			yearsEnd.push(Number(endYear));
			yearsValues.push(yearObj)
		}
	});
	years.values=yearsValues;
	years.start=Math.min(...yearsStart);
	years.end=Math.max(...yearsEnd);
	return years;
}
/*
 * Function to return selected countries (Origin, jorney beginning, jorney ending)
 */
function getActiveCountries(or,jb,je){
	var countries={};
	if(or){
		var orToogles=document.querySelectorAll('[id^=ctlOrCountry]');
		var orCountries=[];
		orToogles.forEach(toogle=>{
			if(toogle.components['gui-toggle'].data.checked){
				var country=toogle.getAttribute('value');
				orCountries.push(country);
			}
		});
		countries.or_countries=orCountries;
	}
	if(jb) {
		var jbToogles=document.querySelectorAll('[id^=ctlJbCountry]');
		var jbCountries=[];
		jbToogles.forEach(toogle=>{
			if(toogle.components['gui-toggle'].data.checked){
				var country=toogle.getAttribute('value');
				jbCountries.push(country);
			}
		});
		countries.jb_countries=jbCountries;
	}
	if(je){
		var jeToogles=document.querySelectorAll('[id^=ctlJeCountry]');
		var jeCountries=[];
		jeToogles.forEach(toogle=>{
			if(toogle.components['gui-toggle'].data.checked){
				var country=toogle.getAttribute('value');
				jeCountries.push(country);
			}
		});
		countries.je_countries=jeCountries;
	}
	return countries
}