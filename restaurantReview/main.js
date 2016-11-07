$(document).ready(function() {
	$("#jsonUpload").click(function(){
		try {
			var jsonData = JSON.parse($("#jsonData").val());
		} catch (e) {
			$("#glyphSpan").removeClass("glyphicon-ok green");
			$("#glyphSpan").addClass("glyphicon-remove red");
			return false;
		}
			$("#glyphSpan").removeClass("glyphicon-remove red");
			$("#glyphSpan").addClass("glyphicon-ok green");
			funSourceWiseData(jsonData.source_wise_stats);
			funFeatureWiseData(jsonData.feature_wise_stats, jsonData.feature_wise_samples);
			drawPieChart(jsonData.overall_stats);
			drawAreaChart(jsonData.time_wise_stats);
			return true;
	});
	$.fn.stars = function() {
		return $(this).each(function() {
			// Get the value
			var val = parseFloat($(this).html());
			// Make sure that the value is in 0 - 5 range, multiply to get width
			var size = Math.max(0, (Math.min(5, val))) * 16;
			// Create stars holder
			var $span = $('<span />').width(size);
			// Replace the numerical value with stars
			$(this).html($span);
		});
	}
	$(function() {
		$('span.stars').stars();
	});
});

function drawPieChart(reviews) {
	var jsonReviews = JSON.parse(reviews);
	// pie chart
	google.charts.load("current", {packages:["corechart"]});
	google.charts.setOnLoadCallback(drawChart);
	function drawChart() {
		var chartData = [['ReviewsType', 'ReviewsCount'],
						["Positive", jsonReviews.positive_count], 
						["Negative", jsonReviews.negative_count],
						["Mixed", jsonReviews.mixed_count]
		];
		var data = google.visualization.arrayToDataTable(chartData);
		var options = {
			pieHole: 0.45,
			legend: { position: 'bottom' },
			tooltip: { isHtml: true }
		};

		var chart = new google.visualization.PieChart($('#pieChartDiv')[0]);
		chart.draw(data, options);
	}
}

function drawAreaChart(reviews) {
	var jsonReviews = JSON.parse(reviews);
	// Area chart
	google.charts.load("current", {packages:["corechart"]});
	google.charts.setOnLoadCallback(drawChart);
	function drawChart() {
		var chartData = [['Time', 'Positive', 'Negative', 'Mixed']];
		var varKeys = Object.keys(jsonReviews);
		for(i in varKeys)
		{
			var countList = [varKeys[i], jsonReviews[varKeys[i]].positive_count, jsonReviews[varKeys[i]].negative_count, jsonReviews[varKeys[i]].mixed_count];
			chartData.push(countList);
		}
		var data = google.visualization.arrayToDataTable(chartData);
		var options = {
			legend: { position: 'bottom' },
			hAxis: {title: 'Time',  titleTextStyle: {color: '#333'}},
			vAxis: {title: 'No. of Reviews', titleTextStyle: {color: '#333'}, minValue: 0}
		};

		var chart = new google.visualization.AreaChart($('#areaChartDiv')[0]);
		chart.draw(data, options);
	}
}

function funSourceWiseData(sourceWiseData) {
	$("#zomatoStar, #zomatoStarValue").text(sourceWiseData[0].source_rating);
	$("#zomatoStarVotes").text(sourceWiseData[0].source_votes + " Votes");
	$("#tripAdvisorStar, #tripAdvisorStarValue").text(sourceWiseData[1].source_rating);
	$("#tripAdvisorStarVotes").text(sourceWiseData[1].source_votes + " Votes");
	$('span.stars').stars();
}

function funFeatureWiseData(feature_wise_stats, feature_wise_samples) {
	var varKeys = Object.keys(feature_wise_stats);
	var panelHtml = '';
	for(i in varKeys)
	{
		var randomNo = Math.round((Math.random() * 40)) / 10 + 1;
		var easyChartClass;
		if(randomNo < 1.3) easyChartClass = "easyChartDR";
		else if(randomNo < 2.5) easyChartClass = "easyChartR";
		else if(randomNo < 4) easyChartClass = "easyChartG";
		else easyChartClass = "easyChartDG";
		var posRevCount = feature_wise_stats[varKeys[i]].positive_count;
		var negRevCount = feature_wise_stats[varKeys[i]].negative_count;
		var posRevPer = (posRevCount*100)/(posRevCount + negRevCount);
		var negRevPer = (negRevCount*100)/(posRevCount + negRevCount);
		panelHtml += '<p></p><div class="panel panel-default">' 
					+ '<div class="panel-heading" id="panel' + i + '" data-toggle="collapse" data-parent="#accordion" data-target="#panelBody' + i + '">' 
					+ '<div class="panel-title">'
					+ '<div class="row"><div class="col-sm-4"><center><b>' + varKeys[i] + '</b></center></div>'
					+ '<div class="col-sm-1"><center><div class="' + easyChartClass + '" data-percent="' + randomNo*20 + '"><span>' + randomNo + '</span></div></center></div>'
					+ '<div class="col-sm-2"><center>Positive Reviews</center><p><span><center>' + posRevCount + '</center></span></p></div>'
					+ '<div class="col-sm-2"><span class="posDiv" style="width:' + posRevPer + '%;"></span>'
					+ '<span class="negDiv" style="width:' + negRevPer + '%;"></span></div>'
					+ '<div class="col-sm-2"><center>Negative Reviews</center><p><span><center>' + negRevCount + '</center></span></p></div>'
					+ '<div class="col-sm-1"><span id="caretSpanpanel' + i + '" class="caretSpan glyphicon glyphicon-chevron-down grey"></span></div></div>'
					+ '</div></div>'
					+ '<div id="panelBody' + i + '" class="panel-collapse collapse">'
					+ '<div class="panel-body"><div class="row">'
					+ '<div class="col-sm-5 col-sm-offset-1"><center><h4><b>Positive</b></h4></center><hr>'
					+ '<ul>';
		if(!(feature_wise_samples[varKeys[i]].positive_samples.length))
		{
			panelHtml += '<center><b>None</b></center>';
		}
		for(j in feature_wise_samples[varKeys[i]].positive_samples)
		{
			panelHtml += '<li><h5>' + feature_wise_samples[varKeys[i]].positive_samples[j].sample
						+ '</h5><p><h6>' + feature_wise_samples[varKeys[i]].positive_samples[j].frequency
						+ ' similar comments</h6></p></li>';
		}		
		panelHtml += '</ul></div><div class="col-sm-5"><center><h4><b>Negative</b></h4></center><hr>'
					+ '<ul>';
		if(!(feature_wise_samples[varKeys[i]].negative_samples.length))
		{
			panelHtml += '<center><b>None</b></center>';
		}
		for(j in feature_wise_samples[varKeys[i]].negative_samples)
		{
			panelHtml += '<li><h5>' + feature_wise_samples[varKeys[i]].negative_samples[j].sample
						+ '</h5><p><h6>' + feature_wise_samples[varKeys[i]].negative_samples[j].frequency
						+ ' similar comments</h6></p></li>';
		}
		panelHtml += '</ul></div></div></div></div></div>';
	}
	$("#accordion").html(panelHtml);
	$(".easyChartG").easyPieChart({
		barColor: '#008000',
		trackColor: 'white',
		scaleColor: 'white',
		lineCap: 'round',
		lineWidth: 5,
		size: 60,
		animate: 500,
		onStart: $.noop,
		onStop: $.noop
	});
	$(".easyChartDG").easyPieChart({
		barColor: '#006400',
		trackColor: 'white',
		scaleColor: 'white',
		lineCap: 'round',
		lineWidth: 5,
		size: 60,
		animate: 500,
		onStart: $.noop,
		onStop: $.noop
	});
	$(".easyChartR").easyPieChart({
		barColor: '#FF0000',
		trackColor: 'white',
		scaleColor: 'white',
		lineCap: 'round',
		lineWidth: 5,
		size: 60,
		animate: 500,
		onStart: $.noop,
		onStop: $.noop
	});
	$(".easyChartDR").easyPieChart({
		barColor: '#8B0000',
		trackColor: 'white',
		scaleColor: 'white',
		lineCap: 'round',
		lineWidth: 5,
		size: 60,
		animate: 500,
		onStart: $.noop,
		onStop: $.noop
	});
	$(".panel-heading").click(function(){
		$("#caretSpan" + $(this).attr("id")).removeClass("caretSpan");
		$(".caretSpan").removeClass("glyphicon-chevron-up glyphicon-chevron-down");
		$(".caretSpan").addClass("glyphicon-chevron-down");
		$("#caretSpan" + $(this).attr("id")).toggleClass("glyphicon-chevron-up glyphicon-chevron-down");
		$("#caretSpan" + $(this).attr("id")).addClass("caretSpan");
	});
}