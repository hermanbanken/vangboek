(function(){
  // Register a Handlebars helper named `tags`
  //
  // Usage:
  Handlebars.registerHelper('tags', function(name, selected, source){
    var l = typeof source == 'function' ? source() : source;
    var d = document.createElement("div");
    d.className = "tags-ui";
    d.innerHTML = _.map(selected, function(item){
                    return "<div class='tag'>"+item+"<input type='hidden' name='"+name+"[]' value='"+item+"' /></div>";
                  });
    d.innerHTML += "<textarea></textarea>";
    $(d).on("click", function(e){
      if(e.target == this) $(this).find("textarea").focus();
    }).on("keyup", function(e){
      if([13,188].indexOf(e.keyCode)){
        var t = $(this).find('textarea'),
            value = t.val();
        t.val("").prepend("<div class='tag'>"+item+"<input type='hidden' name='"+name+"[]' value='"+value+"' /></div>");
        selected.push(value);
      }
    });
      d.addEventListener("click", function(e){
        if(e.target.className == 'tags-ui'){
          
        }
      }, false);
  });
  
  Handlebars.registerHelper('datef', function(date, format){
    return moment(date).format(format);
  });
  
})();