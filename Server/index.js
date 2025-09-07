const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors"); // إضافة حزمة CORS
require("dotenv").config();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
// Middleware
app.use(express.json());
app.use(cors()); // تمكين CORS لجمطل الطلبات

const serverApiKey = process.env.API_KEY;
const PORT = process.env.PORT || 6000;
const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb://admin:kilofoxtrot1850@92.113.149.127:27017/portfolio_db";

// Schemas
const visitorSchema = new mongoose.Schema({
  ip: { type: String },
  userAgent: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const contactRequestSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String },
  email: { type: String, required: true },
  projectType: { type: String, required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Index
visitorSchema.index({ ip: 1, createdAt: 1 });

// Models
const Visitor = mongoose.model("Visitor", visitorSchema);
const ContactRequest = mongoose.model("ContactRequest", contactRequestSchema);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const tmpDir = "tmp_uploads";
    if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir);
    cb(null, tmpDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// دالة لتحديد الرقم التالي بالتسلسل
function getNextIndex(categoryDir) {
  if (!fs.existsSync(categoryDir)) return 1;
  const files = fs.readdirSync(categoryDir);
  const numbers = files
    .map((f) => {
      const match = f.match(/^(\d+)_/);
      return match ? parseInt(match[1], 10) : null;
    })
    .filter((n) => n !== null);
  return numbers.length ? Math.max(...numbers) + 1 : 1;
}

// Routes
app.post("/api/visitors", async (req, res) => {
  try {
    const forwarded = req.headers["x-forwarded-for"];
    const ip = forwarded
      ? forwarded.split(",")[0].trim()
      : req.ip || req.connection.remoteAddress;
    const userAgent = req.get("User-Agent") || req.body.userAgent || "";

    const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const existing = await Visitor.findOne({ ip, createdAt: { $gte: cutoff } });
    if (existing) {
      return res.status(200).json({
        success: true,
        counted: false,
        message: "Visitor already recorded in last 24 hours",
      });
    }

    const visitor = new Visitor({ ip, userAgent });
    await visitor.save();

    res.status(201).json({
      success: true,
      counted: true,
      id: visitor._id,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get("/api/visitors/count", async (req, res) => {
  try {
    const count = await Visitor.countDocuments();
    res.json({ count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/visitors/data", async (req, res) => {
  try {
    if (!serverApiKey) {
      console.error("API_KEY environment variable is not set");
      return res
        .status(500)
        .json({ success: false, error: "Server API key is not configured." });
    }

    const providedKey = (req.get("x-api-key") || "").trim();
    if (providedKey !== serverApiKey) {
      console.warn("API key validation failed for /api/visitors/data");
      return res.status(403).json({ success: false, error: "Forbidden" });
    }

    const visitors = await Visitor.find();
    return res.json({ success: true, visitors });
  } catch (err) {
    console.error("Error in /api/visitors/data:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post("/api/contact", async (req, res) => {
  const { firstName, lastName, projectType, email, message } = req.body;
  if (!firstName || !email || !message || !projectType) {
    return res.status(400).json({
      success: false,
      error: "Name, email, Project Type, and message are required.",
    });
  }

  try {
    const saveRequest = new ContactRequest({
      firstName,
      lastName: lastName || null,
      projectType,
      email,
      message,
    });
    await saveRequest.save();

    res.json({ success: true, message: "Your message has been received." });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET contact Messages - تم التعديل ليكون أكثر أماناً
app.get("/api/contact", async (req, res) => {
  try {
    // Ensure server API key is configured

    if (!serverApiKey) {
      console.error("API_KEY environment variable is not set");
      return res
        .status(500)
        .json({ success: false, error: "Server API key is not configured." });
    }

    // Normalize incoming header and validate
    const providedKey = (req.get("x-api-key") || "").trim();
    if (providedKey !== serverApiKey) {
      console.warn("API key validation failed");
      return res.status(403).json({ success: false, error: "Forbidden" });
    }

    const messages = await ContactRequest.find().sort({ createdAt: -1 });
    return res.json({ success: true, messages });
  } catch (err) {
    console.error("Error in /api/contact:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});
app.delete("/api/contact/:id", async (req, res) => {
  try {
    // Ensure server API key is configured
    if (!serverApiKey) {
      console.error("API_KEY environment variable is not set");
      return res
        .status(500)
        .json({ success: false, error: "Server API key is not configured." });
    }

    // Validate provided API key
    const providedKey = (req.get("x-api-key") || "").trim();
    if (providedKey !== serverApiKey) {
      console.warn("API key validation failed for DELETE /api/contact/:id");
      return res.status(403).json({ success: false, error: "Forbidden" });
    }

    const { id } = req.params;
    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, error: "Invalid id" });
    }

    const deleted = await ContactRequest.findByIdAndDelete(id);
    if (!deleted) {
      return res
        .status(404)
        .json({ success: false, error: "Message not found" });
    }

    res.json({ success: true, message: "Message deleted successfully." });
  } catch (err) {
    console.error("Error in /api/contact/:id:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});
// إضافة مسار للصحة العامة للتطبيق
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Secured upload Before + After + Thumbnail
app.post(
  "/api/upload/:category",
  upload.fields([
    { name: "after", maxCount: 1 },
    { name: "before", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  async (req, res) => {
    const cleanupFiles = async (filesObj = {}) => {
      const allFiles = Object.values(filesObj).flat();
      await Promise.all(
        allFiles.map(async (f) => {
          try {
            if (f && f.path && fs.existsSync(f.path))
              await fs.promises.unlink(f.path);
          } catch (e) {
            /* ignore cleanup errors */
          }
        })
      );
    };

    try {
      // Require server API key
      if (!serverApiKey) {
        await cleanupFiles(req.files);
        return res
          .status(500)
          .json({ success: false, error: "Server API key not configured." });
      }
      const providedKey = (req.get("x-api-key") || "").trim();
      if (providedKey !== serverApiKey) {
        await cleanupFiles(req.files);
        return res.status(403).json({ success: false, error: "Forbidden" });
      }

      const category = (req.params.category || "").trim();

      // Only allow these categories
      const allowedCategories = [
        "video-editing",
        "motion-graphics",
        "thumbnail",
        "shorts",
      ];
      if (!allowedCategories.includes(category)) {
        await cleanupFiles(req.files);
        return res
          .status(400)
          .json({ success: false, error: "Invalid category name." });
      }

      const files = req.files || {};
      const afterFile = files.after && files.after[0];
      const beforeFile = files.before && files.before[0];
      const thumbnailFile = files.thumbnail && files.thumbnail[0];

      if (!afterFile || !beforeFile) {
        await cleanupFiles(req.files);
        return res.status(400).json({
          success: false,
          error: "Both 'after' and 'before' files are required.",
        });
      }
      // Security: ensure uploaded files are from the expected tmp directory
      const tmpRoot = path.resolve(__dirname, "tmp_uploads");
      for (const f of [afterFile, beforeFile, thumbnailFile].filter(Boolean)) {
        const resolved = path.resolve(f.path);
        if (!resolved.startsWith(tmpRoot + path.sep)) {
          await cleanupFiles(req.files);
          return res
            .status(400)
            .json({ success: false, error: "Invalid upload path." });
        }
      }

      // Allowed extensions and MIME types
      const imageExts = [".jpg", ".jpeg", ".png", ".webp", ".gif"];
      const videoExts = [".mp4", ".mov", ".mkv", ".webm", ".avi"];
      const imageMimes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
      const videoMimes = [
        "video/mp4",
        "video/quicktime",
        "video/x-matroska",
        "video/webm",
        "video/x-msvideo",
      ];

      const MAX_SIZE_VIDEO = 500 * 1024 * 1024; // 500 MB
      const MAX_SIZE_IMAGE = 20 * 1024 * 1024; // 20 MB
      const MAX_SIZE_THUMBNAIL = 15 * 1024 * 1024; // 15 MB

      const isImage = (ext, mime) =>
        imageExts.includes(ext) && imageMimes.includes(mime);
      const isVideo = (ext, mime) =>
        videoExts.includes(ext) && videoMimes.includes(mime);

      const categoryIsThumb = category === "thumbnail";

      const validateFile = (
        f,
        requiredName,
        { allowVideo = true, maxSize }
      ) => {
        if (!f) return { ok: false, error: `${requiredName} is missing` };
        const ext = path.extname(f.originalname).toLowerCase();
        const mime = f.mimetype;

        const okImage = isImage(ext, mime);
        const okVideo = isVideo(ext, mime);

        if (categoryIsThumb) {
          if (!okImage) {
            return {
              ok: false,
              error: `${requiredName} must be an image (${imageExts.join(
                ", "
              )}) for category 'thumbnail'.`,
            };
          }
        } else {
          if (!okImage && (!allowVideo || !okVideo)) {
            return {
              ok: false,
              error: `${requiredName} must be an image or video (${[
                ...imageExts,
                ...videoExts,
              ].join(", ")})`,
            };
          }
        }

        if (typeof f.size === "number" && maxSize && f.size > maxSize) {
          return {
            ok: false,
            error: `${requiredName} exceeds max size of ${maxSize} bytes`,
          };
        }

        return { ok: true, ext };
      };

      const afterCheck = categoryIsThumb
        ? validateFile(afterFile, "after", {
            allowVideo: false,
            maxSize: MAX_SIZE_THUMBNAIL,
          })
        : (() => {
            const ext = path.extname(afterFile.originalname).toLowerCase();
            const mime = afterFile.mimetype;
            if (isImage(ext, mime)) {
              return validateFile(afterFile, "after", {
                allowVideo: false,
                maxSize: MAX_SIZE_IMAGE,
              });
            } else {
              return validateFile(afterFile, "after", {
                allowVideo: true,
                maxSize: MAX_SIZE_VIDEO,
              });
            }
          })();

      const beforeCheck = categoryIsThumb
        ? validateFile(beforeFile, "before", {
            allowVideo: false,
            maxSize: MAX_SIZE_THUMBNAIL,
          })
        : (() => {
            const ext = path.extname(beforeFile.originalname).toLowerCase();
            const mime = beforeFile.mimetype;
            if (isImage(ext, mime)) {
              return validateFile(beforeFile, "before", {
                allowVideo: false,
                maxSize: MAX_SIZE_IMAGE,
              });
            } else {
              return validateFile(beforeFile, "before", {
                allowVideo: true,
                maxSize: MAX_SIZE_VIDEO,
              });
            }
          })();

      const thumbCheck = thumbnailFile
        ? validateFile(thumbnailFile, "thumbnail", {
            allowVideo: false,
            maxSize: MAX_SIZE_THUMBNAIL,
          })
        : { ok: true };

      if (!afterCheck.ok || !beforeCheck.ok || !thumbCheck.ok) {
        await cleanupFiles(req.files);
        return res.status(400).json({
          success: false,
          error:
            (afterCheck.ok ? "" : afterCheck.error) ||
            (beforeCheck.ok ? "" : beforeCheck.error) ||
            (thumbCheck.ok ? "" : thumbCheck.error),
        });
      }

      // Create unique folder inside the category
      const categoryDir = path.join(__dirname, "uploads", category);
      if (!fs.existsSync(categoryDir))
        fs.mkdirSync(categoryDir, { recursive: true });

      const uniqueFolder = `${Date.now()}_${Math.random()
        .toString(36)
        .substring(2, 10)}`;
      const targetDir = path.join(categoryDir, uniqueFolder);
      fs.mkdirSync(targetDir, { recursive: true });

      // new filenames (keep same ext, keep role in name)
      const afterNewName = `After${afterCheck.ext}`;
      const beforeNewName = `Before${beforeCheck.ext}`;
      const thumbnailNewName = thumbnailFile
        ? `Thumbnail${thumbCheck.ext}`
        : null;

      const afterNewPath = path.join(targetDir, afterNewName);
      const beforeNewPath = path.join(targetDir, beforeNewName);
      const thumbnailNewPath = thumbnailNewName
        ? path.join(targetDir, thumbnailNewName)
        : null;

      try {
        const moveOps = [
          fs.promises.rename(afterFile.path, afterNewPath),
          fs.promises.rename(beforeFile.path, beforeNewPath),
        ];
        if (thumbnailFile)
          moveOps.push(
            fs.promises.rename(thumbnailFile.path, thumbnailNewPath)
          );
        await Promise.all(moveOps);
      } catch (moveErr) {
        await cleanupFiles(req.files);
        try {
          if (fs.existsSync(afterNewPath))
            await fs.promises.unlink(afterNewPath);
          if (fs.existsSync(beforeNewPath))
            await fs.promises.unlink(beforeNewPath);
          if (thumbnailNewPath && fs.existsSync(thumbnailNewPath))
            await fs.promises.unlink(thumbnailNewPath);
        } catch (_) {}
        return res
          .status(500)
          .json({ success: false, error: "Failed to store uploaded files." });
      }

      return res.json({
        success: true,
        message: "Files uploaded successfully",
        folder: uniqueFolder,
        files: {
          after: {
            filename: afterNewName,
            link: `/api/uploads/${category}/${uniqueFolder}/${afterNewName}`,
          },
          before: {
            filename: beforeNewName,
            link: `/api/uploads/${category}/${uniqueFolder}/${beforeNewName}`,
          },
          thumbnail: thumbnailNewName
            ? {
                filename: thumbnailNewName,
                link: `/api/uploads/${category}/${uniqueFolder}/${thumbnailNewName}`,
              }
            : null,
        },
      });
    } catch (err) {
      await cleanupFiles(req.files);
      return res.status(500).json({ success: false, error: err.message });
    }
  }
);

// Edit existing upload (replace files or move category)
app.post(
  "/api/uploads/:category/:folder",
  upload.fields([
    { name: "after", maxCount: 1 },
    { name: "before", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  async (req, res) => {
    const cleanupTemp = async (filesObj = {}) => {
      const allFiles = Object.values(filesObj).flat();
      await Promise.all(
        allFiles.map(async (f) => {
          try {
            if (f && f.path && fs.existsSync(f.path)) {
              await fs.promises.unlink(f.path);
            }
          } catch (_) {}
        })
      );
    };

    try {
      // API key check
      if (!serverApiKey) {
        await cleanupTemp(req.files);
        return res
          .status(500)
          .json({ success: false, error: "Server API key not configured." });
      }
      const providedKey = (req.get("x-api-key") || "").trim();
      if (providedKey !== serverApiKey) {
        await cleanupTemp(req.files);
        return res.status(403).json({ success: false, error: "Forbidden" });
      }

      const allowedCategories = [
        "video-editing",
        "motion-graphics",
        "thumbnail",
        "shorts",
      ];

      const srcCategory = (req.params.category || "").trim();
      const folderName = (req.params.folder || "").trim();

      if (!allowedCategories.includes(srcCategory)) {
        await cleanupTemp(req.files);
        return res
          .status(400)
          .json({ success: false, error: "Invalid source category." });
      }

      const srcFolder = path.join(
        __dirname,
        "uploads",
        srcCategory,
        folderName
      );
      if (!fs.existsSync(srcFolder)) {
        await cleanupTemp(req.files);
        return res
          .status(404)
          .json({ success: false, error: "Source folder not found." });
      }

      const destCategory = (req.body.newCategory || srcCategory).trim();
      if (!allowedCategories.includes(destCategory)) {
        await cleanupTemp(req.files);
        return res
          .status(400)
          .json({ success: false, error: "Invalid destination category." });
      }

      const destFolder =
        srcCategory === destCategory
          ? srcFolder
          : path.join(__dirname, "uploads", destCategory, folderName);

      if (srcCategory !== destCategory) {
        if (!fs.existsSync(path.dirname(destFolder)))
          fs.mkdirSync(path.dirname(destFolder), { recursive: true });

        // move whole folder
        await fs.promises.rename(srcFolder, destFolder);
      }

      // handle replacing files
      const files = req.files || {};
      const afterFile = files.after && files.after[0];
      const beforeFile = files.before && files.before[0];
      const thumbnailFile = files.thumbnail && files.thumbnail[0];

      const tmpRoot = path.resolve(__dirname, "tmp_uploads");
      for (const f of [afterFile, beforeFile, thumbnailFile].filter(Boolean)) {
        const resolved = path.resolve(f.path);
        if (!resolved.startsWith(tmpRoot + path.sep)) {
          await cleanupTemp(req.files);
          return res
            .status(400)
            .json({ success: false, error: "Invalid upload path." });
        }
      }

      // ✅ VALIDATION
      const imageExts = [".jpg", ".jpeg", ".png", ".webp", ".gif"];
      const videoExts = [".mp4", ".mov", ".mkv", ".webm", ".avi"];
      const imageMimes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
      const videoMimes = [
        "video/mp4",
        "video/quicktime",
        "video/x-matroska",
        "video/webm",
        "video/x-msvideo",
      ];

      const isImage = (f) => {
        if (!f) return false;
        const ext = path.extname(f.originalname).toLowerCase();
        return imageExts.includes(ext) && imageMimes.includes(f.mimetype);
      };
      const isVideo = (f) => {
        if (!f) return false;
        const ext = path.extname(f.originalname).toLowerCase();
        return videoExts.includes(ext) && videoMimes.includes(f.mimetype);
      };

      const categoryIsThumb = destCategory === "thumbnail";

      for (const [name, f] of Object.entries({
        after: afterFile,
        before: beforeFile,
        thumbnail: thumbnailFile,
      })) {
        if (!f) continue;

        if (categoryIsThumb) {
          if (!isImage(f)) {
            await cleanupTemp(req.files);
            return res.status(400).json({
              success: false,
              error: `${name} must be an image for category 'thumbnail'`,
            });
          }
        } else {
          if (name === "thumbnail") {
            if (!isImage(f)) {
              await cleanupTemp(req.files);
              return res.status(400).json({
                success: false,
                error: "thumbnail must be an image",
              });
            }
          } else {
            if (!isImage(f) && !isVideo(f)) {
              await cleanupTemp(req.files);
              return res.status(400).json({
                success: false,
                error: `${name} must be an image or video`,
              });
            }
          }
        }
      }

      // ✅ store new files
      const newFiles = {};
      if (afterFile) {
        const ext = path.extname(afterFile.originalname).toLowerCase();
        const newName = `After${ext}`;
        await fs.promises.rename(
          afterFile.path,
          path.join(destFolder, newName)
        );
        newFiles.after = {
          filename: newName,
          url: `/api/uploads/${destCategory}/${folderName}/${newName}`,
        };
      }

      if (beforeFile) {
        const ext = path.extname(beforeFile.originalname).toLowerCase();
        const newName = `Before${ext}`;
        await fs.promises.rename(
          beforeFile.path,
          path.join(destFolder, newName)
        );
        newFiles.before = {
          filename: newName,
          url: `/api/uploads/${destCategory}/${folderName}/${newName}`,
        };
      }

      if (thumbnailFile) {
        const ext = path.extname(thumbnailFile.originalname).toLowerCase();
        const newName = `Thumbnail${ext}`;
        await fs.promises.rename(
          thumbnailFile.path,
          path.join(destFolder, newName)
        );
        newFiles.thumbnail = {
          filename: newName,
          url: `/api/uploads/${destCategory}/${folderName}/${newName}`,
        };
      }

      return res.json({
        success: true,
        message: "Update successful",
        category: destCategory,
        folder: folderName,
        files: newFiles,
      });
    } catch (err) {
      await cleanupTemp(req.files);
      return res.status(500).json({ success: false, error: err.message });
    }
  }
);

// Get ملف محدد
app.get("/api/uploads/:category/:folder/:filename", (req, res) => {
  try {
    const { category, folder, filename } = req.params;
    const filepath = path.join(
      __dirname,
      "uploads",
      category,
      folder,
      filename
    );
    if (fs.existsSync(filepath)) {
      res.sendFile(filepath);
    } else {
      res.status(404).json({ error: "File not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get كل الفولدرات ضمن كاتيجوري
app.get("/api/uploads/:category", (req, res) => {
  try {
    const category = req.params.category;
    const categoryDir = path.join(__dirname, "uploads", category);

    if (!fs.existsSync(categoryDir)) {
      return res.status(404).json({ error: "Category not found" });
    }

    const folders = fs
      .readdirSync(categoryDir, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => {
        const folderPath = path.join(categoryDir, d.name);
        const files = fs.readdirSync(folderPath);
        return {
          folder: d.name,
          files: files.map((f) => ({
            filename: f,
            url: `/api/uploads/${category}/${d.name}/${f}`,
          })),
        };
      });

    res.json({ success: true, category, folders });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Delete portfolio item (folder and all files inside)
app.delete("/api/uploads/:category/:folder", async (req, res) => {
  try {
    // API key check
    if (!serverApiKey) {
      return res
        .status(500)
        .json({ success: false, error: "Server API key not configured." });
    }

    const providedKey = (req.get("x-api-key") || "").trim();
    if (providedKey !== serverApiKey) {
      console.warn("API key validation failed for DELETE /api/uploads");
      return res.status(403).json({ success: false, error: "Forbidden" });
    }

    const allowedCategories = [
      "video-editing",
      "motion-graphics",
      "thumbnail",
      "shorts",
    ];

    const category = (req.params.category || "").trim();
    const folderName = (req.params.folder || "").trim();

    // Validate category
    if (!allowedCategories.includes(category)) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid category name." });
    }

    // Validate folder name (basic security check)
    if (
      !folderName ||
      folderName.includes("..") ||
      folderName.includes("/") ||
      folderName.includes("\\")
    ) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid folder name." });
    }

    const targetFolder = path.join(__dirname, "uploads", category, folderName);

    // Check if folder exists
    if (!fs.existsSync(targetFolder)) {
      return res
        .status(404)
        .json({ success: false, error: "Portfolio item not found." });
    }

    // Verify it's actually a directory
    const folderStats = await fs.promises.stat(targetFolder);
    if (!folderStats.isDirectory()) {
      return res
        .status(400)
        .json({ success: false, error: "Target is not a folder." });
    }

    // Get list of files before deletion (for logging/response)
    const filesInFolder = fs.readdirSync(targetFolder);

    // Recursively delete the folder and all its contents
    await fs.promises.rmdir(targetFolder, { recursive: true });

    // Log successful deletion
    console.log(
      `Successfully deleted portfolio item: ${category}/${folderName} (${filesInFolder.length} files)`
    );

    return res.json({
      success: true,
      message: "Portfolio item deleted successfully",
      deletedFolder: folderName,
      deletedCategory: category,
      filesDeleted: filesInFolder.length,
    });
  } catch (err) {
    console.error("Error deleting portfolio item:", err);

    // Handle specific errors
    if (err.code === "ENOENT") {
      return res
        .status(404)
        .json({ success: false, error: "Portfolio item not found." });
    }

    if (err.code === "EACCES" || err.code === "EPERM") {
      return res.status(500).json({
        success: false,
        error: "Permission denied. Cannot delete files.",
      });
    }

    return res.status(500).json({
      success: false,
      error: "Failed to delete portfolio item: " + err.message,
    });
  }
});

// Alternative: Delete with additional safety checks and file-by-file deletion
app.delete("/api/uploads/:category/:folder/safe", async (req, res) => {
  const deleteFileSafely = async (filePath) => {
    try {
      if (fs.existsSync(filePath)) {
        await fs.promises.unlink(filePath);
        return true;
      }
      return false;
    } catch (err) {
      console.warn(`Failed to delete file ${filePath}:`, err.message);
      return false;
    }
  };

  try {
    // API key check
    if (!serverApiKey) {
      return res
        .status(500)
        .json({ success: false, error: "Server API key not configured." });
    }

    const providedKey = (req.get("x-api-key") || "").trim();
    if (providedKey !== serverApiKey) {
      return res.status(403).json({ success: false, error: "Forbidden" });
    }

    const allowedCategories = [
      "video-editing",
      "motion-graphics",
      "thumbnail",
      "shorts",
    ];

    const category = (req.params.category || "").trim();
    const folderName = (req.params.folder || "").trim();

    if (!allowedCategories.includes(category)) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid category name." });
    }

    if (
      !folderName ||
      folderName.includes("..") ||
      folderName.includes("/") ||
      folderName.includes("\\")
    ) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid folder name." });
    }

    const targetFolder = path.join(__dirname, "uploads", category, folderName);

    if (!fs.existsSync(targetFolder)) {
      return res
        .status(404)
        .json({ success: false, error: "Portfolio item not found." });
    }

    // Get all files in the folder
    const files = fs.readdirSync(targetFolder);

    let deletedCount = 0;
    const failedFiles = [];

    // Delete each file individually
    for (const file of files) {
      const filePath = path.join(targetFolder, file);
      const deleted = await deleteFileSafely(filePath);
      if (deleted) {
        deletedCount++;
      } else {
        failedFiles.push(file);
      }
    }

    // Try to delete the empty folder
    try {
      await fs.promises.rmdir(targetFolder);
    } catch (err) {
      return res.status(500).json({
        success: false,
        error: "Files deleted but failed to remove folder",
        deletedFiles: deletedCount,
        failedFiles: failedFiles,
      });
    }

    return res.json({
      success: true,
      message: "Portfolio item deleted successfully",
      deletedFolder: folderName,
      deletedCategory: category,
      filesDeleted: deletedCount,
      failedFiles: failedFiles.length > 0 ? failedFiles : undefined,
    });
  } catch (err) {
    console.error("Error in safe delete:", err);
    return res.status(500).json({
      success: false,
      error: "Failed to delete portfolio item: " + err.message,
    });
  }
});

// Get كل الكاتيجوري مع الفولدرات تبعها
app.get("/api/uploads", (req, res) => {
  try {
    const uploadsRoot = path.join(__dirname, "uploads");
    if (!fs.existsSync(uploadsRoot)) {
      return res.json({ success: true, uploads: {} });
    }

    const categories = fs
      .readdirSync(uploadsRoot, { withFileTypes: true })
      .filter((entry) => entry.isDirectory());

    const uploads = {};

    for (const cat of categories) {
      const categoryDir = path.join(uploadsRoot, cat.name);
      const folders = fs
        .readdirSync(categoryDir, { withFileTypes: true })
        .filter((d) => d.isDirectory())
        .map((d) => {
          const folderPath = path.join(categoryDir, d.name);
          const files = fs.readdirSync(folderPath);
          return {
            folder: d.name,
            files: files.map((f) => ({
              filename: f,
              url: `/api/uploads/${cat.name}/${d.name}/${f}`,
            })),
          };
        });
      uploads[cat.name] = folders;
    }

    res.json({ success: true, uploads });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get count حسب الكاتيجوري
app.get("/api/uploads-count", (req, res) => {
  try {
    const uploadsRoot = path.join(__dirname, "uploads");
    if (!fs.existsSync(uploadsRoot)) {
      return res.json({ success: true, totalCount: 0, countsByCategory: {} });
    }

    const categories = fs
      .readdirSync(uploadsRoot, { withFileTypes: true })
      .filter((entry) => entry.isDirectory());

    let totalCount = 0;
    const countsByCategory = {};

    for (const cat of categories) {
      const categoryDir = path.join(uploadsRoot, cat.name);
      const folders = fs
        .readdirSync(categoryDir, { withFileTypes: true })
        .filter((d) => d.isDirectory());

      countsByCategory[cat.name] = folders.length;
      totalCount += folders.length;
    }

    res.json({ success: true, totalCount, countsByCategory });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DB connect + server start
mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000, // زيادة وقت انتظار الاتصال
  })
  .then(() => {
    console.log("Connected to MongoDB successfully");

    app.listen(PORT, "0.0.0.0", () => {
      // الاستماع على جميع الواجهات
      console.log(`Server listening on port ${PORT}`);
      console.log(`Health check available at: http://localhost:${PORT}/health`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// معالجة الأخطاء غير المعالجة
process.on("unhandledRejection", (err) => {
  console.error("Unhandled promise rejection:", err);
  process.exit(1);
});
