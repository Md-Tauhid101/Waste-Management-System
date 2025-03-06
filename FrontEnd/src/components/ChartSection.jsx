import React, { useState } from "react";
import Chart from "./Chart";
import "../style/ChartSection.css";

function ChartSection() {
    const [showChart, setShowChart] = useState(false); // State to control chart visibility

    const handleShowChart = () => {
        setShowChart(true); // Show chart when button is clicked
    };

    return (
        <div className="chart-section">
            <button
                type="button"
                name="submit-waste-amount"
                className="submit-waste"
                onClick={handleShowChart} // Handle button click
            >
                Show Waste Data
            </button>
            {showChart && ( // Conditionally render the chart
                <div className="chart">
                    <Chart />
                </div>
            )}

            <div className="extra">

            </div>
        </div>
    );
}

export default ChartSection;
