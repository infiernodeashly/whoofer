// const { ConnectionError } = require("sequelize/types");

// When the page loads, grab and display all of our whoofs
$.get("/api/all", (data) => {
  if (data.length !== 0) {
    for (let i = 0; i < data.length; i++) {
      const row = $("<div>");
      row.addClass("whoof");

      row.append("<p>" + data[i].author + " whoofed.. </p>");
      row.append("<p>" + data[i].body + "</p>");
      row.append(
        "<p>On " + new Date(data[i].created_at).toLocaleDateString() + "</p>"
      );

      $("#whoof-area").prepend(row);
    }
  }
});

// When user whoofs (clicks addBtn)
$("#whoof-submit").on("click", (event) => {
  event.preventDefault();

  // Make a newwhoof object
  const newwhoof = {
    author: $("#author")
      .val()
      .trim(),
    body: $("#whoof-box")
      .val()
      .trim(),
    createdAt: new Date()
      .toISOString()
      .slice(0, 19)
      .replace("T", " "),
  };

  console.log(newwhoof);

  // Send an AJAX POST-request with jQuery
  $.post("/api/new", newwhoof)
    // On success, run the following code
    .then(() => {
      const row = $("<div>");
      row.addClass("whoof");

      row.append("<p>" + newwhoof.author + " whoofed: </p>");
      row.append("<p>" + newwhoof.body + "</p>");
      row.append(
        "<p>On " + new Date(newwhoof.createdAt).toLocaleDateString() + "</p>"
      );

      $("#whoof-area").prepend(row);
    });

  // Empty each input box by replacing the value with an empty string
  $("#author").val("");
  $("#whoof-box").val("");
});


// 
// When user clicks update button
$("#whoof-update").on("click", (event) => {
  event.preventDefault();

  console.log("udpating whoof");

  $.put("/api/whoofs/:id", function (req, res) {
    whoof.findBypK(req.params.id).then(function (whoof) {
      whoof.update({
        whoof: req.body.whoof,
        tag: req.body.tag
      }).then((whoof) => {
        res.json(whoof);
      });
    });
  });
  //   connection.query("UPDATE whoofs SET whoof = ? WHERE id = ?", [req.body.movie, req.params.id], function (err, result) {
  //     if (err) {
  //       // If an error occurred, send a generic server failure
  //       return res.status(500).end();
  //     }
  //     else if (result.changedRows === 0) {
  //       // If no rows were changed, then the ID must not exist, so 404
  //       return res.status(404).end();
  //     }
  //     res.status(200).end();

  //   });
  // });

  //
  // Delete 
  $("#whoof-delete").on("click", (event) => {
    event.preventDefault();

    console.log("deleting whoof");
    $.delete("/whoofs/:id", function (req, res) {
      whoof.findByPk(req.params.id).then(function (whoof) {
        whoof.destroy();
      }).then(() => {
        res.sendStatus(200);
      });
    });
  });
});