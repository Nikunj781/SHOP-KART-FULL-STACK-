import multer from 'multer'

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true)
    else cb(new Error('Only image files are allowed'))
}

export const upload = multer({
    storage: multer.memoryStorage(),
    fileFilter,
    limits: { fileSize: 2 * 1024 * 1024 }
})