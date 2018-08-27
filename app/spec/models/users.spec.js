process.env.DATABASE_NAME = 'TestUnitDatabase';
const users = require('../../models/users');
const fs = require('fs');

describe('Users Model', function () {

  describe('with fixtures', function () {

    beforeAll((done) => {
      users.model.remove({}).then(() => {
        const data = JSON.parse(fs.readFileSync("./spec/fixtures/mockdata.json"));
        const promises = data.map(element => {
          const item = new users.model(element);
          return item.save();
        });
        return Promise.all(promises);
      })
        .then(done)
        .catch(done.fail);
    });

    afterAll((done) => {
      users.model.remove({})
        .then(done)
        .catch(done.fail);
    });

    describe('getAll', function () {
      it('returns all items', function (done) {
        users.getAll()
          .then((result) => {
            expect(result.length).toEqual(1000);
            expect(result).toContain(jasmine.objectContaining({
              "FirstName": "Lonnard",
              "LastName": "Larmour",
              "Email": "llarmourb@npr.org",
              "Gender": "Male",
              "IsActive": true,
              "LastLoginDate": new Date("2018-01-29T21:53:20Z")
            }));
          })
          .then(done)
          .catch(done.fail);
      });
    });

    describe('getActiveUsers', function () {
      it('returns only active users', function (done) {
        users.getActiveUsers()
          .then((result) => {
            console.log(result.length);
            expect(result.length).toEqual(508);
            expect(result).toContain(jasmine.objectContaining({ "FirstName": "Lonnard",
            "LastName": "Larmour" }));
            expect(result).toContain(jasmine.objectContaining({ "LastName": "Zini" }));
            expect(result).not.toContain(jasmine.objectContaining({ "FirstName": "Adolf",
            "LastName": "Devine", }));
          })
          .then(done)
          .catch(done.fail);
      });
    });

  });

});