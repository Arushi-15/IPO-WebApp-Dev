import IPOInfo from "../models/Ipo_info.js";
import User from "../models/User.js";
import path from "path";
import fs from "fs"
// Register IPO Information
export const registerIpo = async (req, res) =>{
    try {
    
        // Extracting fields from request
        const { company_name, price_band, open, close, issue_size, issue_type, listing_date, status, ipo_price, listing_price, listing_gain, cmp, current_return, userId } = req.body;

        // **Validation**
        if (!company_name) {
            return res.status(400).json({ message: "Company name is required" });
        }
        if (!req.files) {
            console.error(" No company_logo uploaded!");
            return res.status(400).json({ message: "Company Logos is required!" });
        }
        if ( !req.files["company_logo_path"]) {
            console.error(" No company_logo uploaded!");
            return res.status(400).json({ message: "Company Logo is required!" });
        }
        if (!userId) {
            return res.status(400).json({ message: "User ID is required!" });
        }

        // Validate if user exists (Foreign Key Check)
        const userExists = await User.findByPk(userId);
        if (!userExists) {
            return res.status(404).json({ message: "User not found!" });
        }

        // **File paths**
        const companyLogoPath = req.files["company_logo_path"] ? `/uploads/logos/${req.files["company_logo_path"][0].filename}` : null;
        const rhpPath = req.files["rhp"] ? `/uploads/rhp/${req.files["rhp"][0].filename}` : null;
        const drhpPath = req.files["drhp"] ? `/uploads/drhp/${req.files["drhp"][0].filename}` : null;
    
        // **Save IPO Info in Database**
        const ipo = await IPOInfo.create({
            company_name,
            company_logo_path: companyLogoPath,
            price_band,
            open,
            close,
            issue_size,
            issue_type,
            listing_date,
            status,
            ipo_price,
            listing_price,
            listing_gain,
            cmp,
            current_return,
            rhp: rhpPath,
            drhp: drhpPath,
            userId, // Foreign key linking to User table
        });
    console.log("added");
      return  res.status(201).json({message: "IPO registered successfully!",success:true, ipo:ipo });
    
    } catch (error) {
        console.log(error);
        console.log(error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}




// Update IPO Details
export const updateIPO = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            company_name, price_band, open, close, issue_size,
            issue_type, listing_date, status, ipo_price,
            listing_price, listing_gain, cmp, current_return
,userId         } = req.body;

        // Find IPO by ID
        const ipo = await IPOInfo.findByPk(id);
        if (!ipo) {
            return res.status(404).json({ error: "IPO not found!" });
        }
        if (!userId) {
            return res.status(400).json({ error: "User ID is required!" });
        }

        // Validate if user exists (Foreign Key Check)
        const userExists = await User.findByPk(userId);
        if (!userExists) {
            return res.status(404).json({ error: "User not found!" });
        }

        // Prepare update object
        const updateData = {
            company_name: company_name || ipo.company_name,
            price_band: price_band || ipo.price_band,
            open: open || ipo.open,
            close: close || ipo.close,
            issue_size: issue_size || ipo.issue_size,
            issue_type: issue_type || ipo.issue_type,
            listing_date: listing_date || ipo.listing_date,
            status: status || ipo.status,
            ipo_price: ipo_price || ipo.ipo_price,
            listing_price: listing_price || ipo.listing_price,
            listing_gain: listing_gain || ipo.listing_gain,
            cmp: cmp || ipo.cmp,
            current_return: current_return || ipo.current_return,
            userId :userId ||ipo.userId, 
        };

        // Update file paths if new files are uploaded
        const deleteOldFile = (filePath) => {
            if (filePath) {
                const fullPath = path.join(process.cwd(), filePath);
                if (fs.existsSync(fullPath)) {
                    fs.unlinkSync(fullPath);
                    console.log(`Deleted old file: ${fullPath}`);
                }
            }
        };

        // Update file paths if new files are uploaded
        if (req.files["company_logo_path"]) {
            deleteOldFile(ipo.company_logo_path);
            updateData.company_logo_path = `/uploads/logos/${req.files["company_logo_path"][0].filename}`;
        }
        if (req.files["rhp"]) {
            deleteOldFile(ipo.rhp);
            updateData.rhp = `/uploads/rhp/${req.files["rhp"][0].filename}`;
        }
        if (req.files["drhp"]) {
            deleteOldFile(ipo.drhp);
            updateData.drhp = `/uploads/drhp/${req.files["drhp"][0].filename}`;
        }

        // Update the IPO record
        await IPOInfo.update(updateData, { where: { id } });



        res.json({ message: "IPO updated successfully!" , ipo:updateData});
    } catch (error) {
        console.error("Error updating IPO:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
// get ipo by id
export const getIPOById = async (req, res) => {
    try {
        const { id } = req.params;
        const myipo = await IPOInfo.findByPk(id);
        if (!myipo) {
            return res.status(404).json({ error: "IPO not found" });
        }
        const ipo={
        ...myipo.toJSON(),
        company_logo_url: myipo.company_logo_path 
            ? `${process.env.BASE_URL}${myipo.company_logo_path.replace(/\\/g, "/")}`
            : null,
        rhp_url: myipo.rhp 
            ? `${process.env.BASE_URL}${myipo.rhp.replace(/\\/g, "/")}`
            : null,
        drhp_url: myipo.drhp 
            ? `${process.env.BASE_URL}${myipo.drhp.replace(/\\/g, "/")}`
            : null
    };

       return res.status(200).json({ ipo });
    } catch (error) {
        console.log(error)
       return res.status(500).json({ error: "Internal Server Error" });
    }
};


export const getUserIPOs = async (req, res) => {
    try {
        const userId = req.user.id; // Extract userId from authenticated request

        // Pagination parameters from the request query
        const page = parseInt(req.query.page) || 1;  // Default to page 1
        const limit = parseInt(req.query.limit) || 10; // Default to 10 IPOs per page
        const offset = (page - 1) * limit; // Calculate offset

        // Fetch IPOs with pagination
        const { count, rows: userIPOs } = await IPOInfo.findAndCountAll({
            where: { userId: userId }, // Fetch only the IPOs belonging to this user
            limit,
            offset,
            order: [["createdAt", "DESC"]], // Sort by latest IPO
        });

        // Format the response data
        const updatedIpoList = userIPOs.map(ipo => ({
            ...ipo.toJSON(),
            company_logo_url: ipo.company_logo_path 
                ? `${process.env.BASE_URL}${ipo.company_logo_path.replace(/\\/g, "/")}`
                : null,
            rhp_url: ipo.rhp 
                ? `${process.env.BASE_URL}${ipo.rhp.replace(/\\/g, "/")}`
                : null,
            drhp_url: ipo.drhp 
                ? `${process.env.BASE_URL}${ipo.drhp.replace(/\\/g, "/")}`
                : null
        }));

        // Send paginated response
        res.status(200).json({
            ipo: updatedIpoList,
            success: true,
            totalIPOs: count,  // Total number of IPOs for this user
            totalPages: Math.ceil(count / limit), // Total pages
            currentPage: page
        });

    } catch (error) {
        console.error("Error fetching user IPOs:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export  const getAllIPOs = async (req, res) => {
        try {
            const ipoList = await IPOInfo.findAll(); 
    
        
            const updatedIpoList = ipoList.map(ipo => ({
                ...ipo.toJSON(),
                company_logo_url: ipo.company_logo_path 
                    ? `${process.env.BASE_URL}${ipo.company_logo_path.replace(/\\/g, "/")}`
                    : null,
                rhp_url: ipo.rhp 
                    ? `${process.env.BASE_URL}${ipo.rhp.replace(/\\/g, "/")}`
                    : null,
                drhp_url: ipo.drhp 
                    ? `${process.env.BASE_URL}${ipo.drhp.replace(/\\/g, "/")}`
                    : null
            }));
    
            res.status(200).json(updatedIpoList);
        } catch (error) {
            console.error("Error fetching IPOs:", error);
            res.status(500).json({ message: "Failed to fetch IPOs", error });
        }
    };
    
export const deleteIpo =async (req,res) => {
    try {
        const { id } = req.params;

      
        const deletedIpo = await IPOInfo.destroy({
            where: { id: id }
        });
        if (!deletedIpo) {
            return res.status(404).json({ error: "IPO not found!" });
        }

        res.json({ message: "IPO deleted successfully!", deletedIpo ,success:true});
    } catch (error) {
        console.error("Error deleting IPO:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

