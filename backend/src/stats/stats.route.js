const express = require('express');
const User = require('../users/user.model');
const Reviews = require('../reviews/reviews.model');
const Products = require('../products/products.model');
const router = express.Router();

// user stats by email
router.get('/user-stats/:email', async(req, res) => {
    const { email } = req.params;
    if (!email) {
        return res.status(400).send({ message: 'Email is required' });
    }
     try {
        const user =  await User.findOne({ email: email})
        
        if(!user) return res.status(404).send({ message: 'User not found' });

        // get total review 
        const totalReviews = await Reviews.countDocuments({userId: user._id})

        res.status(200).send({
           totalReviews,
        });
        
     } catch (error) {
        console.error("Error fetching user stats", error);
        res.status(500).send({ message: 'Failed to fetch user stats' });
     }
})

// admin status 
router.get('/admin-stats', async (req, res) => {
    try {
     
  
      // Count total products
      const totalProducts = await Products.countDocuments();
  
      // Count total reviews
      const totalReviews = await Reviews.countDocuments();
  
      // Count total users
      const totalUsers = await User.countDocuments();
  
 
  
      // Send the aggregated data
      res.status(200).json({
        totalProducts,
        totalReviews,
        totalUsers,
      });
    } catch (error) {
      console.error("Error fetching admin stats:", error);
      res.status(500).json({ message: "Failed to fetch admin stats" });
    }
  });

module.exports = router;