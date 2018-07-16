/* INSTRUCTIONS
1. Aller sur un tableau de votre trello.
2. Copier l'ID de votre tableau trello (https://trello.com/b/id_de_votre_tableau/nom_de_votre_tableau).
3. Collez cet id dans la variable trelloAttayId ci-dessous.
4. Recopiez les noms exacts de vos trois colonnes représentant les phases 'TODO', 'DOING' et 'DONE' dans les variables todoColName, doingColName et doneColName.
5. Copier-collez ce script en entier dans la console JS de votre navigateur.
6. ENJOY :)

NB : Il suffit de respecter ces quelques points pour que ça marche :
- Les développeurs détaillent finement leurs tâches dans des checklists à cocher et les cochent au fur et à mesure de leurs développements.
- La charge est entre parenthèses dans le nom de chaque tâche.
- Le tableau Trello doit comporter au moins trois colonnes représentant les "phases projet" TODO, DOING et DONE. Seules ces trois colonnes sont considérées.

TROUBLESHOOTING :
- Script testé sur Chrome et Firefox.
- En cas de plantage du script, faites un ctrl+F5.
- Si le plantage persiste, vérifiez que vous n'avez pas de tuile en cours de création dans une des colonnes du tableau.

AUTHOR :
louis m.
*/

var trelloAttayId = '';
var todoColName = '';
var doingColName = '';
var doneColName = '';
var data;

var todo = [];
var todoSum = 0;
var doing = [];
var doingSum = 0;
var doingRaf = 0;
var done = [];
var doneSum = 0;

/*Trouve le nom d'une liste à partir de son ID.*/
function getListName(key){
	var name;
	$.each( data.lists, function( i, item ) {
		if(item.id===key){
			name = item.name;
			return false;
		}
	});
	return name;
};

/*Calcule le RAF d'une fiche en fonction de l'avancement de ses checklists.*/
function calculerRaf(card){
	var charge = readFloatInName(card.name);
	var raf = charge;
	var checkItems = parseInt(card.badges.checkItems);
	if(0<checkItems){
		raf = charge * parseInt(card.badges.checkItemsChecked)/checkItems;
	}
	return raf;
};

/*Extrait la charge du nom d'une fiche (Exemple : "nom de fiche (charge)" )"*/
function readFloatInName(cardName){
	return parseFloat(cardName.replace(',','.').match(/\(([^)]+)\)/)[1]);
};

/*Nettoyage des variables de calcul.*/
function clearAll(){
	todo = [];
	todoSum = 0;
	doing = [];
	doingSum = 0;
	doingRaf = 0;
	done = [];
	doneSum = 0;
};

/*Fonction principale lançant les calculs. Peut être lancée plusieurs fois si besoin après chargement en console.*/
function sumUp(data){
	$.each( data.cards, function( i, item ) {
		var charge = readFloatInName(item.name);
		switch (getListName(item.idList)) {
			case todoColName:
				todo.push(item);
				todoSum += charge;
			break;
			case doingColName:
				doing.push(item);
				doingSum += charge;
				doingRaf += calculerRaf(item);
			break;
			case doneColName:
				done.push(item);
				doneSum += charge;
			break;
		};
    });
	console.log('Total charge colonne '+todoColName+' : '+todoSum+' jh');
	console.log('Total charge colonne '+doingColName+' : '+doingSum+' jh');
	console.log('Total RAF colonne '+doingColName+' : '+doingRaf.toFixed(2)+' jh');
	console.log('Total charge colonne '+doneColName+' : '+doneSum+' jh');
	var chargeTotale = todoSum + doingSum + doneSum;
	console.log('Charge totale projet : '+chargeTotale.toFixed(2)+' jh');
	var rafTotal = doingRaf + todoSum;
	var avancement = ((chargeTotale-rafTotal)/chargeTotale)*100;
	console.log('Avancement global : '+ avancement.toFixed(2) + '%');
	var rafTotalPourcent = 100-avancement;
	console.log('Total RAF : '+rafTotal.toFixed(2)+' jh ('+rafTotalPourcent.toFixed(2)+'%)');
	clearAll();
};

/*Ajout de JQuery et lancement des traitements.*/
(function() {
    var script = document.createElement("SCRIPT");
    script.src = 'https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js';
    script.type = 'text/javascript';
    script.onload = function() {
		jQuery.noConflict();
		console.log('jQuery injected');
		var jqxhr = $.getJSON( "https://trello.com/b/"+trelloAttayId+".json", function() {
		  console.log( "JSON Loaded !" );
		}).done(function(json){
			data=json;
			sumUp(data);
		});
	};
    document.getElementsByTagName("head")[0].appendChild(script);
})();
