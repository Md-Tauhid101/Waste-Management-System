
from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import AutoImageProcessor, AutoModelForImageClassification
from PIL import Image
import torch

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load the model and processor
processor = AutoImageProcessor.from_pretrained("watersplash/waste-classification")
model = AutoModelForImageClassification.from_pretrained("watersplash/waste-classification")

# Define id2label mapping if not provided by model
id2label = model.config.id2label if hasattr(model.config, "id2label") else {
    0: "battery", 1: "biological", 10: "trash",11: "white-glass", 2: "brown-glass", 3: "cardboard",4: "clothes", 5: "green-glass", 6: "metal",7: "paper", 8: "plastic", 9: "shoes"
}

# Recommendations dictionary for each category
recommendations = {
    "cardboard": {
        "disposal": "Flatten and clean the cardboard before recycling. Ensure it is dry and free from food contamination.",
        "reuse": "Use old cardboard for crafts, as storage dividers, or for gardening as a weed barrier.",
        "articles": [
            {"title": "Step-by-Step Guide to Recycling Cardboard", "url": "https://cardboard.org.uk/news/break-it-down-a-step-by-step-guide-to-recycling-cardboard-correctly/"},
            {"title": "20 Ways to Recycle and Repurpose Cardboard​", "url": "https://simplelifeofalady.com/20-ways-to-recycle-cardboard/"}
        ]
    },
    "battery": {
        "disposal": "Batteries should never be disposed of with regular trash due to their toxic components. Take them to designated battery recycling centers or hazardous waste facilities.",
        "reuse": "Rechargeable batteries can be used multiple times before disposal. For single-use batteries, consider using them in low-drain devices until fully discharged.",
        "articles": [
            {"title": "Effective Ways for Disposal of Batteries in India", "url": "https://enterclimate.com/blog/effective-ways-for-disposal-of-batteries-in-india/"},
            {"title": "ecycling Dead Batteries for a Greener Tomorrow", "url": "https://sustainablereview.com/taking-action-recycling-dead-batteries-for-a-greener-tomorrow/"}
        ]
    },
    "plastic": {
        "disposal": "Check for recycling symbols to ensure compatibility with local recycling programs. Avoid disposing of plastic with general waste.",
        "reuse": "Reuse plastic containers for storage or as plant pots. Get creative with crafts using old plastic items.",
        "articles": [
            {"title": "How to Recycle Plastic", "url": "https://www.fairharborclothing.com/blogs/news/30-ways-to-reuse-plastic"},
            {"title": "Innovative Reuse Ideas for Plastic", "url": "https://energytheory.com/reuse-of-plastic/"}
        ]
    },
    "biological": {
        "disposal": "Biological waste must be handled with care. Medical and biological waste should be disposed of in marked biohazard bags and taken to specialized facilities.",
        "reuse": "Composting is a great option for non-hazardous biological waste (e.g., food scraps).",
        "articles": [
            {"title": "Composting: Solution to Food Loss and Waste", "url": "https://www.unep.org/ietc/news/story/composting-solution-food-loss-and-waste"},
            {"title": "Biological Waste Management", "url": "https://www.intechopen.com/chapters/1154473"}
        ]
    },
    "trash": {
        "disposal": "Ensure that non-recyclable trash is securely bagged before placing it in the trash bin to prevent littering and contamination.",
        "reuse": "Before classifying items as trash, consider if parts can be recycled or repurposed in any way.",
        "articles": [
            {"title": "Non Recyclable Items & Responsible Disposal Guide", "url": "https://livingwildandgreen.com/non-recyclable-items-responsible-disposal-guide/"},
            {"title": "ustainable Solutions: Managing Non-Recyclable", "url": "https://www.thebag.co.in/blogs/news/sustainable-solutions-managing-non-recyclable-plastics"}
        ]
    },
    "white-glass": {
        "disposal": "White (clear) glass can be recycled like other glass types. Clean it before placing it in the recycling bin.",
        "reuse": "Use white glass jars and bottles for storage or decorative purposes.",
        "articles": [
            {"title": "14 Ideas for Upcycling Used Bottles", "url": "https://thegoodhuman.com/how-to-reuse-glass-bottles/#:~:text=Regular%20glass%20bottles%20can%20be%20transformed%20into%20drinking,turn%20them%20into%20bird%20feeders%20and%20plant%20pots."},
            {"title": "15 Innovative Uses for Glass Bottles in Gardens", "url": "https://leafyjournal.com/15-uses-for-glass-bottles-in-gardens/"}
        ]
    },
    "brown-glass": {
        "disposal": "Clean the glass and place it in a glass recycling bin. Check if your local recycling facility accepts mixed glass or requires sorting.",
        "reuse": "Use brown glass bottles as storage containers, vases, or for DIY crafts.",
        "articles": [
            {"title": "How to Reuse Glass Bottles: 14 Ideas for Upcycling Used Bottles", "url": "https://thegoodhuman.com/how-to-reuse-glass-bottles/"},
            {"title": "40 Really Smart Ways To Reuse Glass", "url": "https://homehacks.co/40-ways-reuse-glass-bottles/?"}
        ]
    },
    "clothes": {
        "disposal": "Donate gently used clothes to charity or second-hand stores. Torn or unusable clothing can often be recycled at fabric recycling centers.",
        "reuse": "Repurpose old clothes into rags, cushion covers, or sewing projects.",
        "articles": [
            {"title": "10 Ways to Upcycle Old Clothes", "url": "https://www.rd.com/article/upcycle-clothes/"},
            {"title": "20 Best Ways to Reuse Old Clothing With Helpful Tutorials", "url": "https://sustainablykindliving.com/best-ways-to-reuse-old-clothing/"}
        ]
    },
    "green-glass": {
        "disposal": "Green glass can be recycled similarly to other glass types. Ensure it is clean and take it to a recycling facility that accepts glass.",
        "reuse": "Green glass bottles can be repurposed for home decor, like planters or lights.",
        "articles": [
            {"title": "A Comprehensive Guide to Manage Glass Recycling effectively", "url": "https://www.greenpractices.in/blog/a-comprehensive-guide-to-manage-glass-recycling-effectively"},
            {"title": "Waste Glass Recycling: A Circular Solution", "url": "https://wasteadvantagemag.com/waste-glass-recycling-a-circular-solution/"}
        ]
    },
    "metal": {
        "disposal": "Metals can be recycled at local scrap metal centers. Clean them of any non-metal parts before recycling.",
        "reuse": "Repurpose metal containers as planters, tool holders, or other functional items.",
        "articles": [
            {"title": "The Importance Of Metal Recycling In The Modern Economy", "url": "https://recyclingspecialties.com/the-importance-of-metal-recycling-in-the-modern-economy/"},
            {"title": "Advantages of Recycling Metals", "url": "https://tampasteel.com/the-benefits-of-recycling-scrap-metal/"}
        ]
    },
    "paper": {
        "disposal": "Recycle paper in a clean, dry state. Avoid recycling paper with food stains or coated paper.",
        "reuse": "Use paper for gift wrapping, craft projects, or as scratch paper.",
        "articles": [
            {"title": "How to Reuse Paper", "url": "https://www.wikihow.com/Reuse-Paper"},
            {"title": "10 neat ways to reuse paper at home", "url": "https://www.thinkingreener.com/lifestyle/10-neat-ways-to-reuse-paper-at-home/"}
        ]
    },
    "shoes": {
        "disposal": "If the shoes are in good condition, donate them to a local charity. If not, check for shoe recycling programs that repurpose materials.",
        "reuse": "Transform old shoes into planters or decorative items.",
        "articles": [
            {"title": "What To Do With Old Shoes: Ideas for Recycling and Repurposing", "url": "https://sustainablethrive.com/what-to-do-with-old-shoes/"},
            {"title": "Give Your Old Shoes New Life: Creative Ways to Repurpose Them", "url": "https://shoestringforum.com/how-can-i-repurpose-old-shoes/"}
        ]
    }
    # Add more categories as needed
}

@app.route("/classify", methods=["POST"])
def classify_image():
    if "image" not in request.files:
        return jsonify({"error": "No image provided"}), 400

    # Load and preprocess the image
    image_file = request.files["image"]
    image = Image.open(image_file.stream)
    inputs = processor(images=image, return_tensors="pt")

    # Perform inference
    outputs = model(**inputs)
    logits = outputs.logits

    # Get the predicted class index and name
    predicted_class_idx = logits.argmax(-1).item()
    predicted_class_name = id2label.get(predicted_class_idx, "Unknown category")

    # Fetch recommendations based on predicted class
    recommendation = recommendations.get(predicted_class_name, {
        "disposal": "No disposal information available.",
        "reuse": "No reuse information available.",
        "articles": [{"title": "No articles available", "url": "#"}]
    })

    return jsonify({
        "class_index": predicted_class_idx,
        "class_name": predicted_class_name,
        "recommendation": recommendation
    })

if __name__ == "__main__":
    app.run(debug=True)

