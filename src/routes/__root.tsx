import { TanStackRouterDevtools } from '@/components/provider/tanstack-devtools'
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'

interface RootRouteContext {
  search: {
    id?: string
    propertyId?: string
  }
}

export const Route = createRootRouteWithContext<RootRouteContext>()({
  component: () => (
    <>
      <Outlet />
      <TanStackRouterDevtools />
      {/* <TanStackQueryDevtools /> */}
    </>
  )
})
