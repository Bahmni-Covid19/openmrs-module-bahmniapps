'use strict';

angular.module('bahmni.clinical')
    .directive('treatmentTable', ['ngDialog', function (ngDialog) {
        var controller = function ($scope, $http, $window, ngDialog) {
            $scope.isOtherActiveSection = function (dateString) {
                return dateString === Bahmni.Clinical.Constants.otherActiveDrugOrders;
            };

            $scope.isDataPresent = function () {
                if ($scope.drugOrderSections && $scope.drugOrderSections.length == 0) {
                    return $scope.$emit("no-data-present-event") && false;
                }
                return true;
            };

            $scope.dialogWithOtherProperties = function () {
                var dialog = ngDialog.open({
                    template: 'displaycontrols/treatmentData/views/prescriptionTemplate.html',
                    className: 'printPreview'
                });
            };

            $scope.viewPrescription = function (patientUuid) {
                var params = {
                    patientUuid: patientUuid
                };
                var url = "/openmrs/ws/prescription/pdf?patientUuid=" + patientUuid;

                return $http.get(url).then(function (response)
                {
                    $scope.dialogWithOtherProperties();
                });
            };
        };

        return {
            templateUrl: "displaycontrols/treatmentData/views/treatmentTable.html",
            scope: {
                drugOrderSections: "=",
                params: "="
            },
            controller: controller
        };
    }]);

