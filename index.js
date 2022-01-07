let express = require("express");
let app = express();
var path = require("path");
var axios = require("axios");
var mcache = require('memory-cache');


var MongoClient = require("mongodb").MongoClient;
var url =
  "mongodb+srv://sowmya:iNNrxOhVfEdvsUaI@vare.cnw2n.mongodb.net/vare?retryWrites=true&w=majority";
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
const { ObjectId } = require("mongodb");

app.use(function(req, res, next){
   let key = '__express__' + req.originalUrl || req.url
    let cachedBody = mcache.get(key)
    if (cachedBody) {
      res.send(cachedBody)
      return
    } else {
      res.sendResponse = res.send
      res.send = (body) => {
        mcache.put(key, body, 20 * 1000);
        res.sendResponse(body)
      }
      next()
    }
})

var token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZSI6IjkxOTcwMzIyMDk3NCIsInVzZXJJZCI6ImQzNmNlZDIwLTFkYjUtMTFlYy1hZmIwLWMzYzkzYzc4ZThmMyIsInZlbmRvcklkIjoiZTI3YWFmOTAtMjBlYS0xMWVjLWFjNzQtODkzMWZiOWIzMDYyIiwiaWF0IjoxNjM2NDQyMTMwLCJleHAiOjMzMTk0MDQyMTMwfQ.llmnWVk8YAg7Q9YZW3rQKs_DAhi0hZaUAsQ7sQrSDWY";
app.get("/", (req, res) => {
  var menu = [];
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("vare");
    dbo
      .collection("category")
      .find({ level: 1 })
      .toArray(async function (err, result) {
        if (err) throw err;
        // console.log(result);

        for (var i = 0; i < result.length; i++) {
          var sublist = await dbo
            .collection("category")
            .find({ level: 2, parent_id: result[i].id })
            .toArray();
          var submenu = {};
          submenu.items = [];

          submenu.ischild = sublist.length > 0 ? true : false;

          submenu.parent = result[i].id;
          // console.log("iiiiiiiiii-------", sublist);
          for (var j = 0; j < sublist.length; j++) {
            // console.log("jjjjjjj-------", sublist[j]);
            var sub2list = await dbo
              .collection("category")
              .find({ level: 3, parent_id: sublist[j].id })
              .toArray();
            var sub2menu = {};
            // console.log("333333333333-------", sub2list);
            sub2menu.items = sub2list;
            sub2menu.ischild = sub2list.length > 0 ? true : false;
            sub2menu.parent = sublist[j].id;

            submenu.items.push(sub2menu);
          }
          menu.push(submenu);
          // console.log("out-------", menu);
        }
        dbo
          .collection("configuration")
          .findOne({ name: "homepage" }, function (err, result) {
            if (err) throw err;
            // console.log(result);
            db.close();
            if (req.query.json == 1 || req.query.json == "1") {
              res.json({ data: result, menu: menu });
              return;
            }
            //  res.json(result);
            res.render("newindex", { result: result, menu: menu });
          });
      });
  });
});

app.get("/menu", (req, res) => {
  var menu = [];
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("vare");
    dbo
      .collection("category")
      .find({ level: 1 })
      .toArray(async function (err, result) {
        if (err) throw err;
        // console.log(result);

        for (var i = 0; i < result.length; i++) {
          var sublist = await dbo
            .collection("category")
            .find({ level: 2, parent_id: result[i].id })
            .toArray();
          var submenu = {};
          submenu.items = [];

          submenu.ischild = sublist.length > 0 ? true : false;

          submenu.parent = result[i].id;
          // console.log("iiiiiiiiii-------", sublist);
          for (var j = 0; j < sublist.length; j++) {
            // console.log("jjjjjjj-------", sublist[j]);
            var sub2list = await dbo
              .collection("category")
              .find({ level: 3, parent_id: sublist[j].id })
              .toArray();
            var sub2menu = {};
            // console.log("333333333333-------", sub2list);
            sub2menu.items = sub2list;
            sub2menu.ischild = sub2list.length > 0 ? true : false;
            sub2menu.parent = sublist[j].id;

            submenu.items.push(sub2menu);
          }
          menu.push(submenu);
          // console.log("out-------", menu);
        }
        db.close();
        // console.log("out-9999999------", menu);
        res.json({ data: menu });
      });
  });
});

//query params:category,pageNo,serach
app.get("/shopnow", async (req, res) => {
  // var menu = [];

  // MongoClient.connect(url, function (err, db) {
  //   if (err) throw err;
  //   var dbo = db.db("vare");
  //   dbo
  //     .collection("category")
  //     .find({ level: 1 })
  //     .toArray(async function (err, result) {
  //       if (err) throw err;
  //       // console.log(result);

  //       for (var i = 0; i < result.length; i++) {
  //         var sublist = await dbo
  //           .collection("category")
  //           .find({ level: 2, parent_id: result[i].id })
  //           .toArray();
  //         var submenu = {};
  //         submenu.items = [];

  //         submenu.ischild = sublist.length > 0 ? true : false;

  //         submenu.parent = result[i].id;
  //         console.log("iiiiiiiiii-------", sublist);
  //         for (var j = 0; j < sublist.length; j++) {
  //           console.log("jjjjjjj-------", sublist[j]);
  //           var sub2list = await dbo
  //             .collection("category")
  //             .find({ level: 3, parent_id: sublist[j].id })
  //             .toArray();
  //           var sub2menu = {};
  //           console.log("333333333333-------", sub2list);
  //           sub2menu.items = sub2list;
  //           sub2menu.ischild = sub2list.length > 0 ? true : false;
  //           sub2menu.parent = sublist[j].id;

  //           submenu.items.push(sub2menu);
  //         }
  //         menu.push(submenu);
  //         console.log("out-------", menu);
  //       }

  //       console.log("out-9999999------", menu);

  //       // dbo
  //       //   .collection("products")
  //       //   .find({})
  //       //   .toArray(function (err, result) {
  //       //     if (err) throw err;
  //       //     // console.log(result);
  //       //     db.close();
  //       //     if (req.query.json == 1 || req.query.json == "1") {
  //       //       res.json({ data: result, menu: menu });
  //       //       return;
  //       //     }
  //       //     res.render("listingpage", { data: result, menu: menu });
  //       //   });
  //     });
  // });

  // // MongoClient.connect(url, function (err, db) {
  // //   if (err) throw err;
  // //   var dbo = db.db("vare");
  // //   dbo.collection("products").find({}).toArray(function (err, result) {
  // //     if (err) throw err;
  // //     // console.log(result);
  // //     db.close();
  // //     res.render('listingpage', { "data": result });

  // //   });
  // // });
  var pageNo = 1;
  if (req.query.pageNo != undefined) {
    pageNo = req.query.pageNo;
  }
  var menu = await getMenu();

  var data = JSON.stringify({
    category: req.query.category != undefined ? [req.query.category] : [],
    serach: req.query.serach != undefined ? req.query.serach : "",
  });

  var config = {
    method: "post",
    url:
      "https://k6u06d3vrf.execute-api.ap-south-1.amazonaws.com/dev/api/product?pageNo=" +
      pageNo,
    headers: {
      "x-user-auth": token,
      "Content-Type": "application/json",
    },
    data: data,
  };

  var response = await axios(config);

  // res.json("listingpage", { menu: menu, data: response.data });
  if (!response.data.status) {
    response.data.data = [];
  }
  // console.log("RRRRRRRRRREs",response);
  if (req.query.json == 1 || req.query.json == "1") {
    res.json({ data: response.data, menu: menu });
    return;
  }

  res.render("listingpage", { data: response.data, menu: menu });
});

app.get("/shopproduct/:id", async (req, res) => {
  var menu = [];
  menu = await getMenu();
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("vare");

    dbo
      .collection("products")
      .findOne({ productId: req.params.id }, function (err, result) {
        if (err) throw err;
        console.log("DETAIL", result);
        db.close();
        if (req.query.json == 1 || req.query.json == "1") {
          res.json({ data: result, menu: menu });
          return;
        }
        res.render("product-details-affiliate", {
          result: result,
          menu: menu,
        });
      });
  });
});
app.get("/contact", async (req, res) => {
  var menu = [];
  menu = await getMenu();

  var config = {
    method: "get",
    url: "http://k6u06d3vrf.execute-api.ap-south-1.amazonaws.com/dev/api/staticpages?pageName=contactus",
    headers: {},
  };

  var response = await axios(config);

  if (req.query.json == 1 || req.query.json == "1") {
    res.json({ data: response.data, menu: menu });
    return;
  }
  res.render("contact-us", { result: response.data.data, menu: menu });
});
app.get("/terms-conditions", async (req, res) => {
  var menu = [];
  menu = await getMenu();

  var config = {
    method: "get",
    url: "http://k6u06d3vrf.execute-api.ap-south-1.amazonaws.com/dev/api/staticpages?pageName=terms_conditions",
    headers: {},
  };

  var response = await axios(config);

  if (req.query.json == 1 || req.query.json == "1") {
    res.json({ data: response.data, menu: menu });
    return;
  }  res.render("terms_conditions", { result: response.data.data, menu: menu });
});
app.get("/privacy", async (req, res) => {
  var menu = [];
  menu = await getMenu();
  var config = {
    method: "get",
    url: "http://k6u06d3vrf.execute-api.ap-south-1.amazonaws.com/dev/api/staticpages?pageName=privacypolicy",
    headers: {},
  };

  var response = await axios(config);

  if (req.query.json == 1 || req.query.json == "1") {
    res.json({ data: response.data, menu: menu });
    return;
  }
  res.render("privacypolicy", { result: response.data.data, menu: menu });
});
app.get("/aboutus", async (req, res) => {
  var menu = [];
  menu = await getMenu();
  var config = {
    method: "get",
    url: "http://k6u06d3vrf.execute-api.ap-south-1.amazonaws.com/dev/api/staticpages?pageName=aboutus",
    headers: {},
  };

  var response = await axios(config);

  if (req.query.json == 1 || req.query.json == "1") {
    res.json({ data: response.data, menu: menu });
    return;
  }
  res.render("aboutus", { result: response.data.data, menu: menu });
});
app.get("/vendor-policy", async (req, res) => {
  var menu = [];
  menu = await getMenu();
  var config = {
    method: "get",
    url: "http://k6u06d3vrf.execute-api.ap-south-1.amazonaws.com/dev/api/staticpages?pageName=vendor-policy",
    headers: {},
  };

  var response = await axios(config);

  if (req.query.json == 1 || req.query.json == "1") {
    res.json({ data: response.data, menu: menu });
    return;
  }
  res.render("vendor-policy", { result: response.data.data, menu: menu });
});
app.get("/404", (req, res) => {
  res.render("404", { foo: "FOO" });
});
app.get("/login-register", (req, res) => {
  res.render("login-register", { foo: "FOO" });
});
app.get("/blog", async (req, res) => {
  var pageNo = 1;
  if (req.query.pageNo != undefined) {
    pageNo = req.query.pageNo;
  }
  var menu = await getMenu();

  var data = JSON.stringify({
    tags: req.query.tag != undefined ? [req.query.tag] : [],
  });

  var config = {
    method: "post",
    url:
      "https://k6u06d3vrf.execute-api.ap-south-1.amazonaws.com/dev/api/blog?pageNo=" +
      pageNo,
    headers: {
      "x-user-auth": token,
      "Content-Type": "application/json",
    },
    data: data,
  };

  var response = await axios(config);
  // console.log(JSON.stringify(response.data));

  //res.render("product-details-affiliate",{menu:menu,result:response.data});
  if (req.query.json == 1 || req.query.json == "1") {
    res.json({ data: response.data, menu: menu });
    return;
  }
  res.render("blog-04-columns", { data: response.data, menu: menu });
  // res.json({ menu: menu, result: response.data });
});

app.get("/singlepostimage/:id", async (req, res) => {
  // console.log(" req.params.id", req.params.id);

  var menu = [];
  menu = await getMenu();
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("vare");

    dbo
      .collection("blog")
      .findOne({ _id: ObjectId(req.params.id) }, function (err, result) {
        // console.log("hi");
        if (err) throw err;
        // console.log(result);
        result.tags = result.tags.split(",")
        db.close();
        if (req.query.json == 1 || req.query.json == "1") {
          res.json({ result: result, menu: menu });
          return;
        }
        res.render("single-post-image", { result: result, menu: menu });
      });
  });

  // res.render('single-post-image', { foo: 'FOO' });
});

async function getMenu() {
  var menu = [];
  var db = await MongoClient.connect(url, { useNewUrlParser: true }).catch(
    (err) => {
      console.log(err);
    }
  );
  var dbo = db.db("vare");
  var result = await dbo.collection("category").find({ level: 1 }).toArray();
  // console.log(result);

  for (var i = 0; i < result.length; i++) {
    var sublist = await dbo
      .collection("category")
      .find({ level: 2, parent_id: result[i].id })
      .toArray();
    var submenu = {};
    submenu.items = [];

    submenu.ischild = sublist.length > 0 ? true : false;

    submenu.parent = result[i].id;
    submenu.parentName = result[i].name;
    // console.log("iiiiiiiiii-------", sublist);
    for (var j = 0; j < sublist.length; j++) {
      // console.log("jjjjjjj-------", sublist[j]);
      var sub2list = await dbo
        .collection("category")
        .find({ level: 3, parent_id: sublist[j].id })
        .toArray();
      var sub2menu = {};
      // console.log("333333333333-------", sub2list);
      sub2menu.items = sub2list;
      sub2menu.ischild = sub2list.length > 0 ? true : false;
      sub2menu.parent = sublist[j].id;
      sub2menu.parentNmae = sublist[j].name;
      submenu.items.push(sub2menu);
    }
    menu.push(submenu);
    // console.log("out-------", menu);
  }

  // console.log("out-9999999------", menu);
  return menu;
}
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Example app listening on port 3000!"));
