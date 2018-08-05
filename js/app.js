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
	console.log(shipGid);
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
	// Display crew data
	var crew=data.shipdata[0].crew_agg;
	displayCrewDetails(crew);
	//Set the title
	var title=data.shipdata[0].shipname;
	document.getElementById("shidDetailsTitle").setAttribute('value',title);
	//Set other details
	console.log(data.shipdata[0].shipcomments);
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














