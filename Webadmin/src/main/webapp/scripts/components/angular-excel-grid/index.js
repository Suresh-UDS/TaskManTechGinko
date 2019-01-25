'use strict';
var excelGrid = angular.module('excelGrid', ['dx']);
excelGrid
    .directive('excelGridView', function() {
        return {
   restrict : "EA",
   scope: false,
   templateUrl: 'scripts/components/angular-excel-grid/index.html'
   
        };
        
});

excelGrid.controller('excelGridController', function excelGridController($scope) {
    $scope.gridOptions = {
        dataSource: employees,
        selection: {
            mode: "multiple"
        },
        "export": {
            enabled: true,
            fileName: "Employees",
            allowExportSelectedData: true
        },
        groupPanel: {
            visible: true
        },
        columns: [
          
            {
                dataField: "SNo",
                caption: "SI.NO",
                width: 60
            },
            {
                dataField: "EquipmentName",
                caption: "EQUIPMENT NAME",
                //width: 60
                color:"red"
            },
            {
                dataField: "Make",
                caption: "MAKE"
            },
            {
                dataField: "Capacity",
                caption: "CAPACITY"
            },
            {
                dataField: "Location",
                caption: "LOCATION"
            },
            {
                dataField: "Catering",
                caption: "CATERING TO"
            },
            {
                dataField: "Warranty",
                caption: "WARRANTY / AMC PERIOD"
            },
            {
                dataField: "Responsibility",
                caption: "RESPONSIBILITY"
            }
          
            /*, {
                dataField: "Position",
                width: 130
            }, {
                dataField: "BirthDate",
                dataType: "date",
                width: 100
            }, {
                dataField: "HireDate",
                dataType: "date",
                width: 100
            }*/
        ]
    };
    
});