'use strict';
angular.module('myApp')
  .directive('fields', ['$location',
    function (location) {
        return {
            restrict: 'E',
            scope: {
                readOnly: '=',
                btnDisplay: '@',
                placeHolder: '@',
                inData: '='
            },
            template: "<div class='row'>" +
                          "<div ng-repeat='field in fields track by $index'>" +
                              "<div>"+
                                '<form class="form-inline">'+
                                  '<div class="form-group">Field name:'+
                                  '</div>'+
                                  '<div class="form-group mx-sm-3">'+
                                    '<input   ng-disabled="field.name.toLowerCase()==\'id\'" placeholder="field name" class="form-control" ng-attr-id={{"name"+$index}} ng-model="field.name">'+
                                  '</div>'+
                                  '<div class="form-group">Label:'+
                                  '</div>'+
                                  '<div class="form-group mx-sm-3">'+
                                    '<input ng-disabled="field.name.toLowerCase()==\'id\'" placeholder="label" class="form-control"  ng-attr-id={{"column"+$index}} ng-model="field.columnName">'+
                                  '</div>'+
                                  '<button title="Delete field" ng-hide="field.name.toLowerCase()==\'id\'"  class="delete-btn" ng-click="deleteField($index)">X</button>'+
                                '</form>'+

                              "</div>"+
                         "</div>"+
                    "</div>"+

                    "<div class='btn-container'>"+
                        "<button class=\"btn btn-primary add-btn\" title='Add new field' ng-click='addField()'>Add Field</button>"+
                    "</div>",
            controller: function ($scope ) {

                $scope.origFields = angular.copy($scope.inData || []);
                $scope.fields = $scope.inData;

                $scope.isFieldReadOnly = function(field) {
                    var field = _.find(this.origFields, {name: field.name});
                    return !_.isEmpty(field);
                };

                $scope.addField = function() {
                    //setting the id attribute, start from 1
                    var id =  $scope.fields.length==0 ? 1 : $scope.fields.length+1;  //set to 1 when empty
                    $scope.fields.push({id: id, name: '', columnName: ''});
                    $scope.inData = $scope.fields;
                };


                $scope.deleteField = function(index) {
                    this.fields.splice(index, 1);
                };

                console.log('fields controller');
            }
        };
  }]);
