(function(){
angular.module('timeSheetApp')
.service('HierarchyNodeService',function() {

    var selectedItems = [];

    function lowerCase(str) {
        return str.split(' ').map(function(e){
            return e.toString().toLowerCase();  
        }).join(' ');
    }
    
    function treeSearch(tree, query) {
        if (!tree) {
            return {};
        }

        if (lowerCase(tree.elementName).indexOf(lowerCase(query)) > -1) {
            tree.match = true;
            return tree;
        }

        var branches = _.reduce(tree.childElements, function(acc, leaf) {
            var newLeaf = treeSearch(leaf, query);

            if (!_.isEmpty(newLeaf)) {
                acc.push(newLeaf);
            }

            return acc;
        }, []);

        if (_.size(branches) > 0) {
            var trunk = _.omit(tree, 'childElements');
            trunk.childElements = branches;
        
            return trunk;
        }
    
        return {};
    }   
    
   function getAllChildren(node,arr) {
       if(!node) return;
        arr.push(node);

        if(node.childElements) {
            //if the node has children call getSelected for each and concat to array
            node.childElements.forEach(function(childNode) {
                arr = arr.concat(getAllChildren(childNode,[]))  
            })
        }
        return arr;   
    }    
    

    
    function findParent(node,parent,targetNode,cb) {
        if(_.isEqual(node,targetNode)) {
            cb(parent);
            return;
        }
        
        if(node.childElements) {
            node.childElements.forEach(function(item){
                findParent(item,node,targetNode,cb);
            });
        }
    }
            
    
    function getSelected(node,arr) {
        //if(!node) return [];
        //if this node is selected add to array
        if(node.isSelected) {
            arr.push(node);
            return arr;
        }
        
        if(node.childElements) {
            //if the node has children call getSelected for each and concat to array
            node.childElements.forEach(function(childNode) {
                arr = arr.concat(getSelected(childNode,[]))  
            })
        }
        return arr;    
    }
    
    function selectChildren(children,val) {

        //set as selected
        children.isSelected = val;
        if(children.childElements) {
            //recursve to set all children as selected
            children.childElements.forEach(function(el) {
                selectChildren(el,val);  
            })
        }
    }
    
    function trimLeafs(node,parent) {
        
            if(!node.childElements) {
                //da end of the road
                delete parent.childElements;
            } else {
                node.childElements.forEach(function(item){
                    trimLeafs(item,node);
                })
            }
    }

    var setSelected = function (selected,rootNode){
        console.log("Set selected");
        console.log(selected);
        selectedItems = selected;
    }

    function getSelectedItems(){
        console.log("Get selected Items");
        console.log(selectedItems);
        return selectedItems;
    }
    
    
   return {
       getAllChildren:getAllChildren,
       getSelected:getSelected,
       selectChildren:selectChildren,
       trimLeafs:trimLeafs,
       treeSearch:treeSearch,
       findParent:findParent,
       setSelected:setSelected,
       getSelectedItems:getSelectedItems
   };
   
})
    
}).call(this);
