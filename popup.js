// Update the relevant fields with the new data.
const showSection = sectionID => {
  const sections = document.getElementsByClassName('section');
  for (let i = 0; i < sections.length; i++) {
    if (sections[i].id != sectionID) {
      sections[i].style.setProperty('display', 'none');
    } else {
      sections[i].style.setProperty('display', 'block');
    }
  }
}

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

/*
window.onload = function() {
  chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
    let tabId = tabs[0].id;
    showSection('info');

    if (tabs[0].url.includes('sys_update_set.do')) {
      showSection('doc');

      chrome.tabs.sendMessage(
        tabId,
        {type: "NEW", videoId: "id"},
        setDocumentationTemplate 
      );
      // use `url` here inside the callback because it's asynchronous!
    }
});
*/
document.addEventListener('DOMContentLoaded', function () {
  showSection('info');
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      let tabId = tabs[0].id;
      var cookieStoreId = tabs[0].cookieStoreId || '';
      let urlFull = tabs[0].url;
      
      if (tabs[0].url.includes('sys_update_set.do')) {
        showSection('doc');
  
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




