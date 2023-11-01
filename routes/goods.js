const express = require("express"); // express라이브러리를 express 변수에 할당
const router = express.Router(); // 다시 express.Router()라는 함수를 실행시켜 router이라는 변수에 할당

const Goods = require("../schemas/goods");
const Cart = require("../schemas/cart");

router.post("/goods/:goodsId/cart", async (req, res) => {
    const { goodsId } = req.params;
    const { quantity } = req.body;

    const existsCarts = await Cart.find({ goodsId: Number(goodsId) });
    if (existsCarts.length) {
        return res.json({ success: false, errorMessage: "이미 장바구니에 존재하는 상품입니다." });
    }

    await Cart.create({ goodsId: Number(goodsId), quantity: quantity });

    res.json({ result: "success" });
});

router.put("/goods/:goodsId/cart", async (req, res) => {
    const { goodsId } = req.params;
    const { quantity } = req.body;

    const existsCarts = await Cart.find({ goodsId: Number(goodsId) });
    if (existsCarts.length) {
        await Cart.updateOne({ goodsId: Number(goodsId) }, { $set: { quantity } });
    }

    res.json({ success: true });
})
router.delete("/goods/:goodsId/cart", async (req, res) => {
    const { goodsId } = req.params;
    const existsCarts = await Cart.find({ goodsId: Number(goodsId) });
    if (existsCarts.length) {
        await Cart.deleteOne({ goodsId: Number(goodsId)  })
    }
    res.json({ success: true });
})


router.post("/goods", async (req, res) => {
    const { goodsId, name, thumbnailUrl, category, price } = req.body;

    const goods = await Goods.find({ goodsId });
    if (goods.length) {
        return res.status(400).json({ success: false, errorMessage: "이미 있는 데이터입니다." });
    }

    const createdGoods = await Goods.create({ goodsId, name, thumbnailUrl, category, price });

    res.json({ goods: createdGoods });
});

//상품 목록 조회 API
router.get("/goods", (req, res) => {
    res.json({ goods: goods });
});
module.exports = router;