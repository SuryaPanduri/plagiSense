import { Box, Typography } from "@mui/material";

export default function BrandLogo({ size = 28, stacked = false, align = "center" }) {
  return (
    <Box display="flex" alignItems="center" justifyContent={align} gap={1}>
      <svg width={size} height={size} viewBox="0 0 32 32" aria-label="plagiSense logo">
        <defs>
          <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0" stopColor="#22C55E" />
            <stop offset="1" stopColor="#16A34A" />
          </linearGradient>
        </defs>
        <path
          d="M16 3c6.6 0 12 5.4 12 12s-5.4 12-12 12h-4a2 2 0 0 1-2-2V7a4 4 0 0 1 4-4h2zM12 12v9h4a9 9 0 1 0 0-18h-2a3 3 0 0 0-3 3z"
          fill="url(#g)"
        />
      </svg>
      {!stacked && (
        <Typography variant="h5" sx={{ letterSpacing: 0.3, fontWeight: 800 }}>
          plagiSense
        </Typography>
      )}
    </Box>
  );
}
