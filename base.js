/*
 *1 Web
 *2 Image
 *3 Video
 *4 Music
 *5 Ebooks
 *6 Torrents
 *7 Shared Uploads
 *8 News
 */

Element.prototype.hasClass=hasClass;
Element.prototype.addClass=addClass;
Element.prototype.removeClass=removeClass;
//Element.prototype.getElementsByClass=getElementsByClass;

if(document.domain=='localhost')
    base = "http://localhost/askwhole";
else
    base = "http://askwhole.com/beta";

//Helper Methods

//shorthand for document.getElementById
function $(a){
    return document.getElementById(a);
}

function playVid(rz){

    //for (var p in rz) alert(rz[p]);
    vidId=cleanUrl(rz.url);
    if (rz.publisher.indexOf('youtube.com')>=0) rz.publisher='YouTube';
    if (rz.publisher.indexOf('google.com')>=0) rz.publisher='Google';
    //    openPane(rz.title+' - '+rz.publisher,{
    //        w:475,
    //        h:365
    //    });
    openPane(rz.title+' - '+rz.publisher);
    var vidInfo = vidId.split('/');

               
               
    //var vidstring ='&nbsp;<A HREF="'+vidId+'" class="vidLink">LINK</A>';
    var vidstring ='';
    vidstring+='<center><embed ';
    vidstring+=' enableJavascript="false" menu="false" allowScriptAccess="never"';
    vidstring+=' allownetworking="internal" type="application/x-shockwave-flash"';
    vidstring+=' wmode="transparent" pluginspage="http://fpdownload.adobe.com/get/flashplayer/current/install_flash_player.exe" ';

    // Now we'll do a little acrobatics for the individual services.

    if (vidInfo[2].indexOf('youtube.com')>=0) {
        ////////////////////////////////////////////////////////////////////////////////
        // YouTube (Use browser URL, autoplays)
        ////////////////////////////////////////////////////////////////////////////////
        vidInfo=vidId.match(/v=.+$/);
        vidInfo=String(vidInfo).replace(/v=/g,'');
                  
        vidstring+=' src="http://www.youtube.com/v/'+vidInfo+'&autoplay=1" ';
        vidstring+=' height="350" width="425"></embed></center>';
    } else if (vidInfo[2].indexOf('video.google.com')>=0) {
        ////////////////////////////////////////////////////////////////////////////////
        // Google (Use browser URL, autoplays)
        ////////////////////////////////////////////////////////////////////////////////
        vidInfo=vidId.match(/docid=.+$/);
        vidInfo=String(vidInfo).replace(/docid=/g,'');
        vidstring+='  src="http://video.google.com/googleplayer.swf?docId='+vidInfo+'&autoplay=1" ';
        vidstring+=' height="350" width=425"></embed></center>';
    } else if (vidInfo[2].indexOf('metacafe.com')>0) {
        ////////////////////////////////////////////////////////////////////////////////
        // MetaCafe (Use browser URL, autoplays)
        ////////////////////////////////////////////////////////////////////////////////
        vidInfo=vidId.match(/watch.+$/);
        vidInfo=String(vidInfo).replace(/watch./,'');
        vidInfo=String(vidInfo).replace(/.$/,'');
        vidstring+=' flashVars="playerVars=autoPlay=yes" ';
        vidstring+=' src="http://www.metacafe.com/fplayer/'+vidInfo+'.swf" ';
        vidstring+=' width="400" height="345">';  
        vidstring+='</embed></center>';
    } else if (vidInfo[2].indexOf('ifilm.com')>=0) {
        ////////////////////////////////////////////////////////////////////////////////
        // iFilm (Use browser URL, autoplays)
        ////////////////////////////////////////////////////////////////////////////////
        vidInfo=vidId.match(/video.+$/);
        vidInfo=String(vidInfo).replace(/video./,'');
        vidstring+=' flashVars="flvbaseclip='+vidInfo+'&ip=true" ';
        vidstring+=' src="http://ifilm.com/efp" quality="high" name="efp" align="middle" ';
        vidstring+=' width="425" height="350">';  
        vidstring+='</embed></center>';
    } else if (vidInfo[2].indexOf('dailymotion.com')>=0) {
        ////////////////////////////////////////////////////////////////////////////////
        // Daily Motion (Use EMBED URL, autoplays)
        ////////////////////////////////////////////////////////////////////////////////
        vidstring+=' src="'+vidId+'" flashVars="autoStart=1" ';
        vidstring+=' width="425" height="334">';
        vidstring+='</embed></center>';
    } else if (vidInfo[2].indexOf('break.com')>=0) {
        ////////////////////////////////////////////////////////////////////////////////
        // Break (use EMBED URL, does not autostart)
        ////////////////////////////////////////////////////////////////////////////////
        vidstring+=' src="'+vidId+'&autostart=1" autostart="1" ';
        vidstring+=' width="425" height="350">';
        vidstring+='</embed></center>';
    } else if (vidInfo[2].indexOf('soapbox.msn.com')>=0) {
        ////////////////////////////////////////////////////////////////////////////////
        // MSN Soapbox (use the LINK, autostarts)
        ////////////////////////////////////////////////////////////////////////////////
        vidInfo=vidId.match(/vid=.+$/);
        vidInfo=String(vidInfo).replace(/vid=/g,'');
        vidstring+=' src="http://images.soapbox.msn.com/flash/soapbox1_1.swf" ';
        vidstring+=' flashvars="c=v&ap=true&v='+vidInfo+'" ';
        vidstring+=' height="360" width="412"></embed></center>';
    } else if (vidInfo[2].indexOf('shoutfile.com')>=0) {
        ////////////////////////////////////////////////////////////////////////////////
        // Shoutfile (use EMBED URL, does not autostart)
        ////////////////////////////////////////////////////////////////////////////////
        vidstring+=' src="'+vidId+'&autostart=true" flashvars="autostart=1" ';
        vidstring+=' width="400" height="300">';
        vidstring+='</embed></center>';
    } else if (vidInfo[2].indexOf('atomfilms.com')>=0) {
        ////////////////////////////////////////////////////////////////////////////////
        // AtomFilms (use URL, does not autostart), pretty lame embed service IMHO
        ////////////////////////////////////////////////////////////////////////////////
        vidInfo=vidId.match(/film\/.+(\.jsp)/);
        vidInfo=String(vidInfo[0]).replace(/film\//g,'');
        //                  vidInfo=String(vidInfo).replace(/\.jsp/g,'');
        vidstring+=' src="http://www.atomfilms.com:80/a/autoplayer/shareEmbed.swf?keyword='+vidInfo+'" ';
        vidstring+=' height="350" width="425" autostart="true"></embed></center>';
    } else {
        ////////////////////////////////////////////////////////////////////////////////
        // Failed.
        ////////////////////////////////////////////////////////////////////////////////
        vidstring += '></embed><BR><BR><BR>Unknown video service.</center>';
    } 
    // Insert our HTML and display the video window.
    $('paneBody').innerHTML=vidstring;
// Set the Y position of the video window so it's in the visible clip
//               var scrollTop = 0;
//               if (document.documentElement && document.documentElement.scrollTop)
//	                scrollTop = document.documentElement.scrollTop;
//               else if (document.body)
//	                scrollTop = document.body.scrollTop
//               vidPaneID.style.top=scrollTop+50+'px';
//               // Video window was hidden so we'll make it visible
//               vidPaneID.style.display='block';
}

function openDownload(rz){
    //alert(rz.url);
    openPane(rz.title+' - '+rz.publisher);
}

function openPane(paneTitle,config){
    //Principles:
    //there can only be one pane at a time, so no unique identifiers
    //Prevents error when nothing is passed as config array
    //if(!config) config={};
    //
    ////Default configuration when config is not passed
    //var cfg={
    //    l: 75,//left
    //    t: 100,//top
    //    w: 385,//width
    //    h: 280//height
    //    }
    ////if any config is passed, use it, otherwise default
    //for (var p in cfg)
    //  cfg[p] = (typeof config[p] == 'undefined') ? cfg[p] : config[p];


    //$('pane').setAttribute('style', 'left: '+cfg['l']+'px; top: '+cfg['t']+'px; width: '+cfg['w']+'px; height: '+(cfg['h']+20)+'px; text-align: center;');
    $('pane').style.display='block';
    $('paneBackground').style.display='block';
    //Create content

    $('paneBody').innerHTML='Loading.......';

    //Create title bar
    $('paneTitle').innerHTML=paneTitle;

    //add the close button on rite of the title bar

    document.addEventListener('keydown', paneListener,false);

}

function paneListener(e){
    //if esc key is pressed and if a box is active, close the box
    if(e.keyCode==27) closePane();
}

function closePane(){
    $('pane').style.display='none';
    $('paneBackground').style.display='none';
}

function hasClass(cls) {
    return this.className.match(new RegExp('(\\s|^)'+cls+'(\\s|$)'));
}

function addClass(cls) {
    if (!this.hasClass(cls)) this.className += " "+cls;
}

function removeClass(cls) {
    if (this.hasClass(cls)) {
        var reg = new RegExp('(\\s|^)'+cls+'(\\s|$)');
        this.className=this.className.replace(reg,' ');
    }
}

function getElementsByClass(className,tagName){
    //if tagName is not passed, process all the tags
    tagName = typeof(tagName) != 'undefined' ? tagName : '*';
    //create result array
    var result=new Array();
    //create a counter
    var c=0;
    //get required tags
    var tags=document.getElementsByTagName(tagName);
    //iterate through each tag
    for (var i = 0; i < tags.length; i++) {
        //splitting to check tags with multiple classes
        var classes = tags[i].className.split(' ');
        //iterate through each class and check
        for (var j=0;j<classes.length;j++){
            if (classes[j] == className)   {
                //save it and increase the counter
                result[c++]=tags[i];
            }
        }
    }
    //return the array
    return result;
}

function getSocialLinks(title,url){
    str='<a href="http://twitter.com/home?status='+title+' - '+url+'" title="Click to share this site on Twitter" target="_blank"><img src="images/twitter.jpg" alt="Twitter"/>Tweet this!</a><br>';
    str+='<a href="http://www.facebook.com/share.php?u='+url+'&t='+title+'" title="Click to share this site on Facebook" target="_blank"><img src="images/facebook.jpg" alt="Facebook"/>Share on Facebook!</a><br>';
    str+='<a href="http://digg.com/submit?phase=2&url='+url+'" title="Click to share this site on Digg" target="_blank"><img src="images/digg.jpg" alt="Digg!"/>Digg This!</a><br>';
    str+='<a href="http://www.myspace.com/Modules/PostTo/Pages/?t='+title+'&u='+url+'" title="Share on MySpace!" target="_blank"><img src="images/myspace.jpg" alt="MySpace!"/>Share on MySpace!</a><br>';
    str+='<a href="http://www.stumbleupon.com/submit?url='+url+'" title="Share on StumbleUpon!" target="_blank"><img src="images/stumbleupon.jpg" alt="StumbleUpon!"/>StumbleUpon!</a><br>';
    str+='<a href="http://del.icio.us/post?noui&v=4&jump=close&url='+url+'" title="Share on del.icio.us!" target="_blank"><img src="images/delicious.jpg" alt="Del.icio.us!"/>del.icio.us!</a><br>';
    str+='<a href="http://www.google.com/buzz/post?url='+url+'&imgurl=http://askwhole.com/images/askwhole.jpg" target="_blank"><img src="images/buzz.jpg" alt="Buzz!">Google Buzz</a><br>';
    str+='<a href="http://www.addthis.com/bookmark.php" title="AddThis - See more sites!" target="_blank"><img src="images/addthis.jpg" alt="AddThis!"/>More Sharing Sites!</a><br>';
    return str;
}

function setCookie(c_name, value) {
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + 999);
    document.cookie = c_name + "=" + escape(value) + (";expires=" + exdate.toGMTString());
}

function getCookie(c_name) {
    if (document.cookie.length > 0) {
        c_start = document.cookie.indexOf(c_name + "=");
        if (c_start != -1) {
            c_start = c_start + c_name.length + 1;
            c_end = document.cookie.indexOf(";", c_start);
            if (c_end == -1) c_end = document.cookie.length;
            return unescape(document.cookie.substring(c_start, c_end));
        }
    }
    return "";
}

function addCSS(url){
    var el= document.createElement('link');
    var atts= {
        rel:'stylesheet',
        type:'text/css',
        media:'screen',
        href:url
    };
    for(var p in atts) el[p]= atts[p];
    document.getElementsByTagName('head')[0].appendChild(el);
}

function getXmlHttp(){
    var xmlhttp;
    if (window.XMLHttpRequest) xmlhttp=new XMLHttpRequest();
    else  xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    return xmlhttp;
}

function pullFile(y)
{
    if (!flg[1] && y==1) //checks if share.htm is already retrieved
    {
        getContent('shareSiteContent', 'share.htm','');
        flg[1]=1;
    }
    if (!flg[2] && y==2)
    {
        flg[2]=1;
        getContent( 'shareSearchContent', 'shares.htm', insertLink );
            
    }
    if (!flg[3] && y==3)
    {
        flg[2]=1;
        getContent( 'followUsContent', 'follow.htm', '');

    }
       
}

function getContent(id,file,callback) {
    var xmlhttp = getXmlHttp();
    xmlhttp.onreadystatechange = function() {
        if( xmlhttp.readyState == 4 ) {
            document.getElementById( id ).innerHTML = xmlhttp.responseText;
                
            if( typeof callback == 'function' )
                callback();
        }
    }
    xmlhttp.open( "GET", file, true );
    xmlhttp.send( null );
}

function cleanUrl(ul){
    return unescape(ul.replace('http://www.google.com/url?q=','').replace(/&source=.*/,''))
}

function minutify(s){
    return("Duration- "+(s-(s%60))/60+":"+(s%60))
}

function openAbout(){
    pane=openPane('About!',{
        w:475,
        h:365
    });
    getContent('paneContent'+pane,'about.htm');
}

function openHelp(){
    pane=openPane('Help!',{
        w:475,
        h:365
    });
    getContent('paneContent'+pane,'help.htm');
}

function openFriends(){
    pane=openPane('Friendly Links!',{
        w:475,
        h:365
    });
    getContent('paneContent'+pane,'friends.htm');
}

function getSearchQuery(){
    return document.srch.s.value; 
}

function doLog(a){
    if(typeof(console) != "undefined")
        console.log(a);
}

//loading the searchControl
//var searchControl;
//load version 1 of the search API, don't load the CSS'
google.load("search", "1", {
    "nocss": true,
    "nooldnames" : true
});
//upon loading the API, fire init() method
google.setOnLoadCallback(init, true);
///creating some global variables
//t holds numeric value for current tab
var t;
//f holds numeric value for filter
var f=0;
//p holds numeric value for page
var tmp,v,cz=0;
//creating a flg array named flg
var flg = new Array();
//the search types/tabs -- first one is set null to nullify the first index - 0
var tabs=["null","web","images","videos","music","ebooks","torrents","shared","news"]
//the search types/tabs -- first one is set null to nullify the first index - 0
var filters=["null","blogs","imghosts","morevids","funnyvids","mp3","guitartabs","lyrics","pdf","doc","ppt","mediafire","nepali","technology","audiobooks","screencasts","newssites","newsbydate","headlines","world","business","nations","science","elections","politics","entertainment","sports","health",
"toprated","mostviewed","featured","latestvids","multiupload"
]
//array for results;
var rez;
//assign key listening job to returnKey method
window.addEventListener('keydown', returnKey, false)


//core methods
function init() {
    doLog("Initializing askWhole...")
    //initialize timeoutid
    window.timeOuts=new Array();
    //read the last active tab from cookie, if none found set the default tab to tab 5
    if (!(t = parseInt(getCookie("st")))) t = 5;
    //read the last active filter from cookie
    if (!(f = parseInt(getCookie("sf")))) f = 0;
    
    //html5-ff3.6/IE8
    //window.addEventListener('hashchange', readState, false);
    if (history.pushState){
        //html5-ff4
        window.onpopstate = function (event) {
            if (google.search) readState();
        }
    }else{
        //stupid old mechanism for polling the hash every 1/5th of a second
        window.hash0=window.location.hash;
        window.addEventListener('load', function(){
            setInterval('trackHash()', 200);
        }, false);
    }
    readState();
    loadTab();
}

function trackHash() {
    doLog("Tracking hash, the stupid old way!");
    if (window.location.hash!=window.hash0){
        window.hash0=window.location.hash;
        readState();
    }

}

function readState(){
    //if any parameters are passed
    doLog("Reading state");
    if (window.location.hash) {
        var key = window.location.hash
        var p = key.split('#');
        //separate parameter from value
        var s = p[1].split('&');
        //the counter
        c=0;
        while (s[c]) {
            var e = s[c++].split('=');
            if (e[0] == "type" || e[0] == "t") {
                //read the search type
                for (var i=1;i<=tabs.length;i++)
                    if (e[1]==tabs[i] || e[1]==i+'') t=i;
                
            }
            else if (e[0] == "filter" || e[0] == "f") {
                //read the filter type
                for (i=1;i<=filters.length;i++)
                    if (e[1]==filters[i] || e[1]==i+'') f=i;
            }
            //read the search query
            if (e[0] == "search" || e[0] == "s" || e[0] == "q" || e[0] == "query") document.srch.s.value = unescape(e[1]);
        }
    }
    //focus to the search bar
    document.srch.s.focus();
    //uncomment to make the last selected filter to be forgotten on page load
    //unSetFilter();
    triggerSearch();
}

function triggerSearch(){
    if (window.searchQuery!=getSearchQuery()){
        doLog('Search triggered');
        window.searchQuery=getSearchQuery();
        clearAllSearches();
        window.timeOuts[new Date()] = window.setTimeout(callSearch, 1000);
    }
    return false;
}

function clearAllSearches(){
    for(key in timeOuts ){  
        clearTimeout(timeOuts[key]);  
    } 
}

function callSearch(){
    //if (window.searchQuery==getSearchQuery()) return false;
    doLog('Search called');
    if (getSearchQuery()) {
        doLog("Searching for "+getSearchQuery());
        doSearch();
        modifyState(getSearchQuery());
    //insert 'share this search links
    //  insertShareLinks();
    }
    else{//if we don't have search query
//remove ShareSearchbox
//document.getElementById("shareSearchBox").style.display = "none";
    
}
}

function tabClicked(a){
    //save the clicked tab
    t=a;
    unSetFilter();
    //clear the page variable;
    p=1;
    loadTab();
}

function unSetFilter(){
    f=0;
    //also on cookie
    setCookie("sf", 0);
    for (i = 1; i <filters.length; i++) {
        tmps=getElementsByClass('filter' + i, 'li');
        if (tmps.length>0)
            tmps[0].removeClass('selectedFilter')
        
    }
}

function filterClicked(a){
    //unset current filter
    unSetFilter();
    //save the clicked filter
    f=a;
    //clear the page variable;
    p=1;
    loadFilter();
}

function loadTab() {
    doLog("Loading tab "+tabs[t]);
    
    //insert the filters
    enableFilters();
    //if filter is set, load the filter
    if(f!=0) loadFilter();
    //now we know it's an array in here
    rez= new Array()
    //lets put this tab on our secondary memory ;)
    setCookie("st", t);
    //unselect all tabs
    for (var i = 1; i <tabs.length; i++)
        $('tab' + i).className='';
    //set the selected tab
    $('tab' + t).className='selected';
    if (getSearchQuery()){
        clearAllSearches();
        callSearch();
    }
}

function loadFilter() {
    doLog("Loading filter "+filters[f]);
    //save new filter in cookie
    setCookie("sf", f);
    //set new filter to have selected class
    getElementsByClass('filter' + f, 'li')[0].addClass('selectedFilter');
//and finally trigger the search
if (getSearchQuery()) callSearch();
}

//function keyUp(e) {
//    
//    //    var kc = e.keyCode;
//    //        var a = [9, 16, 17, 18, 20, 27, 33, 34, 35, 36, 37, 38, 39, 40, 93];
//    //    for (i = 0; i < 15; i++) if (a[i] == kc) kc = false;
//    //    if (kc) triggerSearch();
//   
//}



function enableFilters()
{
    doLog("Enabling filters for "+ tabs[t]);
    for (var i = 1; i <tabs.length; i++)
        $('tab' + i+'_filters').className='notDisplayed';
    //set the selected tab
    $('tab' + t+'_filters').className='displayed';
//sug.style.background="url(lightBulb.gif) no-repeat left";
//tmp=" for "+getSearchQuery.substr(0,8);
//if (getSearchQuery().length>8) tmp+="...</a>";
    
}

function insertShareLinks(){//generates share this search
    doLog("Inserting 'Share this search' links!");
    $('shareSearchContent').innerHTML=getSocialLinks('askWhole Search - '+getSearchQuery(),encodeURI(window.location));
}

function modifyState(q){
    //change the page title
    document.title='askWhole Search - '+q;
    //the searching animation
    //document.getElementById("sm").value = "    Searching...";
    //document.getElementById("sm").style.backgroundImage = "url('i/loading.gif')";
    //document.getElementById("sm").style.backgroundRepeat = "no-repeat";
    //document.getElementById("shareSearchBox").style.display = "";
    
    //change the URL
    
    
    var filterText='';
    if (f!=0){
        filterText = '&filter='+filters[f];
    }
    hp='type='+tabs[t]+filterText+'&query='+escape(q);
    window.location.hash=hp;
    
}

function doSearch() {
    searchControl = new google.search.SearchControl();
    var options = new google.search.SearcherOptions();
    options.setExpandMode(google.search.SearchControl.EXPAND_MODE_OPEN);
    //searchControl.setResultSetSize(google.search.Search.FILTERED_CSE_RESULTSET);
    
    if (f==0){//for searches not triggered from suggestions
        //web
        searchControl.setResultSetSize(google.search.Search.FILTERED_CSE_RESULTSET);
        if (t == 1) {
            var ws=new google.search.WebSearch(); 
            //ws.setQueryAddition("pokhara");
            searchControl.addSearcher(ws, options); 
        //searchControl.addSearcher(new google.search.WebSearch(), options);
            
        }
        //searchControl.setResultSetSize(google.search.Search.LARGE_RESULTSET);
        //placing it here gets 10 results for web too, 8 for images, videos and news
        //searchControl.setResultSetSize(google.search.Search.FILTERED_CSE_RESULTSET);
        
        //images
        if (t == 2){
            //searchControl.addSearcher(new google.search.ImageSearch(), options);
            var searcher = new google.search.ImageSearch();
            
            if ((tmp=document.img_options.IMAGESIZE.value))
                searcher.setRestriction(google.search.ImageSearch.RESTRICT_IMAGESIZE,eval('google.search.ImageSearch.IMAGESIZE_'+tmp));
            
            if ((tmp=document.img_options.RIGHTS.value))
                searcher.setRestriction(google.search.ImageSearch.RESTRICT_RIGHTS,eval('google.search.ImageSearch.RIGHTS_'+tmp));
            
            if ((tmp=document.img_options.IMAGETYPE.value))
                searcher.setRestriction(google.search.ImageSearch.RESTRICT_IMAGETYPE,eval('google.search.ImageSearch.IMAGETYPE_'+tmp));
            
            if ((tmp=document.img_options.FILETYPE.value))
                searcher.setRestriction(google.search.ImageSearch.RESTRICT_FILETYPE,eval('google.search.ImageSearch.FILETYPE_'+tmp));
            
            if ((tmp=document.img_options.COLORFILTER.value))
                searcher.setRestriction(google.search.ImageSearch.RESTRICT_COLORFILTER,eval('google.search.ImageSearch.COLOR_'+tmp));
            
            if ((tmp=document.img_options.COLORIZATION.value))
                searcher.setRestriction(google.search.ImageSearch.RESTRICT_COLORIZATION,eval('google.search.ImageSearch.COLORIZATION_'+tmp));
            
            if ((tmp=document.img_options.SAFESEARCH.value))
                searcher.setRestriction(google.search.Search.RESTRICT_SAFESEARCH,eval('google.search.Search.SAFESEARCH_'+tmp));
            
            searchControl.addSearcher(searcher, options);
            searchControl.setResultSetSize(google.search.Search.LARGE_RESULTSET);
        }
            
        //videos
        if (t == 3)
            searchControl.addSearcher(new google.search.VideoSearch(), options);
            
        //music
        if (t == 4) 
            searchControl=setCSC('001619386089447790382:jvvawqna7p4');

        //ebooks
        if (t == 5) 
            searchControl=setCSC('001619386089447790382:xbmccopyzxk');
   
        //torrents
        if (t == 6) 
            searchControl=setCSC('001619386089447790382:fi7t1dzqyek');
        
        //shared upoads
        if (t == 7) 
            searchControl=setCSC('001619386089447790382:tpl-fwdebky');
        
        
        //news
        if (t == 8)
            searchControl.addSearcher(new google.search.NewsSearch(), options);
        
    }else {//it's a filter search'
 
 
        if (f == 1) {//blog
            searchControl.addSearcher(new google.search.BlogSearch(),options);
            searchControl.setResultSetSize(google.search.Search.LARGE_RESULTSET);
        }

        if (f==2)//image hosts
            searchControl=setCSC('001619386089447790382:vudxvvztb2y');

        if (f==3)//more video sites
            searchControl=setCSC('001619386089447790382:m8xiquw5j3o');

        if (f==4)//funny videos
            searchControl=setCSC('001619386089447790382:tbnyd-8rsos');

        if (f == 5){//mp3
            searchControl=addQuery('"parent directory" mp3 -html -htm -download -links');
        //doLog(searchControl);
        }
       
        if (f==6)//guitar tabs
        {
            searchControl=setCSC('001619386089447790382:qz1xddvwhe4');
        //            doLog(searchControl);
        }

        if (f==7)//lyrics
            searchControl=setCSC('001619386089447790382:pbok3wcjjvm');

        if (f == 8){//pdf
            searchControl=addQuery("filetype:pdf");
        }

        if (f == 9)//doc
            searchControl=addQuery("filetype:doc");
        

        if (f == 10)//ppt
            searchControl=addQuery("filetype:ppt");
        
        
        if (f == 11)//mediafire
            searchControl=addQuery("site:mediafire.com");
        

        if (f==12){//nepali
            var webSearch = new google.search.WebSearch();
            var extendedArgs = google.search.Search.RESTRICT_EXTENDED_ARGS;
            webSearch.setRestriction(extendedArgs, {
                //gl:'np'
                //hl:'np'
                //cr:'countryNP'
                //lr:'lang_np'
                geo:'np'
            });
            searchControl.addSearcher(webSearch,options);
            searchControl.setResultSetSize(google.search.Search.LARGE_RESULTSET);
        }
    
        if (f==13)//technology
            searchControl=setCSC('001619386089447790382:jutedbsvtog');
    
        if (f==14)//audiobooks
            searchControl=setCSC('001619386089447790382:ijw3lksl9g4');
    
        if (f==15)//screencasts
            searchControl=setCSC('001619386089447790382:fvp7vhqg7k8');

        if (f==16)//news sites
            searchControl=setCSC('001619386089447790382:cakd5d-zl2e');
        
        if(f==17){
            var newsSearch = new google.search.NewsSearch();
            newsSearch.setRestriction(google.search.Search.RESTRICT_EXTENDED_ARGS, {
                'scoring':'d'
            });
            searchControl.addSearcher(newsSearch, options);
            searchControl.setResultSetSize(google.search.Search.LARGE_RESULTSET);
        }
        
        if (f>=18 && f<=27){//for news topics
            var topic;
            var searcher = new google.search.NewsSearch()
            switch(f){
                case 18:
                    topic='h';
                    break;
                case 19:
                    topic='w';
                    break;
                case 20:
                    topic='b';
                    break;
                case 21:
                    topic='n';
                    break;
                case 22:
                    topic='t';
                    break;
                case 23:
                    topic='el';
                    break;
                case 24:
                    topic='p';
                    break;
                case 25:
                    topic='e';
                    break;
                case 26:
                    topic='s';
                    break;
                case 27:
                    topic='m';
                    break;
            }
            searcher.setRestriction(google.search.Search.RESTRICT_EXTENDED_ARGS,
            {
                "topic" : topic
            });
            searchControl.addSearcher(searcher, options);
            searchControl.setResultSetSize(google.search.Search.LARGE_RESULTSET);
        }
        
        if (f>=28 && f<=30){//top rated videos
            var web1 = new google.search.VideoSearch();
            switch(f){
                case 28:
                    web1.setQueryAddition('ytfeed:top_rated');
                    break;
                case 29:
                    web1.setQueryAddition('ytfeed:most_viewed');
                    break;
                case 30:
                    web1.setQueryAddition('ytfeed:recently_featured');
                    break;
            }
            
            searchControl.addSearcher(web1,options);
            searchControl.setResultSetSize(google.search.Search.LARGE_RESULTSET);
        }
        
        if (f == 31){
            searchControl.addSearcher(new google.search.VideoSearch(), options);
            searchControl.setResultOrder(google.search.Search.ORDER_BY_DATE);
        }
        
        if (f == 32)//multiupload
            searchControl=addQuery("site:multiupload.com");
        
    }

    //the search execution
    searchControl.setSearchCompleteCallback(this, searchComplete, null);
    searchControl.setNoResultsString("No Results for the query!");
    
    searchControl.draw(document.getElementById("s2"));
    
    searchControl.execute(getSearchQuery());
    //searchControl.gotoPage(3);
    

    setTimeout("document.getElementById('sm').style.backgroundImage='';", 1000);
//setTimeout("document.getElementById('sm').value='Search Again!';", 1000);

}


function addQuery(q){
    var searchControl = new google.search.SearchControl();
    var options = new google.search.SearcherOptions();
    options.setExpandMode(google.search.SearchControl.EXPAND_MODE_OPEN);
    var web1 = new google.search.WebSearch();
    web1.setQueryAddition(q);
    searchControl.addSearcher(web1,options);
    searchControl.setResultSetSize(google.search.Search.LARGE_RESULTSET);
    return searchControl;
}


function setCSC(id){
    var searchControl = new google.search.SearchControl();
    searchControl = new google.search.CustomSearchControl(id);
    searchControl.setResultSetSize(google.search.Search.FILTERED_CSE_RESULTSET);
    return searchControl;
}



function returnKey(k) {
    k=k.keyCode;
    if (!window.inTextBox){
        if ( k > 47 && k < (49+rez.length)) {
            //        form = document.createElement("form");
            //        form.method = "POST";
            //        form.action = rez[(k + 1) % 10].url;
            //        form.target = "_blank";
            //        document.body.appendChild(form);
            //        form.submit();
            window.open(cleanUrl(unescape(rez[(k + 1) % 10].url)));
        }
    }
}

function tester(str) {
    document.getElementById('test').innerHTML += str;
}

function serialize() {
    doLog("Serializing for "+getSearchQuery());
    var i,tags, c = 0;
    
   
    
    if (t==2 && f==0){
        tags = getElementsByClass("gs-snippet","div");
        
    }
    else{
        tags = getElementsByClass("gs-title","a");
    }
    
    for (i = 0; i < tags.length; i++) {
        //prevent double serialization
        if(tags[i].firstChild) if(tags[i].firstChild.className=='sn') continue;
        var sn = document.createElement('span');
        sn.className='sn';
        sn.innerHTML = ++c + ". ";
        tags[i].insertBefore(sn, tags[i].firstChild);
    }
}

function modifyForImage(){
    var tags=getElementsByClass("gs-image-scalable","a");
    var c=0;
    for (var i = 0; i < tags.length; i++) {
        tags[i].href=rez[i].url;
             
    //        var vi = document.createElement('div')
    //        vi.setAttribute('class', 'vi')
    //        vi.innerHTML='<a href="'+unescape(rez[c].url)+'">View Image</a>';
    //                
    //        tags[i].appendChild(vi);
    //    
    //        var vp = document.createElement('div');
    //        vp.setAttribute('class', 'vp')
    //        vp.innerHTML = 'from <a href="'+rez[c].originalContextUrl+'" target="_blank">'+rez[c].title+'</a>';
    //        tags[i].appendChild(vp);
    //        c++;
    
        
            
    }

    tags=getElementsByClass("gs-visibleUrl", "div");
    for (i = 0; i < tags.length; i++) {
        if (i>=rez.length) continue;
        //prevent adding extra links when already exists
        if(tags[i].children.length>1) continue;
        var links = document.createElement('span');
        links.setAttribute('class', 'links');   
        var ms = document.createElement('span');
        ms.setAttribute('class', 'ms');
        ms.innerHTML='<a href="http://tineye.com/search?url='+encodeURIComponent(rez[i].url)+'" target="_blank">More Sizes</a>';
        links.appendChild(ms);
        var ss = document.createElement('span');
        ss.setAttribute('class', 'ss');
        ss.innerHTML='<a href="http://www.gazopa.com/similar?key_url='+encodeURIComponent(rez[i].url)+'" target="_blank">Similar Images</a>';
        links.appendChild(ss);
        ss = document.createElement('span');
        ss.setAttribute('class', 'th');
        ss.innerHTML='<a href="http://fancytweet.com/tit?title='+encodeURI(rez[i].contentNoFormatting)+'&url='+encodeURIComponent(rez[c].url).replace('http%3A%2F%2F','')+'" target="_blank">TwitPic/YFrog this!</a>';
        links.appendChild(ss);
        tags[i].appendChild(links);
    }

}

function modifyForVideo(){

    var tags=getElementsByClass('gs-title', 'a');
    var c=0;
    for (var i = 0; i < tags.length; i++) {
        if (tags[i].getAttribute('href')) tags[i].setAttribute('href', cleanUrl(tags[i].getAttribute('href')));
    }
    tags=getElementsByClass('gs-publishedDate', 'div');
    c=0;
    for (i = 0; i < tags.length; i++) {
        if (c<rez.length) {
            dur = document.createElement('span');
            dur.setAttribute('class', 'dur');
            dur.innerHTML=minutify(rez[c].duration);
            tags[i].appendChild(dur);
            rat = document.createElement('span');
            rat.setAttribute('class', 'rat');
            rat.innerHTML="Rating: "+Math.round(rez[c].rating*100)/100;
            tags[i].appendChild(rat);
            c++;
        }
    }
    c=0;
    tags=getElementsByClass('gs-publisher', 'div');
    for (i = 0; i < tags.length; i++) {
        if (c<rez.length) {
            //prevent adding extra links when already exists
            if(tags[i].children.length>1) continue;
            var links=document.createElement('span');
            links.setAttribute('class', 'vlinks');
            dur = document.createElement('span');
            dur.setAttribute('class', 'play');
            dur.innerHTML='<a href="javascript:void(0)" onClick="javascript:playVid(rez['+c+']);">Play</a>';
            links.appendChild(dur);
            rat = document.createElement('span');
            rat.setAttribute('class', 'dwnld');
            //"Rating: "+Math.round(rez[c].rating*100)/100;
            rat.innerHTML='<a href="javascript:void(0)" onClick="javascript:openDownload(rez['+c+']);">Download</a>';
            links.appendChild(rat);
            tags[i].appendChild(links);
            c++;

        }
    }
    
}

function getLinks(c){
    var link = document.createElement('span')
    link.setAttribute('class', 'links')
    cached = document.createElement('span');
    cached.setAttribute('class', 'cached');
    cached.innerHTML = '<a href="'+rez[c].cacheUrl+'" target="_blank">Cached</a>';
    link.appendChild(cached);
    var text = document.createElement('span');
    text.setAttribute('id', 'text')
    text.innerHTML = '<a href="'+rez[c].cacheUrl+'&strip=1" target="_blank">Text-only</a>';
    link.appendChild(text);
    shrt = document.createElement('span');
    shrt.setAttribute('class', 'shrt');
    shrt.innerHTML = '<a href="http://j.mp/?v=3&u=' + encodeURIComponent(rez[c].url) + '&s=' + encodeURIComponent(rez[c++].titleNoFormatting) + ' - " target="_blank">Shorten</a>';
    link.appendChild(shrt);
    return link;
}


function addLinks() {
    var results = getElementsByClass("gsc-table-cell-snippet-close", "td");
    for (var i = 0;i<rez.length; i++) {
        //doLog(i+" Adding Links for "+getSearchQuery());    
        if(results[i])
        results[i].appendChild(getLinks(i));
        
    }
}

function modifyForNews() {
    var results = getElementsByClass("gs-result", "div");
    for (var i = 0;i<rez.length; i++) {
        //doLog(c+" Adding Links for "+getSearchQuery());        
        results[i].appendChild(getLinks(i));
    }
}

function modify() {
    doLog("Modifying for "+getSearchQuery());
    serialize();
    if (t==3) modifyForVideo();
    else if (t==2 && f==0) modifyForImage();
    else if (t==8 || f==1) modifyForNews();//for news and blogs
    else addLinks();
}

function searchComplete(searchControl1, searcher) {
    if (searcher.results.length > 0) {
        var str = "";
        exposed=searcher;
        var n = searcher.cursor.estimatedResultCount;
        if (n > 5000) str = "Around ";
        str+=n + " results";
        if (typeof searcher.cursor.searchResultTime!='undefined') str+=" ("+searcher.cursor.searchResultTime+" seconds)";
        document.getElementById('no').innerHTML=str;
        //document.getElementById('no').style.background='url(result.png) no-repeat';
        for (var i = 0; i < searcher.results.length; i++) {
            rez[i] = searcher.results[i];
        }
        createNavigation();
        modify();
    }
    else {
        document.getElementById('no').innerHTML = "";
    }
}

function navigateTo(a){
    exposed.gotoPage(a+1);
//doLog(exposed.cursor);
}

function createNavigation(){
    //doLog(exposed.cursor.pages.length+" pages of results for the search!");
    if (exposed.cursor.currentPageIndex==0) 
        document.getElementById('previous').style.display='none';
    else 
        document.getElementById('previous').style.display='';
    if (exposed.cursor.currentPageIndex==exposed.cursor.pages.length-1) 
        document.getElementById('next').style.display='none';
    else 
        document.getElementById('next').style.display='';
    str="Page "+(exposed.cursor.currentPageIndex+1)+" of "+exposed.cursor.pages.length;
    $('pagination_info').innerHTML=str;
    
}

function next(){
    if (exposed.cursor) navigateTo(exposed.cursor.currentPageIndex);
}

function previous(){
    if (exposed.cursor) navigateTo(exposed.cursor.currentPageIndex-2);
}
