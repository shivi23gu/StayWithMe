import User from "../models/User.js";
import { Webhook } from "svix";

const clerkWebhooks = async (req, res) => {
    try {
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

        const headers = {
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"],
        };

        // Verification step
        await whook.verify(JSON.stringify(req.body), headers);

        const { data, type } = req.body;

        // User Data object with safety checks
        const userData = {
            _id: data.id,
            email: data.email_addresses[0].email_address,
            username: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
            image: data.image_url,
        };

        switch (type) {
            case "user.created": {
                await User.create(userData);
                res.json({ success: true, message: "User Created" });
                break;
            }
            case "user.updated": {
                await User.findByIdAndUpdate(data.id, userData);
                res.json({ success: true, message: "User Updated" });
                break;
            }
            case "user.deleted": {
                await User.findByIdAndDelete(data.id);
                res.json({ success: true, message: "User Deleted" });
                break;
            }
            default:
                res.json({ success: true, message: "Event ignored" });
                break;
        }

    } catch (error) {
        console.log("Webhook Error:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

export default clerkWebhooks;