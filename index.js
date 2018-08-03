const fs = require('fs');
const inputData = JSON.parse(fs.readFileSync('input.json', 'utf8'));
const util = {
  getTarget: (relation) =>{
    let target = [];
    for(let rKey in relation){
      let type = relation[rKey].type;
      if(type !== 'custom'){
        target.push(rKey);
      }
    }

    return target;
  }
}

///////////////////////////////////
//  define class
//////////////////////////////////
class Graph {
  constructor(){
    this.root = 0;
    this.nodes = {};
    this.maxLevel = 0;
    this.maxWidth = 0;
    this.levelTree = {};
  }

  addNode(node){
    let key = node.id;
    this.nodes[key] = node;
  }

  getRoots(){
    let cacheNodes = Object.assign({}, this.nodes);

    for(let key in this.nodes){
      let target = this.nodes[key].target;
      for(let idx = 0; idx < target.length; idx++){
        let tKey = target[idx];
        delete cacheNodes[tKey];
      }
    }

    return Object.keys(cacheNodes);
  }

  execute(){
    // root 구하기
    let roots = this.getRoots();
    for(var idx = 0; idx < roots.length; idx++){
      let rootNode = this.nodes[roots[idx]];
      this.setGrid(rootNode, 0, 0);
    }

    let answer = [];
    for(let level in this.levelTree){
      answer.push(this.levelTree[level]);
    }

    return answer;
  }

  setGrid(node, level, preGrid){
    let { target } = node;
    // let childCount = target.length;
    let grid = 0; 

    for(let idx = 0; idx < target.length; idx++){
      grid += this.setGrid(this.nodes[target[idx]], level+1, grid + preGrid);
    }



    node.grid = grid ? grid : 1;
    this.levelTree[level] = this.levelTree[level] || [];
    
    // null 추가
    if(target.length == 0 && preGrid > 0){
      this.levelTree[level].push({
        name: null,
        grid: preGrid,
        target: []
      });
    }
    this.levelTree[level].push(node);
  
    return node.grid;
  }
}

class Node {
  constructor(id, name, grid, target){
    this.id = id || "";
    this.name = name || "";
    this.grid = grid || 1;
    this.target = target || [];
    this.parents = [];
  }
}

///////////////////////////////////
//  execute code
//////////////////////////////////

let graph = new Graph();

for(let key in inputData){
  let {id, name, relation} = inputData[key];
  let target = util.getTarget(relation);
  graph.addNode(new Node(id, name, 1, target));
}


let answer = graph.execute();

console.log(answer)
