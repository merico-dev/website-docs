import '../styles/components/userFeedback.scss'

import React, { useState } from 'react'

import { FormattedMessage } from 'react-intl'
import HubspotForm from 'react-hubspot-form'
import { Loading } from '../components/Loading'
import { trackCustomEvent } from 'gatsby-plugin-google-analytics'

const UserFeedback = ({ title, locale }) => {
  const [showCloseBtn, setShowCloseBtn] = useState(false)
  const [showFeedbackBody, setShowFeedbackBody] = useState(false)
  const [showYesFollowUp, setShowYesFollowUp] = useState('unset')

  const setDocHelpful = (docTitle, isHelpful) => () => {
    trackCustomEvent({
      category: isHelpful ? `doc-${locale}-useful` : `doc-${locale}-useless`,
      action: 'click',
      label: docTitle,
      transport: 'beacon',
    })

    if (isHelpful) {
      setShowYesFollowUp('show')
    } else {
      setShowYesFollowUp('hide')
    }
  }

  const showThumbs = () => {
    setShowCloseBtn(true)
    setShowFeedbackBody(true)
  }

  const closeFeedback = () => {
    setShowFeedbackBody(false)
    setShowCloseBtn(false)
    setShowYesFollowUp('unset')
  }

  return (
    <section className="PingCAP-UserFeedback feedback-prompt">
      <div className="feedback-header">
        {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
        <div
          className="feedback-title"
          onClick={showThumbs}
          onKeyDown={showThumbs}
        >
          <FormattedMessage id="docHelpful.header" />
        </div>
        {showCloseBtn && (
          // eslint-disable-next-line jsx-a11y/no-static-element-interactions
          <div
            className="close-icon"
            onClick={closeFeedback}
            onKeyDown={closeFeedback}
          >
            x
          </div>
        )}
      </div>
      {showFeedbackBody && (
        <div className="feedback-body">
          {showYesFollowUp === 'unset' && (
            <div className="thumbs">
              <div
                role="button"
                tabIndex={0}
                className="thumb thumb-up"
                onClick={setDocHelpful(title, true)}
                onKeyDown={setDocHelpful(title, true)}
              >
                <FormattedMessage id="docHelpful.thumbUp" />
              </div>
              <div
                role="button"
                tabIndex={0}
                className="thumb thumb-down"
                onClick={setDocHelpful(title, false)}
                onKeyDown={setDocHelpful(title, false)}
              >
                <FormattedMessage id="docHelpful.thumbDown" />
              </div>
            </div>
          )}

          {showYesFollowUp !== 'unset' && (
            <div className="feedback-form">
              <HubspotForm
                portalId="4466002"
                formId={`${
                  showYesFollowUp === 'show'
                    ? locale === 'en'
                      ? 'FEEDBACK_FORM_ID_FOLLOW_EN'
                      : 'FEEDBACK_FORM_ID_FOLLOW_ZH'
                    : locale === 'en'
                    ? 'FEEDBACK_FORM_ID_NOFOLLOW_EN'
                    : 'FEEDBACK_FORM_ID_NOFOLLOW_ZH'
                }`}
                loading={<Loading wholeScreen={false} />}
              />
            </div>
          )}
        </div>
      )}
    </section>
  )
}

export default UserFeedback
