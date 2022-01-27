import {
  annotations,
  clicked,
  column,
  copyright,
  displayed,
  footer,
  items,
  logo,
  title,
  spread as spreadStyle,
  socials,
} from './footer.module.scss'

import {
  Footer as BulmaFooter,
  Column,
  Columns,
  Container,
  Icon,
  Title,
} from '@seagreenio/react-bulma'
import { Link, useIntl } from 'gatsby-plugin-react-intl'
import { useState } from 'react'
import { en, zh } from 'data/footer'
import { graphql, useStaticQuery } from 'gatsby'

import Socials from '../../socials'
import clsx from 'clsx'

export function Footer() {
  const { locale } = useIntl()
  const [spread, setSpread] = useState<number | undefined>(undefined)

  const logo = useStaticQuery(graphql`
    query {
      zh: file(relativePath: { eq: "merico-logo-zh.svg" }) {
        publicURL
      },
      en: file(relativePath: { eq: "merico-logo-en.svg" }) {
        publicURL
      }
    }
  `)
  const footerColumns = locale === 'zh' ? zh : en

  const handleSpreadItems = (index: number) => () => {
    const screenWidth = window.screen.width
    if (screenWidth > 768) {
      return
    }

    setSpread(spread === index ? undefined : index)
  }

  return (
    <BulmaFooter className={footer}>
      <Container>
        <Columns>
          {footerColumns.map((column, index) => (
            <Column key={column.name}>
              <Title
                className={title}
                size={6}
                onClick={handleSpreadItems(index)}>
                {column.name}
                <span
                  className={clsx(spreadStyle, index === spread && clicked)}>
                  <Icon name="mdi mdi-plus" />
                </span>
              </Title>
              <ul className={clsx(items, index === spread && displayed)}>
                {column.items.map(item => (
                  <li key={item.name}>
                    {item.url.startsWith('/') ? (
                      <Link to={item.url}>{item.name}</Link>
                    ) : (
                      <a href={item.url} target="_blank" rel="noreferrer">
                        {item.name}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </Column>
          ))}

          <Column>
            <Columns className={socials} multiline>
              <Socials
                className={clsx('column is-4', column)}
                locale={locale}
              />
            </Columns>
          </Column>
        </Columns>

        <div className={annotations}>
          <div className={copyright}>
            ©{new Date().getFullYear()} Merico. All Rights Reserved.
          </div>
          <a href="https://merico.cn" target="_blank" rel="noreferrer">
            <img className={logo} src={logo[locale].publicURL} alt="Merico" />
          </a>
        </div>
      </Container>
    </BulmaFooter>
  )
}
