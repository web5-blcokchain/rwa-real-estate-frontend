import { TanStackQueryDevtools, TanStackRouterDevtools } from '@/components/provider/tanstack-devtools'
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'

interface RootRouteContext {

}

export const Route = createRootRouteWithContext<RootRouteContext>()({
  component: () => (
    <>
      <Outlet />
      <TanStackRouterDevtools />
      <TanStackQueryDevtools />
    </>
  )
})
