import {
  annotations,
  clicked,
  // column,
  copyright,
  displayed,
  footer,
  items,
  logo as logoClassName,
  title,
  spread as spreadStyle,
  // socials,
  infoAndLinks,
  linkRows,
  logoAndCopyright,
  socialMediaLinks,
  socialMediaLink,
  socialMediaLinkAnchor,
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

// import Socials from './socials'
import clsx from 'clsx'
import { Contacts } from './Contacts'

export function Footer() {
  const { locale } = useIntl()
  const [spread, setSpread] = useState<number | undefined>(undefined)

  const logo = useStaticQuery(graphql`
    query {
      zh: file(relativePath: { eq: "merico-logo-zh.svg" }) {
        publicURL
      }
      en: file(relativePath: { eq: "merico-logo-en.svg" }) {
        publicURL
      }
    }
  `)
  const footerRows = locale === 'zh' ? zh : en

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
        <div className={infoAndLinks}>
          {/* <Column>
            <Columns className={socials} multiline>
              <Socials
                className={clsx('column is-4', column)}
                locale={locale}
              />
            </Columns>
          </Column> */}
          <Contacts />

          <div className={linkRows}>
            {footerRows.map(columns => {
              return (
                <Columns>
                  {columns.map((column, index) => (
                    <Column key={column.name}>
                      <Title
                        className={title}
                        size={8}
                        onClick={handleSpreadItems(index)}>
                        {column.name}
                        <span
                          className={clsx(
                            spreadStyle,
                            index === spread && clicked
                          )}>
                          <Icon name="mdi mdi-plus" />
                        </span>
                      </Title>
                      <ul
                        className={clsx(items, index === spread && displayed)}>
                        {column.items.map(item => (
                          <li key={item.name}>
                            {item.url.startsWith('/') ? (
                              <Link to={item.url}>{item.name}</Link>
                            ) : (
                              <a
                                href={item.url}
                                target="_blank"
                                rel="noreferrer">
                                {item.name}
                              </a>
                            )}
                          </li>
                        ))}
                      </ul>
                    </Column>
                  ))}
                </Columns>
              )
            })}
          </div>
        </div>

        <div className={annotations}>
          <div className={logoAndCopyright}>
            <a href="https://merico.cn" target="_blank" rel="noreferrer">
              <img
                className={logoClassName}
                src={logo[locale].publicURL}
                alt="Merico"
              />
            </a>
            <div className={copyright}>
              ©{new Date().getFullYear()} Merico 京ICP备20006575号-1
            </div>
          </div>
          <div className={socialMediaLinks}>
            <div className={socialMediaLink}>
              <a
                href="https://www.zhihu.com/org/si-ma-yi-yan-fa-xiao-neng"
                className={socialMediaLinkAnchor}>
                <img
                  src="https://assets-global.website-files.com/60f51ddfd73fc988a699a65a/654b4eda6fa9e8bc144884eb_%E7%9F%A5%E4%B9%8E.svg"
                  loading="lazy"
                  alt=""
                />
              </a>
            </div>
            <div className={socialMediaLink}>
              <a
                href="https://blog.csdn.net/simayi2018"
                className={socialMediaLinkAnchor}>
                <img
                  src="https://assets-global.website-files.com/60f51ddfd73fc988a699a65a/654b4edaa449920caa794dd3_csdn.svg"
                  loading="lazy"
                  alt=""
                />
              </a>
            </div>
            <div className={socialMediaLink}>
              <a
                href="https://author.baidu.com/home/1714919853112873"
                className={socialMediaLinkAnchor}>
                <img
                  src="https://assets-global.website-files.com/60f51ddfd73fc988a699a65a/654b4eda4fb918f2261286e5_%E7%99%BE%E5%AE%B6%E5%8F%B7.svg"
                  loading="lazy"
                  alt=""
                />
              </a>
            </div>

            <div className={socialMediaLink}>
              <a
                href="https://mp.sohu.com/profile?xpt=ZDZiY2MyNDEtYjRkMC00NmM3LTgzOWMtYzk1NDA1MmI4YzU5&amp;_f=index_pagemp_1&amp;spm=smpc.content.author.1.1700119469581t1sfA4A"
                className={socialMediaLinkAnchor}>
                <img
                  src="https://assets-global.website-files.com/60f51ddfd73fc988a699a65a/654b4eda68d7416130b2f0df_%E6%90%9C%E7%8B%90.svg"
                  loading="lazy"
                  alt=""
                />
              </a>
            </div>

            {/* <div className={socialMediaLink}>
              <a href="#" className={socialMediaLinkAnchor}>
                <img
                  src="https://assets-global.website-files.com/60f51ddfd73fc988a699a65a/654b4eda70d1b670ef8c0f45_%E5%BE%AE%E4%BF%A1.svg"
                  loading="lazy"
                  alt=""
                />
                <img
                  src="https://assets-global.website-files.com/60f51ddfd73fc988a699a65a/6555ac27255e99a8fc69685d_%E5%BE%AE%E4%BF%A1%E7%BB%BF.svg"
                  loading="lazy"
                  alt=""
                />
              </a>
            </div> */}

            <div className={socialMediaLink}>
              <a
                href="https://space.bilibili.com/2016400700"
                className={socialMediaLinkAnchor}>
                <img
                  src="https://assets-global.website-files.com/60f51ddfd73fc988a699a65a/654b4eda0a01a8eb464cc2ec_b%E7%AB%99.svg"
                  loading="lazy"
                  alt=""
                />
              </a>
            </div>
          </div>
        </div>
      </Container>
    </BulmaFooter>
  )
}
