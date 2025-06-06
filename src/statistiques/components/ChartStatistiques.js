import { Box, useMediaQuery, useTheme } from "@mui/material";
import PropTypes from "prop-types";
import ProgressionSection from "../components-stats/ProgressionSection";
import TopDuMoisTable from "../components-stats/TopDuMoisTable";
import StatistiquesGrid from "../components-stats/StatistiquesGrid";

const ChartStatistiques = ({ data, tableauCommerciaux, selectedCommercial, selectedRank, isSelectedInTop3, isSelectedCommercialValid, filteredReviews, reviews }) => {
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  // Trier et extraire le top 3
  const top3 = [...tableauCommerciaux]
    .sort((a, b) => b.count - a.count)
    .slice(0, 3)
    .map((commercial, index) => ({
      top: index + 1,
      name: commercial.name,
      avis: commercial.count,
      gainBruts: `${commercial.count * 10}€`,
      gainNets: `${commercial.count * 10}€`,
    }));

  const normalizeText = (text) => {
    if (!text || typeof text !== "string") {
      return "";
    }
    return text.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  };

  const selectedCommercialData = tableauCommerciaux.find(
    com => normalizeText(com.name) === normalizeText(selectedCommercial)
  );

  const OBJECTIF_MENSUEL = 5;
  const commercialCountMount = selectedCommercialData ? selectedCommercialData.count : 0;
  const progressionCommercial = selectedCommercial
    ? Math.min(100, Math.round((commercialCountMount / OBJECTIF_MENSUEL) * 100))
    : 0;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        justifyContent: "center",
        alignItems: isMobile ? "center" : "flex-start",
        flexWrap: "wrap",
        maxWidth: isMobile ? "90%" : "1600px",
        margin: "50px auto",
        padding: "30px",
        borderRadius: "20px",
        bgcolor: "white",
        gap: 3,
      }}
    >

      {/* Bloc des statistiques et tableau */}
      <Box sx={{ flex: 1, width: isMobile ? "100%" : "auto" }}>
        <StatistiquesGrid data={data} selectedCommercial={selectedCommercial} />

        {/* Tableau Top du Mois */}
        <Box sx={{ marginTop: "30px", bgcolor: "#F2F3FB", borderRadius: "20px", padding: "20px", display: isMobile ? "none" : "block" }}>
          <TopDuMoisTable
            top3={top3}
            selectedCommercial={selectedCommercial}
            selectedCommercialData={selectedCommercialData}
            selectedRank={selectedRank}
            isSelectedInTop3={isSelectedInTop3}
            isSelectedCommercialValid={isSelectedCommercialValid}
            reviews={filteredReviews}
          />
        </Box>
      </Box>

      {/* Bloc de progression */}
      <Box
        sx={{
          width: "275px",
          height: "700px",
          borderRadius: "20px",
          bgcolor: "#F2F3FB",
          display: isMobile ? "none" : "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <ProgressionSection
          progression={progressionCommercial}
          commercialCountMount={commercialCountMount}
          isYearly={false}
          selectedCommercial={selectedCommercial}
        />
      </Box>
    </Box>
  );
};

// Validation avec PropTypes
ChartStatistiques.propTypes = {
  data: PropTypes.array.isRequired,
  progression: PropTypes.number,
  colors: PropTypes.array,
  tableauCommerciaux: PropTypes.array.isRequired,
  selectedCommercial: PropTypes.string.isRequired,
  selectedRank: PropTypes.number,
  isSelectedInTop3: PropTypes.bool,
  isSelectedCommercialValid: PropTypes.bool,
  filteredReviews: PropTypes.array
};

export default ChartStatistiques;