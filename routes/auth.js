const express = require("express");
const passport = require('passport');
const jwt = require("jsonwebtoken");
const { register, login, getUser } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const { CLIENT_URL, JWT_SECRET } = require("../config");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/user", getUser); 

router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/success', (req, res) => {
  if (req.user) {
    const token = jwt.sign({ id: req.user._id }, JWT_SECRET, { expiresIn: '30d' });

    res.send(`
      <script>
        window.opener.postMessage({ type: 'AUTH_SUCCESS', user: ${JSON.stringify(req.user)}, token: '${token}' }, '${CLIENT_URL}');
        window.close();
      </script>
    `);
  } else {
    res.redirect(`${CLIENT_URL}/login`);
  }
});

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    // res.redirect(`/api/auth/google/success`);

    const token = jwt.sign({ id: req.user._id }, JWT_SECRET, { expiresIn: '30d' });
    res.redirect(`${CLIENT_URL}/auth-callback?token=${token}`);
  }
);

router.get('/logout', (req, res) => {
  req.logout((err) => {
    if(err) {
      return res.status(500).json({ message: 'Error logging out' });
    }
  });
  res.redirect(`${CLIENT_URL}/clients`);
});

module.exports = router;