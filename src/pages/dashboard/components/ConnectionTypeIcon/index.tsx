import MastodonIcon from '@/components/icons/mastodon.tsx'
import BlueskyIcon from '@/components/icons/bluesky.tsx'
import MediumIcon from '@/components/icons/medium.tsx'
import BlogIcon from '@/components/icons/blog.tsx'

interface Props {
  connectionType: string
}
export const ConnectionTypeIcon = ({ connectionType }: Props) => {
  if (!connectionType) return null

  switch (connectionType) {
    case 'mastodon':
      return <MastodonIcon />
    case 'bluesky':
      return <BlueskyIcon />
    case 'medium':
      return <MediumIcon />
    case 'blog':
      return <BlogIcon />
    default:
      return null
  }
}
