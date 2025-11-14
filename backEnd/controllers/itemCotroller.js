import Item from "../models/item.js";
import Shop from "../models/shop.js";
import uploadOnCloudinary from "../utils/cloudinary.js";


export const addItem = async (req, res) => {
    try {
        const { name, category, price, foodType } = req.body;
        let image;
        if (req.file) {
            image = await uploadOnCloudinary(req.file.path)
        }
        const shop = await Shop.findOne({ owner: req.userId })
        if (!shop)
            return res.status(400).json({ message: "Shop doesn't Found" })

        const item = await Item.create({
            name, category, price, foodType, image, shop: shop._id
        })

        shop.items.push(item._id)
        await shop.save();
        await shop.populate("owner")
        await shop.populate({
            path: "items",
            options: { sort: { updatedAt: -1 } }
        })

        return res.status(201).json({ message: "Item added Successfully.", shop })

    } catch (error) {
        return res.status(500).json({ message: `Error for adding item: ${error}` })

    }
}

export const editItem = async (req, res) => {
    try {
        const itemId = req.params.itemId
        const { name, category, price, foodType } = req.body;
        // console.log(req.body)
        let updateData = { name, category, price, foodType };
        
        if (req.file) {
            const image = await uploadOnCloudinary(req.file.path)
            updateData.image = image; // only add image if new one is uploaded
        }

        const item = await Item.findByIdAndUpdate(itemId, updateData, { new: true });

        const shop = await Shop.findOne({ owner: req.userId }).populate({
            path: "items",
            options: { sort: { updatedAt: -1 } }
        })

        if (!shop)
            return res.status(400).json({ message: "Shop doesn't Found" })



        if (!item)
            return res.status(400).json({ message: "Item doesn't Found" })

        return res.status(200).json({ message: "Item Updated Successfully.", shop })



    } catch (error) {
        return res.status(500).json({ message: `Error for updating item: ${error}` })

    }
}

export const getItemById = async (req, res) => {
    try {

        const { itemId } = req.params;
        const item = await Item.findById(itemId);
        if (!item)
            return res.status(400).json({ message: "Item doesn't Found" })
        // console.log(item)
        return res.status(200).json(item)



    } catch (error) {
        return res.status(500).json({ message: `Error for get item: ${error}` })

    }
}

export const deleteItem = async (req, res) => {
    try {
        const { itemId } = req.params;
        const item = await Item.findByIdAndDelete(itemId);

        if (!item)
            return res.status(400).json({ message: "Item doesn't Found" })

        const shop = await Shop.findOne({ owner: req.userId });
        shop.items = shop.items.filter(id => id.toString() !== itemId)
        await shop.save()
        await shop.populate({
            path: "items",
            options: { sort: { updatedAt: -1 } }
        })
        // console.log(shop)
        return res.status(200).json({ message: "Item Deleted Successfully.", shop })


    } catch (error) {
        return res.status(500).json({ message: `Error for delete item: ${error}` })

    }
}

export const getItemsByCity = async (req, res) => {
    try {
        const { city } = req.params
        if (!city)
            return res.status(400).json({ message: "city is Required" })

        const shops = await Shop.find({
            city: { $regex: new RegExp(`^${city}$`, "i") }
        }).populate("items")
        if (!shops)
            return res.status(400).json({ meesage: "Shops Not found in Your City" })

        const shopIds = shops.map((shop) => shop._id);

        const items = await Item.find({ shop: { $in: shopIds } })
        // console.log(items)
        return res.status(200).json(items);

    } catch (error) {
        return res.status(500).json({ message: `Error for get items by City: ${error}` })

    }
}
export const getItemByShop = async (req, res) => {
    try {
        const { shopId } = req.params;
        const shop = await Shop.findById(shopId)
            .populate("items");
        if (!shop)
            return res.status(400).json({ meesage: "Inavild Shop Id" })
        res.status(200).json({
            shop,
            items: shop.items
        })

    } catch (error) {
        return res.status(500).json({ message: `Error for get items by Shop: ${error}` })

    }
}

export const searchItems = async (req, res) => {
    try {
        const { query, city } = req.query
        if (!query || !city)
            return null
        const shops = await Shop.find({
            city: { $regex: new RegExp(`^${city}$`, "i") }
        }).populate("items")

        if (!shops)
            return res.status(400).json({ meesage: "Shops Not found in Your City" })

        const shopIds = shops.map(s => s._id)

        const items = await Item.find({
            shop: { $in: shopIds },
            $or: [
                { name: { $regex: query, $options: "i" } },
                { category: { $regex: query, $options: "i" } }

            ]
        }).populate("shop", "name image")

        return res.status(200).json(items)
    } catch (error) {
        return res.status(500).json({ message: `Error for Search Items: ${error}` })

    }
}


export const rating = async (req, res) => {
    try {
        const { itemId, rating } = req.body;
        if (!itemId || !rating) {
            return res.status(400).json({ message: "itemId and rating are required" })
        }
        if (rating < 1 || rating > 5)
            return res.status(400).json({ message: "Rating Mustbe between 1 to 5" })

        const item = await Item.findById(itemId);
        if (!item)
            return res.status(400).json({ message: "Item not Found" })
        const newCount = item.rating.count + 1;
        const newAverage = (item.rating.average * item.rating.count + rating) / newCount

        item.rating.average = newAverage;
        item.rating.count = newCount;

        await item.save()

        return res.status(200).json({rating:item.rating})


    } catch (error) {
        return res.status(500).json({ message: `Error for updating rating items: ${error}` })
    }
}







// export const rating = async (req, res) => {
//     try {
//         const { itemId, rating } = req.body
//         if (!itemId || !rating)
//             return res.status(400).json({ message: "Item id and rating is required." })
//         if (rating < 1 || rating > 5)
//             return res.status(400).json({ message: "Rating must be between 1 to 5 ." })
//         const item=  await Item.findById(itemId);
//         if(!item)
//             return res.status(400).json({message:"Item is not found."})

//         const newCount = item.rating.count+1
//         const newAverage = (item.rating.count* item.rating.average + rating )/newCount

//         item.rating.count = newCount;
//         item.rating.average = newAverage

//         await item.save();

//         return res.status(200).json(item.rating)
//     } catch (error) {
//         return res.status(500).json({ message: `Error for Updating Rating in items: ${error}` })

//     }
// }
























