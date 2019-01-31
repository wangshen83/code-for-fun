var myModule = angular.module('MusicFinder', []);

myModule.controller('MainCtrl', function($scope, $http) {
	$scope.types = {
		singleSelect: null,
		multipleSelect: [],
		option1: 'album'
	};
	
	$scope.keywords = "";	
	$scope.musicImages = [];
	
	var showPic = function(){
		if($scope.keywords.trim().length >= 4 && $scope.types.singleSelect){
			$http({
				method: "GET",
				url: "https://api.spotify.com/v1/search",
				params: {q: $scope.keywords, type: $scope.types.singleSelect}
			}).then(function(response) {
				$scope.musicImages = [];
				var items = response.data[$scope.types.singleSelect + 's'].items;				
				for(var i=0; i<items.length; i++){
					var obj = {};
					obj.url = items[i].images[0].url;
					obj.name = items[i].name;
					obj.type = items[i].type;
					$scope.musicImages.push(obj);
				}
			}, function(error){
				alert("No Luck!!!")
			});
		}
	}
	
	$scope.inputChange = function(){
		showPic();
	};
	
	$scope.selectChange = function(){
		showPic();
	};
});

myModule.directive('musicImage', function() {
    return {
        scope: true,
        replace: true,
        template: '<div class="col-sm-4"><div class="ih-item square effect1 left_and_right"><a href="#"><div class="img"><img ng-src="{{image.url}}" alt="img"></div><div class="info"><h3>{{image.name}}</h3><p>{{image.type}}</p></div></a></div></div>'
    }
});
