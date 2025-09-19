import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Search,
  Globe,
  Building,
  Zap,
  CheckCircle,
  AlertCircle,
  Activity,
  Brain,
  FileText,
  Loader2,
} from "lucide-react";
import DemoScenarios from "./DemoScenarios";
import MarkdownRenderer from "./MarkdownRenderer";
import CompetitiveDashboard from "./CompetitiveDashboard";

// Form validation schema
const formSchema = z.object({
  companyName: z
    .string()
    .min(1, "Company name is required")
    .max(100, "Company name too long"),
  companyUrl: z
    .string()
    .url("Please enter a valid URL")
    .optional()
    .or(z.literal("")),
});

type FormValues = z.infer<typeof formSchema>;

interface StreamEvent {
  timestamp: string;
  type: string;
  step?: string;
  message?: string;
  tool_name?: string;
  tool_input?: any;
  data?: any;
}

interface AnalysisResult {
  competitor: string;
  website?: string;
  research_findings: string;
  strategic_analysis: string;
  final_report: string;
  metrics?: {
    competitive_metrics?: {
      threat_level?: number;
      market_position?: number;
      innovation?: number;
      financial_strength?: number;
      brand_recognition?: number;
    };
    swot_scores?: {
      strengths?: number;
      weaknesses?: number;
      opportunities?: number;
      threats?: number;
    };
  };
  timestamp: string;
  status: string;
  workflow: string;
}

const API_BASE_URL = "http://localhost:8000";

interface CompetitiveIntelligenceFormProps {
  initialCompany?: string;
  initialUrl?: string;
}

export default function CompetitiveIntelligenceForm({
  initialCompany = "",
  initialUrl = "",
}: CompetitiveIntelligenceFormProps = {}) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState("");
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName: initialCompany,
      companyUrl: initialUrl,
    },
  });

  // Auto-submit when initial values are provided
  useEffect(() => {
    if (initialCompany && !isAnalyzing && !analysisResult) {
      // Small delay to ensure form is fully initialized
      setTimeout(() => {
        analyzeCompetitor({
          companyName: initialCompany,
          companyUrl: initialUrl,
        });
      }, 100);
    }
  }, [initialCompany, initialUrl, isAnalyzing, analysisResult]);

  const analyzeCompetitor = async (values: FormValues) => {
    setIsAnalyzing(true);
    setProgress(0);
    setCurrentStep("Starting analysis...");
    setAnalysisResult(null);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/analyze/stream`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "text/event-stream",
        },
        body: JSON.stringify({
          competitor_name: values.companyName,
          competitor_website: values.companyUrl || undefined,
          stream: true,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error("Failed to get response reader");
      }

      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const eventData: StreamEvent = JSON.parse(line.slice(6));

              // Update progress and current step based on event type
              if (eventData.type === "status_update") {
                setCurrentStep(eventData.message || "");

                if (eventData.step === "research_start") {
                  setProgress(10);
                } else if (eventData.step === "research_complete") {
                  setProgress(40);
                } else if (eventData.step === "analysis_start") {
                  setProgress(50);
                } else if (eventData.step === "analysis_complete") {
                  setProgress(80);
                } else if (eventData.step === "report_start") {
                  setProgress(85);
                } else if (eventData.step === "complete") {
                  setProgress(100);
                }
              } else if (eventData.type === "complete") {
                setAnalysisResult(eventData.data as AnalysisResult);
                setCurrentStep("Analysis complete!");
                setProgress(100);
              } else if (eventData.type === "error") {
                throw new Error(eventData.message || "Analysis failed");
              }
            } catch (parseError) {
              console.warn("Failed to parse event:", parseError);
            }
          }
        }
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred";
      setError(errorMessage);
      setCurrentStep("Analysis failed");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const onSubmit = (values: FormValues) => {
    analyzeCompetitor(values);
  };

  const handleDemoScenario = (name: string, website: string) => {
    form.setValue("companyName", name);
    form.setValue("companyUrl", website);
  };

  const resetForm = () => {
    form.reset();
    setAnalysisResult(null);
    setError(null);
    setProgress(0);
    setCurrentStep("");
  };

  const getStepIcon = (step: string) => {
    if (step.includes("Researcher")) return <Brain className="h-4 w-4" />;
    if (step.includes("Analyst")) return <Activity className="h-4 w-4" />;
    if (step.includes("Writer")) return <FileText className="h-4 w-4" />;
    return <Zap className="h-4 w-4" />;
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0a0a0a" }}>
      <div className="max-w-4xl mx-auto space-y-8 p-4 pt-8">
        {/* Hero Section */}
        <div className="text-center space-y-6">
          <h1
            className="text-4xl md:text-5xl font-bold"
            style={{
              color: "#f9f9f9",
              fontFamily: "Inter, sans-serif",
              fontWeight: 700,
              letterSpacing: "tight",
            }}
          >
            Competitive Intelligence
          </h1>
          <p
            className="text-xl max-w-3xl mx-auto"
            style={{
              color: "#a1a1aa",
              fontFamily: "Inter, sans-serif",
              lineHeight: 1.4,
            }}
          >
            Get comprehensive competitive analysis powered by AI agents. Enter a
            company name and optional website to start your analysis.
          </p>
          <div
            className="flex items-center justify-center space-x-8 text-sm"
            style={{ color: "#a1a1aa" }}
          >
            <div className="flex items-center space-x-2">
              <Brain className="h-5 w-5" style={{ color: "#facc15" }} />
              <span>Researcher Agent</span>
            </div>
            <div className="flex items-center space-x-2">
              <Activity className="h-5 w-5" style={{ color: "#facc15" }} />
              <span>Analyst Agent</span>
            </div>
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5" style={{ color: "#facc15" }} />
              <span>Writer Agent</span>
            </div>
          </div>
        </div>

        {/* Main Form Card */}
        <Card
          className="border-0 shadow-xl"
          style={{
            backgroundColor: "#1a1a1a",
            border: "1px solid #262626",
            borderRadius: "12px",
            boxShadow: "0 0 12px rgba(0,0,0,0.6)",
          }}
        >
          <CardHeader className="text-center">
            <CardTitle
              className="text-xl"
              style={{
                color: "#f9f9f9",
                fontFamily: "Inter, sans-serif",
                fontWeight: 700,
              }}
            >
              Start Analysis
            </CardTitle>
            <CardDescription
              style={{
                color: "#a1a1aa",
                fontFamily: "Inter, sans-serif",
              }}
            >
              Our multi-agent system will research, analyze, and generate a
              comprehensive competitive intelligence report
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="companyName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel
                          className="flex items-center space-x-2"
                          style={{
                            color: "#f9f9f9",
                            fontFamily: "Inter, sans-serif",
                            fontWeight: 500,
                          }}
                        >
                          <Building
                            className="h-4 w-4"
                            style={{ color: "#facc15" }}
                          />
                          <span>Company Name</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Slack, Notion, Figma"
                            className="h-12"
                            style={{
                              backgroundColor: "#111111",
                              borderColor: "#262626",
                              color: "#f9f9f9",
                              fontFamily: "Inter, sans-serif",
                            }}
                            {...field}
                          />
                        </FormControl>
                        <FormDescription
                          style={{
                            color: "#a1a1aa",
                            fontFamily: "Inter, sans-serif",
                          }}
                        >
                          The name of the competitor you want to analyze
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="companyUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel
                          className="flex items-center space-x-2"
                          style={{
                            color: "#f9f9f9",
                            fontFamily: "Inter, sans-serif",
                            fontWeight: 500,
                          }}
                        >
                          <Globe
                            className="h-4 w-4"
                            style={{ color: "#facc15" }}
                          />
                          <span>Company URL</span>
                          <Badge
                            variant="secondary"
                            className="text-xs"
                            style={{
                              backgroundColor: "#111111",
                              color: "#a1a1aa",
                              borderColor: "#262626",
                            }}
                          >
                            Optional
                          </Badge>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://company.com"
                            className="h-12"
                            style={{
                              backgroundColor: "#111111",
                              borderColor: "#262626",
                              color: "#f9f9f9",
                              fontFamily: "Inter, sans-serif",
                            }}
                            {...field}
                          />
                        </FormControl>
                        <FormDescription
                          style={{
                            color: "#a1a1aa",
                            fontFamily: "Inter, sans-serif",
                          }}
                        >
                          Company website for more targeted analysis
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 text-base font-medium transition-all duration-200 hover:brightness-110"
                  style={{
                    backgroundColor: "#facc15",
                    color: "#0a0a0a",
                    borderRadius: "9999px",
                    fontFamily: "Inter, sans-serif",
                    fontWeight: 600,
                  }}
                  disabled={isAnalyzing}
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      Start Analysis
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Demo Scenarios */}
        {!isAnalyzing && !analysisResult && (
          <DemoScenarios onSelectScenario={handleDemoScenario} />
        )}

        {/* Progress and Status */}
        {isAnalyzing && (
          <Card
            className="border-0 shadow-lg"
            style={{
              backgroundColor: "#1a1a1a",
              border: "1px solid #262626",
              borderRadius: "12px",
              boxShadow: "0 0 12px rgba(0,0,0,0.6)",
            }}
          >
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {getStepIcon(currentStep)}
                    <span
                      className="font-medium"
                      style={{
                        color: "#f9f9f9",
                        fontFamily: "Inter, sans-serif",
                      }}
                    >
                      {currentStep}
                    </span>
                  </div>
                  <Badge
                    variant="outline"
                    style={{
                      backgroundColor: "#111111",
                      color: "#facc15",
                      borderColor: "#262626",
                    }}
                  >
                    {progress}%
                  </Badge>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Error Display */}
        {error && (
          <Alert
            style={{
              backgroundColor: "#1a1a1a",
              border: "1px solid #262626",
              borderRadius: "12px",
            }}
          >
            <AlertCircle className="h-4 w-4" style={{ color: "#facc15" }} />
            <AlertDescription
              style={{
                color: "#f9f9f9",
                fontFamily: "Inter, sans-serif",
              }}
            >
              {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Results */}
        {analysisResult && (
          <Card
            className="border-0 shadow-xl"
            style={{
              backgroundColor: "#1a1a1a",
              border: "1px solid #262626",
              borderRadius: "12px",
              boxShadow: "0 0 12px rgba(0,0,0,0.6)",
            }}
          >
            <CardHeader>
              <CardTitle
                className="text-xl flex items-center space-x-2"
                style={{
                  color: "#f9f9f9",
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 700,
                }}
              >
                <CheckCircle className="h-6 w-6" style={{ color: "#facc15" }} />
                <span>Analysis Complete</span>
              </CardTitle>
              <CardDescription
                style={{
                  color: "#a1a1aa",
                  fontFamily: "Inter, sans-serif",
                }}
              >
                Competitive intelligence report for {analysisResult.competitor}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div
                  className="text-center p-4 rounded-lg"
                  style={{
                    backgroundColor: "#111111",
                    border: "1px solid #262626",
                    borderRadius: "12px",
                  }}
                >
                  <Brain
                    className="h-8 w-8 mx-auto mb-2"
                    style={{ color: "#facc15" }}
                  />
                  <div
                    className="font-medium"
                    style={{
                      color: "#f9f9f9",
                      fontFamily: "Inter, sans-serif",
                    }}
                  >
                    Research
                  </div>
                  <div
                    className="text-sm"
                    style={{
                      color: "#a1a1aa",
                      fontFamily: "Inter, sans-serif",
                    }}
                  >
                    Data Collection
                  </div>
                </div>
                <div
                  className="text-center p-4 rounded-lg"
                  style={{
                    backgroundColor: "#111111",
                    border: "1px solid #262626",
                    borderRadius: "12px",
                  }}
                >
                  <Activity
                    className="h-8 w-8 mx-auto mb-2"
                    style={{ color: "#facc15" }}
                  />
                  <div
                    className="font-medium"
                    style={{
                      color: "#f9f9f9",
                      fontFamily: "Inter, sans-serif",
                    }}
                  >
                    Analysis
                  </div>
                  <div
                    className="text-sm"
                    style={{
                      color: "#a1a1aa",
                      fontFamily: "Inter, sans-serif",
                    }}
                  >
                    Strategic Insights
                  </div>
                </div>
                <div
                  className="text-center p-4 rounded-lg"
                  style={{
                    backgroundColor: "#111111",
                    border: "1px solid #262626",
                    borderRadius: "12px",
                  }}
                >
                  <FileText
                    className="h-8 w-8 mx-auto mb-2"
                    style={{ color: "#facc15" }}
                  />
                  <div
                    className="font-medium"
                    style={{
                      color: "#f9f9f9",
                      fontFamily: "Inter, sans-serif",
                    }}
                  >
                    Report
                  </div>
                  <div
                    className="text-sm"
                    style={{
                      color: "#a1a1aa",
                      fontFamily: "Inter, sans-serif",
                    }}
                  >
                    Executive Summary
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-6">
                {/* Dashboard Visualization */}
                {analysisResult.metrics && (
                  <CompetitiveDashboard
                    data={{
                      competitor: analysisResult.competitor,
                      competitive_metrics:
                        analysisResult.metrics.competitive_metrics,
                      swot_scores: analysisResult.metrics.swot_scores,
                    }}
                  />
                )}

                <div>
                  <h3
                    className="font-semibold text-lg mb-2"
                    style={{
                      color: "#f9f9f9",
                      fontFamily: "Inter, sans-serif",
                      fontWeight: 600,
                    }}
                  >
                    Executive Report
                  </h3>
                  <div
                    className="p-6 rounded-lg"
                    style={{
                      backgroundColor: "#111111",
                      border: "1px solid #262626",
                      borderRadius: "12px",
                    }}
                  >
                    <MarkdownRenderer content={analysisResult.final_report} />
                  </div>
                </div>

                <details className="group">
                  <summary
                    className="cursor-pointer font-medium flex items-center transition-colors duration-200 hover:brightness-110"
                    style={{
                      color: "#f9f9f9",
                      fontFamily: "Inter, sans-serif",
                    }}
                  >
                    <Brain
                      className="h-4 w-4 mr-2"
                      style={{ color: "#facc15" }}
                    />
                    View Research Findings
                  </summary>
                  <div
                    className="mt-2 p-6 rounded-lg"
                    style={{
                      backgroundColor: "#111111",
                      border: "1px solid #262626",
                      borderRadius: "12px",
                    }}
                  >
                    <MarkdownRenderer
                      content={analysisResult.research_findings}
                    />
                  </div>
                </details>

                <details className="group">
                  <summary
                    className="cursor-pointer font-medium flex items-center transition-colors duration-200 hover:brightness-110"
                    style={{
                      color: "#f9f9f9",
                      fontFamily: "Inter, sans-serif",
                    }}
                  >
                    <Activity
                      className="h-4 w-4 mr-2"
                      style={{ color: "#facc15" }}
                    />
                    View Strategic Analysis
                  </summary>
                  <div
                    className="mt-2 p-6 rounded-lg"
                    style={{
                      backgroundColor: "#111111",
                      border: "1px solid #262626",
                      borderRadius: "12px",
                    }}
                  >
                    <MarkdownRenderer
                      content={analysisResult.strategic_analysis}
                    />
                  </div>
                </details>
              </div>

              <div
                className="flex items-center justify-between text-sm pt-4 border-t"
                style={{
                  color: "#a1a1aa",
                  borderColor: "#262626",
                  fontFamily: "Inter, sans-serif",
                }}
              >
                <span>
                  Generated on{" "}
                  {new Date(analysisResult.timestamp).toLocaleDateString()}
                </span>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={resetForm}
                    style={{
                      backgroundColor: "#1a1a1a",
                      color: "#f9f9f9",
                      borderColor: "#262626",
                      borderRadius: "6px",
                      fontFamily: "Inter, sans-serif",
                    }}
                  >
                    New Analysis
                  </Button>
                  <Badge
                    variant="outline"
                    style={{
                      backgroundColor: "#111111",
                      color: "#facc15",
                      borderColor: "#262626",
                    }}
                  >
                    {analysisResult.status}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
