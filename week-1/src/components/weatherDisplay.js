import React from "react";
import "./WeatherDisplay.css";

class WeatherDisplay extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            weatherData: null,
            error: null,
        };
    }

    componentDidMount() {
        this.fetchWeatherData();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.city !== this.props.city) {
            this.fetchWeatherData();
        }
    }

    fetchWeatherData() {
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${this.props.city}&appid=${process.env.REACT_APP_API_KEY}&units=metric`).then((response) => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        }).then((data) => this.setState({ weatherData: data }))
            .catch((error) => this.setState({ error }));
    }

    render() {
        const { weatherData, error } = this.state;

        if (error) {
            return <div className="error-message">Error: {error.message}</div>;
        }

        if (!weatherData) {
            return <div className="loading-message">Loading...</div>;
        }

        return (
            <div className="weather-container">
                <h2 className="weather-header">Weather in {weatherData.name}</h2>
                <img
                    className="weather-icon"
                    src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
                    alt={weatherData.weather[0].description}
                />
                <div className="weather-info">
                    <p className="weather-temperature">
                        Temperature: {weatherData.main.temp} °C</p>
                    <p className="weather-condition">Condition: {weatherData.weather[0].description}</p>
                    <p className="weather-wind">Wind Speed: {weatherData.wind.speed} m/s</p>
                </div>
            </div>
        );
    }
}

export default WeatherDisplay;
