let express = require('express');
let app = express();
var path = require('path');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://sowmya:iNNrxOhVfEdvsUaI@vare.cnw2n.mongodb.net/vare?retryWrites=true&w=majority";
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
const { ObjectId } = require('mongodb');

app.get('/', (req, res) => {
  res.render('newindex', { foo: 'FOO' });
});
app.get('/menu', (req, res) => {

var menu=[];
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("vare");
    dbo.collection("category").find({level:1}).toArray(async function (err, result)  {
      if (err) throw err;
      // console.log(result);
      
     
      for(var i=0;i<result.length;i++)
      {
        var sublist=await dbo.collection("category").find({level:2,parent_id:result[i].id}).toArray();
        var submenu={};
        submenu.items=[];
        
        submenu.ischild=sublist.length>0?true:false;

        submenu.parent=result[i].id;
        console.log("iiiiiiiiii-------",sublist);
        for(var j=0;j<sublist.length;j++)
      {
        console.log("jjjjjjj-------",sublist[j]);
        var sub2list=await dbo.collection("category").find({level:3,parent_id:sublist[j].id}).toArray();
        var sub2menu={};
        console.log("333333333333-------",sub2list);
        sub2menu.items=sub2list;
        sub2menu.ischild=sub2list.length>0?true:false;
        sub2menu.parent=sublist[j].id;
        
        submenu.items.push(sub2menu);
        
      }
      menu.push(submenu);
      console.log("out-------",menu);

      }
      db.close();
      console.log("out-9999999------",menu);
      res.json({ "data": menu });

    });
  });

});
app.get('/shopnow', (req, res) => {

  var menu=[];
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("vare");
    dbo.collection("category").find({level:1}).toArray(async function (err, result)  {
      if (err) throw err;
      // console.log(result);
      
     
      for(var i=0;i<result.length;i++)
      {
        var sublist=await dbo.collection("category").find({level:2,parent_id:result[i].id}).toArray();
        var submenu={};
        submenu.items=[];
        
        submenu.ischild=sublist.length>0?true:false;

        submenu.parent=result[i].id;
        console.log("iiiiiiiiii-------",sublist);
        for(var j=0;j<sublist.length;j++)
      {
        console.log("jjjjjjj-------",sublist[j]);
        var sub2list=await dbo.collection("category").find({level:3,parent_id:sublist[j].id}).toArray();
        var sub2menu={};
        console.log("333333333333-------",sub2list);
        sub2menu.items=sub2list;
        sub2menu.ischild=sub2list.length>0?true:false;
        sub2menu.parent=sublist[j].id;
        
        submenu.items.push(sub2menu);
        
      }
      menu.push(submenu);
      console.log("out-------",menu);

      }
      
      console.log("out-9999999------",menu);
      dbo.collection("products").find({}).toArray(function (err, result) {
        if (err) throw err;
        // console.log(result);
        db.close();
        if (req.query.json == 1 || req.query.json == '1') {
          res.json({ "data": result ,"menu":menu});
          return;
        }
        res.render('listingpage', { "data": result ,"menu":menu});
  
      });

    });
  });

  // MongoClient.connect(url, function (err, db) {
  //   if (err) throw err;
  //   var dbo = db.db("vare");
  //   dbo.collection("products").find({}).toArray(function (err, result) {
  //     if (err) throw err;
  //     // console.log(result);
  //     db.close();
  //     res.render('listingpage', { "data": result });

  //   });
  // });

});

app.get('/shopproduct/:id', (req, res) => {
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("vare");
    dbo.collection("products").findOne({ "productId": req.params.id }, function (err, result) {
      if (err) throw err;
      console.log("DETAIL",result);
      db.close();
      if (req.query.json == 1 || req.query.json == '1') {
        res.json({"data" :result});
        return;
      }
      res.render('product-details-affiliate', result);
    });
  });

});
app.get('/contact', (req, res) => {
  res.render('contact-us', { foo: 'FOO' });
});
app.get('/terms-conditions', (req, res) => {
  res.render('terms&conditions', { foo: 'FOO' });
});
app.get('/privacy', (req, res) => {
  res.render('privacypolicy', { foo: 'FOO' });
});
app.get('/aboutus', (req, res) => {
  res.render('aboutus', { foo: 'FOO' });
});

app.get('/404', (req, res) => {
  res.render('404', { foo: 'FOO' });
});
app.get('/login-register', (req, res) => {
  res.render('login-register', { foo: 'FOO' });
});
app.get('/blog', (req, res) => {
  

  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("vare");
    dbo.collection("blog").find({}, {rich_text_Editor:-1}).toArray(function (err, result) {
      if (err) throw err;
      // console.log(result);
      db.close();
      res.render('blog-04-columns', { "data": result });

    });
  });


});
app.get('/singlepostimage/:id', (req, res) => {
  console.log(" req.params.id",  req.params.id);
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("vare");
    dbo.collection("blog").findOne({ "_id": ObjectId(req.params.id) }, function (err, result) {
      console.log("hi");
      if (err) throw err;
      console.log(result);
      db.close();
      res.render('single-post-image', result);
    });
  });

  // res.render('single-post-image', { foo: 'FOO' });
});
app.listen(3000, () => console.log('Example app listening on port 3000!'));