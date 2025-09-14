<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# AI Shipment Copilot

An AI-powered dashboard for planning and optimizing global shipments with interactive route visualization, risk analysis, and what-if scenarios.

View your app in AI Studio: https://ai.studio/apps/drive/1xU-GoNOXqlUUFwhz3zUejV_m5Uu5HI8Z

## Run Locally

**Prerequisites:**  Node.js 18+ and npm

1. Clone this repository:
   ```bash
   git clone https://github.com/yourusername/AI-Shipment-Copilot.git
   cd AI-Shipment-Copilot
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory:
   ```bash
   touch .env
   ```

4. Generate a Gemini API key:
   - Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Sign in with your Google account
   - Click on "Create API Key" button
   - Copy the generated API key

5. Add your Gemini API key to the `.env` file:
   ```
   GEMINI_API_KEY=your_api_key_here
   ```

6. Run the development server:
   ```bash
   npm run dev
   ```

7. Open your browser and navigate to:
   ```
   http://localhost:5173
   ```

## Features

- **AI-Powered Planning**: Chat with AI agents to plan optimal shipment routes
- **Route Visualization**: Interactive timeline view of all stops and transportation modes
- **Risk Analysis**: Detailed assessment of potential risks for each route
- **What-If Scenarios**: Simulate changes in conditions to see impacts on cost and time
- **Route Comparison**: Side-by-side comparison of multiple shipping options
