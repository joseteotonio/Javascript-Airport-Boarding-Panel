ON_TIME = 0, BOARDING = 1, TAKE_OFF = 2, DELAYED = -1;

stateList = [["Alaska",["Anchorage","Fairbanks","Juneau","Sitka","Ketchikan"]],["California",["Los Angeles","San Diego","San Jose","Fresno" ]],["Colorado",["Denver","Colorado Springs","Aurora", "Fort Collins", "Lakewood"]],["Florida",["Jacksonville", "Miami","Tampa", "St. Petersburg","Orlando"]],["Hawaii",["Honolulu","Pearl City","Hilo","Kailua", "Waipahu"]],["Nevada",["Las Vegas", "Henderson", "North Las Vegas", "Reno", "Sunrise Manor"]],["New York",["New York","Buffalo","Rochester","Yonkers", "Syracuse"]],["North Carolina",["Charlotte","Raleigh","Greensboro","Winston-Salem","Durham"]],["Oklahoma",["Oklahoma City","Tulsa","Norman","Broken Arrow","Lawton"]],["Pennsylvania",["Philadelphia","Pittsburgh","Allentown","Erie", "Reading"]],["Tennessee",["Memphis","Nashville","Knoxville","Chattanooga","Clarksville"]],["Texas",["Houston","San Antonio","Dallas","Austin","Fort Worth"]],["Utah",["Salt Lake City","West Valley City","Provo","West Jordan","Orem"]]];

airportClock = new timeSetter(); //clock for planes

planes = [];

function destinationChooser() //since two object need this, I just made it into it's own function
{
	var sIdx = getRandomInteger(0, stateList.length -1);//random state
	var cityList = stateList[sIdx][1];
	var cIdx = getRandomInteger(0, cityList.length -1);//random city in that state.
	return [cityList[cIdx], stateList[sIdx][0]]
}

function timeSetter()
{
	this.hour = 7
	this.minute = 0;
	this.currentTime = "";
	var me = this;
	this.display = function()
	{
		if(me.minute < 10)
			me.currentTime = me.hour + ":" + "0" + me.minute
		else
			me.currentTime = me.hour + ":" + me.minute
	}
	this.timeChange = function()
	{
		me.minute++;
		if(me.minute == 60)
		{
			me.hour++;
			me.minute = 0;
		}
		if(me.hour == 24)
		{
			me.hour = 0;
		}
		me.display();
	}
	this.timeInterval = setInterval(me.timeChange, 1000);
}

function airplaneMaker(t) //t is how often the plane's status will update in seconds
{
	var me = this;
	this.timer = 0;
	this.timerAdv = t;
	this.destination = destinationChooser();
	this.statusA = 0;//because the word status is used by javaScript for something else
	this.statusChanger = function()
	{
		var delayed = 0;
		if (me.statusA == 0 || me.statusA == -1)
		{
			delayed = getRandomInteger(1, 3);//one in 3 chance of being delayed
			if(delayed == 1)// if it is delayed, make it's status DELAYED and stop
			{
				me.statusA = -1;
			}
		}
		if(me.statusA != -1 || delayed > 1 )//if not delayed, advance one step
		{
			if (me.statusA == -1)
			{
				me.statusA = 0;
				
			}
			me.statusA++;
		}
	}
	var mint = Math.round(t*2) + airportClock.minute; //couldn't come up with a better name
	if(mint >= 60)
	{
		mint = mint-60;
		var hout = airportClock.hour + 1;
	}
	else
	{
		var hout = airportClock.hour;
	}
	if(mint<10)
		this.departureTime = hout + ":0" + mint;
	else
		this.departureTime = hout + ":" + mint;
	this.seats = getRandomInteger(50, 100);
}

function peopleMaker()
{
	this.partySize = getRandomInteger(1,4);
	this.destination = destinationChooser();
}

function initialize()
{
	generateTable();
	
	currentTim = document.getElementById("curt");
	
	maxGate = 10;
	
	planeTable = document.getElementById("flightBoard");
	statusClock = setInterval(advanceTimer,1000);
	createPlanes();
	
	go = true;
	newplane = false;
}
function createPlanes()
{
	if (planes.length == 10)
		return;
	//Add a new airplane object to the planes array and update the display.		
	planes.push(new airplaneMaker(8));
	draw();
}

function advanceTimer()
{
	
	//The airport clock will update every second.
	currentTim.innerHTML = airportClock.currentTime;
	
	//For each plane in the planes array, add one to a plane's timer. A plane's status updates every 8 seconds. timeMod is 0 when a plane's timer is 8. If timeMod is equal to 0, each plane's status is updated, the display is updated, and a plane is added to the array.
	for(i = 0; i < planes.length; i++)
	{
		planes[i].timer++
		var timeMod = planes[i].timer % planes[i].timerAdv;
		if(timeMod == 0)
		{
			
			planes[i].statusChanger();
			draw();
			if (newplane == false)
			{
				newplane = true;
				createPlanes();
			}
		}
	}
	if(timeMod == 0)
		newplane = false;
}

function draw()
{
	//For each plane in the planes array, assign it to its corresponding row and cell. Each plane's destination, departure time and status will be displayed.
	for(var i = 0; i < planes.length; i++)
	{
		planeTable.rows[i+1].cells[1].innerHTML = planes[i].destination;
		planeTable.rows[i+1].cells[2].innerHTML = planes[i].departureTime;
		
		if(planes[i].statusA == 0)
		{
			planeTable.rows[i+1].cells[3].innerHTML = "ON TIME";
		}
		if(planes[i].statusA == 1)
		{
			planeTable.rows[i+1].cells[3].innerHTML = "BOARDING";
		}
		if(planes[i].statusA == 2)
		{
			planeTable.rows[i+1].cells[3].innerHTML = "TAKEOFF";
			
		}
		if(planes[i].statusA == -1)
		{
			planeTable.rows[i+1].cells[3].innerHTML = "DELAYED";	
		}
		
		if (planes[i].statusA > 2)
		{
			planes.splice(i, 1);
			createPlanes();
			if (go == true)
			{
				myMove();	
			}
			
		}
		if(planes[i].statusA == -1)
		{
			planeTable.rows[i+1].cells[3].style.color = "red";
		}
		else
		{
			planeTable.rows[i+1].cells[3].style.color = "orange";
		}
	}
}
			
function myMove() 
{
	go = false;
	var elem = document.getElementById("animate");   
	var pos = 0;
	elem.style.display = "inline";
	var id = setInterval(frame, 23);
	function frame() 
	{
		if (pos == 78) 
		{
			clearInterval(id);
			elem.style.display = "none";
			go = true;
		} 			
		else
		{
			pos++; 
			elem.style.left = pos + '%'; 
		}
	}

}

function getNumericSuffix(num)
{
	if (num % 100 != 11 && num % 10 == 1)
	{
		return "st";
	}
	
	if (num % 100 != 12 && num % 10 == 2)
	{
		return "nd";
	}
	
	if (num % 100 != 13 && num % 10 == 3)
	{
		return "rd";
	}
	
	return "th";
}

function getRandomInteger(lower, upper)
{
	//R = (rnd * (u - (L - 1)) + L
	multiplier = upper - (lower - 1);
	rnd = parseInt(Math.random() * multiplier) + lower;
	
	return rnd;
}

function generateRandomColor()
{
	redValue = parseInt(Math.random() * 256);
	greenValue = parseInt(Math.random() * 256);
	blueValue = parseInt(Math.random() * 256);
	
	return "rgb(" + redValue + ", " + greenValue + ", " + blueValue + ")";
}

function generateTable() {

	var output = `
		<table id  = "flightBoard" align="right">
			<tr class = "special"">
				<td>Gate</td> 
				<td>Destination</td>
				<td>Boarding Time</td>
				<td>Status</td> 
			</tr>
			<tr>
				<td>1</td> 
				<td></td>
				<td></td>
				<td></td> 
			</tr>
			<tr>
				<td>2</td> 
				<td></td>
				<td></td>
				<td></td> 
			</tr>
			<tr>
				<td>3</td> 
				<td></td>
				<td></td>
				<td></td> 
			</tr>
			<tr>
				<td>4</td> 
				<td></td>
				<td></td>
				<td></td> 
			</tr>
			<tr>
				<td>5</td> 
				<td></td>
				<td></td>
				<td></td> 
			</tr>
			<tr>
				<td>6</td> 
				<td></td>
				<td></td>
				<td></td> 
			</tr>
			<tr>
				<td>7</td> 
				<td></td>
				<td></td>
				<td></td> 
			</tr>
			<tr>
				<td>8</td> 
				<td></td>
				<td></td>
				<td></td> 
			</tr>
			<tr>
				<td>9</td> 
				<td></td>
				<td></td>
				<td></td> 
			</tr>
			<tr>
				<td>10</td> 
				<td></td>
				<td></td>
				<td></td> 
			</tr>
		</table>
	`

	document.getElementById('tablepanel').innerHTML = output;
}
			

