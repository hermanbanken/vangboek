highCharts = function highCharts(changes, selector, series){
  var stock = 0;
  var data = _.chain(changes).groupBy("billId").map(function(changes, billId){
    return {
      date: Bills.findOne({_id: billId}).date.getTime(),
      change: _.reduce(changes, function(s, i){return s+= i.change}, 0)
    }
  }).sortBy("date").map(function(i){
    stock += i.change;
    return [i.date, stock];
  }).value();
    
  $(selector).highcharts('StockChart', {
		rangeSelector : {
			selected : 1
		},
    scrollbar : {
    	enabled : false
    },
		series : [{
			name : series,
			data : data,
      step: true,
			tooltip: {
				valueDecimals: 2
			}
		}]
	});
}

Handlebars.registerHelper("allUsers", function(){
  return Meteor.users.find({}, {sort: [["profile.year","desc"],"profile.nickname"]});
});

Handlebars.registerHelper("userCollection", function(){
  return Meteor.users;
});

Handlebars.registerHelper("canEdit", function(scope){
  if(scope == 'user' && this._id === Meteor.user()._id) 
    return true;
  if(scope == 'rights' && Roles.userIsInRole(Meteor.user()._id, ['admin'])) 
    return true;
  if(scope == 'groups' && Roles.userIsInRole(Meteor.user()._id, ['admin'])) 
    return true;
  console.log("canEdit", this, arguments);
  return false;
});

Handlebars.registerHelper("userServiceField", function(services, field, otherwise){
  return _.chain(services).map(function(service, key){
    return service[field];
  }).first().value() || typeof(otherwise) == 'string' && otherwise || "";
});

$.fn.serializeObject = function()
{
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};