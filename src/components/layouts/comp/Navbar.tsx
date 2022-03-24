import * as styles from './navbar.module.scss'

import {
  Navbar as BulmaNavbar,
  Container,
  NavbarBrand,
  NavbarBurger,
  NavbarDropdown,
  NavbarEnd,
  NavbarItem,
  NavbarLink,
  NavbarMenu,
  NavbarStart,
  NavbarItemProps,
} from '@seagreenio/react-bulma'
import {
  FormattedMessage,
  Link,
  changeLocale,
  useIntl,
} from 'gatsby-plugin-react-intl'
import { FC, useEffect, useState } from 'react'
import { graphql, useStaticQuery } from 'gatsby'
import { useDispatch, useSelector } from 'react-redux'

import { Progress } from '@seagreenio/react-bulma'
import { SearchInput } from '../../search/Input'
import clsx from 'clsx'
import { setSearchValue } from 'state'

function LanguageStuff() {
  const { locale } = useIntl()

  const { docInfo, langSwitchable } = useSelector(
    state => state
  ) as any

  const enDisabled = !langSwitchable && locale === 'zh'
  const zhDisabled = !langSwitchable && locale === 'en'
  return (
    <NavbarItem as="div" dropdown hoverable>
      <NavbarLink className={styles.langSwitch}>
        <FormattedMessage id="lang.title" />
      </NavbarLink>

      <NavbarDropdown boxed>
        <NavbarItem
          className={clsx(
            styles.langItem,
            enDisabled && styles.disabled
          )}
          onClick={() => !enDisabled && changeLocale('en')}>
          {enDisabled ? (
            <FormattedMessage id="lang.cannotswitch" />
          ) : (
            <FormattedMessage id="lang.en" />
          )}
        </NavbarItem>

        <NavbarItem
          className={clsx(
            styles.langItem,
            zhDisabled && styles.disabled
          )}
          onClick={() => !zhDisabled && changeLocale('zh')}>
          {zhDisabled ? (
            <FormattedMessage
              id={
                docInfo.type === 'tidbcloud'
                  ? 'lang.cannotswitchtocloud'
                  : 'lang.cannotswitch'
              }
            />
          ) : (
            <FormattedMessage id="lang.zh" />
          )}
        </NavbarItem>
      </NavbarDropdown>
    </NavbarItem>
  )
}

export function Navbar() {
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

  const intl = useIntl()
  const { locale } = intl

  const dispatch = useDispatch()
  const { docInfo, searchValue } = useSelector(
    state => state
  ) as any

  const [showBorder, setShowBorder] = useState(false)
  const [burgerActive, setBurgerActive] = useState(false)

  const handleSetSearchValue = (value: string) =>
    dispatch(setSearchValue(value))

  useEffect(() => {
    const documentElement = document.documentElement

    const scrollListener = () => {
      const progressEl = document.querySelector('progress')
      if (!progressEl) {
        return
      }

      const scrollHeight = documentElement.scrollHeight
      const clientHeight = documentElement.clientHeight
      const scrollTop = documentElement.scrollTop
      const scrolled = scrollTop > 0

      const height = scrollHeight - clientHeight
      if (height === 0) {
        return
      }
      const progress = Number(((scrollTop / height) * 100).toFixed())

      progressEl.value = progress

      setShowBorder(scrolled)
    }

    window.addEventListener('scroll', scrollListener)

    return () => window.removeEventListener('scroll', scrollListener)
  }, [])

  return (
    <BulmaNavbar
      as="nav"
      className={showBorder && styles.hasBorder}
      fixed="top"
      transparent>
      <Container>
        <NavbarBrand>
          <NavbarItem as="a" href="https://merico.cn" target="_blank">
            <img
              className={styles.logo}
              src={logo[locale].publicURL}
              alt="Merico"
            />
          </NavbarItem>

          <NavbarBurger
            className={styles.navbarBurger}
            aria-label="menu"
            aria-expanded={burgerActive}
            active={burgerActive}
            onClick={() => setBurgerActive(!burgerActive)}
          />
        </NavbarBrand>
        <NavbarMenu active={burgerActive}>
          <NavbarStart>
            <NavbarItem
              // @ts-ignore
              as={Link}
              className={styles.main}
              to="/ee/dev/overview">
              <FormattedMessage id="navbar.docs" />
            </NavbarItem>
            <NavbarItem as="a" href="https://www.merico.cn/blog" target="_blank" className={styles.main}>
              <FormattedMessage id="navbar.blog" />
            </NavbarItem>
            <NavbarItem as="a" href="#" target="_blank" className={styles.main}>
              <FormattedMessage id="navbar.freeTrial" />
            </NavbarItem>
            <NavbarItem as="a" href="#" target="_blank" className={styles.main}>
              <FormattedMessage id="navbar.contactUs" />
            </NavbarItem>
          </NavbarStart>

          <NavbarEnd>
            {/* <LanguageStuff /> */}

            {/* <NavbarItem as="div" className="search-input">
              <SearchInput
                docInfo={docInfo}
                searchValue={searchValue}
                setSearchValue={handleSetSearchValue}
              />
            </NavbarItem> */}
          </NavbarEnd>
        </NavbarMenu>
      </Container>

      <Progress
        className={clsx(styles.progress, showBorder && styles.show)}
        color="primary"
        value={0}
        max={100}
      />
    </BulmaNavbar>
  )
}
