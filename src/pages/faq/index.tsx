export default function FaqPage() {
  return (
    <div className="container text-only-page">
      <h1>FAQ</h1>

      <h2>General</h2>
      <details className="faq animated-details">
        <summary>Can anybody use this service?</summary>
        <div>
          <p>
            <strong>No!</strong> To ensure a safe, respectful, and inclusive environment, we do not
            allow to use Sociabli for the following types of content:
          </p>
          <ul>
            <li>
              <strong>Hate speech and racism:</strong> Any form of content promoting racism,
              discrimination, or violence against individuals or groups based on race, ethnicity, or
              nationality.
            </li>
            <li>
              <strong>Fake news or fake information:</strong> Any form of content spreading
              misinformation.
            </li>
            <li>
              <strong>Harassment and mobbing:</strong> Content that targets individuals or groups
              for bullying, harassment, or abuse.
            </li>
            <li>
              <strong>Conspiracy theories:</strong> Content that spreads misinformation or promotes
              harmful conspiracy theories.
            </li>
            <li>
              <strong>Discrimination:</strong> Content that degrades, insults, or promotes harm
              against any human or undermines human's rights.
            </li>
            <li>
              <strong>Discrimination against LGBTQ+ individuals:</strong> Content that promotes hate
              or discrimination against individuals based on their sexual orientation, gender
              identity, or expression.
            </li>
          </ul>

          <p>
            We reserve the right to suspend or terminate accounts involved in such activities. By
            using our service, you agree to adhere to these rules to help foster a positive
            community.
          </p>
        </div>
      </details>
      <details className="faq animated-details">
        <summary>How can I cross post to X/Twitter</summary>
        <div>
          <p>
            You cannot. We will <strong>not</strong> support X/Twitter as we do not want to support
            this platform in any ways.
          </p>
        </div>
      </details>
      <details className="faq animated-details">
        <summary>Why is my favorite service not supported?</summary>
        <div>
          <p>
            We are working on more flows. If you have any recommendations, please get in touch with
            us.
          </p>
        </div>
      </details>
      <details className="faq animated-details">
        <summary>What are the WebhookId and token?</summary>
        <div>
          <p>
            In order to trigger cross posting from your website, you have to call our webhook. In
            order to do so, you have to use your personal Webhook, identified by the webhookId. To
            make sure, it's really you calling the webhook, you also have to send your personal
            token.
          </p>
          <p>Both can be found on your account page.</p>
        </div>
      </details>
      <details className="faq animated-details">
        <summary>There is no Sociabli Plugin for my CMS</summary>
        <div>
          We are working on supporting more CMS. Please let us know, which one you are using.
        </div>
      </details>

      <h2>Mastodon</h2>
      <details className="faq animated-details">
        <summary>What is my Mastodon Instance?</summary>
        <div>
          <p>
            This is the server you created your account on. Most popular are servers like
            mastodon.social or mastodon.online. It's basically the URL you use to post and read.
          </p>
        </div>
      </details>

      <details className="faq animated-details">
        <summary>What is my Mastodon Handle?</summary>
        <div>
          <p>
            You can find your handle on many parts of the Mastodon website, for example your profile
            page. It looks something like <code>@username</code>. <strong>Do not</strong> use the
            full URL or instance (<code>@username@instance</code>) when configuring your Mastodon
            account on Sociabli! Simply use the handle only.
          </p>
        </div>
      </details>

      <h2>Bluesky</h2>
      <details className="faq animated-details">
        <summary>Where do I find my Bluesky handle?</summary>
        <div>
          <p>
            Log in to Bluesky, open your profile. You will find your handle right below your name.
            It looks like: <code>@USERNAME.bsky.social</code>.
          </p>
        </div>
      </details>

      <details className="faq animated-details">
        <summary>Where do I find my Bluesky token?</summary>
        <div>
          <p>
            Log in to your Bluesky account. Go to <code>Settings</code>,{' '}
            <code>Privacy and Security</code>,{' '}
            <code>
              <a href="https://bsky.app/settings/app-passwords">App Passwords</a>
            </code>
            . Create a new password and use it as your token.
          </p>
        </div>
      </details>

      <details className="faq animated-details">
        <summary>Why can't I see my Mastodon replies?</summary>
        <div>
          <p>
            We filter out things like replies, because they won't make any sense on Bluesky as the
            users may not exist and cannot be mapped.
          </p>
        </div>
      </details>

      <details className="faq animated-details">
        <summary>How fast is the sync process?</summary>
        <div>
          <p>
            We will process all incoming posts in intervals. It might take up to 3 minutes to be
            synced, depending on the amount of posts in the queue.
          </p>
        </div>
      </details>

      <h2>Medium</h2>
      <details className="faq animated-details">
        <summary>Where is the medium flow gone?</summary>
        <div>
          <p>
            Unfortunately, we had to remove the Medium flow due to changes in the Medium API. Medium
            closed it down, only manual posting and importing is possible. We are working on a
            solution but we are not sure if we can provide one.
          </p>
        </div>
      </details>
      <details className="faq animated-details">
        <summary>Where do I find my Medium token?</summary>
        <div>
          <p>
            Click on your avatar, in the menu open{' '}
            <a href="https://medium.com/me/settings">settings</a>. Switch to the{' '}
            <a href="https://medium.com/me/settings/security">security tab</a>, you will find
            "Integration tokens" on the bottom of the page. Click on it and create a new one.
          </p>
        </div>
      </details>

      {/*<details className="faq animated-details">*/}
      {/*  <summary>How do I use my CMS to cross post?</summary>*/}
      {/*  <div>*/}
      {/*    <p>*/}
      {/*      The easiest way is to use one of our plugins which are available for different CMS. You*/}
      {/*      can find links to them on your account page.*/}
      {/*    </p>*/}
      {/*    <p>*/}
      {/*      If there is no plugin for your CMS or static site generator, please get in touch with*/}
      {/*      us. You may also use our webhook directly.*/}
      {/*    </p>*/}
      {/*  </div>*/}
      {/*</details>*/}
    </div>
  )
}
