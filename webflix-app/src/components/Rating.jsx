import { Box, Typography, CircularProgress } from "@mui/material";
const Rating = ({ value }) => {
  // Determine color based on value
  let color;
  if (value >= 7) {
    color = "#0db816"; // Green color for ratings 7-10
  } else if (value >= 5) {
    color = "#FFBF00"; // Amber/dark yellow color for ratings 5-6.9
  } else {
    color = "#c72121"; // Red color for ratings below 5
  }

  return (
    <Box
      sx={{
        position: "relative",
        display: "inline-block",
        width: "max-content",
      }}
    >
      <CircularProgress
        variant="determinate"
        value={value * 10}
        sx={{ color: color }}
        size={50}
      />
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography
          variant="caption"
          component="div"
          fontWeight="700"
          sx={{ marginTop: "-5px" }}
        >
          {Math.floor(value * 10) / 10}
        </Typography>
      </Box>
    </Box>
  );
};

export default Rating;
