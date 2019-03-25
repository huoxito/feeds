import * as React from "react";
import ProjectsList from "../components/ProjectsList";
import Events from "../components/Events";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

const mapStateToProps = ({ starting, user, pages, userEvents }) => {
  return { starting, user, pages, userEvents };
};

const Lists = props => {
  const list = props.pages[props.path] || [];
  const allEvents = [].concat(...Object.values(props.pages));

  return (
    <div className={`cf w-100 ${props.error && "o-10"}`}>
      <section className="fl w-70-ns w-100-m w-100">
        {list.map(events => <Events key={events.id} events={events} />)}
      </section>

      {props.user && (
        <ProjectsList
          header="You've been involved in:"
          collection={props.userEvents}
        />
      )}

      {props.user && (
        <ProjectsList header="Featured projects" collection={allEvents} />
      )}
    </div>
  );
};

export default withRouter(connect(mapStateToProps)(Lists));
