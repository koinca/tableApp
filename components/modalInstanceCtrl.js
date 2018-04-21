'use strict';
angular.module('myApp')
    .controller('ModalInstanceCtrl', function($uibModalInstance, items, record, createMode) {

        var $ctrl = this;
        $ctrl.origRec = angular.copy(record);
        $ctrl.createMode = createMode;
        $ctrl.record = record;
        $ctrl.items = items;
        $ctrl.selected = {
            item: $ctrl.items[0]
        };


        $ctrl.ok = function() {
          var idList = _.map($ctrl.items, 'id') || [];
          var index = idList.indexOf($ctrl.record.id);
          var dontClose = false;
          if(!$ctrl.createMode) {
              //edit mode
              //check dup
              if(index!=-1 && $ctrl.origRec.id != $ctrl.record.id) {
                  dontClose = true;
                  $ctrl.message = 'ID field must be unique.';
              } else {
                  // Replace item at index using native splice
                  $ctrl.items.splice(index, 1, $ctrl.record);

              }

          } else {
              //create mode
              if(index != -1) {
                 dontClose = true;
                 $ctrl.message = 'ID field must be unique.';

              } else if (_.isEmpty($ctrl.record.id)) {
                 dontClose = true;
                 $ctrl.message = 'ID field cannot be empty.';
              } else {
                $ctrl.items.push($ctrl.record);
              }

          }

          if(!dontClose) {
            $uibModalInstance.close($ctrl.selected.item);
          }
        };

        $ctrl.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };
    });