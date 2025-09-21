# Electric Vehicle Population Dashboard

A comprehensive React dashboard for analyzing electric vehicle population data, built as part of the MapUp Analytics Dashboard Assessment.

## Live Demo

Check out the live site here: [EV Dashboard](https://carsev-dashboard.netlify.app/)
## Features

### 📊 Key Metrics
- Total vehicle count
- Unique makes and models
- Geographic coverage (counties)
- Average electric range
- BEV vs PHEV distribution
- CAFV eligibility statistics
- Year range coverage
- Average MSRP (when available)

### 📈 Interactive Visualizations
- **Top 10 Vehicle Makes**: Bar chart showing the most popular EV manufacturers
- **Vehicle Type Distribution**: Pie chart comparing Battery Electric Vehicles (BEV) vs Plug-in Hybrid Electric Vehicles (PHEV)
- **Registration Trends**: Line chart showing vehicle registration by year (last 10 years)
- **Geographic Distribution**: Horizontal bar chart of top counties by vehicle count
- **Electric Range Distribution**: Bar chart showing range distribution across different mile ranges

### 🔍 Data Table
- Sortable columns for easy data exploration
- Filtering by make and vehicle type
- Pagination for handling large datasets
- Responsive design for mobile devices

## Technology Stack

- **React 19** with TypeScript
- **Recharts** for data visualization
- **Papa Parse** for CSV data processing
- **CSS3** with modern styling and animations
- **Responsive Design** for mobile and desktop

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Navigate to the project directory
3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npm start
   ```

5. Open [http://localhost:3000](http://localhost:3000) to view it in the browser

### Building for Production

```bash
npm run build
```

This builds the app for production to the `build` folder.

## Data Source

The dashboard analyzes the Electric Vehicle Population Data from Washington State, containing information about:
- Vehicle specifications (make, model, year, type)
- Electric range and MSRP
- Geographic location (county, city, state)
- CAFV eligibility status
- Utility provider information

## Key Insights

The dashboard reveals several interesting patterns in electric vehicle adoption:

1. **Tesla Dominance**: Tesla vehicles make up a significant portion of the EV market
2. **Geographic Concentration**: Most EVs are concentrated in specific counties, particularly King County
3. **Technology Evolution**: Newer vehicles tend to have longer electric ranges
4. **Type Distribution**: Battery Electric Vehicles (BEV) are more common than Plug-in Hybrids (PHEV)
5. **Year Trends**: EV adoption has been increasing over recent years

## Deployment

The application can be deployed to any static hosting service such as:
- Vercel
- Netlify
- GitHub Pages
- AWS S3 + CloudFront

## Performance

- Optimized for large datasets (50,000+ records)
- Lazy loading and pagination for smooth user experience
- Responsive design for all device sizes
- Efficient data processing and visualization

## Future Enhancements

- Real-time data updates
- Advanced filtering options
- Export functionality
- Interactive maps
- Comparative analysis tools
- Mobile app version
