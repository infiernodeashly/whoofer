// Requiring our models and passport as we've configured it
const db = require("../models");
const passport = require("../config/passport");
const isAuthenticated = require("../config/middleware/isAuthenticated");

module.exports = function(app) {
  // Using the passport.authenticate middleware with our local strategy.
  // If the user has valid login credentials, send them to the members page.
  // Otherwise the user will be sent an error
  app.post("/api/login", passport.authenticate("local"), (req, res) => {
    // Sending back a password, even a hashed password, isn't a good idea
    res.json({
      email: req.user.email,
      id: req.user.id,
    });
  });

  // Route for signing up a user. The user's password is automatically hashed and stored securely thanks to
  // how we configured our Sequelize User Model. If the user is created successfully, proceed to log the user in,
  // otherwise send back an error
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
  app.post("/api/new", (req, res) => {
    const userWhoof = {
      UserId: parseInt(req.user.id),
      body: req.body.body,
    };
    db.Whoof.create(userWhoof)
      .then(() => {
        console.log("YAY");
        // res.redirect(307, "/members");
      })
      .catch((err) => {
        res.status(401).json(err);
      });
  });

  // Get all whoofs joined with users
  app.get(
    "/api/whoofs",
    /*isAuthenticated,*/ function(req, res) {
      db.User.findAll({
        include: [db.Whoof],
      })
        .then(function(dbWhoof) {
          res.json(dbWhoof);
        })
        .catch((err) => {
          res.status(500).end();
          throw err;
        });
    }
  );

  app.delete(
    "/api/whoofs/:id",
    /*isAuthenticated,*/ function(req, res) {
      db.Whoof.destroy({
        where: {
          id: req.params.id,
        },
      })
        .then(function(dbWhoof) {
          res.json(dbWhoof);
        })
        .catch((err) => {
          res.status(500).end();
          throw err;
        });
    }
  );

  // Get all whoofs
  // app.get("/api/whoofs", (req, res) => {
  //   // Here we add an "include" property to our options in our findAll query
  //   // We set the value to an array of the models we want to include in a left outer join
  //   // In this case, just db.Post
  //   if (req.user) {
  //     // res.redirect("/members");
  //     db.Whoof.findAll({})
  //       .then((dbWhoof) => {
  //         res.json(dbWhoof);
  //       })
  // .catch((err) => {
  //   res.status(500).end();
  //   throw err;
  // });
  //   } else {
  //     res.redirect("/login");
  //   }
  // });

  // Route for logging user out
  app.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
  });

  // Route for getting some data about our user to be used client side
  app.get("/api/user_data", (req, res) => {
    if (!req.user) {
      // The user is not logged in, send back an empty object
      res.json({});
    } else {
      // Otherwise send back the user's email and id
      // Sending back a password, even a hashed password, isn't a good idea
      res.json({
        email: req.user.email,
        id: req.user.id,
      });
    }
  });
};
