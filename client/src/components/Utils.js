import React from "react";
import Marked from "marked";
import TimeFromNow from "./TimeFromNow";

const linkTitle = events => {
  if (events.type.startsWith("Issue")) {
    return events.payload.issue.title;
  }

  if (events.type.startsWith("PullRequest")) {
    return events.payload.pull_request.title;
  }

  return events.type;
};

const linkName = events => {
  if (events.type.startsWith("Issue")) {
    return `${events.repo.name}#${events.payload.issue.number}`;
  }

  if (events.type.startsWith("PullRequest")) {
    return `${events.repo.name}#${events.payload.pull_request.number}`;
  }

  if (events.type.startsWith("CommitCommentEvent")) {
    const commit = events.payload.comment.commit_id;
    return `${events.repo.name}@${commit.substr(0, 8)}`;
  }

  return events.repo.name;
};

const linkHref = events => {
  if (events.type.endsWith("CommentEvent")) {
    return events.payload.comment.html_url;
  }

  if (events.type.startsWith("Issue")) {
    return events.payload.issue.html_url;
  }

  if (events.type.startsWith("PullRequest")) {
    return events.payload.pull_request.html_url;
  }

  return `https://github.com/${events.repo.name}`;
};

const eventAction = events => {
  if (events.type === "IssueCommentEvent") {
    return "commented on";
  }
  if (events.type === "GollumEvent") {
    return `${events.payload.pages[0].action} a wiki page in `;
  }
  if (events.type === "CommitCommentEvent") {
    return "commented on";
  }
  if (events.type === "PushEvent") {
    return " pushed to ";
  }
  if (events.type === "DeleteEvent") {
    return " deleted ";
  }
  if (events.type === "ForkEvent") {
    return " forked ";
  }
  if (events.type === "CreateEvent") {
    return " created ";
  }
  if (events.type === "PullRequestReviewCommentEvent") {
    return "commented on";
  }
  if (events.payload.pull_request && events.payload.pull_request.merged) {
    return "merged";
  }

  return `${events.payload.action} `;
};

const richContent = content => (
  <p
    className="f6 fw3 ma0 lh-copy"
    dangerouslySetInnerHTML={{ __html: Marked(content || "") }}
  />
);

const BranchLink = ({ events }) => {
  const ref = events.payload.ref || events.payload.master_branch;
  const name = ref.replace("refs/heads/", "");
  return (
    <a
      href={`https://github.com/${events.repo.name}/tree/${name}`}
      className="link blue"
    >
      {name}
    </a>
  );
};

const Summary = ({ events }) => {
  return (
    <div className="relative fw4 f6 lh-copy mv0">
      <span className="dn-ns di">{events.actor.login} </span>
      {eventAction(events)}
      {events.type === "MemberEvent" && (
        <a
          href={`https://github.com/${events.payload.member.login}`}
          className="link blue"
        >
          {events.payload.member.login}
        </a>
      )}
      {events.type === "MemberEvent" && " to "}
      {events.type === "PushEvent" && <BranchLink events={events} />}
      {events.type === "PushEvent" && " at "}
      {events.type === "CreateEvent" && <BranchLink events={events} />}
      {events.type === "CreateEvent" && " at "}
      {events.type === "DeleteEvent" && <BranchLink events={events} />}
      {events.type === "DeleteEvent" && " at "}
      {events.type === "WatchEvent" && " watching "}
      {events.type === "IssuesEvent" && " issue "}
      {events.type === "CommitCommentEvent" && " commit "}
      {events.type === "PullRequestReviewCommentEvent" && " pull request "}
      {events.type === "IssueCommentEvent" &&
        events.payload.issue.pull_request &&
        " pull request "}
      {events.type === "IssueCommentEvent" &&
        !events.payload.issue.pull_request &&
        " issue "}
      {events.type === "PullRequestEvent" && " pull request "}
      <a
        title={linkTitle(events)}
        className="link blue"
        href={linkHref(events)}
      >
        {linkName(events)}
      </a>{" "}
      <TimeFromNow timestamp={events.created_at} />
    </div>
  );
};

const Avatar = ({ actor }) => (
  <div className="mb4 mb0-ns ph3 dn db-ns">
    <a href={`https://github.com/${actor.login}`} title={actor.login}>
      <img
        src={`${actor.avatar_url}s=64&v=4`}
        className="br3 h2 w2 dib"
        alt={actor.login}
        title={actor.login}
      />
    </a>
  </div>
);

const Header = ({ title, link, linkText }) => {
  const href = linkText && (
    <a className="link blue" href={link}>
      {linkText}
    </a>
  );

  return (
    <h1 className="f4 fw3 mt1 mb1 lh-title">
      {title} {href}
    </h1>
  );
};

export { richContent, Summary, Avatar, Header };
