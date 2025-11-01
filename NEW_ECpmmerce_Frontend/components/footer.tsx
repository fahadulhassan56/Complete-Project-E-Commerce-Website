import styles from "./footer.module.css"

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          <div className={styles.column}>
            <h3>StyleHub</h3>
            <p>Premium fashion and clothing for everyone.</p>
          </div>
          <div className={styles.column}>
            <h4>Shop</h4>
            <ul className={styles.linkList}>
              <li>
                <a href="#">New Arrivals</a>
              </li>
              <li>
                <a href="#">Best Sellers</a>
              </li>
              <li>
                <a href="#">Sale</a>
              </li>
            </ul>
          </div>
          <div className={styles.column}>
            <h4>Support</h4>
            <ul className={styles.linkList}>
              <li>
                <a href="#">Contact Us</a>
              </li>
              <li>
                <a href="#">FAQ</a>
              </li>
              <li>
                <a href="#">Shipping Info</a>
              </li>
            </ul>
          </div>
          <div className={styles.column}>
            <h4>Legal</h4>
            <ul className={styles.linkList}>
              <li>
                <a href="#">Privacy Policy</a>
              </li>
              <li>
                <a href="#">Terms of Service</a>
              </li>
            </ul>
          </div>
        </div>
        <div className={styles.divider}>
          <p>&copy; 2025 StyleHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
