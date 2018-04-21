'use strict';
angular.module('myApp')
    .controller('mainCtrl', function($scope, $uibModal, $log, $document) {


        $scope.fields = [];
        $scope.fields.push({
            id: 1,
            name: 'id',
            columnName: 'ID'
        });

        $scope.columns = $scope.fields.map(function(c) {
            return c.columnName
        });

        $scope.fieldNames = $scope.fields.map(function(c) {
            return c.name
        });

        $scope.rows = [];

        $scope.orderByField = 'id';
        $scope.reverseSort = false;

        $scope.fieldsPanelOpen = true;
        $scope.fieldsPanelClickHandler = function() {
            $scope.fieldsPanelOpen = !$scope.fieldsPanelOpen;
            if (!$scope.fieldsPanelOpen) {
                $('#collapseOne').hide();
            } else {
                $('#collapseOne').show();
            }
        }

        $scope.sortHandler = function(field) {
            this.orderByField = field.name;
            this.reverseSort = !this.reverseSort;
        }.bind($scope);


        $scope.editHandler = function (record) {
            $ctrl.record = angular.copy(record);
            //merge additional fields if it gets added
            //after record is added
            var nameArr = _.map(this.fields, 'name');
            for(var i in nameArr) {
                if(!$ctrl.record.hasOwnProperty(nameArr[i])) {
                    $ctrl.record[nameArr[i]] = '';
                }
            }
            $ctrl.createMode = false;
            return $ctrl.open('lg');
        };

        $scope.addHandler = function() {
            var record = {};   //new record
            for (var i in $scope.fieldNames) {
                var fld = $scope.fieldNames[i];
                record[fld] = '';  //value default to empty
            }
            $ctrl.createMode = true;
            $ctrl.record = record;

            return $ctrl.open('lg');
        };

        $scope.export2json = function() {
            var rows = angular.copy($scope.rows);
            rows = _.map(rows, function(row) {
                 delete row['$$hashKey'];  //remove internal $$hashKey key from row
                 return row;
            });
            var dataStr = JSON.stringify(rows, null, 4);
            var dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

            var exportFileDefaultName = 'data.json';

            var linkElement = document.createElement('a');
            linkElement.setAttribute('href', dataUri);
            linkElement.setAttribute('download', exportFileDefaultName);
            linkElement.click();
        }

        $scope.export2csv = function() {
            var  csvStr = json2csv($scope.rows),
                dataUri = 'data:text/csv;charset=utf-8,'+ csvStr,
                exportFileDefaultName = 'data.csv',
                linkElement = document.createElement('a');
            linkElement.setAttribute('href', dataUri);
            linkElement.setAttribute('download', exportFileDefaultName);
            linkElement.click();
        }

        $scope.$watch('fields', function(newValue, oldValue) {
            //check empty fields
            var newItem = newValue[newValue.length - 1];
            if (newItem.name == '' || newItem.columnName == '') {
                return;
            }

            this.columns = newValue.map(function(c) {
                return c.columnName
            });
            this.fieldNames = newValue.map(function(c) {
                return c.name
            });

        }.bind($scope), true);


        //------------- modal stuff

        var $ctrl = this;
        $ctrl.record = null;
        $ctrl.items = $scope.rows;
        $ctrl.animationsEnabled = false;

        $ctrl.open = function(size, parentSelector) {
            var parentElem = parentSelector ?
                angular.element($document[0].querySelector('.modal-dlg ' + parentSelector)) : undefined;
            var modalInstance = $uibModal.open({
                animation: $ctrl.animationsEnabled,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'myModalContent.html',
                controller: 'ModalInstanceCtrl',
                controllerAs: '$ctrl',
                size: size,
                appendTo: parentElem,
                resolve: {
                    createMode: function() {
                        return $ctrl.createMode;
                    },
                    record: function() {
                        return $ctrl.record;
                    },
                    items: function() {
                        return $ctrl.items;
                    }
                }
            });

            modalInstance.result.then(function(selectedItem) {
                $ctrl.selected = selectedItem;
            }, function() {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };


        function json2csv(jsonData) {
            if(jsonData.length == 0) {
                return '';
            }

            var keys = Object.keys(jsonData[0]);

            var columnDelimiter = ',';
            var lineDelimiter = '\n';

            var colHeaders = angular.copy(keys);
            colHeaders.pop();  //removing the internal hashkey column

            var csvColumnHeader = colHeaders.join(columnDelimiter);
            var csvStr = csvColumnHeader + lineDelimiter;

            jsonData.forEach(item => {
                keys.forEach((key, index) => {
                    if(key.indexOf('$$')<0) {
                        if( (index > 0) && (index < keys.length-1) ) {
                            csvStr += columnDelimiter;
                        }
                        csvStr += item[key];

                    }

                });
                csvStr += lineDelimiter;
            });

            return encodeURIComponent(csvStr);;
        }

    });