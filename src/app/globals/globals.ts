import * as $ from 'jquery';
import { Pace } from 'pace-js';

declare function format(valueFormat:any, data:any):any;

export let GLOBALS = {
    menuList:"",
    initializeData:"",
    selectedIndexTo:"",
    selectedIndexFrom:"",
    selectedLyIndexTo:"",
    selectedLyIndexFrom:"",
    gridWeek:"",
    dateList:"",
    default_load_title:"",
    measureSelectionList:"",
    productSelectionTabs:[],
    marketSelectionTabs:"",
    skuSelectionTabs:"",
    projectID:"",
    projectName:"",
    COMPANY_NAME:"",
    settings:"",
    filter_list:"",
    territoryList:"",
    clientID:"",
    currencySign:"",
    timeSelectionUnit:"weekMonth",
    default_load_pageID:"",
    default_page_slug:"",
    is_static_page:"",
    with_future_gridWeek:"",
    with_future_selectedIndexTo:"",
    with_future_selectedIndexFrom:"",
    with_future_selectedLyIndexTo:"",
    with_future_selectedLyIndexFrom:"",
    hasGlobalFilter:true,
    globalFilterJsonKey:"",
    globalFilterKey:"",
    defaultGlobalFilterVal:"",
    globalFilter_SNAME:"",
    globalFilterEnabledList:"",
    productAndMarketFilterData:"",
    fetchProductAndMarketFilterOnTabClick:1,
    positiveStartColorCode:"",
    positiveEndColorCode:"",
    negativeStartColorCode:"",
    negativeEndColorCode:"",
    newItemColorCode:"",
    actPageServiceName:"",
    stopPace:false,
    filterOptions:{},
    isShowProductFilter:{},
    isShowMarketFilter:{},
    showVsDropdownTimeSelection:true,
    showLyRangeTextInTimeSelection:true,
    showDateInWeeks:true,
    getTimeSelection:"",
    getTimeSelectionDays:"",
    getMeasureSelection:"",
    getSkuSelection:"",
    getProductSelection:"",
    getSkuFilterSelection:"",
    getMarketSelection:"",
    isInitialLoaded:true,
    pageSwitched:false,
    stickyFilter:0,
    //showMarketFilter:"",
    stickyFilterMarket:0,
    ROOT_productSelectionTabs:"",
    ROOT_marketSelectionTabs:"",
    SIF:false,
    ROOT_stickyBackup_marketSelectionTabs:"",
    ROOT_measureSelectionList:"",
    ROOT_measureSelectionListSIF:"",
    measuresOptiondata:"",
    stickyFilterMarket_prestate:0,
    defaultFromWeek:"",
    defaultToWeek:"",
    defaultMeasureSelectionID:"",
    projectDirectiveFileVer:"",
    projectVer:"",
    pageUniqueId:"",
    onGoingRequests:[],
    paceObj: window['Pace'],
    ultChartColors:['#3E933E', '#AE832E', '#D5FF00', '#ca44ff', '#e951a4', '#336699', '#ca8c20', '#b52b2b', '#4ad2de', '#2b80b5', '#86b52b',"#3366CC", "#DC3912", "#FF9900", "#109618", "#990099", "#3B3EAC", "#0099C6", "#DD4477", "#66AA00", "#B82E2E", "#316395","#994499","#22AA99", "#AAAA11", "#6633CC", "#E67300", "#8B0707", "#329262", "#5574A6", "#3B3EAC"],
    // for efficiency component
    isShowProductMarketSelectionInlineFilter: false,
    getIndex (arr, obj) {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i].data === obj) {
                return i;
            }
        };
        return -1;
    },
    stopGlobalPaceLoader() {
        if (GLOBALS.paceObj != undefined ) {
            GLOBALS.paceObj.stop();
        }
    },
    updateGlobalStopPace() {
        if (GLOBALS.onGoingRequests != undefined && GLOBALS.onGoingRequests.length == 0 && GLOBALS.stopPace) {
            GLOBALS.stopPace = false;
        }
    },
    getRandomId() {
        var d = new Date();
        var timeData = d.getTime().toString();
        var dateTimeData = d.getFullYear().toString() + d.getMonth().toString() + d.getDay().toString() + d.getHours().toString() + d.getMinutes().toString() + d.getSeconds().toString();
        return dateTimeData + "-" + timeData;
    },
    getRandomData(fileType) {
        if(fileType == 'dir')
            return "?ver="+this.projectDirectiveFileVer;
        else
            return "?ver="+this.projectVer;
    },
    getRandomColor() {
        return '#'+Math.floor(Math.random()*16777215).toString(16);
    },
    getWordWrap(str, data) {
        if (str != undefined) {
            var regex = /\s+/gi;
            var strLength = data.length;
            var wordCount = str.trim().replace(regex, ' ').split(' ').length;
            if (strLength <= 4) {
                return str.trim();
            }
            else if (strLength == 5) {
                if (wordCount > 3) {
                    return str.trim().replace(regex, ' ').split(' ').slice(0, 3).join(" ") + "...";
                }
                else {
                    return str.trim().replace(regex, ' ').split(' ').slice(0, 3).join(" ");
                }
            }
            else {
                if (wordCount > 2) {
                    return str.trim().replace(regex, ' ').split(' ').slice(0, 2).join(" ") + "...";
                }
                else {
                    return str.trim().replace(regex, ' ').split(' ').slice(0, 2).join(" ");
                }
            }
        } else {
            return "";
        }
    },
    tsdSif:false,
    weekYearList:"",
    ROOT_days_weekYearList:"",
    ROOT_days_selectedIndexFrom:"",
    ROOT_with_future_selectedIndexTo:"",
    templateSlugName:"",
    ROOT_weekYearList:"",
    ROOT_selectedIndexFrom:"",
    ROOT_selectedIndexTo:"",
    ROOT_selectedLyIndexFrom:"",
    ROOT_selectedLyIndexTo:"",
    ROOT_with_future_weekYearList:"",
    ROOT_with_future_selectedIndexFrom:"",
    ROOT_with_future_selectedLyIndexFrom:"",
    ROOT_with_future_selectedLyIndexTo:"",
    timeSelectionStyleDDArray:[
        {'data':"YTD", 'label':"YTD", 'jsonKey':'YTD'},
        {'data':"4", 'label':"Latest 4 Weeks", 'jsonKey':'L4'},
        {'data':"12",'label':"Latest 12 Weeks", 'jsonKey':'L12'},
        {'data':"52", 'label':"Latest 52 Weeks", 'jsonKey':'L52'}
    ],
    setTimeSelectionVars() {
        /*if (this.tsdSif == true) { // For Tsd only
            this.weekYearList = this.ROOT_days_weekYearList;
            this.selectedIndexFrom = this.ROOT_days_selectedIndexFrom;
            this.selectedIndexTo = this.ROOT_with_future_selectedIndexTo;
        } else if (this.templateSlugName == 'PerformancePage' && this.timeSelectionUnit == 'period') {
            this.weekYearList = this.ROOT_weekYearList;
            this.selectedIndexFrom = this.ROOT_selectedIndexFrom;
            this.selectedIndexTo = this.ROOT_selectedIndexTo;
            this.selectedLyIndexFrom = this.ROOT_selectedLyIndexFrom;
            this.selectedLyIndexTo = this.ROOT_selectedLyIndexTo;
        } else if (this.templateSlugName == 'PerformancePage') {
            this.weekYearList = this.ROOT_with_future_weekYearList;
            this.selectedIndexFrom = this.ROOT_with_future_selectedIndexFrom;
            this.selectedIndexTo = this.ROOT_with_future_selectedIndexTo;
            this.selectedLyIndexFrom = this.ROOT_with_future_selectedLyIndexFrom;
            this.selectedLyIndexTo = this.ROOT_with_future_selectedLyIndexTo;
        } else {*/
            this.weekYearList = this.ROOT_weekYearList;
            this.selectedIndexFrom = this.ROOT_selectedIndexFrom;
            this.selectedIndexTo = this.ROOT_selectedIndexTo;
            this.selectedLyIndexFrom = this.ROOT_selectedLyIndexFrom;
            this.selectedLyIndexTo = this.ROOT_selectedLyIndexTo;
       //}
    },
    makeFilteredValue(mainObj) {
        var labelText = "";
        Object.keys(mainObj).forEach(function(key) {
            var innerObject = mainObj[key];
            labelText += innerObject.indexName.toUpperCase() + '=';
            if (innerObject.selectedDataList.length > 0) {
                Object.keys(innerObject.selectedDataList).forEach(function(key1) {
                    var obj = innerObject.selectedDataList[key1];
                    labelText += encodeURIComponent(obj.data) + ',';
                });
                labelText = labelText.substring(0, labelText.length - 1) + '&';
            }
            else {
                labelText += "&";
            }
        });
        labelText = labelText.substring(0, labelText.length - 1);
        return labelText;
    },
    setMeasureSelectionVars(){
        if(this.SIF == true){
            this.measuresOptiondata = this.ROOT_measureSelectionListSIF;
        }else{
            this.measuresOptiondata = this.ROOT_measureSelectionList;
        }
    },
    isShowPrivateLabel:true,
    isShowTyData:true,
    isShowLyData:true,
    isShowSkuFilter: false,
    timeSelectionModeVal:2,
    timeSelectionStyle:"DROPDOWN",
    stickyFilter_prestate:0,
    ROOT_stickyBackup_productSelectionTabs:"",
    measureLabel:"",
    vsLabel:"Last Period",
    callbackObjPerformance:{},
    requestType:"",
    projectAlias:"",
    projectTypeId:1,
    templateDetails:{},
    changeGrid:"",
    singleSkuName:"",
    showAllGridName:"",
    heightGrid:"",
    gridFirstHeader:{},
    pageSetup(obj) {
        // checking which layout will set or not
        if (obj != undefined) {
            if (obj.isLayout != undefined && obj.isLayout == true) {
                this.configuringLayout(obj);
            }
        }
    },
    configuringLayout(obj) {
        var windowWidth = $(window).width();
        var windowHeight = $(window).height();
        var responsiveStart = false;
        var selectionFrameHeight = (selectionFrameHeight == undefined) ? true : false;

        if (windowWidth < 768) {
            responsiveStart = true;
        }
        if (windowHeight <= 600) {
            windowHeight = 600;
        }

        var asideHeight = $("#left-panel").height();
        asideHeight = (asideHeight == undefined) ? 0 : asideHeight;

        var headerHeight = $('#header:visible').height();
        headerHeight = (headerHeight == undefined) ? 0 : headerHeight;

        var ribbonHeight = $("#ribbon").height(); //30
        ribbonHeight = (ribbonHeight == undefined) ? 0 : ribbonHeight;

        if (selectionFrameHeight == true) {
            var tempSelectionFrameHeight = $('#selectionFrame').height();
            selectionFrameHeight = 90;
        } else {
            selectionFrameHeight = selectionFrameHeight;
        }

        var footerHeight = $(".page-footer").height(); //15
        footerHeight = (footerHeight == undefined) ? 0 : footerHeight;


        var rowMarginBottom = 20;
        var podHeadHeight = 42;
        var defaultSpace = 20; // not using yet it may need in future

        var containerHeight = windowHeight - asideHeight - ribbonHeight - footerHeight - headerHeight;
        
        // set main container height without scrollbar
        $("#main").css({"height": containerHeight});

        var pageContainer = obj.pageContainer || "";
        var pageUniqueKey = obj.pageUniqueKey || "";

        // will set the height property when container row is one
        if (obj.layout == 'ONE_ROW_WITH_HEADER_FILTER') {

            var dyncSelectionFrameHeight = $("#"+pageUniqueKey+"SelectionFrame").height();
            podHeadHeight = 6;
            containerHeight = windowHeight - asideHeight - ribbonHeight - footerHeight - headerHeight - dyncSelectionFrameHeight - 13;
            $("#main").css({"height": containerHeight});

            var rowWithMargin = containerHeight;
            // set pod container height with default bottom margin
            $(pageContainer + " .podRowOne>article").css({"height": rowWithMargin});
            // set main widget without widget header height
            $(pageContainer + " .podRowOne>article>.jarviswidget").css({"height": rowWithMargin - podHeadHeight});
            // set pod container(widget container) height same as main widget height
            $(pageContainer + " .podRowOne>article>.jarviswidget>.podContainer").css({"height": "100%"});
        }

        // will set the height property when container row is one
        if (obj.layout == 'ONE_ROW') {

            var filterrowtwoht = 0;
            if($(".filterrowtwo") && $(".filterrowtwo") != undefined && $(".filterrowtwo").length > 0){
                filterrowtwoht = $(".filterrowtwo").height()+40;
            }
            var rowTwo = (containerHeight - selectionFrameHeight - filterrowtwoht);
            //var rowWithMargin = rowTwo - rowMarginBottom;
            var rowWithMargin = rowTwo;
            // set pod container height with default bottom margin
            $(pageContainer + " .podRowOne>article").css({"height": rowWithMargin});
            // set main widget without widget header height
            $(pageContainer + " .podRowOne>article>.jarviswidget").css({"height": rowWithMargin - podHeadHeight});
            // set pod container(widget container) height same as main widget height
            $(pageContainer + " .podRowOne>article>.jarviswidget>.podContainer").css({"height": "100%"});
        }
        // will set the height property when container row is one and page contribution analysis
        if (obj.layout == 'CONTRIBUTION_ANALYSIS') {
            var conHeight = ((containerHeight - selectionFrameHeight)) - 100;
            // set pod container height with default bottom margin
            $(pageContainer + " .contributionAnalysisContainer").css({"height": conHeight});
            $(pageContainer + " .contributionAnalysisContainer .podContainer").css({"height": (conHeight / 2) - 40});
            $(pageContainer + " .contributionAnalysisContainer .podContainerMid").css({"height": conHeight});
            $(pageContainer + " .bottomMsgContainer").css({"height": 40});
        }
        // will set the height property when container row is one
        if (obj.layout == 'ONE_ROW_WITHOUT_TIME_FRAME') {
            var rowTwo = (containerHeight);
            var rowWithMargin = rowTwo - rowMarginBottom;
            var halfrowWithMargin = (rowTwo / 2) - rowMarginBottom - 22;
            // set pod container height with default bottom margin
            $(pageContainer + " .podRowOne>article").css({"height": rowWithMargin});
            // set main widget without widget header height
            $(pageContainer + " .podRowOne>article>.jarviswidget").css({"height": rowWithMargin - podHeadHeight});
            // set pod container(widget container) height same as main widget height
            $(pageContainer + " .podRowOne>article>.jarviswidget>.podContainer").css({"height": "100%"});

            // set pod container height with default bottom margin
            $(pageContainer + " .halfRow>article").css({"height": halfrowWithMargin});
            // set main widget without widget header height
            $(pageContainer + " .halfRow>article>.jarviswidget").css({"height": halfrowWithMargin - podHeadHeight});
            // set pod container(widget container) height same as main widget height
            $(pageContainer + " .halfRow>article>.jarviswidget>.podContainer").css({"height": "100%"});

        }
        // will set the height property when container row is one
        if (obj.layout == 'TWO_ROW_GRID') {
            var rowOne = ((containerHeight - selectionFrameHeight) * 2) / 3;
            var rowTwo = (containerHeight - selectionFrameHeight) / 3;
            var rowWithMargin = rowOne - rowMarginBottom;
            var rowWithMargin2 = rowTwo - rowMarginBottom;
            // set pod container height with default bottom margin

            $(pageContainer + " .podRowOne>article").css({"height": rowWithMargin});
            $(pageContainer + " .podRowTwo>article").css({"height": rowWithMargin2});
            $(pageContainer + " .podRowTwo>article>.podContainer").css({"height": "100%"});
            // set main widget without widget header height
            $(pageContainer + " .podRowOne>article>.jarviswidget").css({"height": rowWithMargin - podHeadHeight});
            // set pod container(widget container) height same as main widget height
            $(pageContainer + " .podRowOne>article>.jarviswidget>.podContainer").css({"height": "100%"});
        }
        // will set the height property when container row is one
        if (obj.layout == 'TWO_ROW_GRID_WITHOUT_MARGIN') {
            var rowOne = ((containerHeight) * 2) / 3;
            var rowTwo = (containerHeight) / 3;
            var rowWithMargin = rowOne - rowMarginBottom;
            var rowWithMargin2 = rowTwo - rowMarginBottom;
            // set pod container height with default bottom margin

            $(pageContainer + " .podRowOne>article").css({"height": rowWithMargin});
            $(pageContainer + " .podRowTwo>article").css({"height": rowWithMargin2});
            $(pageContainer + " .podRowTwo>article>.podContainer").css({"height": "100%"});
            // set main widget without widget header height
            $(pageContainer + " .podRowOne>article>.jarviswidget").css({"height": rowWithMargin - podHeadHeight});
            // set pod container(widget container) height same as main widget height
            $(pageContainer + " .podRowOne>article>.jarviswidget>.podContainer").css({"height": "100%"});
        }

        // will set the height property when container row are two
        if (obj.layout == 'TWO_ROW') {
            var rowTwo = ((containerHeight - selectionFrameHeight) / 2);
            var rowWithMargin = rowTwo - rowMarginBottom + 20;
            $(pageContainer + " .podRowTwo>article").css({"height": rowWithMargin});

            // set main widget without widget header height
            $(pageContainer + " .podRowTwo>article>.jarviswidget").css({"height": rowWithMargin - podHeadHeight});
            // set pod container(widget container) height same as main widget height
            $(pageContainer + " .podRowTwo>article>.jarviswidget>.podContainer").css({"height": "100%"});

            if ( obj.initLayout == true)
            {
                var initLayoutVar = {};
                initLayoutVar[pageContainer + " .podRowTwo>article"] = "{height: "+rowWithMargin+'px}';
                initLayoutVar[pageContainer + " .podRowTwo>article>.jarviswidget"] = "{height:" + (rowWithMargin - podHeadHeight) + 'px}';
                initLayoutVar[pageContainer + " .podRowTwo>article>.jarviswidget>.podContainer"] = "{height:100%}";
                this.setInitLayout(initLayoutVar);
            }

            var initLayoutVar = {};
            initLayoutVar[pageContainer + " .podRowTwo>article"] = "{height: "+rowWithMargin+'px}';
            initLayoutVar[pageContainer + " .podRowTwo>article>.jarviswidget"] = "{height:" + (rowWithMargin - podHeadHeight) + 'px}';
            initLayoutVar[pageContainer + " .podRowTwo>article>.jarviswidget>.podContainer"] = "{height:100%}";
            this.setInitLayout(initLayoutVar);
        }

        if (obj.layout == 'TWO_ROW_CUSTOM') {
            var rowTwo = ((containerHeight) / 2);
            var rowWithMargin = rowTwo - rowMarginBottom + 10;
            $(pageContainer + " .podRowTwo>article").css({"height": rowWithMargin});

            // set main widget without widget header height
            $(pageContainer + " .podRowTwo>article>.jarviswidget").css({"height": rowWithMargin - podHeadHeight});
            // set pod container(widget container) height same as main widget height
            $(pageContainer + " .podRowTwo>article>.jarviswidget>.podContainer").css({"height": "100%"});

            if ( obj.initLayout == true)
            {
                var initLayoutVar = {};
                initLayoutVar[pageContainer + " .podRowTwo>article"] = "{height: "+rowWithMargin+'px}';
                initLayoutVar[pageContainer + " .podRowTwo>article>.jarviswidget"] = "{height:" + (rowWithMargin - podHeadHeight) + 'px}';
                initLayoutVar[pageContainer + " .podRowTwo>article>.jarviswidget>.podContainer"] = "{height:100%}";
                this.setInitLayout(initLayoutVar);
            }
            
            var rowTwo = (containerHeight);
            var rowWithMargin = rowTwo - rowMarginBottom;
            var halfrowWithMargin = (rowTwo / 2) - rowMarginBottom - 22;
            // set pod container height with default bottom margin
            $(pageContainer + " .podRowOne>article").css({"height": rowWithMargin});
            // set main widget without widget header height
            $(pageContainer + " .podRowOne>article>.jarviswidget").css({"height": rowWithMargin - podHeadHeight});
            // set pod container(widget container) height same as main widget height
            $(pageContainer + " .podRowOne>article>.jarviswidget>.podContainer").css({"height": "100%"});

            // set pod container height with default bottom margin
            $(pageContainer + " .halfRow>article").css({"height": halfrowWithMargin});
            // set main widget without widget header height
            $(pageContainer + " .halfRow>article>.jarviswidget").css({"height": halfrowWithMargin - podHeadHeight});
            // set pod container(widget container) height same as main widget height
            $(pageContainer + " .halfRow>article>.jarviswidget>.podContainer").css({"height": "100%"});        
            
        }        
        
        if (obj.layout == 'ONE_ROW_CUSTOM') {
            var pContainerHeight = windowHeight - asideHeight - ribbonHeight;
            $(pageContainer).css("height", pContainerHeight + 5);
        }    
        
        // will set the height property when container are splitters
        if (obj.layout == 'SPLITTER_CONTAINER') {

            // top and bottom splitter
           
        }

        // will set the height property when container are splitters
        if (obj.layout == 'SPLITTER_CONTAINER_HORIZONTAL') {
            // top and bottom splitter
            $(obj.splitContainer).jqxSplitter({
                height: containerHeight - rowMarginBottom,
                width: '100%',
                orientation: 'horizontal',
                panels: [
                    {collapsible: false, size: '70%'},
                    {size: '30%'}
                ]
            });
        }    
        
        // will set the height property when container are splitters
        if (obj.layout == 'SPLITTER_CONTAINER_GROWTH_DECLINE') {
            // top and bottom splitter
            /*$(obj.splitContainer).jqxSplitter({
                height: containerHeight - rowMarginBottom,
                width: '100%',
                orientation: 'horizontal',
                panels: [
                    {collapsible: false, size: '45%'},
                    {size: '55%'}
                ]
            });

            // left and right splitter
            $(obj.splitter).jqxSplitter({
                width: '100%',
                panels: [
                    {size: "20%"}
                ]
            });*/

            var rowTwo = (containerHeight) / 2;
            var rowWithMargin = rowTwo - rowMarginBottom;
            // set pod container height with default bottom margin
            $(pageContainer + " .podRowTwo>article").css({"height": rowWithMargin});
            $(pageContainer + " .podRowTwo>article>.podContainer").css({"height": "100%"});
        }

        // will set the height property when container is splitter
        if (obj.layout == 'SPLITTER_CONTAINER_SINGLE') {

            /*
            if (!responsiveStart) { // desktop
                $(obj.splitContainer).jqxSplitter({
                    width: '100%',
                    height: containerHeight - rowMarginBottom,
                    orientation: 'vertical',
                    panels: [
                        {size: "20%"}
                    ]
                });
            } else { // responsive
                $(obj.splitContainer).jqxSplitter({
                    width: '100%',
                    //height: containerHeight - rowMarginBottom,
                    orientation: 'horizontal',
                    panels: [
                        {size: "100%"}
                    ]
                });
            }
            */

            var oneThird = (containerHeight) / 3;
            var oneThirdWithMargin = oneThird - rowMarginBottom;
            var twoThirdWithMargin = (oneThird * 2) - rowMarginBottom;
            var fullHeight = containerHeight - rowMarginBottom;

            var half = (containerHeight) / 2;
            var halfWithMargin = half - rowMarginBottom;

            if (responsiveStart) {
                // setting one/third row height
                $(pageContainer + " .oneThirdRow>article>.jarviswidget").css({"height": "100%"});

                // setting two/third row height
                $(pageContainer + " .twoThirdRow>article>.jarviswidget").css({"height": "100%"});

                // setting Half row height
                $(pageContainer + " .halfRow>article>.jarviswidget").css({"height": "100%"});

                // setting Full row height
                $(pageContainer + " .fullRow>article>.jarviswidget").css({"height": "100%"});
            } else {
                // setting one/third row height
                $(pageContainer + " .oneThirdRow>article>.jarviswidget").css({"height": oneThirdWithMargin});

                // setting two/third row height
                $(pageContainer + " .twoThirdRow>article>.jarviswidget").css({"height": twoThirdWithMargin - 40});

                // setting Half row height
                $(pageContainer + " .halfRow>article>.jarviswidget").css({"height": halfWithMargin - 40});

                // setting Full row height
                $(pageContainer + " .fullRow>article>.jarviswidget").css({"height": fullHeight - 40});
            }

            // setting one/third row height
            $(pageContainer + " .oneThirdRow>article").css({"margin-bottom": 10});
            $(pageContainer + " .oneThirdRow>article>.jarviswidget>.podContainer").css({"height": "100%"});

            // setting two/third row height
            $(pageContainer + " .twoThirdRow>article>.jarviswidget>.podContainer").css({"height": "100%"});

            // setting Half row height
            $(pageContainer + " .halfRow>article>.jarviswidget>.podContainer").css({"height": "100%"});

            // setting Full row height
            $(pageContainer + " .fullRow>article>.jarviswidget>.podContainer").css({"height": "100%"});
        }

        if (obj.layout == 'SPLITTER_CONTAINER_LEFT_ONE_ROW') {
            var height = containerHeight - rowMarginBottom;
            $(obj.splitContainer + " .right_container").css({"height": height, "overflow-x":"hidden","overflow-y":"visible"});
        }

        // will set the height property when container is splitter
        if (obj.layout == 'SPLITTER_CONTAINER_SINGLE_TWO_ROW') {
            // left and right splitter
            $(obj.splitter).jqxSplitter({
                width: '100%',
                height: containerHeight - rowMarginBottom,
                panels: [
                    {size: "20%"}
                ]
            });
            var rowTwo = (containerHeight) / 2;
            var rowWithMargin = rowTwo - rowMarginBottom;
            // set pod container height with default bottom margin
            $(pageContainer + " .podRowTwo>article").css({"height": rowWithMargin});
            $(pageContainer + " .podRowTwo>article>.podContainer").css({"height": "100%"});
        }
    },
    setInitLayout(objs) {
        var styleNode = document.createElement('style');
        styleNode.type = "text/css";

        Object.keys(objs).forEach(function(key) {
            var value = objs[key];
            var styleText = document.createTextNode(key + value);
            styleNode.appendChild(styleText);
        });

        document.getElementsByTagName('head')[0].appendChild(styleNode);
    },
    makeLabelText(mainObj) {
        var labelText = "";
        Object.keys(mainObj).forEach(function(key) {
            var innerObject = mainObj[key];
            if (innerObject.selectedDataList.length > 0) {
                labelText += "<b>" + innerObject.label.toUpperCase() + ":</b>";
                Object.keys(innerObject.selectedDataList).forEach(function(subkey) {
                    var obj = innerObject.selectedDataList[subkey];
                    if (innerObject.selectedDataList.length > 0) {
                        labelText += ",";
                    }
                    labelText += " " + obj.label.toUpperCase();
                });
                labelText += ". ";
            }
        });
        return labelText;
    },
    setProductSelectionVars() {
        //this.productModalWidth = 1200; // Product popup window width
    },
    setMarketSelectionVars() {
        //this.productModalWidth = 1200; // Product popup window width
    },
    getFullScreenClickEvent(obj) {
        $("#"+obj).toggleClass("fullscreen");
        $("#"+obj).find('i').toggleClass("fa-expand fa-compress");
    },
    nFormatter (num, decimal) {
        if (typeof (decimal) === 'undefined')
            decimal = 0;
        var isNegative = false;
        var formattedNumber;
        if (num < 0) {
            isNegative = true;
        }
        num = Math.abs(num);
        if (num >= 1000000) {
            formattedNumber = (num / 1000000).toFixed(2).replace(/\.0$/, '') + 'm';
        } else {
            if (decimal) {
                formattedNumber = num.toFixed(decimal).replace(/./g, function(c, i, a) {
                    return c;
                });
            }
            else {
                formattedNumber = num.toFixed(0).replace(/./g, function(c, i, a) {
                    return i && c !== "." && ((a.length - i) % 3 === 0) ? ',' + c : c;
                });
            }
        }
        if (isNegative) {
            formattedNumber = '-' + formattedNumber;
        }
        return formattedNumber;
    },
    getPercent(totalValue, singleValue) {
        return ((singleValue * 100) / totalValue).toFixed(1);
    },
    setProjectPageCustomErrors (errors, actPageServiceName, pageID) {
        if (pageID != undefined) {
            this.actPageServiceName[pageID].showErrorPopUp = true;
            this.actPageServiceName[pageID].serviceName = actPageServiceName;
            this.actPageServiceName[pageID].errorMessage = errors;
            $('#projectPageCustomErrors').css({ top: $('#content').position().top +'px' });
            $('#projectPageCustomErrors div.projectPageCustomErrorsDv').css({ top: $('#content').position().top +'px' });
            $('body').addClass('customErrOverflowHide');
        }
    },
    getMaxValue(arr, valarray) {
        var val_max = 0;
        Object.keys(arr).forEach(function(key) {
            var value = arr[key];
            var val = value[valarray] * 1;
            if (val > val_max) {
                val_max = val;
            }
        });
        return val_max;
    },
    getSecondMaxValue (arr, valarray, max) {
        var val_secondmax = 0;
        Object.keys(arr).forEach(function(key) {
            var value = arr[key];
            var val = value[valarray];
            if (val > val_secondmax && val < 100 && val != max) {
                val_secondmax = val;
            }
        });
        return val_secondmax;
    },
    getMinValue(arr, valarray) {
        var val_min = 100;
        Object.keys(arr).forEach(function(key) {
            var value = arr[key];
            var val = value[valarray];
            if (val < val_min && val > 0) {
                val_min = val;
            }
        });
        return val_min;
    },
    getMinValueIncMinus(arr, valarray) {
        var val_min = 0;
        Object.keys(arr).forEach(function(key) {
            var value = arr[key];
            var val = value[valarray];
            if (val < val_min) {
                val_min = val;
            }
        });
        return val_min;
    },
    getWordWrapInLine(str) {
        var wrapText = "";
        var words = str.split(" ");
        for (var i = 0; i < words.length; i++) {
            if (i > 0)
                wrapText += "\n";
            wrapText += words[i];
        }
        return wrapText;
    },
    getWordWrapForDate(str) {
        var wrapText = "";
        var words = str.split("-");
        for (var i = 0; i < words.length; i++) {
            if (i > 0)
                wrapText += "\n";
            wrapText += words[i];
        }
        return wrapText;
    },
    layoutSetup(obj) {
        /*if (setLayoutInit == true) {
            setLayoutInit = false;
            //setTimeout(function() {
            configuringLayout(obj);
            //},1000);
        }
        else {*/
            this.configuringLayout(obj);
        //}
    },
    getDynamicHeight(obj) {
        var windowWidth = $(window).width();
        var windowHeight = $(window).height();
        var responsiveStart = false;
        var selectionFrameHeight = (selectionFrameHeight == undefined) ? true : false;

        if (windowWidth < 768) {
            responsiveStart = true;
        }
        if (windowHeight <= 600) {
            windowHeight = 600;
        }

        var asideHeight = $("#left-panel").height();
        asideHeight = (asideHeight == undefined) ? 0 : asideHeight;

        var headerHeight = $('#header:visible').height();
        headerHeight = (headerHeight == undefined) ? 0 : headerHeight;

        var ribbonHeight = $("#ribbon").height(); //30
        ribbonHeight = (ribbonHeight == undefined) ? 0 : ribbonHeight;

        if (selectionFrameHeight == true) {
            var tempSelectionFrameHeight = $('#selectionFrame').height();
            selectionFrameHeight = 90;
        } else {
            selectionFrameHeight = selectionFrameHeight;
        }

        var footerHeight = $(".page-footer").height(); //15
        footerHeight = (footerHeight == undefined) ? 0 : footerHeight;


        var rowMarginBottom = 20;
        var podHeadHeight = 42;
        var defaultSpace = 20; // not using yet it may need in future

        var containerHeight = windowHeight - asideHeight - ribbonHeight - footerHeight - headerHeight;
        
        // set main container height without scrollbar
        //$("#main").css({"height": containerHeight});

        return containerHeight;
    },
    getProjectType(projectID) {
        if(projectID == 1)
            return "lcl";
        else if(projectID == 2)
            return "relayplus";
        else if(projectID == 15)
            return "tesco-store-daily";
        else if(projectID == 19)
            return "nielsen";
        else if(projectID == 27)
            return "impulseViewJS";
    },
    isScreenLocked:false,
    screenLock:[],
    setScreenLock() {
        this.isScreenLocked = true;
        var dummydata = 'data';
        this.screenLock.push(dummydata);
    },
    removeScreenLock() {
        this.screenLock.pop();
        if(this.screenLock.length>0)
            this.isScreenLocked = true;
        else
            this.isScreenLocked = false;
    },
    defaultClusterID:"",
    myProductBaseDate:"",
    weekEndingText:"",
    myStoreBaseDate:"",
    showMaintainanceReload:"",
    showMaintainancePopup:false,
    selectedGlobalFilter:"",
    territoryLevel:"",
    paramsCookie:"",
    dcViewState:"",
    errorsArray:[],
    checkProjectHealth(errors) {
        this.errorsArray = errors;
        var checkResults = "";
        var errorMsgPart = "";
        checkResults = "<div id='actionPart' style='background:#F2FAFC; width:100%; padding:15px; border: 1px solid red; border-radius: 5px;'><i class='fa-fw fa fa-exclamation-triangle' style='font-size: 20px; color: #BC1C1C; margin-top: 7px;'></i><label style='position: absolute; margin-left: 8px; margin-top: 3px; font-size: 20px; color: #BC1C1C;'>Project Configuration Missing</label><a style='float:right;' onclick='location.reload();' href='javascript:void(0);' class='btn btn-labeled btn-success'><span class='btn-label'><i class='glyphicon glyphicon-refresh'></i></span>Reload </a>&nbsp;&nbsp;&nbsp;<a style='float:right; margin-right: 10px;' onclick='jsToNg();' href='javascript:void(0);' class='btn btn-labeled btn-warning'><span class='btn-label'><i class='glyphicon glyphicon-envelope'></i></span>Send Error Report </a><hr style='border-color:#BC1C1C;'/>";

        checkResults += '<div id="successMsg" style="display:none;" class="alert alert-block alert-success"><h4 class="alert-heading"><i class="fa fa-thumbs-o-up"></i> Success!</h4><p>Error report has been post successfully.</p></div>';

        checkResults += '<div id="failMsg" style="display:none;" class="alert alert-block alert-danger"><h4 class="alert-heading"><i class="fa fa-exclamation-triangle"></i> Fail!</h4><p>Error report could not post.</p></div>';

        var arrayLength = errors.length;
        for (var i = 0; i < arrayLength; i++)
        {
            errorMsgPart = errorMsgPart + "<div class='msgs alert alert-danger fade in'><i style='margin-right:5px;' class='fa-fw fa fa-times'></i>" + errors[i] + "</div>";
        }
        checkResults = checkResults + errorMsgPart + "</div>";

        $('body').append("<div id='healthChecker' style='display:none; position:fixed; top:0; bottom:0; left:0; right:0; z-index:10000000000000000005'; ><div style='position:fixed; top:0; bottom:0; left:0; right:0; background:black; opacity:0.8; filter: alpha(opacity=100); z-index:10000000000000000005'></div><div style='position:absolute; top:30%; margin:0 25%; z-index:10000000000000000005; width:50%;'>" + checkResults + "</div></div>");
        $('#healthChecker').fadeIn(600);
    },
    startWaiting() {
    },
    endWaiting() {
    },
    savedFilters:"",
    filtersGrid:"",
    CMN_FILTER_productSelectionTabs:"",
    CMN_FILTER_marketSelectionTabs:"",
    globalFilterData:{},
    filtersGridModule(data) {
        var columnsName = [];
        columnsName.push({
            field: 'label', 
            title: 'Saved Report', 
            filterable: true,
            width: '80%'
        });
        columnsName.push({
            field: 'filterId', 
            title: 'Action', 
            filterable: false,
            template: '<button class="btn btn-primary" ng-click="editFilterNameForm(#=filterId#, \'#=label#\')">Rename</button>&nbsp;&nbsp;<button class="btn btn-danger" ng-click="removeFilterForm(#=filterId#, \'#=label#\')">Delete</button>&nbsp;&nbsp;',
            width: '20%'
        });
        this.filtersGrid = {
            resizable: true,
            selectable: "row",
            dataSource: {
                type: "json",
                transport: {
                    read: function (options) {
                        options.success(data.filters);
                    },
                    parameterMap: function (data, operation) {
                        return JSON.stringify(data.filters);
                    }
                },
                serverPaging: false,
                serverSorting: false,
                serverFiltering: false
            },
            pageable: false,
            sortable: false,
            filterable: true,
            columns: columnsName
        };
        return this.filtersGrid;
    },
    defaultLoadPageTitle:"",
    page_title:"",
    mainPage:"",
    activePage:{
        templateSlug:this.default_page_slug,
        pageID:this.default_load_pageID
    },
    default_menu_item:{
        slug:""
    },
    setSvgMapTooltip (container, valueFormat) {
        valueFormat = (valueFormat == undefined) ? "#,##0.##" : valueFormat;
        // custom tooltip for map
        $(container + " path").hover(function(event) {
            var idName = $(this).attr("id");
            if (idName != undefined) {
                idName = idName.split('_');
                var name = "";
                for (var i = 1; i < idName.length; i++) {
                    name += idName[i] + ' ';
                }
                name = name.substr(0, name.length - 1);
                var type = $('.customTooltip').attr("type");
                var data = $(this).attr("tooltipData");
                if (type == 'variance') {
                    if (data == 0)
                        data = "0.00";
                    data = format(valueFormat, data);
                } else {
                    if (data == 0)
                        data = "0.00";
                    data = format("#,##0.#", data);
                    data = data + " %";
                }
                $(".customTooltip").html(name + "<br/>" + data);
                var x = event.pageX;
                var y = event.pageY - 50;
                $('.customTooltip').css({"display": "block", "top": y, "left": x});
            }
        }, function() {
            $('.customTooltip').css("display", "none");
        });
    }
}