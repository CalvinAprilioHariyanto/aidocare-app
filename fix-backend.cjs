const fs = require('fs');
const filePath = 'c:/Users/msila/aido-care-backend/src/app.js';
let app = fs.readFileSync(filePath, 'utf8');

app = app.replace(
  'const authRoutes = require("./routes/authRoutes");',
  'const authRoutes = require("./routes/authRoutes");\nconst cors = require("cors");'
);

app = app.replace(
  'app.use(express.json({ limit: "16kb" }));',
  'app.use(express.json({ limit: "16kb" }));\napp.use(cors({\n  origin: "http://localhost:5173",\n  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],\n  allowedHeaders: ["Content-Type", "Authorization"]\n}));'
);

fs.writeFileSync(filePath, app);
console.log("Updated app.js successfully.");
