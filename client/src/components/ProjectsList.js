import React from 'react'
import {
  Link
} from 'react-router-dom'

export default ({ collection, header }) => {
  if (collection.length === 0) { return null }

  let repos = []

  collection.forEach((ev) => {
    if (ev.org && repos.indexOf(ev.org.login) === -1) {
      repos.push(ev.org.login)
    }

    if (ev.repo && repos.indexOf(ev.repo.name) === -1) {
      repos.push(ev.repo.name)
    }
  })

  return (
    <section className='db-ns dn fl w-30 pl3'>
      <div className="f6 fw4 pa1 pa1-ns">
        <h3 className='fw4 mb0'>{header}</h3>

        <ul className="list pl0 measure center">
          {repos.map(repo =>
            <li key={repo}
              className="lh-copy pv2 ba bl-0 bt-0 br-0 b--dotted b--black-30"
            >

              <Link to={`/${repo}`} className='link blue'>
                {repo}
              </Link>
            </li>
          )}
        </ul>
      </div>
    </section>
  )
}
