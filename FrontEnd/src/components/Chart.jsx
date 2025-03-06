import React, { useEffect, useState } from "react";
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';


// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function Chart() {
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [{
            label: 'Waste Weight (kg)',
            data: [],
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
        }]
    });

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch('http://localhost:3000/setWasteData'); // Make sure the endpoint is correct
                const data = await response.json();

                // Ensure data is an array and not empty
                if (Array.isArray(data) && data.length > 0) {
                    const labels = data.map(item => item.waste_type);
                    const weights = data.map(item => item.weight);

                    setChartData({
                        labels: labels,
                        datasets: [{
                            label: 'Waste Weight (kg)',
                            data: weights,
                            backgroundColor: 'rgba(75, 192, 192, 0.6)',
                        }]
                    });
                } else {
                    console.warn('No waste data available');
                }
            } catch (error) {
                console.error('Error fetching waste data:', error);
            }
        }
        fetchData();
    }, []);

    return <Bar data={chartData} />;
}

export default Chart;
