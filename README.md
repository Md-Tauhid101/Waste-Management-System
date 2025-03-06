🌿 How the Waste Management System Works
1️⃣ User Registration and Login
  Users create an account or log in using their credentials.
  Authentication ensures secure access to the platform.
2️⃣ Waste Image Upload
  After logging in, users can upload images of their waste.
  The uploaded image is sent to an AI model (hosted on port 5000) for classification.
3️⃣ Waste Classification
  The AI model processes the image and predicts the waste category — for example:
  Organic (food scraps, garden waste)
  Recyclable (plastic, paper, glass)
  Hazardous (batteries, chemicals)
  General waste (non-recyclable items)
  The predicted waste type is displayed to the user.
4️⃣ Waste Amount Entry
  The user manually enters the weight or quantity of the identified waste.
  Clicking the OK button submits both the waste type and amount to the database.
5️⃣ Data Storage
  The backend (Node.js + Express) stores this information in a MongoDB database.
  Each record contains:
  User ID
  Waste type
  Waste amount
  Timestamp
6️⃣ Data Visualization
  Users can view their waste history and trends using interactive charts.
  The charts show:
  Daily/weekly waste generation
  Waste type distribution
  Progress toward reducing waste
7️⃣ Recommendations and Reminders
  The system provides personalized tips to reduce waste.
  Users receive notifications/reminders about eco-friendly habits.
