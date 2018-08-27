var express = require("express");
var router = express.Router();
var users = require("../models/users");

/* GET users listing. */
router.get("/", function(req, res, next) {
  users
    .getAll()
    .then(result => {
      const users = result.map(item => ({
        First: item.FirstName,
        Last: item.LastName,
        Active: item.IsActive,
      }));
      res.send({ Users: users });
    })
    .catch(err => {
      res.sendStatus(500);
      res.render("error", { message: "Cannot get users", error: err });
    });
});

/* INSERT mocked user data */
router.get("/setup-mock-data", function(req, res, next) {
  users
    .insertMockData()
    .then(result => {
      res.render("status", {
        status: `${result.message}\nUsers in database: ${result.count}`,
      });
    })
    .catch(err => {
      res.render("error", { message: "Cannot insert mock data", error: err });
    });
});

router.post("/add-user", function(req, res) {
  // email validation function
  function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  // date validation function
  function isValidDate(dateString) {
    // First check for the pattern
    if (!/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateString)) return false;

    // Parse the date parts to integers
    var parts = dateString.split("/");
    var day = parseInt(parts[1], 10);
    var month = parseInt(parts[0], 10);
    var year = parseInt(parts[2], 10);

    // Check the ranges of month and year
    if (year < 1000 || year > 3000 || month == 0 || month > 12) return false;

    var monthLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    // Adjust for leap years
    if (year % 400 == 0 || (year % 100 != 0 && year % 4 == 0))
      monthLength[1] = 29;

    // Check the range of the day
    return day > 0 && day <= monthLength[month - 1];
  }
  // Check string and boolean values
  function validation(keyVal, stringName, type) {
    if (!keyVal && typeof keyVal !== type) {
      res.render("error", { message: `${stringName} not valid/missing.` });
    }
  }
  validation(req.body.FirstName, "First name", "string");
  validation(req.body.LastName, "Last name", "string");
  validation(req.body.Gender, "Gender", "string");
  validation(req.body.IsActive, "Activity", "boolean");

  // check email using regex
  if (!validateEmail(req.body.Email)) {
    res.render("error", { message: "Email isn't valid." });
  }

  // check date using function
  if (!isValidDate(req.body.LastLoginDate)) {
    res.render("error", {
      message: "Date is missing or is not in mm/dd/yyyy form.",
    });
  }

  // create user in db if all data is valid.
  users
    .createUser(user)
    .then(users => {
      res.send({ Users: users });
    })
    .catch(err => {
      res.sendStatus(422);
      res.render("error", { message: "Cannot add user.", error: err });
    });
});
module.exports = router;
