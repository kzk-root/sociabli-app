export default function IndexPage() {
  return (
    <div className="home">
      <div className="container">
        <header>
          <img src="/sociabli.svg" alt="Sociabli" />
          <h1>Sociabli</h1>
        </header>

         <p className="description-md">
          <strong>Sociabli</strong> helps you to share your content online. Post once
          and let Sociabli sync to other services and platforms. Right now Sociabli can use your Blog and Mastodon account as
          sources, but we are working on more!
        </p>

        <p className="centered">
                <a href="/sign-up" className="btn btn-primary">
          Join beta phase
        </a>
        </p>
        <section>
          <h3>Cross post from Mastodon to Bluesky</h3>
          <p className="description">Connect your Mastodon account with Bluesky. Sociabli will cross post all your Mastodon posts to Bluesky, we will even scale and upload images. We will filter out things like replies so you don't clutter your Bluesky timeline with irrelevant posts.</p>

          <div className="flow">
            <div className="card">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="mastodon"
              >
                <path d="M21.2595 13.9898C20.9852 15.4006 18.8033 16.9446 16.2974 17.2439C14.9907 17.3998 13.7041 17.5431 12.3321 17.4802C10.0885 17.3774 8.31809 16.9446 8.31809 16.9446C8.31809 17.163 8.33156 17.371 8.3585 17.5655C8.65019 19.7797 10.5541 19.9124 12.3576 19.9742C14.1779 20.0365 15.7987 19.5254 15.7987 19.5254L15.8735 21.1711C15.8735 21.1711 14.6003 21.8548 12.3321 21.9805C11.0814 22.0493 9.52849 21.9491 7.71973 21.4703C3.79684 20.432 3.12219 16.2504 3.01896 12.0074C2.98749 10.7477 3.00689 9.55981 3.00689 8.56632C3.00689 4.22771 5.84955 2.95599 5.84955 2.95599C7.2829 2.29772 9.74238 2.0209 12.2993 2H12.3621C14.919 2.0209 17.3801 2.29772 18.8133 2.95599C18.8133 2.95599 21.6559 4.22771 21.6559 8.56632C21.6559 8.56632 21.6916 11.7674 21.2595 13.9898ZM18.3029 8.9029C18.3029 7.82924 18.0295 6.97604 17.4805 6.34482C16.9142 5.71359 16.1726 5.39001 15.2522 5.39001C14.187 5.39001 13.3805 5.79937 12.8473 6.61819L12.3288 7.48723L11.8104 6.61819C11.2771 5.79937 10.4706 5.39001 9.40554 5.39001C8.485 5.39001 7.74344 5.71359 7.17719 6.34482C6.62807 6.97604 6.3547 7.82924 6.3547 8.9029V14.1562H8.43597V9.05731C8.43597 7.98246 8.88822 7.4369 9.79281 7.4369C10.793 7.4369 11.2944 8.08408 11.2944 9.36376V12.1547H13.3634V9.36376C13.3634 8.08408 13.8646 7.4369 14.8648 7.4369C15.7694 7.4369 16.2216 7.98246 16.2216 9.05731V14.1562H18.3029V8.9029Z"></path>
              </svg>
              <p>
                <em>@user@mastodon.social</em>
                <br />
                Hello world! I am now using Sociabli to cross post my content to Bluesky.
              </p>
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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="bluesky"
              >
                <path d="M12 11.3884C11.0942 9.62673 8.62833 6.34423 6.335 4.7259C4.13833 3.17506 3.30083 3.4434 2.75167 3.69256C2.11583 3.9784 2 4.95506 2 5.52839C2 6.10339 2.315 10.2367 2.52 10.9276C3.19917 13.2076 5.61417 13.9776 7.83917 13.7309C4.57917 14.2142 1.68333 15.4017 5.48083 19.6292C9.65833 23.9542 11.2058 18.7017 12 16.0392C12.7942 18.7017 13.7083 23.7651 18.4442 19.6292C22 16.0392 19.4208 14.2142 16.1608 13.7309C18.3858 13.9784 20.8008 13.2076 21.48 10.9276C21.685 10.2376 22 6.10256 22 5.52923C22 4.95423 21.8842 3.97839 21.2483 3.6909C20.6992 3.44256 19.8617 3.17423 17.665 4.72423C15.3717 6.34506 12.9058 9.62756 12 11.3884Z"></path>
              </svg>
              <p>
                <em>user.bsky.social</em>
                <br />
                Hello world! I am now using Sociabli to cross post my content to Bluesky.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h3>You Blog to Medium</h3>
          <p className="description">Publish your blog posts on Medium. Sociabli enables you to define which of your blog posts should be cross posted to medium.com. Simply install the Sociabli plugin for your CMS and connect it to Medium. We will take care of canonical links and other details, so that you won't run into duplicate content on Google and other search engines.</p>

          <div className="flow">
            <div className="card">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="blog"
              >
                <path d="M2 4C2 3.44772 2.44772 3 3 3H21C21.5523 3 22 3.44772 22 4V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V4ZM4 5V19H20V5H4ZM6 7H12V13H6V7ZM8 9V11H10V9H8ZM14 9H18V7H14V9ZM18 13H14V11H18V13ZM6 15V17L18 17V15L6 15Z"></path>
              </svg>
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
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M13.4093 12.0071C13.4093 15.4573 10.6314 18.2544 7.20454 18.2544C3.77771 18.2544 1 15.4582 1 12.0071C1 8.55605 3.77792 5.76001 7.20454 5.76001C10.6312 5.76001 13.4093 8.55689 13.4093 12.0071ZM20.216 12.0071C20.216 15.2551 18.8269 17.8878 17.1136 17.8878C15.4003 17.8878 14.0112 15.2542 14.0112 12.0071C14.0112 8.75999 15.4003 6.1264 17.1136 6.1264C18.8269 6.1264 20.216 8.75999 20.216 12.0071ZM23 12.0071C23 14.9171 22.5114 17.276 21.9088 17.276C21.3063 17.276 20.8177 14.9163 20.8177 12.0071C20.8177 9.09793 21.3063 6.73823 21.9091 6.73823C22.5118 6.73823 23 9.0973 23 12.0071Z"></path>
              </svg>
              <p className="service">Medium</p>
            </div>
          </div>
        </section>

        <section>
          <h3>More flows will come!</h3>
          <p className="description">We're just starting! Sociabli is currently running in a beta test mode and we are working on more flows to enable you to connect even more services. Sign up for free now to join our beta. We will add more flows over the time.</p>

          <div className="flow">
            <div className="card">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="bluesky"
              >
                <path d="M12 11.3884C11.0942 9.62673 8.62833 6.34423 6.335 4.7259C4.13833 3.17506 3.30083 3.4434 2.75167 3.69256C2.11583 3.9784 2 4.95506 2 5.52839C2 6.10339 2.315 10.2367 2.52 10.9276C3.19917 13.2076 5.61417 13.9776 7.83917 13.7309C4.57917 14.2142 1.68333 15.4017 5.48083 19.6292C9.65833 23.9542 11.2058 18.7017 12 16.0392C12.7942 18.7017 13.7083 23.7651 18.4442 19.6292C22 16.0392 19.4208 14.2142 16.1608 13.7309C18.3858 13.9784 20.8008 13.2076 21.48 10.9276C21.685 10.2376 22 6.10256 22 5.52923C22 4.95423 21.8842 3.97839 21.2483 3.6909C20.6992 3.44256 19.8617 3.17423 17.665 4.72423C15.3717 6.34506 12.9058 9.62756 12 11.3884Z"></path>
              </svg>
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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="mastodon"
              >
                <path d="M21.2595 13.9898C20.9852 15.4006 18.8033 16.9446 16.2974 17.2439C14.9907 17.3998 13.7041 17.5431 12.3321 17.4802C10.0885 17.3774 8.31809 16.9446 8.31809 16.9446C8.31809 17.163 8.33156 17.371 8.3585 17.5655C8.65019 19.7797 10.5541 19.9124 12.3576 19.9742C14.1779 20.0365 15.7987 19.5254 15.7987 19.5254L15.8735 21.1711C15.8735 21.1711 14.6003 21.8548 12.3321 21.9805C11.0814 22.0493 9.52849 21.9491 7.71973 21.4703C3.79684 20.432 3.12219 16.2504 3.01896 12.0074C2.98749 10.7477 3.00689 9.55981 3.00689 8.56632C3.00689 4.22771 5.84955 2.95599 5.84955 2.95599C7.2829 2.29772 9.74238 2.0209 12.2993 2H12.3621C14.919 2.0209 17.3801 2.29772 18.8133 2.95599C18.8133 2.95599 21.6559 4.22771 21.6559 8.56632C21.6559 8.56632 21.6916 11.7674 21.2595 13.9898ZM18.3029 8.9029C18.3029 7.82924 18.0295 6.97604 17.4805 6.34482C16.9142 5.71359 16.1726 5.39001 15.2522 5.39001C14.187 5.39001 13.3805 5.79937 12.8473 6.61819L12.3288 7.48723L11.8104 6.61819C11.2771 5.79937 10.4706 5.39001 9.40554 5.39001C8.485 5.39001 7.74344 5.71359 7.17719 6.34482C6.62807 6.97604 6.3547 7.82924 6.3547 8.9029V14.1562H8.43597V9.05731C8.43597 7.98246 8.88822 7.4369 9.79281 7.4369C10.793 7.4369 11.2944 8.08408 11.2944 9.36376V12.1547H13.3634V9.36376C13.3634 8.08408 13.8646 7.4369 14.8648 7.4369C15.7694 7.4369 16.2216 7.98246 16.2216 9.05731V14.1562H18.3029V8.9029Z"></path>
              </svg>
              <p className="service">Mastodon</p>
            </div>
          </div>

          <div className="flow">
            <div className="card">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="blog"
              >
                <path d="M2 4C2 3.44772 2.44772 3 3 3H21C21.5523 3 22 3.44772 22 4V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V4ZM4 5V19H20V5H4ZM6 7H12V13H6V7ZM8 9V11H10V9H8ZM14 9H18V7H14V9ZM18 13H14V11H18V13ZM6 15V17L18 17V15L6 15Z"></path>
              </svg>

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
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.3362 18.339H15.6707V14.1622C15.6707 13.1662 15.6505 11.8845 14.2817 11.8845C12.892 11.8845 12.6797 12.9683 12.6797 14.0887V18.339H10.0142V9.75H12.5747V10.9207H12.6092C12.967 10.2457 13.837 9.53325 15.1367 9.53325C17.8375 9.53325 18.337 11.3108 18.337 13.6245V18.339H18.3362ZM7.00373 8.57475C6.14573 8.57475 5.45648 7.88025 5.45648 7.026C5.45648 6.1725 6.14648 5.47875 7.00373 5.47875C7.85873 5.47875 8.55173 6.1725 8.55173 7.026C8.55173 7.88025 7.85798 8.57475 7.00373 8.57475ZM8.34023 18.339H5.66723V9.75H8.34023V18.339ZM19.6697 3H4.32923C3.59498 3 3.00098 3.5805 3.00098 4.29675V19.7033C3.00098 20.4202 3.59498 21 4.32923 21H19.6675C20.401 21 21.001 20.4202 21.001 19.7033V4.29675C21.001 3.5805 20.401 3 19.6675 3H19.6697Z"></path>
              </svg>
              <p className="service">LinkedIn</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
