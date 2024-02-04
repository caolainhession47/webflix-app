import React, { useState } from "react";
import Slider from "@mui/material/Slider";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

const RangeSlider = ({ onYearChange }) => {
  const [value, setValue] = useState([1940, 2024]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    onYearChange(newValue); // This will call the passed function with the new year range
  };

  // Generate marks for each decade
  const generateMarks = () => {
    const marks = [];
    for (let year = 1940; year <= 2024; year += 10) {
      marks.push({ value: year, label: `${year}` });
    }
    return marks;
  };

  return (
    <Box width={700} sx={{ marginBottom: "20px" }}>
      <Typography id="range-slider" gutterBottom>
        Year Range
      </Typography>
      <Slider
        min={1940}
        max={2024}
        value={value}
        onChange={handleChange}
        valueLabelDisplay="auto"
        aria-labelledby="range-slider"
        getAriaValueText={(value) => `${value} Year`}
        marks={generateMarks()}
        sx={{
          "& .MuiSlider-thumb": {
            color: "#E82128",
          },
          "& .MuiSlider-track": {
            color: "#E82128",
          },
          "& .MuiSlider-markLabel": {
            color: "white",
          },
          "& .MuiSlider-mark": {
            backgroundColor: "#E82128",
            height: "8px",
          },
        }}
      />
    </Box>
  );
};

export default RangeSlider;
