import bcrypt from "bcrypt";

const saltRounds = 10;

const signIn = (req, res, db) => {
  const { email, password } = req.body;
  db.select("email", "password")
    .from("login")
    .where("email", "=", email)
    .then((data) => {
      const isValid = bcrypt.compareSync(password, data[0].password);
      console.log(data);
      if (isValid) {
        db.select("*")
          .from("user")
          .where("email", "=", email)
          .then((data) => res.json(data[0]));
      }
    })
    .catch((err) => res.status(400).json(err));
};

const register = (req, res, db) => {
  const { email, password, name } = req.body;
  if (!email || !password || !name) {
    return res.status(400).json("invalid input");
  }
  const salt = bcrypt.genSaltSync(saltRounds);
  const hash = bcrypt.hashSync(password, salt);
  db.transaction((t) => {
    return t
      .insert({ email, password: hash }, "id")
      .into("login")
      .then((id) => {
        return t
          .returning("*")
          .insert({ email, name, entries: 0, date: new Date() })
          .into("user")
          .then((data) => {
            res.json(data[0]);
          })
          .catch(console.error);
      })
      .then(t.commit)
      .catch(t.rollback);
  });
};

const findAllUsers = (req, res, db) => {
  db.select("*")
    .from("user")
    .then((data) => {
      console.log("data", data);
      res.json(data);
    });
};

export { signIn, register, findAllUsers };
