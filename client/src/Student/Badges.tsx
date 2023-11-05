import { Box, Grid, Typography } from "@mui/material";

export default function Badges() {
    return (
        <Box sx={{ width: '100%', height: '100%', border: '1px solid black', borderRadius: '10px', padding: '16px' }}>
            <Typography variant="h6" fontWeight={700}>
                Badges
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={8}>

                </Grid>
                <Grid item xs={4}>

                </Grid>
                <Grid item xs={4}>

                </Grid>
                <Grid item xs={8}>

                </Grid>
            </Grid>
        </Box>
    )
}