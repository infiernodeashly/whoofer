$("#whoof-area").on("click", ".whoof-delete", (event) => {
  event.preventDefault();
  const id = $(event.target).data("id");
  $.ajax({
    url: "/api/whoofs/" + id,
    method: "DELETE",
  }).then(function () {
    console.log("Deleted Successfully!");
    location.reload();
  });
});

$("#log-out").click(() => {
  $.ajax({
    url: "/logout",
    method: "GET"
  }).then(() => {
    location.reload();
    console.log("Logged out");
  }).catch((err) => {
    throw err;
  });
});

// When user whoofs (clicks addBtn)
$("#whoof-submit").on("click", (event) => {
  event.preventDefault();

  // Make a newwhoof object
  const newWhoof = {
    body: $("#whoof-box")
      .val()
      .trim(),
  };

  // Send an AJAX POST-request with jQuery
  $.post("/api/whoofs", newWhoof)
    // On success, run the following code
    .then((data) => {
      console.log(data);
      location.reload();
    });

  $("#whoof-box").val("");
});
