import * as React from 'react'
import ProjectsList from '../components/ProjectsList'
import Events from '../components/Events'
import ErrorBanner from '../components/ErrorBanner'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

const mapStateToProps = ({ loading, starting, path, pages, error, userEvents }) => {
  return { loading, starting, path, pages, error, userEvents }
}

const Lists = (props) => {
  if (props.starting) {
    return (
      <section className='mw7 pl3 helvetica'>
        <header className='relative mt2 mb2 ph2 h-100'>
          <span className='pa3'>Starting session ..</span>
        </header>
      </section>
    )
  }

  if (props.loading) {
    return (
      <section className='mw7 pl3 helvetica'>
        <header className='relative mt2 mb2 ph2 h-100'>
          <span className='pa3'>Loading ...</span>
        </header>
      </section>
    )
  }

  const list = props.pages[props.path] || []
  const allEvents = [].concat(...Object.values(props.pages))

  return (
    <div className='cf w-100'>
      <section className='fl w-70-ns w-100'>
        <ErrorBanner message={props.error} />
        {list.map(
          events => <Events key={events.id} events={events} />
        )}
      </section>

      <ProjectsList header="You've contributed to"
                    collection={props.userEvents} />
      <ProjectsList header='Featured projects'
                    collection={allEvents} />
    </div>
  )
}

export default withRouter(
  connect(mapStateToProps)(Lists)
)
