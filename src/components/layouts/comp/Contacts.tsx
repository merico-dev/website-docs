import { graphql, useStaticQuery } from 'gatsby'
import * as classes from './contacts.module.scss'

export function Contacts() {
  const qrCodes = useStaticQuery(graphql`
    query {
      wechatQRCode: file(relativePath: { eq: "merico-wechat-qr-code.svg" }) {
        publicURL
      }
      contactQRCode: file(relativePath: { eq: "merico-contact-qr-code.svg" }) {
        publicURL
      }
    }
  `)
  return (
    <div className={classes.contacts}>
      <div className={classes.infoBlock}>
        <img
          src={qrCodes.wechatQRCode.publicURL}
          alt="merico-wechat-qr-code"
          className={classes.qrCode}
        />
        <span className={classes.infoTitle}>关注公众号</span>
      </div>

      <div className={classes.infoBlock}>
        <img
          src={qrCodes.contactQRCode.publicURL}
          alt="merico-wechat-qr-code"
          className={classes.qrCode}
        />
        <span className={classes.infoTitle}>在线咨询</span>
      </div>
      <span className={classes.telTitle}>咨询电话</span>
      <span className={classes.telNumber}>400-863-7426</span>
    </div>
  )
}
