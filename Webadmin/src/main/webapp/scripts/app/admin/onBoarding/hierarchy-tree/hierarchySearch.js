(function(){
    angular.module('timeSheetApp')
    .directive('hierarchySearch',function(HierarchyNodeService,$timeout) {
    
    return {
        restrict:'E',
        templateUrl:'scripts/app/admin/onBoarding/hierarchy-tree/hierarchySearch.tpl.html',
        scope: {
            dataset:'='
        },
        controller:function($scope, OnBoardingComponent,MyList) {
            $scope.selectedItems = {};
            $scope.loadSapBusinessCategories= function(){
                console.log("Getting sap business categories");
                OnBoardingComponent.getSapBusinessCategories().then(function (data) {
                    console.log(data);
                    console.log(JSON.parse(data.elementsJson));
                    console.log(MyList);
                    $scope.baseList = JSON.parse(data.elementsJson);
                    $scope.list = $scope.baseList;
                })
            };
            $scope.numSelected = 0;
            //$scope.list is used by ng-tree, dataset should never be modified
            $scope.list = angular.copy($scope.dataset);

            $scope.options = {};

            $scope.expandNode = function(n,$event) {
                $event.stopPropagation();
                n.toggle();
            }


            $scope.itemSelect = function(item) {
                var rootVal = !item.isSelected;
                HierarchyNodeService.selectChildren(item,rootVal);

                HierarchyNodeService.findParent($scope.list[0],null,item,selectParent);
                var s = _.compact(HierarchyNodeService.getAllChildren($scope.list[0],[]).map(function(c){ return c.isSelected && !c.items;}));
                $scope.numSelected = s.length;
            }

            function selectParent(parent) {
                var children = HierarchyNodeService.getAllChildren(parent,[]);

                if(!children) return;
                children = children.slice(1).map(function(c){ return c.isSelected;});

                parent.isSelected =  children.length === _.compact(children).length;
                HierarchyNodeService.findParent($scope.list[0],null,parent,selectParent)
            }

            $scope.nodeStatus = function(node) {
                var flattenedTree = getAllChildren(node,[]);
                flattenedTree = flattenedTree.map(function(n){ return n.isSelected });

                return flattenedTree.length === _.compact(flattenedTree);
            }
 
        },
        link:function(scope,el,attr) {
            
            scope.$watch('pastUsersFilter',function(nv){
               if(_.isUndefined(nv)) return;
               
               if(nv) {
                   HierarchyNodeService.trimLeafs(scope.list[0]);
               } else {
                   scope.list = angular.copy(scope.dataset);
               }
               
            });
            
          
            var inputTimeout;
            var time = 300;
            scope.$watch('searchValue',function(nv) {
                if(!nv && nv !== '') {
                    return;
                }
                var previousDataset = angular.copy(scope.list);
                var newData = (scope.searchValue === '') ? angular.copy(scope.dataset) : [HierarchyNodeService.treeSearch(angular.copy(scope.dataset[0]),scope.searchValue)];
                
                if(newData.length === 1 && _.isEmpty(newData[0]) ) {
                  scope.emptyData = true;
                  return;
                }
                
                scope.emptyData = false;
                if(_.isEqual(previousDataset,newData)) {
                  clearTimeout(inputTimeout);
                  return;
                } 
                
                scope.list = newData;
                
                
                $timeout.cancel(inputTimeout);
                inputTimeout = $timeout(function() {
                    
                    var els = document.querySelectorAll('[ui-tree-node]');
                    
                    Array.prototype.forEach.call(els,function(el) {
                        el = angular.element(el);
                        var elScope = el.scope();
                        if(elScope.$modelValue.match) {
                            
                            elScope.expand();
                            
                            //loop through all parents and keep expanding until no more parents are found
                            var p = elScope.$parentNodeScope;
                            while(p) {
                              p.expand();
                              p = p.$parentNodeScope;
                              
                            }
                        }
                    });
                },500);
            });
            
            
          
            
            scope.$watch('list',function(nv,ov) {
                if(!nv) return;
                if(nv && !ov) { scope.$apply();}

                console.log(nv);
                console.log(ov);

                //UPDATE SELECTED IDs FOR QUERY
                //get the root node
                var rootNode = nv[0];
                //get all elements where isSelected == true
                var a = HierarchyNodeService.getSelected(rootNode,[]);
                console.log("Selected");
                console.log(a);
                HierarchyNodeService.setSelected(a,nv);
                //get the ids of each element
                a = _.map(a,'elemetCode');
                scope.selected = a;

            },true);
        }
    }
})
}).call(this);
