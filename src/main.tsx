import { QueryClientProvider } from '@tanstack/react-query';
import { createRoot } from 'react-dom/client';
import { ErrorBoundary } from 'react-error-boundary';
import { Provider } from 'react-redux';

import { store } from '@/store';

import './plugins/assets';
import App from './App.tsx';
import FallbackRender from './components/ErrorBoundary.tsx';
import { globalConfig } from './config.ts';
import { setupI18n } from './locales';
import { setupAppVersionNotification, setupDayjs, setupIconifyOffline, setupNProgress } from './plugins';
import { fetchGetUserInfo } from './service/api/auth.ts';
import { QUERY_KEYS } from './service/keys/index.ts';
import { queryClient } from './service/queryClient';
import { themeSettings } from './theme/settings.ts';
import { localStg } from './utils/storage.ts';

function initGlobalConfig() {
  /** - 初始化默认主题颜色 */
  globalConfig.defaultThemeColor = localStg.get('themeColor') || themeSettings.themeColor;

  /** - 初始化默认语言 */
  globalConfig.defaultLang = localStg.get('lang') || globalConfig.defaultLang;

  /** - 初始化默认暗色模式 */
  globalConfig.defaultDarkMode = localStg.get('darkMode') || globalConfig.defaultDarkMode;
}

const hasToken = Boolean(localStg.get('token'));

function setupApp() {
  initGlobalConfig();

  setupI18n();

  const container = document.getElementById('root');

  if (!container) return;

  const root = createRoot(container);

  if (hasToken) {
    queryClient.prefetchQuery({
      queryFn: fetchGetUserInfo,
      queryKey: QUERY_KEYS.AUTH.USER_INFO
    });
  }

  root.render(
    <ErrorBoundary fallbackRender={FallbackRender}>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </Provider>
    </ErrorBoundary>
  );

  setupNProgress();

  setupIconifyOffline();

  setupDayjs();

  setupAppVersionNotification();
}

setupApp();
