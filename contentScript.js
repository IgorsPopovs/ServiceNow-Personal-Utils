(() => {
  chrome.runtime.onMessage.addListener((obj, sender, response) => {
    newDocumetation();
      const { type, value, videoId } = obj;
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




})();


