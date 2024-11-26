const express = require("express");
const mongoose = require("mongoose");
const User = require("./src/users/user.model");
const passport = require('passport');
const jwt = require('jsonwebtoken');
require('./src/users/auth');// Import Passport configuration
const cors = require('cors');
const app = express();
require('dotenv').config()
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser')
const { OAuth2Client } = require('google-auth-library');
const port = process.env.PORT || 5000;
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
// middleware setup
app.use(express.json({limit: "25mb"}));
// app.use((express.urlencoded({limit: "25mb"})));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}))
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

// Initialize Passport
app.use(passport.initialize());

// Google OAuth routes
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

/*app.get(
  '/auth/google/callback',
  passport.authenticate('google', { session: false }), async (req, res) => {
    const id = req.user._id;
    console.log('id',req.user.id);
    const user = await User.findOne({ id });
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    if (user.status === "block") {
      return res.status(406).send({ message: "User Blocked. Contact Cust. Care" });
    }
  
    // Generate a JWT token
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });

    res.redirect(`http://localhost:5173?token=${token}&user=${user}`); // Redirect to frontend with token

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });
  }
);*/
app.post('/auth/google/callback', async (req, res) => {
  const { token } = req.body;

  try {
    // Verify the token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID, // Specify the client ID
    });

    const payload = ticket.getPayload(); // User info
    const userId = payload.sub; // Google user ID
//console.log('payload',payload);
//console.log('userid',userId);
    // Find or create user in your database
    let user = await User.findOne({ googleId: userId });
    if (!user) {
      user = new User({
        googleId: userId,
        email: payload.email,
        username: payload.name,
        profileImage: payload.picture,
      });
      await user.save();
    }

    // Generate your JWT token
    const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: '1h',
    });

    res.cookie("jwtToken", jwtToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });

    res.send({ token: jwtToken, user });
  } catch (error) {
    console.error('Error during token verification:', error);
    res.status(401).json({ error: 'Unauthorized' });
  }
});


// image upload 
const uploadImage = require("./src/utils/uploadImage");

// all routes
const authRoutes = require('./src/users/user.route');
const productRoutes =  require('./src/products/products.route');
const reviewRoutes = require('./src/reviews/reviews.router');
const orderRoutes = require('./src/orders/orders.route');
const statsRoutes = require('./src/stats/stats.route')

app.use('/api/user', authRoutes);
app.use('/api/products', productRoutes);
app.use("/api/reviews", reviewRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/stats', statsRoutes)



main()
  .then(() => console.log("mongodb is successfully connected."))
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(process.env.DB_URL);

  app.get("/", (req, res) => {
    res.send("Server is running....!");
  });
}

app.post("/uploadImage", (req, res) => {
  uploadImage(req.body.image)
    .then((url) => res.send(url))
    .catch((err) => res.status(500).send(err));
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
