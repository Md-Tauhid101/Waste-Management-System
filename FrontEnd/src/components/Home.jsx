import React, { useState } from 'react';
import "../style/Home.css";
import ChartSection from "./ChartSection";

function Home() {
    const [selectedImage, setSelectedImage] = useState(null);
    const [wasteType, setWasteType] = useState('');
    const [weight, setWeight] = useState('');
    const [disposal, setDisposal] = useState('');
    const [reuse, setReuse] = useState('');
    const [articles, setArticles] = useState([]);

    // Function to handle image classification
    async function classifyImage() {
        const input = document.getElementById("imageInput");
        if (input.files.length === 0) {
            alert("Please select an image.");
            return;
        }

        const formData = new FormData();
        formData.append("image", input.files[0]);

        try {
            const response = await fetch("http://127.0.0.1:5000/classify", {
                method: "POST",
                body: formData
            });

            if (!response.ok) {
                throw new Error("Failed to classify image.");
            }

            const result = await response.json();
            setWasteType(result.class_name);
            setDisposal(result.recommendation.disposal || "No information available");
            setReuse(result.recommendation.reuse || "No information available");

            // Set articles list
            if (result.recommendation.articles) {
                setArticles(result.recommendation.articles);
            } else {
                setArticles([{ title: "No related articles available", url: "#" }]);
            }
        } catch (error) {
            console.error(error);
            alert("Error classifying image.");
        }
    }

    // Function to handle waste data submission
    async function submitWasteData() {
        if (!wasteType || !weight) {
            alert("Please classify the waste and enter the weight.");
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/getWasteData', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    wasteType: wasteType,
                    weight: weight,
                }),
            });

            if (response.ok) {
                alert("Waste data submitted successfully!");
                setWeight(''); // Clear the weight input
            } else {
                alert("Error submitting waste data.");
            }
        } catch (error) {
            console.error('Error submitting waste data:', error);
            alert("Error submitting waste data.");
        }
    }

    // Handle image change for preview
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedImage(reader.result); // Set the preview image URL
            };
            reader.readAsDataURL(file); // Read file as data URL
        }
    };

    return (
        <div className='container'>
            <div className="home-heading">
                <h1>Waste Management System</h1>
            </div>
            <div className='middle-container'>
                <form onSubmit={(e) => e.preventDefault()}>
                    <div className='waste-category'>
                        <div className='category-left'>
                            <div className='img'>
                                <img
                                    className='bg-image'
                                    src="../../public/waste-img.jpg"
                                    alt="Background"
                                    style={{
                                        position: 'absolute',
                                        top: '0%',
                                        left: '0%',
                                        width: '100%',
                                        height: '100%',
                                        borderRadius: '30px'
                                    }}
                                />
                                {selectedImage && (
                                    <img
                                        src={selectedImage}
                                        alt="Selected"
                                        style={{
                                            position: 'absolute',
                                            top: '49.8%',
                                            left: '49.85%',
                                            transform: 'translate(-50%, -50%)',
                                            width: '100%',
                                            height: '100%',
                                            borderRadius: '30px'
                                        }}
                                    />
                                )}
                            </div>

                            <div className='img-input'>
                                <label className="choose-img" htmlFor="imageInput">
                                    <span>Choose Image</span>
                                </label>
                                <input onChange={handleImageChange} type="file" id="imageInput" className="input-img" />
                                <button type="button" onClick={classifyImage} className='submit-button'>
                                    <span>Submit Image</span>
                                </button>
                            </div>
                        </div>
                        <div className='category-right'>
                            <div className='waste-type'>
                                <h2 className='img-category'>Waste Type: <span>{wasteType}</span></h2>
                                <h3>Recommendations</h3>
                                <div className='recommendation'>
                                    <p><strong>Disposal Advice:</strong> <span>{disposal}</span></p>
                                    <p><strong>Reuse Tips:</strong> <span>{reuse}</span></p>
                                    <p><strong>Related Articles:</strong></p>

                                    <div className='articles'>
                                        <ul>
                                            {articles.map((article, index) => (
                                                <li key={index}>
                                                    <a href={article.url} target="_blank" rel="noopener noreferrer">
                                                        {article.title}
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                            </div>
                            <div className='waste-amount'>
                                <label htmlFor="number">Enter amount of waste in <strong>kg</strong>:</label>
                                <input
                                    type="number"
                                    value={weight}
                                    onChange={(e) => setWeight(e.target.value)}
                                />
                                <button type="button" onClick={submitWasteData} className='amount-ok-button'>OK</button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
            <div className='chart-container'>   {/*Chart Section*/}
                <ChartSection />
            </div>
        </div>
    );
}

export default Home;
