import { ErrorPage } from '@/components/common/error-page'
import { createRouter, RouterProvider } from '@tanstack/react-router'
import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { AppProviders } from './components/provider'

import { routeTree } from './routeTree.gen'
import '@ant-design/v5-patch-for-react-19'
import '@unocss/reset/tailwind-compat.css'
import './globals.scss'
import 'virtual:uno.css'
import '@fontsource-variable/inter'
import '@fontsource-variable/jetbrains-mono'
import 'virtual:svg-icons-register'

window.Buffer = Buffer

// Document: https://tanstack.com/router/latest/docs/framework/react/guide/route-trees
export const router = createRouter({
  routeTree,
  context: {
    miniAppRaw: undefined! // We'll set this in React-land
  },
  defaultNotFoundComponent: () => {
    return <ErrorPage />
  }
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

// Render the app
const rootElement = document.getElementById('root')!
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <AppProviders>
        <AppRouter />
      </AppProviders>
    </StrictMode>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
function AppRouter() {
  return (
    <RouterProvider
      router={router}
      context={{
      }}
    />
  )
}
