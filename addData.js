document.getElementById("add").addEventListener("click",addrow);
document.getElementById("update").addEventListener("click",update);
$(function() {
    oFileIn = document.getElementById('my_file_input');
    if(oFileIn.addEventListener) {
        oFileIn.addEventListener('change', filePicked, false);
    }
});

var click=0;
function addrow(){
	
	click++;
	var table = document.getElementById("dataTable");
    var row = table.insertRow();
	
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
	var cell3 = row.insertCell(2);
    var cell4 = row.insertCell(3);
	var cell5 = row.insertCell(4);
    var cell6 = row.insertCell(5);
	var cell7 = row.insertCell(6);
	
	var x1 = document.createElement("INPUT");
    x1.setAttribute("type", "text");
	
	var x2 = document.createElement("INPUT");
    x2.setAttribute("type", "text");
	
	var x3 = document.createElement("INPUT");
    x3.setAttribute("type", "text");
	
	var x4 = document.createElement("INPUT");
    x4.setAttribute("type", "text");
	
	var x5 = document.createElement("INPUT");
    x5.setAttribute("type", "text");
	
	var x6 = document.createElement("INPUT");
    x6.setAttribute("type", "text");
	
	var x7 = document.createElement("INPUT");
    x7.setAttribute("type", "text");
	
	cell1.appendChild(x1);
	cell2.appendChild(x2);
	cell3.appendChild(x3);
	cell4.appendChild(x4);
	cell5.appendChild(x5);
	cell6.appendChild(x6);
	cell7.appendChild(x7);
}

function update(){
	var arr=new Array();
	var tr=document.getElementsByTagName("TR");
	for(var i=1;i<tr.length;i++){
		var obj=new Object();
		var td=tr[i].getElementsByTagName("TD");
		console.log(td.length);
		obj["Task_id"]=td[0].getElementsByTagName("INPUT")[0].value;
		obj["Task_name"]=td[1].getElementsByTagName("INPUT")[0].value;
		obj["start"]=td[2].getElementsByTagName("INPUT")[0].value;
		obj["duration"]=td[3].getElementsByTagName("INPUT")[0].value;
		obj["percentage"]=td[4].getElementsByTagName("INPUT")[0].value;
		obj["dependencies"]=td[5].getElementsByTagName("INPUT")[0].value;
		obj["resources"]=td[6].getElementsByTagName("INPUT")[0].value;
		console.log(obj);
		arr.push(obj);
	}
	//console.log(arr);
	drawChart(arr);
}

function filePicked(oEvent) {
    var oFile = oEvent.target.files[0];
    var sFilename = oFile.name;
    var reader = new FileReader();
    reader.onload = function(e) {
        var data = e.target.result;
        var cfb = XLS.CFB.read(data, {type: 'binary'});
        var wb = XLS.parse_xlscfb(cfb);
        wb.SheetNames.forEach(function(sheetName) {
            var oJS = XLS.utils.sheet_to_row_object_array(wb.Sheets[sheetName]);   
			drawChart(oJS)
        });
    };
    reader.readAsBinaryString(oFile);
}

    google.charts.load('current', {'packages':['gantt']});
    google.charts.setOnLoadCallback(drawChart);

    function daysToMilliseconds(days) {
      return days * 24 * 60 * 60 * 1000;
    }

    function drawChart(obj) {

      var data = new google.visualization.DataTable();
      data.addColumn('string', 'Task ID');
      data.addColumn('string', 'Task Name');
      data.addColumn('string', 'Resource');
      data.addColumn('date', 'Start Date');
      data.addColumn('date', 'End Date');
      data.addColumn('number', 'Duration');
      data.addColumn('number', 'Percent Complete');
      data.addColumn('string', 'Dependencies');

	  if(obj){
		  var len=obj.length;
		  for(var i=0;i<len;i++){
			  var tid=String(obj[i].Task_id);
			  var tname=String(obj[i].Task_name);
			  var start=new Date(obj[i].start);
			  var duration=parseInt(obj[i].duration);
			  var percentage=parseInt(obj[i].percentage);
			  var dependency,resources;
			  if(obj[i].dependencies==null){
				  dependency=null;
			  }
			  else{
				  dependency=obj[i].dependencies;
			  }
			  
			  if(obj[i].resources==null){
				  resources=null;
			  }
			  else{
				  var resources=obj[i].resources;
			  }
			  console.log([tid,tname,resources,new Date(obj[i].start),null,daysToMilliseconds(duration),percentage,dependency]);
			  data.addRows([[tid,tname,resources,new Date(obj[i].start),null,daysToMilliseconds(duration),percentage,dependency]]);
		  }
		  
		  var options = {
			height: 275,
			gantt: {
			  criticalPathEnabled: false,
			  labelStyle: {
				  fontName: 'Arial',
				  fontSize: 16,
				  color: '#757575'
				},
			}
		  };

		  var chart = new google.visualization.Gantt(document.getElementById('chart_div'));

		  chart.draw(data, options);
	  }
    }