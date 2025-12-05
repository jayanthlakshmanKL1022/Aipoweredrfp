import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Chip,
  Divider,
  IconButton,
  Collapse,
  List,
  ListItem,
  ListItemText,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  BarChart,
  Bar,
} from "recharts";

import { GoogleGenAI } from "@google/genai";
const GEMINI_API_KEY = "AIzaSyBmCOuyRqLi-o0TUNQTaCxiYoU_E7N1eLY";
const ScoreBar = ({ data }: { data: any[] }) => {
  if (!data || data.length === 0) return <Typography>No comparison data</Typography>;
  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="score" fill="#4caf50" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

const PriceLine = ({ data, keys }: { data: any[]; keys: string[] }) => {
  if (!data || data.length === 0 || !keys || keys.length === 0)
    return <Typography>No trend available</Typography>;

  return (
    <ResponsiveContainer width="100%" height={240}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend />
        {keys.map((k, i) => (
          <Line
            key={k}
            type="monotone"
            dataKey={k}
            stroke={i === 0 ? "#1976d2" : "#ff7f50"}
            strokeWidth={2}
            dot={{ r: 2 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
};

const SentimentBar = ({ data }: { data: Record<string, number> | null }) => {
  if (!data) return <Typography>No sentiment data</Typography>;
  const formatted = Object.keys(data).map((k) => ({ name: k, sentiment: Number(data[k]) }));
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={formatted}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis domain={[-1, 1]} />
        <Tooltip />
        <Bar dataKey="sentiment" fill="#9c27b0" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

const BulkProposals: React.FC = () => {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [analyseOpen, setAnalyseOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any | null>(null);
  const [analyseLoading, setAnalyseLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any | null>(null);
  const [analyseError, setAnalyseError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch("http://localhost:5000/email/bulkproposals");
        const data = await res.json();
        setRecords(data.records || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load proposals");
      }
      setLoading(false);
    };

    loadData();
  }, []);

  const getStatusColor = (record: any) => {
    const total = record.vendors?.length || 0;
    const replied = record.replies?.length || 0;
    if (replied === 0) return "error";
    if (replied === total) return "success";
    return "warning";
  };

  const getStatusLabel = (record: any) => {
    const total = record.vendors?.length || 0;
    const replied = record.replies?.length || 0;
    if (replied === 0) return "Not Started";
    if (replied === total) return "Completed";
    return "In Progress";
  };

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );

  if (error)
    return (
      <Typography color="error" sx={{ textAlign: "center", mt: 5 }}>
        {error}
      </Typography>
    );
  const handleAnalyse = async (record: any) => {
    setSelectedRecord(record);
    setAnalysisResult(null);
    setAnalyseError("");
    setAnalyseOpen(true);

    // Build prompt: include replies and vendors
    const repliesText =
      (record.replies || [])
        .map((r: any) => `Vendor: ${r.name}\nReply: ${r.reply}`)
        .join("\n\n") || "No replies";

    const vendorsText =
      (record.vendors || []).map((v: any) => `${v.name} | ${v.email}`).join("\n") || "";

    const prompt = `
You are an expert market analyst and procurement specialist in 2025.
Analyze the following vendor replies & vendor details for the order.
Use current market trends and procurement best practices to produce a structured analysis.

OrderName: ${record.orderName}

Vendor List:
${vendorsText}

Vendor Replies:
${repliesText}

Return STRICT VALID JSON ONLY with the following structure:
{
  "summary": "short executive summary (2-4 sentences)",
  "recommendation": "clear recommendation (1-3 sentences)",
  "alternatives": "2 short alternative approaches",
  "insights": ["concise bullet insight 1","insight 2"],
  "scoreComparison": [ {"name":"Vendor A","score":75}, {"name":"Vendor B","score":68} ],
  "priceTrend": [ {"month":"Oct","vendorA":700,"vendorB":650}, {"month":"Nov","vendorA":720,"vendorB":670} ],
  "priceKeys": ["vendorA","vendorB"],
  "sentiment": { "Vendor A":0.6, "Vendor B":-0.1 }
}
Notes:
- Scores 0-100 (higher is better).
- priceTrend should reflect hypothetical recent market pricing for comparable items.
- Keep JSON valid only, no extra text.
`;

    setAnalyseLoading(true);
    setAnalyseError("");

    try {
      const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
      const resp = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      let text: string | undefined = undefined;
      if (typeof resp?.text === "string") text = resp.text;
      if (!text && resp?.output && Array.isArray(resp.output) && resp.output[0]?.content) {
        text = resp.output[0].content?.text;
      }
      // fallback
      text = (text || "").trim();

      if (!text) {
        throw new Error("Empty response from Gemini");
      }

      const cleaned = text.replace(/```json/gi, "").replace(/```/g, "").trim();

      const parsed = JSON.parse(cleaned);
      if (!parsed.priceKeys && parsed.priceTrend && parsed.priceTrend.length > 0) {
        const first = parsed.priceTrend[0];
        parsed.priceKeys = Object.keys(first).filter((k: string) => k !== "month");
      }

      setAnalysisResult(parsed);
    } catch (err: any) {
      console.error("Analysis error:", err);
      setAnalyseError(err?.message || "Failed to generate analysis");
    } finally {
      setAnalyseLoading(false);
    }
  };

  const closeAnalyse = () => {
    setAnalyseOpen(false);
    setSelectedRecord(null);
    setAnalysisResult(null);
    setAnalyseError("");
  };

  // Replies renderer
  const RepliesBox = ({ replies }: { replies: any[] }) => {
    if (!replies || replies.length === 0)
      return (
        <Paper sx={{ p: 2, mb: 2 }}>
          <Typography>No vendor replies available.</Typography>
        </Paper>
      );

    return (
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mb: 2 }}>
        {replies.map((r: any, i: number) => (
          <Paper key={i} sx={{ p: 2 }}>
            <Typography fontWeight={700}>{r.name}</Typography>
            <Typography color="text.secondary" sx={{ mt: 1, whiteSpace: "pre-wrap" }}>
              {r.reply}
            </Typography>
          </Paper>
        ))}
      </Box>
    );
  };

  return (
    <Box sx={{ mt: 5, overflowX: "hidden" }}>
      <Typography variant="h4" fontWeight={700} sx={{ mb: 3 }}>
        Bulk RFP Proposals
      </Typography>

      {records.length === 0 && (
        <Typography sx={{ textAlign: "center", mt: 5 }}>No bulk proposals found.</Typography>
      )}

      {records.map((record: any) => (
        <Card
          key={record._id}
          sx={{
            mb: 3,
            p: 2,
            borderRadius: 3,
            background: "#fafafa",
            boxShadow: 3,
          }}
        >
          <CardContent>
            {/* HEADER */}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography variant="h6" fontWeight={600}>
                {record.orderName}
              </Typography>

              <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                <Chip label={getStatusLabel(record)} color={getStatusColor(record)} sx={{ fontWeight: 600 }} />

                <Button
                  variant="contained"
                  size="small"
                  sx={{ backgroundColor: "green", textTransform: "none", "&:hover": { backgroundColor: "darkgreen" } }}
                  onClick={() => handleAnalyse(record)}
                >
                  Analyze with AI
                </Button>
              </Box>
            </Box>

            {/* SUBJECT */}
            <Typography sx={{ mt: 1, color: "gray" }}>Subject: {record.Subject}</Typography>

            {/* COUNTS */}
            <Typography sx={{ mt: 0.5, color: "gray" }}>
              Vendors: <strong>{record.vendors?.length || 0}</strong> | Replies: <strong>{record.replies?.length || 0}</strong>
            </Typography>

            <Divider sx={{ my: 2 }} />

           
            <Box sx={{ textAlign: "right" }}>
              <IconButton onClick={() => setExpanded(expanded === record._id ? null : record._id)}>
                <ExpandMoreIcon sx={{ transform: expanded === record._id ? "rotate(180deg)" : "rotate(0)", transition: "0.3s" }} />
              </IconButton>
            </Box>

            <Collapse in={expanded === record._id}>
              <Typography variant="subtitle1" sx={{ mt: 1, mb: 1 }}>
                Vendors
              </Typography>

              <List dense>
                {record.vendors?.map((v: any, idx: number) => (
                  <ListItem key={idx}>
                    <ListItemText primary={`${v.name}`} secondary={v.email} />
                  </ListItem>
                ))}
              </List>

              <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
                Replies
              </Typography>

              <List dense>
                {record.replies?.length > 0 ? (
                  record.replies.map((r: any, idx: number) => (
                    <ListItem key={idx}>
                      <ListItemText primary={r.name} secondary={r.reply} />
                    </ListItem>
                  ))
                ) : (
                  <Box sx={{ textAlign: "center", py: 2 }}>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      No replies yet
                    </Typography>
                    <Button variant="contained" color="primary" size="small" onClick={() => handleAnalyse(record)} sx={{ textTransform: "none" }}>
                      Analyze with AI
                    </Button>
                  </Box>
                )}
              </List>
            </Collapse>
          </CardContent>
        </Card>
      ))}


      <Dialog open={analyseOpen} onClose={closeAnalyse} maxWidth="lg" fullWidth scroll="paper">
        <DialogTitle>AI Analysis — {selectedRecord?.orderName}</DialogTitle>
        <DialogContent dividers>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Vendor Replies
          </Typography>

          <RepliesBox replies={selectedRecord?.replies || []} />

          <Divider sx={{ my: 2 }} />

          {analyseLoading && (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress />
            </Box>
          )}

          {analyseError && (
            <Typography color="error" sx={{ mb: 2 }}>
              {analyseError}
            </Typography>
          )}

          {analysisResult && (
            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 440px", gap: 3 }}>
              <Box>
                <Paper sx={{ p: 2, mb: 2 }}>
                  <Typography fontWeight={700}>Executive Summary</Typography>
                  <Typography sx={{ mt: 1 }}>{analysisResult.summary}</Typography>
                </Paper>

                <Paper sx={{ p: 2, mb: 2 }}>
                  <Typography fontWeight={700}>Recommendation</Typography>
                  <Typography sx={{ mt: 1 }}>{analysisResult.recommendation}</Typography>
                </Paper>

                <Paper sx={{ p: 2, mb: 2 }}>
                  <Typography fontWeight={700}>Alternatives</Typography>
                  <Typography sx={{ mt: 1 }}>{analysisResult.alternatives}</Typography>
                </Paper>

                {analysisResult.insights?.length > 0 && (
                  <Paper sx={{ p: 2, mb: 2 }}>
                    <Typography fontWeight={700}>Key Insights</Typography>
                    <Box component="ul" sx={{ mt: 1, pl: 3 }}>
                      {analysisResult.insights.map((it: string, i: number) => (
                        <li key={i}>
                          <Typography>{it}</Typography>
                        </li>
                      ))}
                    </Box>
                  </Paper>
                )}
              </Box>

              <Box>
                <Paper sx={{ p: 2, mb: 2 }}>
                  <Typography fontWeight={700}>Score Comparison</Typography>
                  <Box sx={{ mt: 1 }}>{ScoreBar({ data: analysisResult.scoreComparison || [] })}</Box>
                </Paper>

                <Paper sx={{ p: 2, mb: 2 }}>
                  <Typography fontWeight={700}>Price Trend (Market)</Typography>
                  <Box sx={{ mt: 1 }}>
                    <PriceLine data={analysisResult.priceTrend || []} keys={analysisResult.priceKeys || []} />
                  </Box>
                </Paper>

                <Paper sx={{ p: 2 }}>
                  <Typography fontWeight={700}>Sentiment</Typography>
                  <Box sx={{ mt: 1 }}>
                    <SentimentBar data={analysisResult.sentiment || null} />
                  </Box>
                </Paper>
              </Box>
            </Box>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={closeAnalyse}>Close</Button>
          <Button
            onClick={() => {
              if (!analysisResult) return;
              navigator.clipboard.writeText(JSON.stringify(analysisResult, null, 2));
              alert("Analysis copied to clipboard");
            }}
          >
            Copy Analysis
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BulkProposals;
