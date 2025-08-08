import { NewsList } from '@/components/news/newsList'
import { createLazyFileRoute } from '@tanstack/react-router'
import './index.scss'

export const Route = createLazyFileRoute('/_app/news/')({
  component: RouteComponent
})

function RouteComponent() {
  return (
    <NewsList />
  )
}
