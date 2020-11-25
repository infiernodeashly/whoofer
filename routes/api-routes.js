// Requiring our models and passport as we've configured it
const db = require("../models");
const passport = require("../config/passport");
const isAuthenticated = require("../config/middleware/isAuthenticated");

module.exports = function (app) {
  app.post("/api/login", passport.authenticate("local"), (req, res) => {
    res.json({
      email: req.user.email,
      id: req.user.id,
    });
  });

  // Sign up route
  app.post("/api/signup", (req, res) => {
    db.User.create({
      email: req.body.email,
      password: req.body.password,
    })
      .then(() => {
        res.redirect(307, "/api/login");
      })
      .catch((err) => {
        res.status(401).json(err);
      });
  });

  // Creating a new Whoof
  app.post(
    "/api/whoofs",
    /*isAuthenticated,*/(req, res) => {
      const userWhoof = {
        UserId: parseInt(req.user.id),
        body: req.body.body,
      };
      db.Whoof.create(userWhoof)
        .then((data) => {
          res.json(data);
          console.log("YAY");
          // res.redirect(307, "/members");
        })
        .catch((err) => {
          res.status(401).json(err);
        });
    }
  );

  // Get all whoofs joined with users
  app.get(
    "/api/whoofs",
    /*isAuthenticated,*/ function (req, res) {
      db.User.findAll({
        include: [db.Whoof],
      })
        .then(function (dbWhoof) {
          // res.render("whoofs", { whoofs: dbWhoof });
          res.json(dbWhoof);
        })
        .catch((err) => {
          res.status(500).end();
          throw err;
        });
    }
  );

  // Delete whoof with a given id
  app.delete(
    "/api/whoofs/:id",
    /*isAuthenticated,*/ function (req, res) {
      db.Whoof.destroy({
        where: {
          id: req.params.id,
        },
      })
        .then(function (dbWhoof) {
          res.json(dbWhoof);
        })
        .catch((err) => {
          res.status(500).end();
          throw err;
        });
    }
  );

  // PUT route for updating posts
  app.put("/api/whoofs", function (req, res) {
    db.Whoof.update(req.body, {
      where: {
        id: req.body.id,
      },
    })
      .then(function (dbWhoof) {
        res.json(dbWhoof);
      })
      .catch((err) => {
        res.status(500).end();
        throw err;
      });
  });



  // Route for getting some data about our user to be used client side
  app.get("/api/user_data", isAuthenticated, (req, res) => {
    // Otherwise send back the user's email and id
    // Sending back a password, even a hashed password, isn't a good idea
    res.json({
      email: req.user.email,
      id: req.user.id,
    });
  });


  // Route for logging user out
  app.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
  });

  app.get("/members", isAuthenticated, (req, res) => {
    db.Whoof.findAll({
      include: [db.User]
    }).then((data) => {
      data.reverse();
      res.render("index", { whoofs: data });
    });
  });
};
