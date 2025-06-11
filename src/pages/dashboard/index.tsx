import 'tippy.js/dist/tippy.css'
import 'react-toastify/dist/ReactToastify.css'
import { Connections } from '@/pages/dashboard/components/Connections'
import { Workflows } from '@/pages/dashboard/components/Workflows'
import { UserFlows } from '@/pages/dashboard/components/UserFlows'

export default function DashboardPage() {
  const onFlowCreated = () => {
    window.location.reload()
  }

  return (
    <>
      <div className="container dashboard">
        <div className="msg">Copied</div>
        <section>
          <h1>Dashboard</h1>
          <p className="intro" data-tippy-content={'hallo welt'}>
            See all available workflows and the ones you activated.
          </p>
        </section>

        <h2>Your flows</h2>
        <UserFlows />

        <h2>Connections</h2>
        <Connections />

        <h2>Available flows</h2>
        <p className="description">
          Click on a flow to configure it. Enter the needed information to activate the flow. Our
          flows will start working with your next post, we will not publish older posts.
        </p>

        <Workflows onCreated={onFlowCreated} />

        <h2>Do you have any feedback? Please get in touch</h2>
        <p className="description">
          We would love to hear from you. If you have any feedback, questions or ideas, please get
          in touch at <a href="mailto:support@sociab.li">support@sociab.li</a>
        </p>

        <script src='https://storage.ko-fi.com/cdn/scripts/overlay-widget.js'></script>
        <script>
          kofiWidgetOverlay.draw('sociabli', {
            'type': 'floating-chat',
            'floating-chat.donateButton.text': 'Support Us',
            'floating-chat.donateButton.background-color': '#fcbf47',
            'floating-chat.donateButton.text-color': '#323842'
          });
        </script>
      </div>
    </>
  )
}
