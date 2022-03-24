import { en, zh } from '../../../data/socials'

import PropTypes from 'prop-types'
import React from 'react'
import clsx from 'clsx'
import ReactTooltip from 'react-tooltip'
import { graphql, useStaticQuery } from 'gatsby'

import { tooltipQR } from './footer.module.scss'

const Socials = ({ locale, className }) => {
  const wechatQRCode = useStaticQuery(graphql`
    query {
      file: file(relativePath: { eq: "merico-wechat-qr-code.png" }) {
        publicURL
      }
    }
  `)

  const data = locale === 'en' ? en : zh

  return (
    <>
      {data &&
        data.map(social => (
          // eslint-disable-next-line jsx-a11y/anchor-has-content
          <a
            key={social.name}
            className={clsx('social', social.name, className)}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            title={social.name}
            aria-label={social.name}
          />
        ))}
      <span
        data-tip
        data-for="tooltipQR"
        className={clsx('social', 'wechat', className)}
        href="#"
        target="_blank"
        rel="noopener noreferrer"
        title="wechat"
        aria-label="wechat"
      />
      <ReactTooltip
        className={tooltipQR}
        id="tooltipQR"
        place="top"
        type="light"
        effect="solid"
      >
        <img
          src={wechatQRCode.file.publicURL}
          alt="merico-wechat-qr-code"
          width={120}
          height={120}
        />
      </ReactTooltip>
    </>
  )
}

Socials.propTypes = {
  locale: PropTypes.string.isRequired,
  className: PropTypes.string,
}

export default Socials
