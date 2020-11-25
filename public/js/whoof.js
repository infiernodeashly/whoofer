$(document).ready(() => {
  $(".whoof-delete").on("click", (event) => {
    event.preventDefault();
    let id = -1;
    if ($(event.target).is("i")) {
      id = $(event.target.parentElement).data("id");
    } else {
      id = $(event.target).data("id");
    }

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

  $(".whoof-update").on("click", (event) => {
    event.preventDefault();
    let whoofId = -1;
    if ($(event.target).is("i")) {
      whoofId = $(event.target.parentElement).data("id");
    } else {
      whoofId = $(event.target).data("id");
    }
    $.ajax({
      url: "/api/whoofs/" + whoofId,
      method: "GET",
    }).then((data) => {
      console.log(data);
      $("#placeholder").val(data.body);
      $("#update-whoof").modal("show");

      $(document).on("click", "#save-whoof", () => {
        const editedWhoof = {
          body: $("#placeholder").val()
        };

        console.log(editedWhoof);
        $.ajax({
          url: "/api/whoofs/" + whoofId,
          method: "PUT",
          data: editedWhoof
        }).then(() => {
          $("#update-whoof").modal("show");
          location.reload();
        }).catch((err) => {
          throw err;
        });
      });
    });

    console.log(whoofId);
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

});



