const express = require("express");
const async = require("async");
var bodyParser = require("body-parser");

//const path = require("path");
const mongoose = require("mongoose");
const mongodbConnect = require("./config/database");

//const db = mongoose.connection;
const app = new express();
const Node = require('./models/user');///////////////
const router = express.Router(); 
var ObjectId = require('mongodb').ObjectId

var cors = require('cors')
app.use(cors()) // Use this after the variable declaration

mongodbConnect();

// Server Middleware
app.use(bodyParser.json());
app.use((req, res, next) => {
  console.log("A " + req.method + " request received at " + new Date());
  next();
});
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});
app.listen(8080, () => {
    console.log("Listening to port 8080.");
});

app.use('/api', router);
//=========================================================
//app.use(bodyParser.urlencoded({ extended: true }));
app.get('/', (req, res) => {
    res.json({ message: 'hooray! welcome to our home!' });   
});
//=========================================================
router.get('/', (req, res) => {
    res.json({ message: 'hooray! welcome to our api!' });   
});
//=======================get soldier list with populate ==================================
router.get('/users', (req, res) => {
    console.log('req.query', req.query)
    var pageOptions = {
      curpage: 0, //////////////////
      pnum: 1,
      limit: 3,////////////////////////
      order: {_id: -1},//{date: -1},
      searchText:'',
    }
    if(req.query.PageNum){
      pageOptions.curpage = parseInt(req.query.PageNum);
    }
    if(req.query.Num){
      pageOptions.pnum = parseInt(req.query.Num);
    }
    if(req.query.Limit){
      pageOptions.limit = parseInt(req.query.Limit);
    }
    if(req.query.Order !==''){
      pageOptions.order = (req.query.Order === 'ascending')?{name: 1}:{name:-1}
    }
    if(req.query.SearchText){
      pageOptions.searchText = req.query.SearchText;
    }
    console.log('pageOptions', pageOptions);//req.query);

    let search = req.query.SearchText;
    const searchQuery = {
      $or: [
          { name: new RegExp(search, "i") },
          //{ rank: new RegExp(search, "i") },
          //{ phone: new RegExp(search, "i") },
          //{ email: new RegExp(search, "i") },
      ]
    };

    console.log('searchQuery', search);//req.query);
    Node.find(searchQuery)
    //Node.find()
    .populate('superior')
    //.sort({ date: -1 })
    .collation({ locale: "en" })
    .sort(pageOptions.order)
    .skip(pageOptions.curpage * pageOptions.limit )//////////////////////////
    .limit(pageOptions.limit * pageOptions.pnum)///////////////////////////////
    .then(nodes => {
        console.log('res nodes length---------',nodes.length)
        res.status(200).json({nodes: nodes, 
                              PageNum: nodes.length > 0? (pageOptions.curpage + pageOptions.pnum) :pageOptions.curpage, 
                              Limit:parseInt(req.query.Limit),
                              Order: req.query.Order,
                              SearchText: req.query.SearchText,
        })
      })
    .catch(err => res.status(404).json({ error: 'No employees found' , err}));
    
    // search text 
}) 
//=======fetch all possible superior list and loop detection===============================
router.get('/users/supierior/:user_id', (req, res) => { 
//router.get('/users', (req, res) => {
    let id = (req.params.user_id!==undefined)? req.params.user_id:'-1';
    //console.log("get detial___________-req.params", req.params);
    console.log('without superior id:******88', req.params.user_id, id==='undefined');
    getAll(req, res, id); // return all possible superior node list
});
//======================loop detection ====================================================
function getAllChildNodes(startNodeId, callback1) {
  var tree = [];//descandents
  var Nodes = [];

  Node.findOne({_id: startNodeId }, (err, curnode)=>{
    console.log('curnode-----', curnode.id)
    tree.push(curnode);

    Node.find({ superior: curnode.id}, (err, nodesToLoad)=>{
          Nodes = nodesToLoad
          console.log('new Nodes length: ', Nodes.length)
          let count = 0;
    
          async.whilst(
              function test() { return count < Nodes.length },
              function iter(callback) {
                  console.log('==========88888============')
                  var subnode = Nodes[count]
                  tree.push(subnode);
                  console.log('subnode id', subnode.name)
                  count += 1;
                  Node.find({ superior: subnode._id}).exec((err, children)=>{
                    if(children){
                        Nodes = Nodes.concat(children);
                        callback(null, count);
                    }
                    else{
                        console.log(err)
                        callback(null, err)/////??
                    }
                  }); 
              },//iter
              function (err, n) {
                if(err)  
                  console.log(err)
                else{
                  console.log('success', tree.length)
                  callback1(null,tree)
                  //return tree;
                }
              }
            
          ); //async whilst
          console.log('out async whilst')
          //return tree;
    });//node.children;
})//find curnode first
}
//====================================================================================

async function getAll(req, res, id){
    if(id==='undefined'){
      Node.find(function(err, users){ //all possible superior node, no superior before 
          if(err){
              res.send(err.toString());
          }
          else{
              res.json(users);
          }
      })
    }//if
    else if(id){ // loop detection 
      console.log('with superior id: -----',id);
      //BFS 
      Node.find()
          .then(nodes => {
              console.log('nodes: length', nodes.length)

              getAllChildNodes(id, (err, tree)=>{
                console.log('tree', tree.length)
                for(let i = 0; i < tree.length; i++){
                  for(let j = 0; j < nodes.length; j++){
                    if (JSON.stringify(nodes[j]._id) === JSON.stringify(tree[i]._id)){
                      console.log('tree i id: ',tree[i]._id, nodes[j]._id);
                      nodes.splice(j, 1)// minus one node in the all node list
                    }
                  }
                }
                nodes.map(node=> console.log(node._id))
                res.send(nodes)
              })
              //res.send(filterdNodes);
          })//then
          .catch(error => res.status(404).json({ err: 'No employees found' , error}));
          
    }//else
}
//================================================================
router.post('/users',(req, res) => {
    //console.log("req.body", req.body);
    createOne(req, res);
})
let createOne = (req, res) => {
    var node = new Node();
    node.name = req.body.name;
    node.rank = req.body.rank[0];
    node.sex = req.body.sex;
    node.startdate = req.body.startdate;//Date.parseDate(req.body.startdate, "n/j/y");
    console.log("startdate", req.body.startdate);
    node.email = req.body.email;
    node.phone = req.body.phone;
    if(req.body.superior){
      node.superior = req.body.superior;
    };
    node.avatar = req.body.avatar;

    node.save(function(err){
        if(err){
          res.send(err.toString());
        }
        else if(req.body.superior){
            console.log("req body superior", req.body.superior[0]);
            Node.findOneAndUpdate({_id: req.body.superior[0]}, { $inc: { ds: 1 } }, function(err, user){
              if(err){
                console.log('error', err);
                res.send(err.toString());
              }
              else{                
                res.json(node);
              }
            })
        }
        else{
            res.json(node)
            //res.json({message: 'node created! and superior ds updated!'});
        }
    })
    
}

router.get('/search',(req, res) => {
  //console.log("req.body", req.body);
  searchSoldiers(req, res);
})
let searchSoldiers = (req, res) => {
  //console.log('search req.body', req.query);
  if(req.query.searchId){ //search superior in the main list
      Node.findById(req.query.searchId, function(err, user){
        if(err){
          console.log(err);
          res.send(err.toString());
        }
        else{
          res.json([user]);
        }
      })
  }
  else if(req.query.searchText!== ''){
    console.log("searchText:", req.query.searchText);
    //let searchQuery = { $text : { $search: req.query.searchText }};
      let search = req.query.searchText;
        const searchQuery = {
          $or: [
              { name: new RegExp(search, "i") },
              { rank: new RegExp(search, "i") },
              { phone: new RegExp(search, "i") },
              { email: new RegExp(search, "i") },
          ]
      };
      Node.find(searchQuery)
      .populate('superior')
      .then(users=>{
          console.log('users sent already!', users.length);
          res.json(users);
      })
      .catch(err=>{
          console.log("ERR:", err);
          res.send(err.toString());
      }) 
      /*,(err, users)=>{  
      if(err){
          console.log("ERR:", err);
          res.send(err.toString());
      }
      else{
          console.log('users sent already!', users.length);
          res.json(users);
      }
    })*/
  }
  else if(req.query.superiorId){//ponit to DS in the main list
    Node
        .find()
        .populate('superior')
        .find({ superior: req.query.superiorId}, function(err, users){
        if(err){
          console.log("ERR:", err);
          res.send(err.toString());
        }
        else{
          console.log('users sent already!', users.length);
          res.json(users);
        }
    })
  }

}

router.delete('/users/:user_id', (req, res) => {
    console.log("******8delete", req.params.user_id)
    deleteOne(req, res, req.params.user_id);
});
async function deleteOne (req, res, id) {
  try{
      let parent = (await Node.findById(id)).superior;//parent
      let children = (await Node.find({superior: id})).map(node => node._id);
      //console.log("parent", parent, "children", children);
      if(children && children.length > 0 && parent !== null){
          await Node.updateMany({superior: id}, {$set: {superior: parent}}).exec()
          await Node.updateOne({_id:parent}, {$inc:{ds: (-1 + children.length) }}).exec()
          console.log("many children and one parent");
      }
      else if ((children && (children.length === 0)) && (parent !== null)){
          //parent.ds -= 1
          await Node.findOneAndUpdate({_id: parent}, { $inc: { ds: -1 } }).exec()
          console.log("no children and one parent");
      }
      else if ((children && (children.length > 0)) && (parent === null)) {
          //update all children
          await Node.updateMany({superior: id}, {$set:{superior: null}}).exec()
          console.log("many children and no parent");
      }
      //delete cur node
      console.log("finally delete cur node", children);
      await Node.deleteOne({_id: id}).exec();
      res.send('node deleted successfully!')
  }
  catch(err){
      console.log('err happend when delete node', err);
      res.send(err.toString());
  }
}

//Detail user
router.get('/users/:user_id', (req, res) => {
  console.log("******get******user detail*****", req.params);
  Node.findById(req.params.user_id, function(err, user){
      if(err){
        console.log("Err happened", err.toString());
        res.send(err.toString());
      }
      else{
        res.json(user)
      }
  })
})

//Edit user
router.put('/users/:user_id', (req, res) => {
    console.log("******put***********", req.params.user_id);
    console.log("req.body.superior", req.body.superior);
    Node.findById(req.params.user_id, function(err, user) {
        if (err){
            console.log('edit err', err);
            res.send(err);
        }
        else{
            user.name = req.body.name;  // update the users info
            user.phone = req.body.phone;
            user.email = req.body.email;
            user.sex = req.body.sex;
            user.startdate = req.body.startdate;
            user.avatar = req.body.avatar;
            user.rank = req.body.rank && req.body.rank[0];
            let id1 = 0;
            if(user.superior){
              id1 = user.superior;////////////////////////
              console.log("id1-----------------", id1);
            }
            if(req.body.superior){
              user.superior = req.body.superior[0];
            }
            //user.ds = user.ds;
            // save the bear
            let id2 = 0;
            if(req.body.superior && (req.body.superior[0] !== undefined) && (req.body.superior[0] !== null)){
              console.log("--------------------id2-----------------", id2);
              id2 = req.body.superior[0];
            }
            updateSuperiorDS(id1, id2);
            user.save(function(err) {
                if (err){
                    console.log('save edit err', err);
                    res.send(err);
                }
                res.json({ message: 'User updated!' });
            });
        }
    });
})
async function updateSuperiorDS(id1, id2){
  //id1 - 1, id2 + 1
  if(id1 !== 0){
    console.log("updating id1: ", id1);
    await Node.findByIdAndUpdate({_id: id1}, {$inc:{ds: -1}}).exec();
    console.log("UPdate id1!!!!!!");
  }
  if(id2 !== 0){
    console.log("updating id2: ", id2);
    await Node.findByIdAndUpdate({_id: id2}, {$inc:{ds: 1}}).exec();
    console.log("UPdate id2!!!!!!");
  }
}