import React from 'react'
import Marked from 'marked'
import moment from 'moment'

const linkTitle = events => {
  if (events.type.startsWith('Issue')) {
    return events.payload.issue.title
  }

  if (events.type.startsWith('PullRequest')) {
    return events.payload.pull_request.title
  }

  return events.type
}

const linkName = events => {
  if (events.type.startsWith('Issue')) {
    return `${events.repo.name}#${events.payload.issue.number}`
  }

  if (events.type.startsWith('PullRequest')) {
    return `${events.repo.name}#${events.payload.pull_request.number}`
  }

  return events.repo.name
}

const linkHref = events => {
  if (events.type.endsWith('CommentEvent')) {
    return events.payload.comment.html_url
  }

  if (events.type.startsWith('Issue')) {
    return events.payload.issue.html_url
  }

  if (events.type.startsWith('PullRequest')) {
    return events.payload.pull_request.html_url
  }

  return `https://github.com/${events.repo.name}`
}

const eventAction = events => {
  if (events.type === 'IssueCommentEvent') { return 'commented on' }
  if (events.type === 'PushEvent') { return ' pushed to ' }
  if (events.type === 'DeleteEvent') { return ' deleted ' }
  if (events.type === 'ForkEvent') { return ' forked ' }
  if (events.type === 'CreateEvent') { return ' created ' }
  if (events.type === 'PullRequestReviewCommentEvent') { return 'commented on' }
  if (events.payload.pull_request && events.payload.pull_request.merged) {
    return 'merged'
  }

  return `${events.payload.action} `
}

const richContent = content =>
  <p className='f6 fw3 ma0 lh-copy'
    dangerouslySetInnerHTML={{__html: Marked(content)}} />

const timeFromNow = timeString => {
  const time = moment.utc(timeString.replace(' UTC', ''))
  return <span title={time.toDate()}>{moment(time).fromNow()}</span>
}

const BranchLink = ({ events }) => {
  const ref = events.payload.ref || events.payload.master_branch
  const name = ref.replace('refs/heads/', '')
  return (
    <a href={`https://github.com/${events.repo.name}/tree/${name}`}
      className='link blue'>
      {name}
    </a>
  )
}

const Summary = ({ events, justLoaded }) => {
  return (
    <p className={`fw4 f6 lh-copy mv0 ${justLoaded && 'highlight'}`}>
      {eventAction(events)}
      {events.type === 'PushEvent' && <BranchLink events={events} />}
      {events.type === 'PushEvent' && ' at '}
      {events.type === 'CreateEvent' && <BranchLink events={events} />}
      {events.type === 'CreateEvent' && ' at '}
      {events.type === 'DeleteEvent' && <BranchLink events={events} />}
      {events.type === 'DeleteEvent' && ' at '}
      {events.type === 'WatchEvent' && ' watching '}
      {events.type === 'IssuesEvent' && ' issue '}
      {events.type === 'PullRequestReviewCommentEvent' && ' pull request '}
      {events.type === 'IssueCommentEvent' && events.payload.issue.pull_request && ' pull request '}
      {events.type === 'IssueCommentEvent' && !events.payload.issue.pull_request && ' issue '}
      {events.type === 'PullRequestEvent' && ' pull request '}

      <a title={linkTitle(events)} className='link blue' href={linkHref(events)}>
        {linkName(events)}
      </a> {timeFromNow(events.created_at)}
    </p>
  )
}

const Avatar = ({ actor }) =>
  <div className='mb4 mb0-ns ph3'>
    <a href={`https://github.com/${actor.login}`} title={actor.login}>
      <img src={actor.avatar_url}
        className='br3 h2 w2 dib'
        alt={actor.login} title={actor.login} />
    </a>
  </div>

const Header = ({ title }) =>
  <h1 className='f4 fw3 mt1 mb1 lh-title'>{title}</h1>

export {
  richContent,
  Summary,
  Avatar,
  Header
}
