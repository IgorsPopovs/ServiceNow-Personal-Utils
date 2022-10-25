(() => {
  chrome.runtime.onMessage.addListener((obj, sender, response) => {
    newDocumetation();
      const { type, myVars, videoId } = obj;

      if (type === "getVars") {
        console.log('getVars started');
        response({ 
          myVars: getVars(myVars), 
          url: location.origin, 
          frameHref: getFrameHref() 
        });
      }

      if (type === "LocalUpdateSetScrapper") {
        const gsftMain = (document.querySelector("#gsft_main") || document.querySelector("[component-id]")
        .shadowRoot.querySelector("#gsft_main"));
        const name = gsftMain.contentWindow.document.getElementById('sys_update_set.name').value;
        const state = '';
        response({
          name: name,
          state: state
        })
      }

      if (type === "NEW") {
          console.log("start-something");
          const gsftMain = (document.querySelector("#gsft_main") || document.querySelector("[component-id]")
          .shadowRoot.querySelector("#gsft_main"))
          const updateSetsTable = gsftMain.contentWindow.document.getElementById('sys_update_set.sys_update_xml.update_set_table')
          
          const header = updateSetsTable.rows[1];

          let typeCol = 0;
          let targetNameCol = 0;
          let actionCol = 0;
          let createdOnCol = 0;
          for (var cell = 0; cell < header.cells.length; cell++) {
            
            if (header.cells[cell]){
              let cellName = header.cells[cell].getAttribute('name');
              //console.log(header.cells[cell].getAttribute('name'));
              if (cellName == 'sys_created_on') createdOnCol = cell;
              if (cellName == 'type') typeCol = cell;
              if (cellName == 'target_name') targetNameCol = cell;
              if (cellName == 'action') actionCol = cell;
            }
          }
          console.log('typeCol = ' + typeCol);
          console.log('targetNameCol = ' + targetNameCol);

          let docTemplate = [];
          for (var row = 2; row < updateSetsTable.rows.length; row++) {
            let element = {};
            element.url = updateSetsTable.rows[row].cells[createdOnCol].getElementsByTagName('a')[0].getAttribute('href')
            element.type = updateSetsTable.rows[row].cells[typeCol].innerHTML;
            element.targetName = updateSetsTable.rows[row].cells[targetNameCol].innerHTML;
            element.action = updateSetsTable.rows[row].cells[actionCol].innerHTML;
            docTemplate.push(element);
          }

          console.info(createdOnCol);
          console.log(docTemplate);


          console.log(updateSetsTable);
          

          response(docTemplate);
          //newVideoLoaded();
      }
  });

  const newDocumetation = () => {
    console.log(document);
    const customerUpdates = document.getElementById("sys_update_set.sys_update_xml.update_set_table");
    console.log(customerUpdates);
  }

 //try to return the window variables, defined in the comma separated varstring string
 function getVars(varstring) {

    var doc = document;
    var ret = {};
    if (document.querySelectorAll('#gsft_main').length) //ui16
        doc = document.querySelector('#gsft_main').contentWindow.document;
    else if (document.querySelectorAll("[component-id]").length && //polaris ui
             document.querySelector("[component-id]").shadowRoot.querySelectorAll("#gsft_main").length) {
        doc = document.querySelector("[component-id]").shadowRoot.querySelector("#gsft_main").contentWindow.document;  
    }
    else if (document.querySelectorAll('div.tab-pane.active').length == 1) { //studio
        try{
            doc = document.querySelector('div.tab-pane.active iframe').contentWindow.document;
            ret.g_ck = doc.querySelector('input#sysparm_ck').value;
        }
        catch(ex){
            doc = document;
        }
    }

    if (varstring.indexOf('g_list') > -1)
        setGList(doc);


    var variables = varstring.replace(/ /g, "").split(",");
    var scriptContent = "";
    for (var i = 0; i < variables.length; i++) {
        var currVariable = variables[i];
        scriptContent += "try{ if (typeof window." + currVariable + " !== 'undefined') document.body.setAttribute('tmp_" + currVariable.replace(/\./g, "") + "', window." + currVariable + "); } catch(err){console.log(err);}\n"
    }

    var detail = { 
        "detail" : {
            "type" : "code", 
            "content" : scriptContent 
        }
    };
    if (typeof cloneInto != 'undefined') detail = cloneInto(detail, document.defaultView); //required for ff
    var event = new CustomEvent('snuEvent', detail);
    doc.dispatchEvent(event);

    for (var i = 0; i < variables.length; i++) {
        var currVariable = variables[i];
        ret[currVariable.replace(/\./g, "")] = doc.body.getAttribute("tmp_" + currVariable.replace(/\./g, ""));
        doc.body.removeAttribute("tmp_" + currVariable.replace(/\./g, ""));
    }
    return ret;
 }

  //get the href of the contentframe gsft_main
  function getFrameHref() {
    var frameHref = document.location.href;
    if (document.querySelectorAll('#gsft_main').length) //ui16
        frameHref = document.getElementById("gsft_main").contentWindow.location.href;
    else if (document.querySelectorAll("[component-id]").length && //polaris ui
            document.querySelector("[component-id]").shadowRoot.querySelectorAll("#gsft_main").length) {
        frameHref = document.querySelector("[component-id]").shadowRoot.querySelector("#gsft_main").contentWindow.location.href;  
    }
    else if (document.querySelectorAll('div.tab-pane.active').length == 1) { //studio
        try{
            frameHref = document.querySelector('div.tab-pane.active iframe').contentWindow.location.href;
        }
        catch(ex){
            
        }
    }
    return frameHref;
  }

})();


