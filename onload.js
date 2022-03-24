
'use strict';

var t1 = document.getElementsByClassName("filmo-row even");
var t2 = document.getElementsByClassName("filmo-row odd");
var title_objects = new Array(t1.length + t2.length);
for (var i = 0, toIndex = 0 ; i < Math.max(t1.length, t2.length) ; ++i, toIndex += 2)
{
	if (i < t1.length && i < t2.length)
	{
		title_objects[toIndex] = t1[i];
		title_objects[toIndex+1] = t2[i];
	}
	else if (i < t1.length)
	{
		title_objects[toIndex] = t1[i];
		toIndex--;
	}
	else if (i < t2.length)
	{
		title_objects[toIndex] = t2[i];
		toIndex--;
	}
	else // We shouldn't end up here
	{
		console.log("Index " + i + " larger than either list - how?")
	}
}

for (var i = 0 ; i < title_objects.length ; ++i)
{
	var eps = title_objects[i].getElementsByClassName("filmo-episodes");
	if (eps.length != 0)
	{
		for (var e = 0 ; e < eps.length ; ++e)
		{
			var anchor = getFirstChildOfType(eps[e], "A");
			if (anchor == null)
				continue;
			addRating(true, anchor.href, eps[e]);
		}
	}
	var children = title_objects[i].children;
	for (var k = 0 ; k < children.length ; ++k)
	{
		var anchor = getFirstChildOfType(children[k], "A");
		if (anchor == null)
			continue;
		if (children[k].className == "filmo-episodes")
			continue;
		addRating(false, anchor.href, title_objects[i]);
	}
}

async function addRating(isEpisode, addr, rowItem)
{
	const response = await fetch(addr, {});
	if (!response.ok)
		return;
	const result = await response.text();
	var parser = new DOMParser();
	var doc = parser.parseFromString(result, 'text/html');
	//var rv = doc.getElementsByClassName("ratingValue"); // Old div, rating at: rv[0].children[0].children[0].innerHTML;

	//var rating1StartTime = performance.now()
	var rv = doc.getElementsByClassName("ipc-button__text");

	// This should trigger at idx 6, not sure if that's always the case though
	var rating1 = null
	for (var i = 0 ; i < rv.length ; ++i)
	{
		var query_lst = rv[i].querySelectorAll("div[data-testid='hero-rating-bar__aggregate-rating__score']");
		if (query_lst.length > 0)
		{
			rating1 = query_lst[0].firstChild.innerHTML;
			break
		}
	}
	//var rating1EndTime = performance.now()
	//console.log(`Rating1: ${rating1EndTime-rating1StartTime}ms`)
	//console.log(`Rating2: ${rating2EndTime-rating2StartTime}ms`)

	if (rating1 != null)
	{
		//console.log("Rating: " + rating1);
		var targetEl;
		if (!isEpisode)
		{
			var brk = getFirstChildOfType(rowItem, "BR");
			if (brk == null)
				return;
			targetEl = brk;
		}
		else
		{
			targetEl = rowItem.lastChild.nextSibling;
		}
		var newEl = document.createElement("B");
		newEl.innerHTML = rating1;
		var star = createStarElement();
		rowItem.insertBefore(star, targetEl);
		rowItem.insertBefore(newEl, targetEl);
	}
}

function getFirstChildOfType(object, elementString)
{
	if (object != null)
	{
		var childList = object.children;
		for (var i = 0 ; i < childList.length ; ++i)
		{
			if (childList[i].tagName == elementString)
			{
				return childList[i];
			}
		}
	}
	return null;
}

function createStarElement()
{
	var newSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
	newSvg.setAttributeNS(null, "fill", "#c39400");
	newSvg.setAttributeNS(null, "height", "15");
	newSvg.setAttributeNS(null, "viewBox", "0 0 16.25 15");
	newSvg.setAttributeNS(null, "width", "16.25");

	var p1 = document.createElementNS("http://www.w3.org/2000/svg", "path");
	p1.setAttributeNS(null, "d", "M0 0h24v24H0z");
	p1.setAttributeNS(null, "fill", "none");

	var p2 = document.createElementNS("http://www.w3.org/2000/svg", "path");
	p2.setAttributeNS(null, "d", "m4.5,15   4.5,-15   4.5,15   L1.25,6   h15 z");

	var p3 = document.createElementNS("http://www.w3.org/2000/svg", "path");
	p3.setAttributeNS(null, "d", "M0 0h24v24H0z");
	p3.setAttributeNS(null, "fill", "none");

	newSvg.appendChild(p1);
	newSvg.appendChild(p2);
	newSvg.appendChild(p3);

	return newSvg;
}
