import { Grid } from '@mui/material';
import Aside from './Aside';
import Editor from './Editor';
import Sidebar from './Sidebar';

export default function ArticleEditor() {
  return (
    <Grid className="h-screen px-32 py-6" container spacing={2}>
      <Grid size="grow">
        <Sidebar />
      </Grid>

      <Grid
        size={{
          xs: 12,
          sm: 12,
          md: 6,
          lg: 6,
          xl: 6,
        }}
      >
        <Editor />
      </Grid>

      <Grid size="grow">
        <Aside />
      </Grid>
    </Grid>
  );
}
