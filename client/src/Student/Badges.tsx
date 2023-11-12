import { Box, Grid, Typography } from '@mui/material';

export default function Badges() {
    return (
        <Box sx={{ width: '100%', height: '100%', border: '1px solid black', borderRadius: '10px', padding: '16px' }}>
            <Typography variant="h6" fontWeight={700}>
                Badges
            </Typography>
            <Grid container spacing={2}>
                <Grid container item xs={12} spacing={3}>
                    <Grid item xs>
                        <img src="first_session.svg" alt="" />
                    </Grid>
                    <Grid item xs>
                        <img src="ten_sessions.svg" alt="" />
                    </Grid>
                </Grid>
                <Grid container item xs={12} spacing={3}>
                    <Grid item xs>
                        <img src="ten_sessions.svg" alt="" />
                    </Grid>
                </Grid>
            </Grid>
        </Box>
    )
}