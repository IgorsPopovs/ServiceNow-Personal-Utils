const setActiveNavList = navListId => {
  var links = document.querySelectorAll("a.navlist");
  Array.prototype.map.call(links, function(e) {
      e.className = "navlist";
      if (e.id == navListId)
          e.className = "activePage navlist";
  })
}

document.querySelectorAll('a.navlist').forEach(item => {
  item.addEventListener('click', event => {
    var target = event.target;
    setActiveNavList(target.id);
  })
})


const setDocumentationTemplate = info => {
  console.log(info);
  let template = `<h3><b>Documentation</b>:</h3><ul>`
  info.forEach(element => {
    template += `<li>${element.type} - ${element.targetName}</li>`;
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



document.addEventListener('DOMContentLoaded', function () {
  if (document.querySelectorAll("section:target").length == 0) {
    window.location = "#home";
    setActiveNavList('link1');
  }
  
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      let tabId = tabs[0].id;
      var cookieStoreId = tabs[0].cookieStoreId || '';
      let urlFull = tabs[0].url;
      
      if (urlFull.includes('sys_update_set.do')) {
        window.location = "#docTemplate";
        setActiveNavList('link2');
  
        chrome.tabs.sendMessage(
          tabId,
          {type: "NEW", videoId: "id"},
          setDocumentationTemplate 
        );
        // use `url` here inside the callback because it's asynchronous!
      }

  });

  if (typeof InstallTrigger !== 'undefined') $('input[type="color"]').attr('type','text') //bug in FireFox to use html5 color tag in popup

});




