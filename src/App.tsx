import { QueryClientProvider } from '@tanstack/react-query';

import { RouterProvider } from '@/features/router';

import { LazyAnimate } from './features/animate';
import { AntdContextHolder, AntdProvider } from './features/antdConfig';
import { LangProvider } from './features/lang';
import { ThemeProvider } from './features/theme';
import { queryClient } from './service/queryClient';

const App = () => (
  <ThemeProvider>
    <QueryClientProvider client={queryClient}>
      <LangProvider>
        <AntdProvider>
          <AntdContextHolder>
            <LazyAnimate>
              <RouterProvider />
            </LazyAnimate>
          </AntdContextHolder>
        </AntdProvider>
      </LangProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
