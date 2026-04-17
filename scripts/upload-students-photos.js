const fs = require("fs");
const path = require("path");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "dhwcij51c",
  api_key: "971662739642471",
  api_secret: "hJRTaGcdHeU28uIcBwPX4mqfXmg",
});

const ROOT_FOLDER = path.join(
  process.cwd(),
  "public",
  "img",
  "fotos_estudiantes_yumbo_2026"
);

const PROGRESS_FILE = path.join(process.cwd(), "upload-progress.json");
const MAX_SIZE = 10 * 1024 * 1024; // 10MB

function loadProgress() {
  if (!fs.existsSync(PROGRESS_FILE)) {
    return {};
  }

  return JSON.parse(fs.readFileSync(PROGRESS_FILE, "utf-8"));
}

function saveProgress(progress) {
  fs.writeFileSync(PROGRESS_FILE, JSON.stringify(progress, null, 2));
}

function normalizeFileName(fileName) {
  return path.parse(fileName).name;
}

async function uploadFolder(folderPath, relativeFolder = "") {
  const progress = loadProgress();
  const items = fs.readdirSync(folderPath);

  for (const item of items) {
    const fullPath = path.join(folderPath, item);
    const stats = fs.statSync(fullPath);

    if (stats.isDirectory()) {
      await uploadFolder(fullPath, path.join(relativeFolder, item));
      continue;
    }

    const extension = path.extname(item).toLowerCase();

    if (![".jpg", ".jpeg", ".png", ".webp"].includes(extension)) {
      continue;
    }

    const publicId = normalizeFileName(item);

    const progressKey = `${relativeFolder}/${publicId}`;

    if (progress[progressKey]) {
      console.log(`⏭️ Ya existe: ${publicId}`);
      continue;
    }

    let fileToUpload = fullPath;

    if (stats.size > MAX_SIZE) {
      const compressedPath = path.join(
        path.dirname(fullPath),
        `${publicId}_compressed.jpg`
      );

      if (fs.existsSync(compressedPath)) {
        fileToUpload = compressedPath;
        console.log(`🗜️ Usando comprimida: ${path.basename(compressedPath)}`);
      } else {
        console.log(`⚠️ No existe comprimida, uso original: ${item}`);
      }
    }

    try {
      console.log(`📤 Subiendo: ${publicId}`);

      await cloudinary.uploader.upload(fileToUpload, {
        folder: `fotos_estudiantes_yumbo_2026/${relativeFolder}`,
        public_id: publicId,
        overwrite: false,
        resource_type: "image",
      });

      progress[progressKey] = true;
      saveProgress(progress);

      console.log(`✅ Subido: ${publicId}`);
    } catch (error) {
      console.error(`❌ Error: ${publicId}`, error.message);
    }
  }
}

uploadFolder(ROOT_FOLDER)
  .then(() => console.log("🎉 Carga completada"))
  .catch(console.error);