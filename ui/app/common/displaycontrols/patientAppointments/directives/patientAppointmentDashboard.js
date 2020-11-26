'use strict';

angular.module('bahmni.common.displaycontrol.patientAppointmentsDashboard', []);
angular.module('bahmni.common.displaycontrol.patientAppointmentsDashboard').directive('patientAppointmentsDashboard', ['$http', '$q', '$window', 'appService', function ($http, $q, $window, appService) {
    var link = function ($scope) {
        var getUpcomingAppointments = function () {
            var params = {
                q: "bahmni.sqlGet.upComingAppointments",
                v: "full",
                patientUuid: $scope.patient.uuid
            };
            return $http.get('/openmrs/ws/rest/v1/bahmnicore/sql', {
                method: "GET",
                params: params,
                withCredentials: true
            });
        };
        var getPastAppointments = function () {
            var params = {
                q: "bahmni.sqlGet.pastAppointments",
                v: "full",
                patientUuid: $scope.patient.uuid
            };
            return $http.get('/openmrs/ws/rest/v1/bahmnicore/sql', {
                method: "GET",
                params: params,
                withCredentials: true
            });
        };
        $q.all([getUpcomingAppointments(), getPastAppointments()]).then(function (response) {
            $scope.upcomingAppointments = response[0].data;
            $scope.upcomingAppointmentsUUIDs = [];
            for (var i = 0; i < $scope.upcomingAppointments.length; i++) {
                $scope.upcomingAppointmentsUUIDs[i] = $scope.upcomingAppointments[i].uuid;
                delete $scope.upcomingAppointments[i].uuid;
            }
            $scope.upcomingAppointmentsHeadings = _.keys($scope.upcomingAppointments[0]);
            $scope.pastAppointments = response[1].data;
            $scope.pastAppointmentsHeadings = _.keys($scope.pastAppointments[0]);
        });

        $scope.goToListView = function () {
            $window.open('/bahmni/appointments/#/home/manage/appointments/list');
        };
        $scope.openJitsiMeet = function (appointmentIndex) {
            var jitsiMeetingId = $scope.upcomingAppointmentsUUIDs[appointmentIndex];
            appService.setTeleConsultationVars(jitsiMeetingId, true);
        };
    };
    return {
        restrict: 'E',
        link: link,
        scope: {
            patient: "=",
            section: "="
        },
        templateUrl: "../common/displaycontrols/patientAppointments/views/patientAppointmentsDashboard.html"
    };
}]);
