const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Product = require('../models/Product');
const { isLoggedIn } = require('../middleware');

router.post('/toggle', isLoggedIn, async (req, res) => {
  const { productId } = req.body;
  const userId = req.user._id;

  try {
    const user = await User.findById(userId);

    if (user.wishList.includes(productId)) {
      user.wishList.pull(productId);
    } else {
      user.wishList.push(productId);
    }

    await user.save();
    res.json({ success: true });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
});

router.get('/products', isLoggedIn, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('wishList');
    res.json({ success: true, products: user.wishList });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
});

module.exports = router;
