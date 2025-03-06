import React, { useEffect, useState } from "react";
import "../style/LandingPage.css";
import { Link } from "react-router-dom";

function LandingPage() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [currentText, setCurrentText] = useState('');
    const [charIndex, setCharIndex] = useState(0);
    const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);

    const wasteCategoriesImages = [
        { type: "Plastic", img: "/plastic.jpg" },
        { type: "Metal", img: "/metal.jpg" },
        { type: "Glass", img: "/glass.jpg" },
        { type: "Paper", img: "/paper.jpg" },
        { type: "Organic", img: "/organic.jpg" },
        { type: "Electronic", img: "/electric.jpg" },
    ];

    const wasteCategories = [
        'Plastic', 'Metal', 'Glass', 'Paper', 'Organic', 'Electronic'
    ];

    // Use effect for image slide change
    useEffect(() => {
        const slideInterval = setInterval(() => {
            setCurrentSlide((prevSlide) => (prevSlide + 1) % wasteCategoriesImages.length);

            // Reset typing effect when image changes
            setCurrentText(""); 
            setCharIndex(0);
            // Update waste category to start typing for the new image
            setCurrentCategoryIndex((prevIndex) => (prevIndex + 1) % wasteCategories.length);
        }, 3000);

        return () => clearInterval(slideInterval);
    }, []); // This runs only once on mount to set up the slide change

    // Use effect for typing effect of waste category text
    useEffect(() => {
        const typingInterval = setInterval(() => {
            const category = wasteCategories[currentCategoryIndex];

            if (charIndex < category.length) {
                setCurrentText((prevText) => prevText + category[charIndex]);
                setCharIndex((prevIndex) => prevIndex + 1);
            } else {
                clearInterval(typingInterval); // Stop typing once the text is complete
            }
        }, 150);

        return () => clearInterval(typingInterval); // Cleanup interval on each render
    }, [charIndex, currentCategoryIndex]); // Runs when charIndex or currentCategoryIndex changes

    return (
        <div className="container">
            <div className="heading">
                <h1>Waste Management System</h1>
            </div>
            <div className="mid-container">
                <div className="left-right">
                    <div className="left">
                        
                        <div className="slider">
                            {wasteCategoriesImages.map((category, index) => (
                                <div
                                    className={`slide ${index === currentSlide ? "active" : ""}`}
                                    key={index}
                                >
                                    <img
                                        src={category.img}
                                        alt={`${category.type} waste`}
                                        className="slider-image"
                                    />
                                </div>
                            ))}
                        </div>
                        <h2>Waste Type: <span className="category">{currentText}</span></h2>
                    </div>
                    <div className="right">
                        <div className="image"></div>
                        <input
                            type="file"
                            id="fileInput"
                            style={{ display: "none" }}
                        />
                        <Link to="/Login" className="upload-button">
                            Upload File
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LandingPage;
