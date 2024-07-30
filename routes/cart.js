const express = require('express');
const router = express.Router();
const mongoose = require('mongoose'); // Add this line
const { isLoggedIn } = require('../middleware');
const Product = require('../models/Product');
const User = require('../models/User');

// Route to get the user's cart
router.get('/user/cart', isLoggedIn, async (req, res) => {
    const user = await User.findById(req.user._id).populate('cart.product');
    const totalAmount = user.cart.reduce((sum, curr) => sum + curr.product.price, 0);
    const productInfo = user.cart.map((p) => p.product.desc).join(',');
    res.render('cart/cart', { user, totalAmount, productInfo });
});

// Route to add product to the cart
router.post('/user/:productId/add', isLoggedIn, async (req, res) => {
    const { productId } = req.params;
    const userId = req.user._id;
    const product = await Product.findById(productId);
    const user = await User.findById(userId);

    // Add product to cart with a unique cartItemId
    user.cart.push({ product: product._id, cartItemId: new mongoose.Types.ObjectId() });
    await user.save();
    res.redirect('/user/cart');
});

// Route to delete product from the cart
router.post('/user/cart/:cartItemId/delete', isLoggedIn, async (req, res) => {
    try {
        const { cartItemId } = req.params;
        const userId = req.user._id;

        const user = await User.findById(userId);

        // Remove the specific cart item by its unique cartItemId
        user.cart = user.cart.filter((cartItem) => cartItem.cartItemId.toString() !== cartItemId);
        await user.save();

        res.redirect('/user/cart');
    } catch (error) {
        console.error('Error deleting product from cart:', error);
        res.status(500).send('Error deleting product from cart');
    }
});



// Clear Cart Route
router.post('/user/cart/clear', isLoggedIn, async (req, res) => {
  try {
      const userId = req.user._id;
      const { transactionId } = req.body;

      // You can add payment verification logic here if needed

      // Clear the cart
      const user = await User.findById(userId);
      user.cart = [];
      await user.save();

      res.status(200).json({ message: 'Cart cleared successfully' });
  } catch (error) {
      console.error('Error clearing cart:', error);
      res.status(500).send('Error clearing cart');
  }
});


module.exports = router;
