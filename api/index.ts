import express from "express";
import axios from "axios";

const app = express();
const API_BASE_URL = "http://43.225.52.40:81";

app.use(express.json());

// Proxy API requests to the biometric device API
app.all("*", async (req, res) => {
  try {
    // Handle both /api/biometric/... and /... formats
    const targetPath = req.url.replace(/^\/api\/biometric/, '');
    const url = `${API_BASE_URL}${targetPath}`;
    
    const headers: any = {
      ...req.headers,
      host: undefined,
      origin: undefined,
      referer: undefined,
    };

    if (req.headers.authorization) {
      headers['Authorization'] = req.headers.authorization;
      delete headers.authorization;
    }

    const response = await axios({
      method: req.method,
      url: url,
      data: req.body,
      headers: headers,
    });
    res.status(response.status).json(response.data);
  } catch (error: any) {
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

export default app;
