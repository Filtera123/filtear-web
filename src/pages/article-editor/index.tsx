import { Grid } from '@mui/material';
import Aside from './Aside';
import Editor from './Editor';
import Sidebar from './Sidebar';

export default function ArticleEditor() {
  // TODO: 通过 id 获取文章数据
  // const params = useParams();

  return (
    <Grid
      className=" px-32 py-12 h-screen overflow-hidden overflow-y-auto relative"
      container
      spacing={2}
    >
      <Grid className="sticky top-0 border-r h-full border-gray-300" size="grow">
        <Sidebar />
      </Grid>

      <Grid
        size={{
          xs: 12,
          sm: 12,
          md: 8,
          lg: 8,
          xl: 8,
        }}
      >
        <Editor />
      </Grid>

      <Grid className="sticky top-0 h-full border-l border-gray-300" size="grow">
        <Aside />
      </Grid>
    </Grid>
  );
}