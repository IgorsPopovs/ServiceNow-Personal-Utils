export default class NavigationList {
    constructor() {

        this.activeLinkLocation = 'link0';
        this.linkLocations = {
            link0 : '#loading',
            link1 : '#home',
            link2 : '#docTemplate'
        }

        this._setEvents();
        this.setActive('link0');   
           
        //this.setActive('link1');
    }

    getLinkLocation = url => {
        if (url == 'loading') this.activeLinkLocation = 'link0';
        else if (url == undefined) this.activeLinkLocation = 'link1';
        else if (url.includes('sys_update_set.do')) this.activeLinkLocation = 'link2';
        else this.activeLinkLocation = 'link1';

        return this;
    }

    setActive = (navListId) => {
        if (navListId != undefined) this.activeLinkLocation = navListId;
        
        if (this.activeLinkLocation == 'link0') {
            window.location = this.linkLocations[this.activeLinkLocation];
            return;
        }
        

        var links = document.querySelectorAll("a.navlist");
        Array.prototype.map.call(links, e => {
            e.className = "navlist";
            if (e.id == this.activeLinkLocation) {
                e.className = "activePage navlist";
                window.location = this.linkLocations[this.activeLinkLocation];
            }
        })
    }

    _setEvents = () => {
        document.querySelectorAll('a.navlist').forEach(item => {
            item.addEventListener('click', event => {
                var target = event.target;
                this.setActive(target.id);
            })
        })
    }
}

/*
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
  */