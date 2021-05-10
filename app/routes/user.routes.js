const { authJwt } = require("../middlewares");
const { verifySignUp } = require("../middlewares");
const controller = require("../controllers/user.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/userdetails", authJwt.verifyToken, controller.userdetails);
  app.get("/api/userdetail/:id", authJwt.verifyToken, controller.userdetail);
  app.post("/api/create", authJwt.verifyToken, controller.validate('createUser'), verifySignUp.checkDuplicateEntry, controller.create);
  app.post("/api/update/:id", authJwt.verifyToken, controller.validate('updateUser'), controller.update); 
  app.delete("/api/deleteuserdetail/:id", authJwt.verifyToken, controller.deleteuserdetail);

};
