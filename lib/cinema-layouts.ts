import { CinemaLayout } from "@/types/cinema";

// Sample cinema layouts that can be used for demonstration
export const sampleCinemaLayouts: Record<string, CinemaLayout> = {
  // Standard cinema layout with a single section
  standard: {
    id: "cinema-1",
    name: "Pathé Azur",
    screen: {
      width: 70
    },
    sections: [
      {
        id: "main",
        name: "Main Hall",
        rows: Array.from({ length: 10 }, (_, rowIndex) => {
          const rowName = String.fromCharCode(65 + rowIndex); // A, B, C, ...
          return {
            id: `row-${rowName}`,
            name: rowName,
            seats: Array.from({ length: 16 }, (_, seatIndex) => {
              const seatNumber = seatIndex + 1;
              // Make some seats unavailable or different types for demonstration
              const type = 
                rowIndex < 3 ? 'standard' :
                rowIndex < 6 ? (seatIndex % 8 === 0 ? 'premium' : 'standard') :
                rowIndex < 9 ? (seatIndex % 10 === 0 ? 'vip' : 'standard') : 'standard';
              
              const status = 
                (rowIndex === 4 && seatIndex === 7) || 
                (rowIndex === 5 && seatIndex === 8) || 
                (rowIndex === 6 && seatIndex === 9) ? 'sold' : 'available';
              
              return {
                id: `${rowName}-${seatNumber}`,
                row: rowName,
                number: seatNumber,
                type,
                status
              };
            })
          };
        })
      }
    ]
  },
  
  // IMAX theater with premium center section
  imax: {
    id: "cinema-2",
    name: "Pathé Tunis",
    screen: {
      width: 85
    },
    sections: [
      {
        id: "lower",
        name: "Lower Level",
        rows: Array.from({ length: 6 }, (_, rowIndex) => {
          const rowName = String.fromCharCode(65 + rowIndex); // A, B, C, ...
          return {
            id: `row-${rowName}`,
            name: rowName,
            seats: Array.from({ length: 20 }, (_, seatIndex) => {
              const seatNumber = seatIndex + 1;
              // Center seats are premium
              const type = seatIndex >= 5 && seatIndex <= 14 ? 'premium' : 'standard';
              
              return {
                id: `${rowName}-${seatNumber}`,
                row: rowName,
                number: seatNumber,
                type,
                status: 'available'
              };
            })
          };
        })
      },
      {
        id: "upper",
        name: "Upper Level",
        rows: Array.from({ length: 8 }, (_, rowIndex) => {
          const rowName = String.fromCharCode(71 + rowIndex); // G, H, I, ...
          return {
            id: `row-${rowName}`,
            name: rowName,
            seats: Array.from({ length: 24 }, (_, seatIndex) => {
              const seatNumber = seatIndex + 1;
              // Last two rows are VIP
              const type = rowIndex >= 6 ? 'vip' : 'standard';
              
              // Make some seats unavailable
              const status = 
                (rowIndex === 2 && (seatIndex === 5 || seatIndex === 6)) || 
                (rowIndex === 3 && (seatIndex === 7 || seatIndex === 8)) ? 'sold' : 'available';
              
              return {
                id: `${rowName}-${seatNumber}`,
                row: rowName,
                number: seatNumber,
                type,
                status
              };
            })
          };
        })
      }
    ]
  },
  
  // Luxury cinema with fewer, more spacious seats
  luxury: {
    id: "cinema-3",
    name: "L'Agora",
    screen: {
      width: 60
    },
    sections: [
      {
        id: "vip",
        name: "VIP Section",
        rows: Array.from({ length: 4 }, (_, rowIndex) => {
          const rowName = String.fromCharCode(65 + rowIndex); // A, B, C, D
          return {
            id: `row-${rowName}`,
            name: rowName,
            seats: Array.from({ length: 8 }, (_, seatIndex) => {
              const seatNumber = seatIndex + 1;
              
              return {
                id: `${rowName}-${seatNumber}`,
                row: rowName,
                number: seatNumber,
                type: 'vip',
                status: 'available'
              };
            })
          };
        })
      },
      {
        id: "premium",
        name: "Premium Section",
        rows: Array.from({ length: 3 }, (_, rowIndex) => {
          const rowName = String.fromCharCode(69 + rowIndex); // E, F, G
          return {
            id: `row-${rowName}`,
            name: rowName,
            seats: Array.from({ length: 10 }, (_, seatIndex) => {
              const seatNumber = seatIndex + 1;
              
              // Add some unavailable seats
              const status = 
                (rowIndex === 1 && seatIndex === 4) || 
                (rowIndex === 2 && seatIndex === 5) ? 'sold' : 'available';
              
              return {
                id: `${rowName}-${seatNumber}`,
                row: rowName,
                number: seatNumber,
                type: 'premium',
                status
              };
            })
          };
        })
      }
    ]
  },
  
  // Asymmetric layout with gaps and irregular seating
  asymmetric: {
    id: "cinema-4",
    name: "Cinéma Le Colisée",
    screen: {
      width: 75
    },
    sections: [
      {
        id: "left",
        name: "Left Wing",
        rows: Array.from({ length: 5 }, (_, rowIndex) => {
          const rowName = String.fromCharCode(65 + rowIndex); // A, B, C, ...
          // Increasing number of seats per row
          const seatCount = 4 + rowIndex;
          
          return {
            id: `row-${rowName}-left`,
            name: rowName,
            seats: Array.from({ length: seatCount }, (_, seatIndex) => {
              const seatNumber = seatIndex + 1;
              
              return {
                id: `${rowName}-L-${seatNumber}`,
                row: rowName,
                number: seatNumber,
                type: rowIndex >= 3 ? 'premium' : 'standard',
                status: 'available'
              };
            })
          };
        })
      },
      {
        id: "center",
        name: "Center",
        rows: Array.from({ length: 7 }, (_, rowIndex) => {
          const rowName = String.fromCharCode(65 + rowIndex); // A, B, C, ...
          // Center section has more seats
          const seatCount = 8;
          
          return {
            id: `row-${rowName}-center`,
            name: rowName,
            seats: Array.from({ length: seatCount }, (_, seatIndex) => {
              const seatNumber = seatIndex + 10; // Start numbering from 10
              
              // Make some seats unavailable
              const status = 
                (rowIndex === 3 && seatIndex === 3) || 
                (rowIndex === 4 && seatIndex === 4) ? 'sold' : 'available';
              
              return {
                id: `${rowName}-C-${seatNumber}`,
                row: rowName,
                number: seatNumber,
                type: rowIndex >= 5 ? 'vip' : 'standard',
                status
              };
            })
          };
        })
      },
      {
        id: "right",
        name: "Right Wing",
        rows: Array.from({ length: 5 }, (_, rowIndex) => {
          const rowName = String.fromCharCode(65 + rowIndex); // A, B, C, ...
          // Decreasing number of seats per row
          const seatCount = 8 - rowIndex;
          
          return {
            id: `row-${rowName}-right`,
            name: rowName,
            seats: Array.from({ length: seatCount }, (_, seatIndex) => {
              const seatNumber = seatIndex + 20; // Start numbering from 20
              
              return {
                id: `${rowName}-R-${seatNumber}`,
                row: rowName,
                number: seatNumber,
                type: rowIndex >= 3 ? 'premium' : 'standard',
                status: 'available'
              };
            })
          };
        })
      }
    ]
  }
};