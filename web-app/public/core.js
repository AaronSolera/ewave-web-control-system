var core_module = angular.module('coreModule', ['ui.router', 'zingchart-angularjs']);

core_module.service('global', function() {
  var user = {};

  var setUser = function(item) {
    user = item;
  };

  var getUser = function(){
      return user;
  };

  return {
    setUser: setUser,
    getUser: getUser
  };

});

/*----------------------------------------------------------------------------------------------------------------------------------------------------------------------
|  Configuring coreModule to change views through ui router
|---------------------------------------------------------------------------------------------------------------------------------------------------------------------*/

core_module.config(function($stateProvider, $urlRouterProvider) {
    var states = [
      {
        name: 'log_in',
        url: '/',
        templateUrl: 'log_in.html',
        controller: 'loginController'
      },
      {
        name: 'administrator',
        url: '/administrator',
        templateUrl: 'modules/administrator/index.html',
        controller: 'adminController'
      },
      {
        name: 'administrator.controlpanel',
        url: '/controlpanel',
        templateUrl: 'modules/administrator/control_panel.html',
        controller: 'adminController'
      },
      {
        name: 'employee',
        url: '/employee',
        templateUrl: 'modules/employee/index.html',
        controller: 'employeeController'
      }
    ];
    states.forEach((state) => $stateProvider.state(state));
    $urlRouterProvider.otherwise('/');
});

/*----------------------------------------------------------------------------------------------------------------------------------------------------------------------
|  Login Controller Actions
|---------------------------------------------------------------------------------------------------------------------------------------------------------------------*/

core_module.controller('loginController',function ($scope, $interval, $http, global){

  $scope.logintype = { view: "employee", path: "employee", model: "employee"};
  $scope.measures = {};
  $scope.time = [];
  $scope.email = "";
  $scope.password = "";

  $scope.vc_chart_json = {
    type: 'line',
    legend: {},
    plot: { tooltip: { text: "%t<br>%v" } },
    'scale-x': {
      label: { text: "Date" },
      labels: $scope.time,
      transform: {
        type: "date",
        all: "%m/%d/%Y<br>%h:%i:%s:%q %A"
      },
      item: { 'font-size': 10 },
      guide: {
        visible: true,
        'line-color': "black",
        'line-style': "dotted",
        alpha: 1
      }
    },
    'scale-y': { 
      label: { text: "Magnitude" },
      item: { 'font-size': 10 },
      guide: {
        visible: true,
        'line-color': "gray",
        'line-style': "solid",
        alpha: 1
      }
    },
    series : [
      { values: [] , text: "Current (A)"},
      { values: [] , text: "Voltage (V)"}
    ]
  };

  $scope.pp_chart_json = {
    type: 'line',
    legend: {},
    plot: { tooltip: { text: "%t<br>%v" } },
    'scale-x': {
      label: { text: "Date" },
      labels: $scope.time,
      transform: {
        type: "date",
        all: "%m/%d/%Y<br>%h:%i:%s:%q %A"
      },
      item: { 'font-size': 10 },
      guide: {
        visible: true,
        'line-color': "black",
        'line-style': "dotted",
        alpha: 1
      }
    },
    'scale-y': { 
      label: { text: "Magnitude" },
      item: { 'font-size': 10 },
      guide: {
        visible: true,
        'line-color': "gray",
        'line-style': "solid",
        alpha: 1
      }
    },
    series : [
      { values: [] , text: "Tank pressure 1 (MPa)"},
      { values: [] , text: "Tank pressure 2 (MPa)"}
    ]
  };

  function getData() {

    //Get measures from database request
    $http.get('/api/read/last/measure/url?data={}').then(function(response) {
      $scope.measures = response.data;
      console.log(response)
    });

    //Mongo date format conversion to unix time
    var date = new Date($scope.measures.Date);
    date.setHours( date.getHours() + 6);
    date = date.getTime();
    //Insert time to be shown in x axe
    $scope.time.push(date);

    //Insert data to be shown in Voltage and Current chart
    $scope.vc_chart_json.series[0].values.push($scope.measures.Current);
    $scope.vc_chart_json.series[1].values.push($scope.measures.Voltage);
    //Insert data to be shown in pressures chart
    $scope.pp_chart_json.series[0].values.push($scope.measures["Pressure 1"]);
    $scope.pp_chart_json.series[1].values.push($scope.measures["Pressure 2"]);

    //Delete the oldest element when the arrays reaches 10 items.
    if($scope.vc_chart_json.series[0].values.length > 5){
      $scope.vc_chart_json.series[0].values.shift();
      $scope.vc_chart_json.series[1].values.shift();
      $scope.pp_chart_json.series[0].values.shift();
      $scope.pp_chart_json.series[1].values.shift();
      $scope.time.shift();
    }

  }

  //Start function call every 10 seconds  
  var getDataContinuously = $interval(getData, 5000);

/* 
  // call this method to stop interval
  $scope.stop = function() {
    $interval.cancel(getDataContinuously);
  };

  $scope.checkLogin = function(){

    $scope.goTo("administrator.controlpanel");

    
    $http.get('/api/read/'+ $scope.logintype.model +'/url?data={"Email": 1, "Password": 1}')
      .then(function(response) {
        console.log(response.data);

        var found = false;
        
        response.data.forEach(function(element) {
          if(encrypt(element["Password"]) == $scope.password & element["Email"] == $scope.email){
            global.setUser(element);
            $scope.goTo($scope.logintype.path);
            found = true;
          }
        });

        if(!found){
          alert("Email or password incorrect. Please, try again.");
        }

    });
    
  };

  $scope.goTo = function(page) {
    $state.go(page);
  };

  $scope.setLoginType = function(type) {
    $scope.logintype.view = type;
    if(type == "administrator"){
      $scope.logintype.path = "administrator", 
      $scope.logintype.model= "administrator";
    }else{
      $scope.logintype.path = "employee.search", 
      $scope.logintype.model= "employee";
    }
  };

  function encrypt(string){
    var key = 129;
    var result = "";
    for (i = 0; i < string.length; ++i) {
      result += String.fromCharCode(key ^ string.charCodeAt(i));
    }
    return result;
  }
*/

});

/*----------------------------------------------------------------------------------------------------------------------------------------------------------------------
|  Administrator Controller Actions
|---------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
/*
core_module.controller('administratorController',function ($scope, $state, $http){

  //Titles and section indicators shown in web page
  $scope.title = "WCS - Administrador";
  $scope.form = {};

  // Structures to bluid forms in the view
  // Label must have the same name has keys in arrays used in data to show in table
  $scope.entity = {

    employee: { 

      form : [  {Label: "Nombre",   Type: "text"}, 
                {Label: "Ubicación",Type: "text"}, 
                {Label: "Contacto", Type: "text"}, 
                {Label: "Sitio Web",Type: "text"} ],
              
      view : [ "Nombre", "Ubicación", "Contacto", "Sitio Web" ]

    }

  };

  //This function returns a specific purpose JSON that indicades wich attributes will be displayed acording to entity view request
  function parseReadRequest(request){
    size = request.length;
    query = "{";
    request.forEach(function(element) {
      size--;
      if(size == 0){
        query += '"' + element + '"' + ":1}";
      }else{
        query += '"' + element + '"' + ":1,";
      }
    });
    return query;
  }

  function encrypt(string){
    var key = 129;
    var result = "";
    for (i = 0; i < string.length; ++i) {
      result += String.fromCharCode(key ^ string.charCodeAt(i));
    }
    return result;
  }

});
*/
/*----------------------------------------------------------------------------------------------------------------------------------------------------------------------
|  Employee Controller Actions
|---------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
/*
core_module.controller('employeeController',function ($scope, $http, global){

//Titles and section indicators shown in web page
$scope.title = "TECPlane - Costumer";
$scope.section = "Branch offices";
$scope.form = {};

// Structures to bluid forms in the view
// Label must have the same name has keys in arrays used in data to show in table
$scope.entity = {

  order: { 
    view: ["Time","Extra description","Total"],
    show: [],
    form : [{Label: "Extra description", Type: "text"}]
  },

  product: {
    show: []
  },

  branch: {
    view: ["Name"]
  }

};

//Get all data to show
$http.get('/api/read/branch/url?data=' + parseReadRequest($scope.entity.branch.view))
  .then(function(response) {
    $scope.entity.branch.show = response.data;
    console.log(response)
});
$http.get('/api/read/order/url?data=' + parseReadRequest($scope.entity.order.view))
  .then(function(response) {
    $scope.entity.order.show = response.data;
    $scope.entity.order.order_quantity = response.data.length;
    console.log(response)
});

//This creates a new order
$scope.entity.order.create = function(){
  $http.post('/api/create/order/url?data={}', $scope.form)
    .then(function(response) {
      $scope.form = {};
      console.log(response.data);
  });
}

$scope.getProducts = function(){
  $http.get('/api/read/all/product/url?condition={"Branch":"'+ $scope.form.Branch +'"}')
  .then(function(response) {
    $scope.entity.product.show = response.data;
    $scope.entity.product.show.forEach(function(product) {
      product.Quantity = 0;
    });
    console.log(response)
  }); 
}

$scope.entity.order.select = function(index){
  $scope.entity.order.selected = $scope.entity.order.show[index];
}

$scope.buildOrder = function(){
  $scope.form.Time = $scope.getCurrentTime();
  $scope.form.State = "Registered";
  $scope.form.Products = [];
  $scope.form.Total = 0;
  $scope.entity.product.show.forEach(function(product) {
    if(product.Quantity > 0){
      $scope.form.Products.push({_id: product._id, Quantity: product.Quantity})
      $scope.form.Total += product.Price * product.Quantity;
    }
  });
}

$scope.setSection  = function(section){
  $scope.section = section;
}

$scope.getCurrentTime = function(){
  let date_ob = new Date();
  // current date
  // adjust 0 before single digit date
  let date = ("0" + date_ob.getDate()).slice(-2);
  // current month
  let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
  // current year
  let year = date_ob.getFullYear();
  // current hours
  let hours = date_ob.getHours();
  // current minutes
  let minutes = date_ob.getMinutes();
  // current seconds
  let seconds = date_ob.getSeconds();
  // prints date & time in YYYY-MM-DDTHH:MM:SS format
  return year + "-" + month + "-" + date + "T" + hours + ":" + minutes + ":" + seconds
}

//This function returns a specific purpose JSON that indicades wich attributes will be displayed acording to entity view request
function parseReadRequest(request){
  size = request.length;
  query = "{";
  request.forEach(function(element) {
    size--;
    if(size == 0){
      query += '"' + element + '"' + ":1}";
    }else{
      query += '"' + element + '"' + ":1,";
    }
  });
  return query;
}

//All data to show in a table
$http.get('/api/read/branch/url?data=' + parseReadRequest($scope.entity.branch.view))
  .then(function(response) {
    $scope.entity.branch.show = response.data;
    console.log(response)
});
$http.get('/api/read/product/url?data=' + parseReadRequest($scope.entity.product.view))
  .then(function(response) {
    $scope.entity.product.show = response.data;
    $scope.entity.product.form[3].Options = $scope.entity.branch.show;
    $scope.join('product', 'Branch', 'branch');
    console.log(response)
});

//This adds a new data and return all the products in the data base
$scope.entity.product.create = function(){
  $http.post('/api/create/product/url?data=' + parseReadRequest($scope.entity.product.view), $scope.form)
    .then(function(response) {
      $scope.form = {};
      $scope.entity.product.show = response.data;
      console.log(response.data);
  });
  $scope.join('product', 'Branch', 'branch');
}

  //This adds a new data and return all the products in the data base
  $scope.entity.branch.create = function(){
    $http.post('/api/create/branch/url?data={}', $scope.form)
      .then(function(response) {
        $scope.form = {};
        console.log(response.data);
    });
  }

  //This deletes a data and return all the branches in the data base
  $scope.entity.branch.delete = function() {-
    $http.delete('/api/delete/branch/' + $scope.entity.branch.selected._id + '/url?data=' + parseReadRequest($scope.entity.branch.view))
      .then(function(response) {
        $scope.entity.branch.show = response.data;
        console.log(response.data);
    });
  }

  //This edits a new data and return all the branches in the data base
  $scope.entity.branch.edit = function(){
    $http.put('/api/update/branch/' + $scope.entity.branch.selected._id + '/url?data=' + parseReadRequest($scope.entity.branch.view), $scope.form)
      .then(function(response) {
        $scope.form = {};
        $scope.entity.branch.show = response.data;
        console.log(response.data);
    });
  }

  $scope.setSection  = function(section){
    $scope.section = section;
  }

  $scope.entity.branch.select = function(index){
    $scope.entity.branch.selected = $scope.entity.branch.show[index];
  }

  $scope.join = function(model1_name, attribute_name, model2_name){
    $scope.entity[model1_name].show.forEach(function(data) {
      $http.get('/api/read/one/' + model2_name + '/url?condition={"_id":"'+ data[attribute_name] +'"}')
      .then(function(response) {
        data[attribute_name] = response.data.Name;
        console.log(response)
      });
    });
  }

});*/