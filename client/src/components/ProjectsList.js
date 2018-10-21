import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

const mapStateToProps = ({ urlUpdated }) => {
  return { urlUpdated };
};

const ProjectsLists = ({ collection, header, urlUpdated }) => {
  if (collection.length === 0 || urlUpdated) {
    return null;
  }

  let repos = [];

  collection.forEach(ev => {
    if (ev.repo && repos.indexOf(ev.repo.name) === -1) {
      repos.push(ev.repo.name);
    }
  });

  return (
    <section className="db-ns dn-m dn fl w-30 pl3">
      <div className="f6 fw4 pa1 pa1-ns">
        <h3 className="fw4 mb0">{header}</h3>

        <ul className="list pl0 measure center">
          {repos.map(repo => (
            <li
              key={repo}
              className="lh-copy pv2 ba bl-0 bt-0 br-0 b--dotted b--black-30"
            >
              <Link to={`/${repo.split("/")[0]}`} className="link blue">
                {repo.split("/")[0]}
              </Link>{" "}
              /{" "}
              <Link to={`/${repo}`} className="link blue">
                {repo.split("/")[1]}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default connect(mapStateToProps)(ProjectsLists);
