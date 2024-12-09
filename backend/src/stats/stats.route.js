const express = require('express');
const User = require('../users/user.model');
const Order = require('../orders/orders.model');
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

        // sum of all orders
        const totalPaymentsResult =  await Order.aggregate([
            { $match: {userId: user._id}},
            {
                $group: {_id: null, totalAmount: {$sum: "$amount"}}
            }
        ])

        const totalPaymentsAmmount =  totalPaymentsResult.length > 0 ? totalPaymentsResult[0].totalAmount : 0

        // get total review 
        const totalReviews = await Reviews.countDocuments({userId: user._id})

        // total purchased products
        const purchasedProductIds = await Order.distinct("products._id", {userId: user._id});
        const totalPurchasedProducts =  purchasedProductIds.length;

        res.status(200).send({
           totalPayments: totalPaymentsAmmount.toFixed(2),
           totalReviews,
           totalPurchasedProducts
        });
        
     } catch (error) {
        console.error("Error fetching user stats", error);
        res.status(500).send({ message: 'Failed to fetch user stats' });
     }
})

// admin status 
router.get('/admin-stats', async (req, res) => {
    try {
      // Count total orders
      const totalOrders = await Order.countDocuments();
  
      // Count total products
      const totalProducts = await Products.countDocuments();
  
      // Count total reviews
      const totalReviews = await Reviews.countDocuments();
  
      // Count total users
      const totalUsers = await User.countDocuments();
  
      // Calculate total earnings by summing the 'amount' of all orders
      const totalEarningsResult = await Order.aggregate([
        {
          $group: {
            _id: null,
            totalEarnings: { $sum: "$amount" },
          },
        },
      ]);
  
      const totalEarnings = totalEarningsResult.length > 0 ? totalEarningsResult[0].totalEarnings : 0;
   
  
      // Send the aggregated data
      res.status(200).json({
        totalOrders,
        totalProducts,
        totalReviews,
        totalUsers,
        totalEarnings, 
  
      });
    } catch (error) {
      console.error("Error fetching admin stats:", error);
      res.status(500).json({ message: "Failed to fetch admin stats" });
    }
  });

module.exports = router;