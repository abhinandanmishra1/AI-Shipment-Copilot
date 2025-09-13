import { GoogleGenAI, Type } from "@google/genai";
import { typedCache } from '../lib/cache';
import type { ShipmentRoute, PlannerResponse, CostAnalysisFactor, RouteSegment, StructuredExplanation, RiskAnalysisResponse } from '../types';

if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function getPlannerSuggestion(routes: ShipmentRoute[], goal: string, constraints: string): Promise<PlannerResponse> {
  // Check cache first
  const cached = typedCache.planner.get(routes, goal, constraints);
  if (cached) {
    console.log('Using cached planner result');
    return cached;
  }

  const model = 'gemini-2.5-flash';

  const prompt = `You are an AI Planner Agent for a shipment planning tool. Your goal is to suggest the best initial shipment route based on user-provided constraints. Given a list of shipment routes, a user's primary goal, and optional constraints, output a single JSON object for the optimal route.
  
  User's primary goal: "${goal}"

  User's constraints: "${constraints || 'None'}"
  
  Please factor in the constraints heavily. If a constraint makes a route impossible, do not suggest it.

  Focus only on the primary goal and constraints, and provide a concise reason. The available routes are:
  ${JSON.stringify(routes, null, 2)}
  `;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
        responseMimeType: 'application/json',
        responseSchema: {
            type: Type.OBJECT,
            properties: {
                suggested_route: {
                    type: Type.STRING,
                    description: "The name of the suggested route, e.g., 'Route A'."
                },
                reason: {
                    type: Type.STRING,
                    description: "A concise reason why this route was chosen based on the user's criteria."
                }
            },
            required: ['suggested_route', 'reason']
        }
    }
  });

  const jsonText = response.text.trim();
  try {
    const result = JSON.parse(jsonText) as PlannerResponse;
    // Cache the result
    typedCache.planner.set(routes, goal, constraints, result);
    return result;
  } catch (e) {
    console.error("Failed to parse Planner JSON response:", jsonText);
    throw new Error("The AI Planner returned an invalid format.");
  }
}

export async function getStructuredExplainerAnalysis(routes: ShipmentRoute[], plannerResult: PlannerResponse): Promise<StructuredExplanation> {
    // Check cache first
    const cached = typedCache.explainer.get(routes, plannerResult);
    if (cached) {
        console.log('Using cached explainer result');
        return cached;
    }

    const model = 'gemini-2.5-flash';
    const alternativeRoutes = routes.filter(r => r.route_name !== plannerResult.suggested_route);

    const prompt = `You are an AI Explainer Agent that provides transparent reasons for AI decisions. Your task is to explain the trade-offs between different shipment routes in a structured JSON format. The Planner Agent has already suggested a route. 
    
    1.  Provide a 'pros' and 'cons' list for the suggested route based on the Planner's reason and the data.
    2.  For two other alternative routes, provide a summary comparing it to the suggested route, and then list its specific 'pros' and 'cons'.
    3.  Keep all explanations concise and focused on cost, time, and risk.

    Suggested Route: ${plannerResult.suggested_route}
    Reason from Planner: ${plannerResult.reason}
    
    The full data for all routes is:
    ${JSON.stringify(routes, null, 2)}

    Alternative routes to compare:
    ${JSON.stringify(alternativeRoutes, null, 2)}
    `;

    const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
            responseMimeType: 'application/json',
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    suggested_route_summary: {
                        type: Type.OBJECT,
                        properties: {
                            pros: { type: Type.ARRAY, items: { type: Type.STRING } },
                            cons: { type: Type.ARRAY, items: { type: Type.STRING } }
                        },
                        required: ['pros', 'cons']
                    },
                    alternatives: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                route_name: { type: Type.STRING },
                                summary: { type: Type.STRING },
                                pros: { type: Type.ARRAY, items: { type: Type.STRING } },
                                cons: { type: Type.ARRAY, items: { type: Type.STRING } }
                            },
                            required: ['route_name', 'summary', 'pros', 'cons']
                        }
                    }
                },
                required: ['suggested_route_summary', 'alternatives']
            }
        }
    });

    const jsonText = response.text.trim();
    try {
        const result = JSON.parse(jsonText) as StructuredExplanation;
        // Cache the result
        typedCache.explainer.set(routes, plannerResult, result);
        return result;
    } catch (e) {
        console.error("Failed to parse Explainer JSON response:", jsonText);
        throw new Error("The AI Explainer returned an invalid format.");
    }
}

export async function getRouteCostAnalysis(route: ShipmentRoute): Promise<CostAnalysisFactor[]> {
    // Check cache first
    const cached = typedCache.costAnalysis.get(route);
    if (cached) {
        console.log('Using cached cost analysis result');
        return cached;
    }

    const model = 'gemini-2.5-flash';

    const prompt = `You are a logistics cost analyst. Given the data for a single shipment route, provide a JSON array of objects explaining the key factors contributing to its cost. Each object should analyze one factor.
    
    The route data is:
    ${JSON.stringify(route, null, 2)}
    
    Analyze at least three factors, such as "Mode of Transport", "Transit Time", and "Risk Profile".`;

    const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
            responseMimeType: 'application/json',
            responseSchema: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        factor_name: {
                            type: Type.STRING,
                            description: "The name of the cost factor, e.g., 'Mode of Transport'."
                        },
                        impact: {
                            type: Type.STRING,
                            enum: ['High', 'Medium', 'Low'],
                            description: "The level of impact this factor has on the total cost."
                        },
                        description: {
                            type: Type.STRING,
                            description: "A concise explanation of how this factor influences the cost."
                        }
                    },
                    required: ['factor_name', 'impact', 'description']
                }
            }
        }
    });
    
    const jsonText = response.text.trim();
    try {
        const result = JSON.parse(jsonText) as CostAnalysisFactor[];
        // Cache the result
        typedCache.costAnalysis.set(route, result);
        return result;
    } catch (e) {
        console.error("Failed to parse Analyst JSON response:", jsonText);
        throw new Error("The AI Analyst returned an invalid format.");
    }
}

export async function generateRouteTimeline(route: ShipmentRoute): Promise<RouteSegment[]> {
    // Check cache first
    const cached = typedCache.timeline.get(route);
    if (cached) {
        console.log('Using cached timeline result');
        return cached;
    }

    const model = 'gemini-2.5-flash';
    const prompt = `You are a logistics planner. Based on the shipment route data below, create a detailed, step-by-step timeline as a JSON array of segments.
    - The first segment must be type: 'origin' and the last must be type: 'destination'.
    - Invent plausible intermediate transit steps based on the route's mode_of_transport. For 'mixed' mode, include at least one truck and one sea/air transit. For 'road', use truck. For 'sea', use sea. For 'air', use air.
    - Each segment must have a 'type', 'details' (e.g., "Truckload Transit"), and 'location'. Transit segments must also include a 'mode'.

    Route data:
    ${JSON.stringify(route, null, 2)}
    `;
    
    const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
            responseMimeType: 'application/json',
            responseSchema: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        type: { type: Type.STRING, enum: ['origin', 'destination', 'transit'] },
                        mode: { type: Type.STRING, enum: ['truck', 'sea', 'air'], nullable: true },
                        details: { type: Type.STRING },
                        location: { type: Type.STRING }
                    },
                    required: ['type', 'details', 'location']
                }
            }
        }
    });

    const jsonText = response.text.trim();
    try {
        const result = JSON.parse(jsonText) as RouteSegment[];
        // Cache the result
        typedCache.timeline.set(route, result);
        return result;
    } catch (e) {
        console.error("Failed to parse Timeline JSON response:", jsonText);
        throw new Error("The AI Planner returned an invalid timeline format.");
    }
}

export async function getRiskAnalysis(route: ShipmentRoute, constraints: string): Promise<RiskAnalysisResponse> {
    // Check cache first
    const cached = typedCache.riskAnalysis.get(route, constraints);
    if (cached) {
        console.log('Using cached risk analysis result');
        return cached;
    }

    const model = 'gemini-2.5-flash';

    const prompt = `You are a logistics Risk Analysis Agent. Analyze the given shipment route for potential risks based on its data and user-specified constraints.
    - If there are significant risks, return a JSON object with a 'risks' array. Each item in the array should detail the risk name, its severity (High, Medium, or Low), a description, and a suggested mitigation.
    - If there are no significant risks, return a JSON object with an empty 'risks' array.

    Route Data:
    ${JSON.stringify(route, null, 2)}

    User Constraints to consider during risk analysis:
    "${constraints || 'None'}"
    `;

    const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
            responseMimeType: 'application/json',
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    risks: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                risk_name: { type: Type.STRING },
                                severity: { type: Type.STRING, enum: ['High', 'Medium', 'Low'] },
                                description: { type: Type.STRING },
                                mitigation: { type: Type.STRING }
                            },
                            required: ['risk_name', 'severity', 'description', 'mitigation']
                        }
                    }
                },
                required: ['risks']
            }
        }
    });

    const jsonText = response.text.trim();
    try {
        const result = JSON.parse(jsonText) as RiskAnalysisResponse;
        // Cache the result
        typedCache.riskAnalysis.set(route, constraints, result);
        return result;
    } catch (e) {
        console.error("Failed to parse Risk Analysis JSON response:", jsonText);
        throw new Error("The AI Risk Analyst returned an invalid format.");
    }
}