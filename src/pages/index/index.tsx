import { SignedIn, SignedOut } from '@clerk/clerk-react'
import MastodonIcon from '@/components/icons/mastodon.tsx'
import ConnectionIcon from '@/components/icons/connection.tsx'
import BlueskyIcon from '@/components/icons/bluesky.tsx'
import BlogIcon from '@/components/icons/blog.tsx'
import LinkedInIcon from '@/components/icons/linkedin.tsx'

export default function IndexPage() {
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
            <div className="card">
              <MastodonIcon />
              <p>
                <em>@user@mastodon.social</em>
                <br />
                Hello world! I am now using Sociabli to cross post my content to Bluesky.
              </p>
            </div>

            <ConnectionIcon />

            <div className="card">
              <BlueskyIcon />
              <p>
                <em>user.bsky.social</em>
                <br />
                Hello world! I am now using Sociabli to cross post my content to Bluesky.
              </p>
            </div>
          </div>
        </section>

        {/*<section>*/}
        {/*  <h3>Your Blog to Medium</h3>*/}
        {/*    Publish your blog posts on Medium. Sociabli enables you to define which of your blog*/}
        {/*    posts should be cross posted to medium.com. Simply install the Sociabli plugin for your*/}
        {/*    CMS and connect it to Medium. We will take care of canonical links and other details, so*/}
        {/*    that you won't run into duplicate content on Google and other search engines.*/}
        {/*  </p>*/}

        {/*  <div className="flow">*/}
        {/*    <div className="card">*/}
        {/*      <BlogIcon />*/}
        {/*      <p className="service">Your blog</p>*/}
        {/*    </div>*/}

        {/*    <svg*/}
        {/*      xmlns="http://www.w3.org/2000/svg"*/}
        {/*      viewBox="0 0 24 24"*/}
        {/*      fill="currentColor"*/}
        {/*      className="connection"*/}
        {/*    >*/}
        {/*      <path d="M19.1642 12L12.9571 5.79291L11.5429 7.20712L16.3358 12L11.5429 16.7929L12.9571 18.2071L19.1642 12ZM13.5143 12L7.30722 5.79291L5.89301 7.20712L10.6859 12L5.89301 16.7929L7.30722 18.2071L13.5143 12Z"></path>*/}
        {/*    </svg>*/}

        {/*    <div className="card">*/}
        {/*      <MediumIcon />*/}
        {/*      <p className="service">Medium</p>*/}
        {/*    </div>*/}
        {/*  </div>*/}
        {/*</section>*/}

        <section>
          <h3>More flows will come!</h3>
          <p className="description">
            We're just starting! Sociabli is currently running in a beta test mode and we are
            working on more flows to enable you to connect even more services. Sign up for free now,
            to join our beta. We will add more flows over the time.
          </p>

          <div className="flow">
            <div className="card">
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

            <div className="card">
              <MastodonIcon />
              <p className="service">Mastodon</p>
            </div>
          </div>

          <div className="flow">
            <div className="card">
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

            <div className="card">
              <LinkedInIcon />
              <p className="service">LinkedIn</p>
            </div>
          </div>

          <div className="flow dimmed">
            <div className="card">
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

            <div className="card">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM7 12H9C9 13.6569 10.3431 15 12 15C13.6569 15 15 13.6569 15 12H17C17 14.7614 14.7614 17 12 17C9.23858 17 7 14.7614 7 12Z"></path>
              </svg>
              <p className="service">. . . </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
