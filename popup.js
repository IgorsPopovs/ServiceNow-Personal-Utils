//document.getElementById('sysparm_ck').value;
import NavigationList from './Navigation.js';
const navList = new NavigationList();


var queryStringParams = {};

var tabid;
var g_ck;
var url;
var instance;
var urlFull;
var userName;
var roles;
var dtUpdateSets;
var dtUpdates;
var dtNodes;
var dtTables;
var dtDataExplore;
var dtSlashcommands;
var objCustomCommands = {};
var ipArr = [];

var objSettings;
var tablesloaded = false;
var nodesloaded = false;
var dataexploreloaded = false;
var userloaded = false;
var updatesetsloaded = false;
var updatesloaded = false;
var myFrameHref;
var datetimeformat;
var table;
var sys_id;
var isNoRecord = true;

var nme;





/*
if (document.readyState == 'complete') {
  highlighter();
} else {
  document.onreadystatechange = function () {
    if (document.readyState === "complete") {
      setTimeout(function () {
        docLoaded();
      }, 200);
    }
  }
}*/

//function docLoaded() {
document.addEventListener('DOMContentLoaded', function () {
//window.addEventListener('load', function () {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    let tabId = tabs[0].id;
    var cookieStoreId = tabs[0].cookieStoreId || '';
    let urlFull = tabs[0].url;

    if (urlFull != undefined && urlFull.includes('service-now')) {
      getBrowserVariables(tabId, cookieStoreId).then(
        () => { navList.getLinkLocation(urlFull).setActive(); }
      );




      document.getElementById('getUpdateSet').addEventListener('click', function () {
        getUpdateSet();
      });
    }







  });

  //Set browser variables



});



//Retrieve variables from browser tab, passing them back to popup
async function getBrowserVariables(tid, cStoreId, callback) {
  let tabid = tid;
  console.log('getVars started');
  chrome.tabs.sendMessage(
    tabid,
    {
      type: "getVars",
      myVars: "g_ck,g_user_date_time_format,NOW.user.roles,NOW.user.name,NOW.user_name"
    }, function (response) {
      if (response == null || typeof response !== 'object') return;
      g_ck = response.myVars.g_ck || '';
      url = response.url;
      instance = (new URL(url)).host.replace(".service-now.com", "");
      userName = response.myVars.NOWusername;
      datetimeformat = response.myVars.g_user_date_time_format;
      myFrameHref = response.frameHref;
      console.log('getVars response (nextLine):');
      console.log(response);



      //setBrowserVariables(response);

      queryStringParams = getQueryStringParameters(myFrameHref);
      setPopupVariables(tid);



      //callback(response);

      console.log('getVars stopped');
      console.log("url:" + url);
    });

}

function setPopupVariables(tid) {
  //console.log('setPopupVariables Start');

  // Set Local Update Set pattern for search
  if (queryStringParams['sysparm_record_target'] == "sys_update_set") {
    chrome.tabs.sendMessage(
      tid,
      {
        type: "LocalUpdateSetScrapper"
      }, function (response) {
        document.getElementById('storyNumber').innerHTML = response.name.match('^(srcm)(_[0-9]*){4}')[0];
      });
  }
  //console.log('setPopupVariables Ed');
}


function getQueryStringParameters(url) {
  var urlParams = {},
    match,
    additional = /\+/g, // Regex for replacing additional symbol with a space
    search = /([^&=]+)=?([^&]*)/g,
    decode = function (s) { return decodeURIComponent(s.replace(additional, " ")); },
    query;
  if (url) {
    if (url.split("?").length > 0) {
      query = url.split("?")[1];
    }
  } else {
    url = window.location.href;
    query = window.location.search.substring(1);
  }
  while (match = search.exec(query)) {
    urlParams[decode(match[1])] = decode(match[2]);
  }
  return urlParams;
}

function getUpdateSet() {
  console.log('getUpdateSet started');

  let docRawData = [];
  let fields1 = 'name,sys_id';
  let query1 = 'nameSTARTSWITH' + document.getElementById('storyNumber').value + '^ORDERBYname';
  let myurl1 = url + '/api/now/table/sys_update_set?sysparm_fields=' + fields1 + '&sysparm_query=' + query1;

  snuFetch(g_ck, myurl1, null, function (res) {
    if (res.result == undefined) {
      //error
      return;
    }
    docRawData = res.result;
    for (let i = 0; i < docRawData.length; i++) {
      docRawData[i].url = getSNUrl('sys_update_set', docRawData[i].sys_id);


      var fields = 'name,target_name,type,action,type,sys_id';
      var query = 'update_set=' + docRawData[i].sys_id + '^ORDERBYname';
      var myurl = url + '/api/now/table/sys_update_xml?sysparm_fields=' + fields + '&sysparm_query=' + query;
      snuFetch(g_ck, myurl, null, function (res) {
        docRawData[i].updates = res.result;
        for (let j = 0; j < docRawData[i].updates.length; j++) {
          docRawData[i].updates[j].url = getSNUrl('sys_update_xml', docRawData[i].updates[j].sys_id);
        }


        if (i == docRawData.length - 1) {
          console.log(docRawData);
          setDocumentationTemplate(docRawData);
        }
      })




    }
  });
  console.log(myurl1);
  console.log(docRawData);


}

function getSNUrl(tableName, sysId) {
  return url + '/' + tableName + '.do?sys_id=' + sysId;
}

//Function to query Servicenow API
function snuFetch(token, url, post, callback) {
  var hdrs = {
    'Cache-Control': 'no-cache',
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  };
  if (token) //only for instances with high security plugin enabled
    hdrs['X-UserToken'] = token;

  var requestInfo = {
    method: 'get',
    headers: hdrs
  }

  if (post) {
    requestInfo.method = 'PUT';
    requestInfo.body = post;
  }

  fetch(url, requestInfo)
    .then(response => response.json())
    .then(data => {
      callback(data);
    });

}

const setDocumentationTemplate = info => {
  let updateSets = '';
  info.forEach(us => { updateSets += '<li><a href="' + us.url + '" target="_blank">' + us.name + '</a></li>' });

  let template = `<h3>Local Update Set:<ul> ${updateSets}</ul></h3>
  <h3><b>Documentation</b>:</h3><ul>`;

  info.forEach(us => {
    if (info.length > 1) template += '<li><a href="' + us.url + '" target="_blank">' + us.name + '</a><ul>';
    us.updates.forEach(upd => {
      template += `<li> ${upd.type} - <a href="${upd.url}" target="_blank">${upd.target_name}</a> </li>`; //${upd.type} - ${upd.target_name}
    });
    if (info.length > 1) template += '</ul>';


  });
  template += `</ul><h3><b>Testing</b>:</h3>
  <h4><b>   Testing Steps #1 (BAT and UAT):</b></h4>
  <ol><li>Navigate to</li><li></li></ol><p><b>Expected result:</b> </p>
  <h4><b>   Testing Steps #2 (BAT and UAT):</b></h4>
  <ol><li>Navigate to</li><li></li></ol><p><b>Expected result:</b> </p>
  <h3><b>Notes</b>:</h3>
  <ul><li><p></p></li></ul>
  `;
  document.getElementById('rawDocTemplate').textContent = template;

  document.getElementById('exampleDocTemplate').innerHTML = template;
};
