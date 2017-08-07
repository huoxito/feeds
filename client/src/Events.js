import React from 'react'
import Marker from 'marked'

const Summary = ({ events, link }) =>
  <a className='db ph0-l no-underline black dim' href={link} target='_blank'>
    <p className='f6 lh-copy mv0'>
      {events.type} {events.payload.action} {events.repo.name} {events.created_at}
    </p>
  </a>

const Avatar = ({ actor }) =>
  <div className='mb4 mb0-ns ph3'>
    <img src={actor.avatar_url}
         className='br4 h2 w2 dib'
         alt={actor.login} title={actor.login} />
  </div>

const Header = ({ title }) =>
  <h1 className='f4 fw1 baskerville mt0 lh-title'>{title}</h1>

const PushEvent = ({ events }) => {
  return (
    <div className='flex flex-column flex-row-ns'>
      <div className='w-100 w-90-ns'>
        <Summary events={events} />

        <h1 className='f4 fw1 baskerville mt0 lh-title'>
          {events.actor.login} pushed to {events.payload.ref}
        </h1>
        <p className='f6 f5-l lh-copy' dangerouslySetInnerHTML={{__html: events.payload.commits.map((commit) => `${commit.sha.substr(0, 8)} ${commit.message}`)}} />
      </div>
    </div>
  )
}

const CreateEvent = ({ events }) => {
  return (
    <div className='flex flex-column flex-row-ns'>
      <div className='w-100 w-90-ns'>
        <p className='f6 f5-l mv0 lh-copy'>
          {events.actor.login} created
          {events.payload.ref} at {events.repo.name}
        </p>
      </div>
    </div>
  )
}

const IssueCommentEvent = ({ events }) => {
  return (
      <div className='flex flex-column flex-row-ns'>
        <Avatar actor={events.actor} />

        <div className='w-100 w-90-ns'>
          <Summary events={events} link={events.payload.comment.html_url} />
          <Header title={events.payload.issue.title} />

          <p className='f6 f5-l lh-copy' dangerouslySetInnerHTML={{__html: Marker(events.payload.comment.body)}} />
        </div>
      </div>
  )
}

const PullRequestReviewCommentEvent = ({ events }) => {
  return (
    <div className='flex flex-column flex-row-ns'>
      <Avatar actor={events.actor} />

      <div className='w-100 w-90-ns'>
        <Summary events={events} link={events.payload.comment.html_url} />
        <Header title={events.payload.pull_request.title} />

        <p className='f6 f5-l lh-copy' dangerouslySetInnerHTML={{__html: Marker(events.payload.comment.body)}} />

      </div>
    </div>
  )
}

// this is for open and closing PRs
const PullRequestEvent = ({ events }) => {
  return (
    <div className='flex flex-column flex-row-ns'>
      <Avatar actor={events.actor} />

      <div className='w-100 w-90-ns'>
        <Summary events={events} link={events.payload.pull_request.html_url} />
        <Header title={events.payload.pull_request.title} />

        <p className='f6 f5-l lh-copy' dangerouslySetInnerHTML={{__html: Marker(events.payload.pull_request.body)}} />
      </div>
    </div>
  )
}

const IssuesEvent = ({ events }) => {
  return (
    <div className='flex flex-column flex-row-ns'>
      <Avatar actor={events.actor} />

      <div className='w-100 w-90-ns'>
        <Summary events={events} />
        <Header title={events.payload.issue.title} />

        <p className='f6 f5-l lh-copy' dangerouslySetInnerHTML={{__html: Marker(events.payload.issue.body)}} />
      </div>
    </div>
  )
}

export default {
  PullRequestEvent,
  PushEvent,
  CreateEvent,
  IssuesEvent,
  IssueCommentEvent,
  PullRequestReviewCommentEvent
};
