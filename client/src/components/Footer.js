import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const Footer = () => {
  return (
    <Box
      sx={{
        backgroundColor: "#2E3B55",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 10,
        height: "1vh",
      }}
    >
      
      <Typography variant="h6" sx={{ color: "white", marginTop: "-50px", }}>
        JOB HUB
      </Typography>
      <Typography variant="subtitle1" sx={{ color: "white", marginBottom: "-50px", }}>
        RCCG SOW Copyright © 2023. All Right Reserved
      </Typography>
    </Box>
  );
};

export default Footer;
