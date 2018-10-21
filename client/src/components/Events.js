import React from "react";
import { Summary, Avatar, richContent, Header } from "./Utils";

const PushEvent = ({ events }) => {
  const commitLine = events => {
    const classes = "pre fw2 mt2 mb1 lh-copy";
    if (events.payload.size < 2) {
      const commit = events.payload.commits[0];

      return (
        <p className={classes}>
          <a
            href={`https://github.com/${events.repo.name}/commit/${commit.sha}`}
            className="link blue"
          >
            {commit.sha.substr(0, 8)}
          </a>{" "}
          {commit.message.split("\n")[0].substr(0, 50)}
        </p>
      );
    } else {
      const oldHead = events.payload.before;
      const head = events.payload.head;
      const commit = events.payload.commits[events.payload.size - 1];

      return (
        <p className={classes}>
          <a
            href={`https://github.com/${
              events.repo.name
            }/compare/${oldHead}...${head}`}
            className="link blue"
          >
            {oldHead.substr(0, 8)}...{head.substr(0, 8)}
          </a>{" "}
          {commit && commit.message.split("\n")[0].substr(0, 50)}
        </p>
      );
    }
  };

  return events.payload.commits.length > 0 && commitLine(events);
};

const CommentEvent = ({ events }) => (
  <section className="bg-white mt2 pl2">
    {richContent(events.payload.comment.body)}
  </section>
);

const IssueCommentEvent = CommentEvent;
const PullRequestReviewCommentEvent = CommentEvent;
const CommitCommentEvent = CommentEvent;

const PullRequestEvent = ({ events }) => {
  const mergedLine = ({ commits, additions, deletions, changed_files }) => (
    <p className="pre fw2 lh-copy mv0">
      {commits} commits with {additions} additions {deletions} deletions and{" "}
      {changed_files} changed files
    </p>
  );

  return (
    <section className="bg-white mt2 pa2">
      <Header title={events.payload.pull_request.title} />

      {events.payload.pull_request.merged &&
        mergedLine(events.payload.pull_request)}
      {!events.payload.pull_request.merged &&
        events.payload.pull_request.state !== "closed" &&
        richContent(events.payload.pull_request.body)}
    </section>
  );
};

const IssuesEvent = ({ events }) => (
  <section className="bg-white mt2 pa2">
    <Header title={events.payload.issue.title} />

    {events.payload.action === "opened" &&
      richContent(events.payload.issue.body)}
  </section>
);

const customs = {
  CommitCommentEvent,
  PushEvent,
  IssuesEvent,
  IssueCommentEvent,
  PullRequestEvent,
  PullRequestReviewCommentEvent
};

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error, info) {
    this.setState({ hasError: true, message: error.message });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div>
          <p className="red">something went wrong:</p>
          <pre>{this.state.message}</pre>
        </div>
      );
    }
    return this.props.children || null;
  }
}

class Events extends React.Component {
  render() {
    const Event = customs[this.props.events.type];

    return (
      <article className="mw-100 bb pv3 ph2 b--black-10">
        <div className="flex flex-column flex-row-ns">
          <Avatar actor={this.props.events.actor} />

          <div className="w-100 w-90-ns">
            <Summary {...this.props} />
            <ErrorBoundary>{Event && <Event {...this.props} />}</ErrorBoundary>
          </div>
        </div>
      </article>
    );
  }
}

export default Events;
