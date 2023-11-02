const express = require("express");
const router = express.Router();

const Cart = require("../schemas/cart.js");
const Goods = require("../schemas/goods.js");

// 장바구니 조회 API
router.get("/carts", async (req, res) => {
  const carts = await Cart.find({}).sort({"goodsId":-1});
  const cartsId = carts[0].goodsId+1
  const goodsIds = carts.map((cart) => cart.goodsId);
  console.log(cartsId)

  const goods = await Goods.find({ goodsId: goodsIds });

  const results = carts.map((cart) => {
    return {
      quantity: cart.quantity,
      goods: goods.find((item) => item.goodsId === cart.goodsId)
    };
  });

  res.json({
    carts: results,
  });
});


module.exports = router;