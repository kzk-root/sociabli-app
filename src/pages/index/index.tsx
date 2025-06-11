import { SignedIn, SignedOut } from '@clerk/clerk-react'
import MastodonIcon from '@/components/icons/mastodon.tsx'
import ConnectionIcon from '@/components/icons/connection.tsx'
import BlueskyIcon from '@/components/icons/bluesky.tsx'
import BlogIcon from '@/components/icons/blog.tsx'
import LinkedInIcon from '@/components/icons/linkedin.tsx'
import { useEffect, useState } from 'react'

export default function IndexPage() {
  const [recentPosts, setRecentPosts] = useState([])

  const getRecentPosts = async () => {
    const response = await fetch(
      'https://mastodon.social/api/v1/accounts/113514326644185172/statuses',
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      }
    )
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
    return await response.json()
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getRecentPosts()

        const posts = data
          .filter((post: any) => post.in_reply_to_id === null)
          .map((post: any) => {
            const date = new Date(post.created_at)
            const createdAt = date.toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })

            return {
              id: post.id,
              content: post.content,
              createdAt: createdAt,
              url: post.url,
            }
          })

        setRecentPosts(posts.slice(-5))
      } catch (error) {
        console.error('Error fetching recent posts:', error)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="home">
      <div className="container">
        <header>
          <img src="/sociabli.svg" alt="Sociabli" />
          <h1>Sociabli</h1>
        </header>

        <p className="description-md">
          <strong>Sociabli</strong> helps you to share your content online. Post once and let
          Sociabli sync to other services and platforms. Right now Sociabli can use your Blog and
          Mastodon account as sources, but we are working on more!
        </p>

        <p className="centered sticky">
          <SignedIn>
            <a href="/dashboard" className="btn btn-primary">
              Open Dashboard
            </a>
          </SignedIn>
          <SignedOut>
            <a href="/sign-up" className="btn btn-primary">
              Join beta phase
            </a>
          </SignedOut>
        </p>
        <section>
          <h3>Cross post from Mastodon to Bluesky</h3>
          <p className="description">
            Connect your Mastodon account with Bluesky. Sociabli will cross post all your Mastodon
            posts to Bluesky, we will even scale and upload images. We will filter out things like
            replies so you don't clutter your Bluesky timeline with irrelevant posts.
          </p>

          <div className="flow">
            <div className="card-base flow-connection">
              <MastodonIcon />
              <p>
                <em>@user@mastodon.social</em>
                <br />
                Hello world! I am now using Sociabli to cross post my content to Bluesky.
              </p>
            </div>

            <ConnectionIcon />

            <div className="card-base flow-connection">
              <BlueskyIcon />
              <p>
                <em>user.bsky.social</em>
                <br />
                Hello world! I am now using Sociabli to cross post my content to Bluesky.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h3>More flows will come!</h3>
          <p className="description">
            We're just starting! Sociabli is currently running in a beta test mode and we are
            working on more flows to enable you to connect even more services. Sign up for free now,
            to join our beta. We will add more flows over the time.
          </p>

          <div className="flow">
            <div className="card-base  flow-connection">
              <BlueskyIcon />
              <p className="service">Bluesky</p>
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="connection"
            >
              <path d="M19.1642 12L12.9571 5.79291L11.5429 7.20712L16.3358 12L11.5429 16.7929L12.9571 18.2071L19.1642 12ZM13.5143 12L7.30722 5.79291L5.89301 7.20712L10.6859 12L5.89301 16.7929L7.30722 18.2071L13.5143 12Z"></path>
            </svg>

            <div className="card-base  flow-connection">
              <MastodonIcon />
              <p className="service">Mastodon</p>
            </div>
          </div>

          <div className="flow">
            <div className="card-base  flow-connection">
              <BlogIcon />
              <p className="service">Your blog</p>
            </div>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="connection"
            >
              <path d="M19.1642 12L12.9571 5.79291L11.5429 7.20712L16.3358 12L11.5429 16.7929L12.9571 18.2071L19.1642 12ZM13.5143 12L7.30722 5.79291L5.89301 7.20712L10.6859 12L5.89301 16.7929L7.30722 18.2071L13.5143 12Z"></path>
            </svg>

            <div className="card-base  flow-connection">
              <LinkedInIcon />
              <p className="service">LinkedIn</p>
            </div>
          </div>

          <div className="flow dimmed">
            <div className="card-base  flow-connection">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="blog"
              >
                <path d="M2 4C2 3.44772 2.44772 3 3 3H21C21.5523 3 22 3.44772 22 4V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V4ZM4 5V19H20V5H4ZM6 7H12V13H6V7ZM8 9V11H10V9H8ZM14 9H18V7H14V9ZM18 13H14V11H18V13ZM6 15V17L18 17V15L6 15Z"></path>
              </svg>

              <p className="service">. . .</p>
            </div>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="connection"
            >
              <path d="M19.1642 12L12.9571 5.79291L11.5429 7.20712L16.3358 12L11.5429 16.7929L12.9571 18.2071L19.1642 12ZM13.5143 12L7.30722 5.79291L5.89301 7.20712L10.6859 12L5.89301 16.7929L7.30722 18.2071L13.5143 12Z"></path>
            </svg>

            <div className="card-base  flow-connection">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM7 12H9C9 13.6569 10.3431 15 12 15C13.6569 15 15 13.6569 15 12H17C17 14.7614 14.7614 17 12 17C9.23858 17 7 14.7614 7 12Z"></path>
              </svg>
              <p className="service">. . . </p>
            </div>
          </div>
        </section>
      </div>
      <section id="about" className="container">
        <div className="about">
          <div>
            <h4>The Sociabli Team</h4>
            <p className={'description'}>
              Sociabli is a project by <strong>Mark</strong> and <strong>Maurice</strong>. We are
              software architects and developers from Hamburg.
            </p>
            <div className={'card-base profile'}>
              <img src={'/mark.webp'} alt="Mark" />
              <div>
                <p>
                  <strong>Hi, I'm Mark</strong>. I'm a software architect & developer. I plan
                  event-driven applications as an architect, as a full stack developer I write the
                  frontend and backend code.
                </p>
                <p className={'links'}>
                  <span className="socials">
                    <a href={'https://yadl.info'} target={'_blank'} rel="noopener noreferrer">
                      <BlogIcon />
                    </a>{' '}
                    <a
                      href={'https://mastodon.social/@mark_schmeiser'}
                      target={'_blank'}
                      rel="noopener noreferrer"
                    >
                      <MastodonIcon />
                    </a>{' '}
                    <a
                      href={'https://bsky.app/profile/mark-schmeiser.bsky.social'}
                      target={'_blank'}
                      rel="noopener noreferrer"
                    >
                      <BlueskyIcon />
                    </a>
                  </span>
                </p>
              </div>
            </div>
            <div className={'card-base profile'}>
              <img src={'/maurice-profile.png'} alt="Maurice" />
              <div>
                <p>
                  <strong>Hi, I'm Maurice</strong>. I walk the border between two worlds, dealing
                  with technologies and the IndieWeb on the one hand and with media and online
                  publishing on the other.
                </p>
                <p className={'links'}>
                  <span className="socials">
                    <a
                      href={'https://maurice-renck.de'}
                      target={'_blank'}
                      rel="noopener noreferrer"
                    >
                      <BlogIcon />
                    </a>{' '}
                    <a
                      href={'https://mastodon.online/mauricerenck'}
                      target={'_blank'}
                      rel="noopener noreferrer"
                    >
                      <MastodonIcon />
                    </a>{' '}
                    <a
                      href={'https://bsky.app/profile/mauricerenck.de'}
                      target={'_blank'}
                      rel="noopener noreferrer"
                    >
                      <BlueskyIcon />
                    </a>
                  </span>
                </p>
              </div>
            </div>
          </div>
          <div className={'recent-posts'}>
            <h4>Recent updates</h4>
            <p className="description">
              Follow us on <a href={'https://mastodon.social/@sociabli'}>Mastodon</a> or{' '}
              <a href={'https://bsky.app/profile/sociab.li'}>Bluesky</a> to get the latest updates
              about Sociabli.
            </p>
            <ul>
              {recentPosts.map((post: any) => (
                <li key={post.id}>
                  <p dangerouslySetInnerHTML={{ __html: post.content }} />

                  <div className="meta">
                    <a href={post.url} target="_blank" rel="noopener noreferrer">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M18.3638 15.5355L16.9496 14.1213L18.3638 12.7071C20.3164 10.7545 20.3164 7.58866 18.3638 5.63604C16.4112 3.68341 13.2453 3.68341 11.2927 5.63604L9.87849 7.05025L8.46428 5.63604L9.87849 4.22182C12.6122 1.48815 17.0443 1.48815 19.778 4.22182C22.5117 6.95549 22.5117 11.3876 19.778 14.1213L18.3638 15.5355ZM15.5353 18.364L14.1211 19.7782C11.3875 22.5118 6.95531 22.5118 4.22164 19.7782C1.48797 17.0445 1.48797 12.6123 4.22164 9.87868L5.63585 8.46446L7.05007 9.87868L5.63585 11.2929C3.68323 13.2455 3.68323 16.4113 5.63585 18.364C7.58847 20.3166 10.7543 20.3166 12.7069 18.364L14.1211 16.9497L15.5353 18.364ZM14.8282 7.75736L16.2425 9.17157L9.17139 16.2426L7.75717 14.8284L14.8282 7.75736Z"></path>
                      </svg>
                    </a>
                    <span>{post.createdAt}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
      <script src='https://storage.ko-fi.com/cdn/scripts/overlay-widget.js'></script>
        <script>
          kofiWidgetOverlay.draw('sociabli', {
            'type': 'floating-chat',
            'floating-chat.donateButton.text': 'Support Us',
            'floating-chat.donateButton.background-color': '#f98a29',
            'floating-chat.donateButton.text-color': '#ffffff'
          });
        </script>
    </div>
  )
}
