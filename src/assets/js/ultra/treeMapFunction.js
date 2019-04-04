/**
 * method : getTreeMap
 * action : DRAW A TREEMAP
 * @params : object type (CONTAINER NAME AND JSON DATA)
 * @returns : void type
**/

var getTreeMap = function(obj) {
  obj.container   = (obj.container==undefined)?"":obj.container;
  obj.valueFormat = (obj.valueFormat==undefined)? "#,##0.": obj.valueFormat;
  obj.jsonData    = (obj.jsonData==undefined)?"":obj.jsonData;
  //obj.onClick   = (obj.onClick==undefined)?"return false":obj.onClick;
  obj.symbol = (obj.symbol==undefined || obj.symbol=="Sales")?"\u00A3":obj.symbol; // by default pound
  
  if (obj.jsonData != undefined && obj.positiveStartColorCode != undefined && obj.positiveEndColorCode != undefined && obj.negativeStartColorCode != undefined && obj.negativeEndColorCode != undefined && obj.newItemColorCode != undefined) {

    obj.positiveColorCode      = obj.positiveStartColorCode;
    obj.positiveStartColorCode = hexToRgb(obj.positiveStartColorCode);
    obj.positiveEndColorCode   = hexToRgb(obj.positiveEndColorCode);
    obj.negativeColorCode      = obj.negativeStartColorCode;
    obj.negativeStartColorCode = hexToRgb(obj.negativeStartColorCode);
    obj.negativeEndColorCode   = hexToRgb(obj.negativeEndColorCode);
      
      var allChartData = obj.jsonData.children;
      if (obj.positiveMaxVal != undefined && obj.positiveMinVal != undefined && obj.negativeMaxVal != undefined && obj.negativeMinVal != undefined) {
          var positiveMaxVal = obj.positiveMaxVal;
          var positiveMinVal = obj.positiveMinVal;
          var negativeMaxVal = obj.negativeMaxVal;
          var negativeMinVal = obj.negativeMinVal;
      } else {
          var allPositiveVals = _.sortBy(_.filter(allChartData, function(v) { return v.varPct > 0 }), function(num) { return num.varPct; });
          var allNegativeVals = _.sortBy(_.filter(allChartData, function(v) { return v.varPct < 0 }), function(num) { return num.varPct; });

          var positiveMaxVal = _.max(allPositiveVals, function(o){return o.varPct;});
          var positiveMinVal = _.min(allPositiveVals, function(o){return o.varPct;});
          positiveMaxVal = (positiveMaxVal.varPct < 0) ? parseFloat(positiveMaxVal.varPct * -1) : parseFloat(positiveMaxVal.varPct);
          positiveMaxVal = Math.round(positiveMaxVal);
          positiveMinVal = (positiveMinVal.varPct < 0) ? parseFloat(positiveMinVal.varPct * -1) : parseFloat(positiveMinVal.varPct);
          positiveMinVal = Math.round(positiveMinVal);

          var negativeMinVal = _.max(allNegativeVals, function(o){return o.varPct;});
          var negativeMaxVal = _.min(allNegativeVals, function(o){return o.varPct;});
          negativeMaxVal = (negativeMaxVal.varPct < 0) ? parseFloat(negativeMaxVal.varPct * -1) : parseFloat(negativeMaxVal.varPct);
          negativeMaxVal = Math.round(negativeMaxVal);
          negativeMinVal = (negativeMinVal.varPct < 0) ? parseFloat(negativeMinVal.varPct * -1) : parseFloat(negativeMinVal.varPct);
          negativeMinVal = Math.round(negativeMinVal);
      }

      _.each(allChartData, function(value, key) {
          var colorCode = '';
          if(obj.redrawChart != undefined){
              if (value['varPct'] == 0) {
                  colorCode = obj.newItemColorCode;
              } else if (value['varPct'] > 0) {
                  if(value['varPct'] >= positiveMaxVal){
                      colorCode = obj.positiveColorCode;
                  }else{
                      colorCode = renderColorCode(positiveMaxVal, positiveMinVal, negativeMaxVal, negativeMinVal, value['varPct'], obj.positiveStartColorCode, obj.positiveEndColorCode, obj.negativeStartColorCode, obj.negativeEndColorCode, obj.newItemColorCode);                            
                  }
              } else {
                  var tmpNgVal = (value['varPct']*-1);
                  if(tmpNgVal >= negativeMaxVal){
                      colorCode = obj.negativeColorCode;
                  }else{
                      colorCode = renderColorCode(positiveMaxVal, positiveMinVal, negativeMaxVal, negativeMinVal, value['varPct'], obj.positiveStartColorCode, obj.positiveEndColorCode, obj.negativeStartColorCode, obj.negativeEndColorCode, obj.newItemColorCode);  
                  }
              }
          }else{
              colorCode = renderColorCode(positiveMaxVal, positiveMinVal, negativeMaxVal, negativeMinVal, value['varPct'], obj.positiveStartColorCode, obj.positiveEndColorCode, obj.negativeStartColorCode, obj.negativeEndColorCode, obj.newItemColorCode);
          }
          obj.jsonData.children[key]['colorCode'] = colorCode.replace('#','');
      });
      console.log(obj);
  }

  obj.symbolText = "";
  if(obj.symbol=="Cases" || obj.symbol=="Units"){
      obj.symbolText = obj.symbol;
      obj.symbol = "";
  };

  $(obj.container).html('');
  $(obj.container).addClass('treeMap');
  var color = d3.scale.category10();
  
  //console.log(color);
  var treemap = d3.layout.treemap()
  .size([100, 100])
  .sticky(true)
  .sort(function(a, b) { return a.value - b.value; })
  .value(function(d) { return d.size; });

  //console.log(treemap);

  var div = d3.select(obj.container);
  
  var node = div.datum(obj.jsonData).selectAll(".node")
      .data(treemap.nodes)
      .enter().append("div")
      .attr("class",'node')
      //.attr("id",obj.container.substring(1,obj.container.length)+'_Node')
      //.attr('ng-model','testModel')
      //.attr("ng-click", function(d) { return (obj.onClick==undefined)?"return false":obj.onClick+'("'+d.name+'")';})
      //.attr("onclick", function(d) { return (obj.onClick==undefined)?"return false":obj.onClick+'("'+d.name+'")';})
      .attr('data-toggle',"tooltip")
      .attr('data-html',true)
      .attr("dataid", function(d) { return d.id==undefined?'':d.id })
      .attr("title", function(d) {
        //var nVal = format(obj.valueFormat,d.value)
        var nVal = d.value
        //var unit = (obj.symbol=='Sales')?"\u00A3 "+ nVal : nVal +' '+ obj.symbol;
        var unit = obj.symbol + ' ' + nVal +' '+ obj.symbolText;
        unit = unit.trim();
        var vars = d.share;
        //var varp = d.varPct>0 ? 'Up '+format("#,##0.#",d.varPct) : 'Down '+format("#,##0.#",d.varPct) ;
        var varp = d.varPct>0 ? 'Up '+d.varPct : 'Down '+d.varPct;
        return d.name + "<br> " + unit + "<br> " + vars+'% Share' + "<br> " + varp +'%';
      })
      .style("background-color", function(d) { return ('#' + d.colorCode) })
      .call(position)
      .text(function(d) { return d.children ? null : d.name; });
      //.on("mouseover", function(d){tooltip.text(d.name); return tooltip.style("visibility", "visible");});

      function position() {
        this.style("left", function(d) { return d.x + "%"; })
            .style("top", function(d) { return d.y + "%"; })
            .style("width", function(d) { return d.dx + "%"; })
            .style("height", function(d) { return  d.dy + "%"; });
      }
  
    //if (typeof tooltip === 'function') {
      //$('[data-toggle="tooltip"]').tooltip();
    //}
}


/**
 * method : getTreeMapZoom
 * action : DRAW A TREEMAP
 * @params : object type (CONTAINER NAME AND JSON DATA)
 * @returns : void type
**/
var backUPTreeData = [];
var getTreeMapZoom = function(obj){
    obj.container = (obj.container==undefined)?"":obj.container;
    //obj.jsonData = (obj.jsonData==undefined)?"":obj.jsonData;
    
    if(treeBackup==false)
    {
      obj.jsonData = (obj.jsonData==undefined)?"":obj.jsonData;
      backUPTreeData.push(obj.jsonData);
      treeBackup = true;
    }
    else{
      console.log(backUPTreeData);
      obj.jsonData = backUPTreeData[0];
    }
    
    var $container = $(obj.container),
        margin = {top: 25, right: 0, bottom: 0, left: 0},
        width = $container.width(),
        height = $container.height() - margin.top - margin.bottom,
        formatNumber = d3.format(",d"),
        transitioning;
        //console.log(obj.container);
        //console.log(width);
    var x = d3.scale.linear()
        .domain([0, width])
        .range([0, width]);
    
    var y = d3.scale.linear()
        .domain([0, height])
        .range([0, height]);
    
    var treemap = d3.layout.treemap()
        .children(function(d, depth) { return depth ? null : d._children; })
        .sort(function(a, b) { return a.value - b.value; })
        .ratio(height / width * 0.5 * (1 + Math.sqrt(5)))
        .round(false);
        
    var svg = d3.select(obj.container).append("div")
        .attr('id', 'TreeMapContainer')
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.bottom + margin.top)
        .style("margin-left", -margin.left + "px")
        .style("margin.right", -margin.right + "px")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.bottom + margin.top)
        .style("margin-left", -margin.left + "px")
        .style("margin.right", -margin.right + "px")
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .style("shape-rendering", "crispEdges");
    
    var grandparent = svg.append("g")
        .attr("class", "grandparent");
    
    grandparent.append("rect")
        .attr("y", -margin.top)
        .attr("width", width)
        .attr("height", margin.top);
    
    grandparent.append("text")
        .attr("x", 6)
        .attr("y", 6 - margin.top)
        .attr("dy", ".75em");
    
    //d3.json("flare.json", function(root) {
      root = obj.jsonData;
      initialize(root);
      accumulate(root);
      layout(root);
      display(root);
    
      function initialize(root) {
        root.x = root.y = 0;
        root.dx = width;
        root.dy = height;
        root.depth = 0;
      }
    
      // Aggregate the values for internal nodes. This is normally done by the
      // treemap layout, but not here because of our custom implementation.
      // We also take a snapshot of the original children (_children) to avoid
      // the children being overwritten when when layout is computed.
      function accumulate(d) {
        return (d._children = d.children)
            ? d.value = d.children.reduce(function(p, v) { return p + accumulate(v); }, 0)
            : d.value;
      }
    
      // Compute the treemap layout recursively such that each group of siblings
      // uses the same size (1�1) rather than the dimensions of the parent cell.
      // This optimizes the layout for the current zoom state. Note that a wrapper
      // object is created for the parent node for each group of siblings so that
      // the parent�s dimensions are not discarded as we recurse. Since each group
      // of sibling was laid out in 1�1, we must rescale to fit using absolute
      // coordinates. This lets us use a viewport to zoom.
      function layout(d) {
        if (d._children) {
          treemap.nodes({_children: d._children});
          d._children.forEach(function(c) {
            c.x = d.x + c.x * d.dx;
            c.y = d.y + c.y * d.dy;
            c.dx *= d.dx;
            c.dy *= d.dy;
            c.parent = d;
            layout(c);
          });
        }
      }
    
      function display(d) {
        grandparent
            .datum(d.parent)
            .on("click", transition)
            .select("text")
            .text(name(d));
    
        var g1 = svg.insert("g", ".grandparent")
            .datum(d)
            .attr("class", "depth");
    
        var g = g1.selectAll("g")
            .data(d._children)
          .enter().append("g");
    
        g.filter(function(d) { return d._children; })
            .classed("children", true)
            .on("click", transition);
    
        g.selectAll(".child")
            .data(function(d) { return d._children || [d]; })
            .enter().append("rect")
            .attr("class", "child")
            .call(rect)
            .style("fill", function(d) { return ('#' + d.colorCode) });
            //color added
    
        g.append("rect")
            .attr("class", "parent")
            .call(rect)
            .append("title")
            .text(function(d) { return formatNumber(d.value); });
    
        g.append("text")
            .attr("dy", ".75em")
            .text(function(d) { return d.name; })
            .call(text);
    
        function transition(d) {
          if (transitioning || !d) return;
          transitioning = true;
    
          var g2 = display(d),
              t1 = g1.transition().duration(750),
              t2 = g2.transition().duration(750);
    
          // Update the domain only after entering new elements.
          x.domain([d.x, d.x + d.dx]);
          y.domain([d.y, d.y + d.dy]);
    
          // Enable anti-aliasing during the transition.
          svg.style("shape-rendering", null);
    
          // Draw child nodes on top of parent nodes.
          svg.selectAll(".depth").sort(function(a, b) { return a.depth - b.depth; });
    
          // Fade-in entering text.
          g2.selectAll("text").style("fill-opacity", 0);
    
          // Transition to the new view.
          t1.selectAll("text").call(text).style("fill-opacity", 0);
          t2.selectAll("text").call(text).style("fill-opacity", 1);
          t1.selectAll("rect").call(rect);
          t2.selectAll("rect").call(rect);
    
          // Remove the old node when the transition is finished.
          t1.remove().each("end", function() {
            svg.style("shape-rendering", "crispEdges");
            transitioning = false;
          });
        }
    
        return g;
      }
    
      function text(text) {
        text.attr("x", function(d) { return x(d.x) + 6; })
            .attr("y", function(d) { return y(d.y) + 6; });
      }
    
      function rect(rect) {
        rect.attr("x", function(d) { return x(d.x); })
            .attr("y", function(d) { return y(d.y); })
            .attr("width", function(d) { return x(d.x + d.dx) - x(d.x); })
            .attr("height", function(d) { return y(d.y + d.dy) - y(d.y); })
            .style("fill", function(d) { return ('#' + d.colorCode) });
            //color added
      }
    
      function name(d) {
        //return d.parent ? name(d.parent) + " > " + d.name : d.name;       
        return d.parent ? (name(d.parent)===undefined?"":name(d.parent) + " > ") + d.name : d.name;
      }
    //});
    
    console.log(backUPTreeData[0]);
}

/**
 * method : getTreeMapZoom
 * action : DRAW A TREEMAP
 * @params : object type (CONTAINER NAME AND JSON DATA)
 * @returns : void type
**/

var getTreeMapZoom_backup = function(obj){
    obj.container = (obj.container==undefined)?"":obj.container;
    obj.jsonData = (obj.jsonData==undefined)?"":obj.jsonData;
    var $container = $(obj.container),
        margin = {top: 25, right: 0, bottom: 0, left: 0},
        width = $container.width(),
        height = $container.height() - margin.top - margin.bottom,
        formatNumber = d3.format(",d"),
        transitioning;
        //console.log(obj.container);
        //console.log(width);
    var x = d3.scale.linear()
        .domain([0, width])
        .range([0, width]);
    
    var y = d3.scale.linear()
        .domain([0, height])
        .range([0, height]);
    
    var treemap = d3.layout.treemap()
        .children(function(d, depth) { return depth ? null : d._children; })
        .sort(function(a, b) { return a.value - b.value; })
        .ratio(height / width * 0.5 * (1 + Math.sqrt(5)))
        .round(false);
        
    var svg = d3.select(obj.container).append("div")
        .attr('id', 'TreeMapContainer')
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.bottom + margin.top)
        .style("margin-left", -margin.left + "px")
        .style("margin.right", -margin.right + "px")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.bottom + margin.top)
        .style("margin-left", -margin.left + "px")
        .style("margin.right", -margin.right + "px")
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .style("shape-rendering", "crispEdges");
    
    var grandparent = svg.append("g")
        .attr("class", "grandparent");
    
    grandparent.append("rect")
        .attr("y", -margin.top)
        .attr("width", width)
        .attr("height", margin.top);
    
    grandparent.append("text")
        .attr("x", 6)
        .attr("y", 6 - margin.top)
        .attr("dy", ".75em");
    
    //d3.json("flare.json", function(root) {
      root = obj.jsonData;
      initialize(root);
      accumulate(root);
      layout(root);
      display(root);
    
      function initialize(root) {
        root.x = root.y = 0;
        root.dx = width;
        root.dy = height;
        root.depth = 0;
      }
    
      // Aggregate the values for internal nodes. This is normally done by the
      // treemap layout, but not here because of our custom implementation.
      // We also take a snapshot of the original children (_children) to avoid
      // the children being overwritten when when layout is computed.
      function accumulate(d) {
        return (d._children = d.children)
            ? d.value = d.children.reduce(function(p, v) { return p + accumulate(v); }, 0)
            : d.value;
      }
    
      // Compute the treemap layout recursively such that each group of siblings
      // uses the same size (1�1) rather than the dimensions of the parent cell.
      // This optimizes the layout for the current zoom state. Note that a wrapper
      // object is created for the parent node for each group of siblings so that
      // the parent�s dimensions are not discarded as we recurse. Since each group
      // of sibling was laid out in 1�1, we must rescale to fit using absolute
      // coordinates. This lets us use a viewport to zoom.
      function layout(d) {
        if (d._children) {
          treemap.nodes({_children: d._children});
          d._children.forEach(function(c) {
            c.x = d.x + c.x * d.dx;
            c.y = d.y + c.y * d.dy;
            c.dx *= d.dx;
            c.dy *= d.dy;
            c.parent = d;
            layout(c);
          });
        }
      }
    
      function display(d) {
        grandparent
            .datum(d.parent)
            .on("click", transition)
            .select("text")
            .text(name(d));
    
        var g1 = svg.insert("g", ".grandparent")
            .datum(d)
            .attr("class", "depth");
    
        var g = g1.selectAll("g")
            .data(d._children)
          .enter().append("g");
    
        g.filter(function(d) { return d._children; })
            .classed("children", true)
            .on("click", transition);
    
        g.selectAll(".child")
            .data(function(d) { return d._children || [d]; })
            .enter().append("rect")
            .attr("class", "child")
            .call(rect)
            .style("fill", function(d) { return ('#' + d.colorCode) });
            //color added
    
        g.append("rect")
            .attr("class", "parent")
            .call(rect)
            .append("title")
            .text(function(d) { return formatNumber(d.value); });
    
        g.append("text")
            .attr("dy", ".75em")
            .text(function(d) { return d.name; })
            .call(text);
    
        function transition(d) {
          if (transitioning || !d) return;
          transitioning = true;
    
          var g2 = display(d),
              t1 = g1.transition().duration(750),
              t2 = g2.transition().duration(750);
    
          // Update the domain only after entering new elements.
          x.domain([d.x, d.x + d.dx]);
          y.domain([d.y, d.y + d.dy]);
    
          // Enable anti-aliasing during the transition.
          svg.style("shape-rendering", null);
    
          // Draw child nodes on top of parent nodes.
          svg.selectAll(".depth").sort(function(a, b) { return a.depth - b.depth; });
    
          // Fade-in entering text.
          g2.selectAll("text").style("fill-opacity", 0);
    
          // Transition to the new view.
          t1.selectAll("text").call(text).style("fill-opacity", 0);
          t2.selectAll("text").call(text).style("fill-opacity", 1);
          t1.selectAll("rect").call(rect);
          t2.selectAll("rect").call(rect);
    
          // Remove the old node when the transition is finished.
          t1.remove().each("end", function() {
            svg.style("shape-rendering", "crispEdges");
            transitioning = false;
          });
        }
    
        return g;
      }
    
      function text(text) {
        text.attr("x", function(d) { return x(d.x) + 6; })
            .attr("y", function(d) { return y(d.y) + 6; });
      }
    
      function rect(rect) {
        rect.attr("x", function(d) { return x(d.x); })
            .attr("y", function(d) { return y(d.y); })
            .attr("width", function(d) { return x(d.x + d.dx) - x(d.x); })
            .attr("height", function(d) { return y(d.y + d.dy) - y(d.y); })
            .style("fill", function(d) { return ('#' + d.colorCode) });
            //color added
      }
    
      function name(d) {
        //return d.parent ? name(d.parent) + " > " + d.name : d.name;       
        return d.parent ? (name(d.parent)===undefined?"":name(d.parent) + " > ") + d.name : d.name;
      }
    //});
}

/*[START] MAP PAGE COLOR CODE GENERATION FUNCTIONS */
    function hexToRgb(hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }
    function fromRGBtoHex(r, g, b) { return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1); }
    /*function calculateColorCode(endPointVal,val,rgbEndPoint) {
        if (endPointVal > 0) {
            if(val < 0) val = val*-1;
            var cdR = Math.round(parseFloat((val * rgbEndPoint['r']) / endPointVal));
            var cdG = Math.round(parseFloat((val * rgbEndPoint['g']) / endPointVal));
            var cdB = Math.round(parseFloat((val * rgbEndPoint['b']) / endPointVal));
            return fromRGBtoHex(cdR,cdG,cdB);    
        } else {
            return '#000000';
        }
    }*/
    /*function renderColorCode(maxVal, minVal, val, rgbPositiveEndPoint, rgbNegativeEndPoint){
        var colorCode = '';
        if (val == 0) {
            colorCode = '#000000';
        }else if (val > 0) {
            colorCode = calculateColorCode(maxVal,val,rgbPositiveEndPoint);
        } else {
            colorCode = calculateColorCode(minVal,val,rgbNegativeEndPoint);
        }
        return colorCode;
    }*/
    function calculateColorCode(val,rgbStartPoint,rgbEndPoint) {
        if(val < 0) val = val*-1;
        var cdR = Math.round(parseFloat((val * (rgbStartPoint['r'] - rgbEndPoint['r'])) + rgbEndPoint['r']));
        var cdG = Math.round(parseFloat((val * (rgbStartPoint['g'] - rgbEndPoint['g'])) + rgbEndPoint['g']));
        var cdB = Math.round(parseFloat((val * (rgbStartPoint['b'] - rgbEndPoint['b'])) + rgbEndPoint['b']));
        return fromRGBtoHex(cdR,cdG,cdB);
    }
    function calculateValPerRetio(val,minVal,maxVal) {
        if(val < 0) val = val*-1;
        var pVAL = ((maxVal - minVal) > 0 && (val - minVal) >= 0) ? parseFloat((val - minVal) / (maxVal - minVal)) : 0;
        return pVAL;
    }
    function renderColorCode(positiveMaxVal, positiveMinVal, negativeMaxVal, negativeMinVal, val, rgbPositiveStartPoint, rgbPositiveEndPoint, rgbNegativeStartPoint, rgbNegativeEndPoint, newItemColorCode) {
        var colorCode = '';
        if (val == 0) {
            colorCode = newItemColorCode;
        } else if (val > 0) {
            val = Math.round(val);
            pVal = calculateValPerRetio(val, positiveMinVal, positiveMaxVal);
            if (val == positiveMaxVal) {
                colorCode = fromRGBtoHex(rgbPositiveStartPoint['r'],rgbPositiveStartPoint['g'],rgbPositiveStartPoint['b']);
            }else if (val == positiveMinVal) {
                colorCode = fromRGBtoHex(rgbPositiveEndPoint['r'],rgbPositiveEndPoint['g'],rgbPositiveEndPoint['b']);
            }else if (pVal == 0) {
                colorCode = fromRGBtoHex(rgbPositiveStartPoint['r'],rgbPositiveStartPoint['g'],rgbPositiveStartPoint['b']);
            }else{
                colorCode = calculateColorCode(pVal, rgbPositiveStartPoint, rgbPositiveEndPoint);
            }
            /*colorCode = (pVal == 0) ? fromRGBtoHex(rgbPositiveStartPoint['r'],rgbPositiveStartPoint['g'],rgbPositiveStartPoint['b']) : calculateColorCode(pVal, rgbPositiveStartPoint, rgbPositiveEndPoint);*/
        } else {
            val = Math.round(val*-1);
            pVal = calculateValPerRetio(val, negativeMinVal, negativeMaxVal);
            if (val == negativeMaxVal) {
                colorCode = fromRGBtoHex(rgbNegativeStartPoint['r'],rgbNegativeStartPoint['g'],rgbNegativeStartPoint['b']);
            }else if (val == negativeMinVal) {
                colorCode = fromRGBtoHex(rgbNegativeEndPoint['r'],rgbNegativeEndPoint['g'],rgbNegativeEndPoint['b']);
            }else  if (pVal == 0) {
                colorCode = fromRGBtoHex(rgbNegativeStartPoint['r'],rgbNegativeStartPoint['g'],rgbNegativeStartPoint['b']);
            }else{
                colorCode = calculateColorCode(pVal, rgbNegativeStartPoint, rgbNegativeEndPoint);
            }
            /*colorCode = (pVal == 0) ? fromRGBtoHex(rgbNegativeStartPoint['r'],rgbNegativeStartPoint['g'],rgbNegativeStartPoint['b']) : calculateColorCode(pVal, rgbNegativeStartPoint, rgbNegativeEndPoint);*/
        }
        return colorCode;
    }

    /*function interpolateColor(color1, color2, factor) {
        if (arguments.length < 3) { factor = 0.5; }
        var result = color1.slice();
        for (var i = 0; i < 3; i++) {
            result[i] = Math.round(result[i] + factor * (color2[i] - color1[i]));
        }
        return result;
    };
    
    function interpolateColors(color1, color2, steps) {
        var stColor = "rgb("+color1['r']+","+color1['g']+","+color1['b']+")";
        var edColor = "rgb("+color2['r']+","+color2['g']+","+color2['b']+")";
        var stepFactor = 1 / (steps - 1),
            interpolatedColorArray = [];
        stColor = stColor.match(/\d+/g).map(Number);
        edColor = edColor.match(/\d+/g).map(Number);
        for(var i = 0; i < steps; i++) {
            interpolatedColorArray.push(interpolateColor(stColor, edColor, stepFactor * i));
        }
        return interpolatedColorArray;
    }*/
/*[END] MAP PAGE COLOR CODE GENERATION FUNCTIONS */