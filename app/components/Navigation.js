import Link from 'next/link';
import styles from './Navigation.module.css';
import { MdOutlineOutput } from "react-icons/md";

export default function Navigation() {
  return (
    <nav className={styles.nav}>
      <h2 className={styles.title}>
        <Link href="/" className={styles.titleLink}>
          score.dp
        </Link>
      </h2>
      <ul className={styles.list}>
        <li className={styles.listItem}>
          <Link href="https://zasa.sakura.ne.jp/dp/rank.php" className={styles.link}>
            <span className={styles.linkWithIcon}>Rank <MdOutlineOutput /></span>
          </Link>
        </li>
        <li className={styles.listItem}>
          <Link href="/user" className={styles.link}>
            Player
          </Link>
        </li>
        <li className={styles.listItem}>
          <Link href="/data" className={styles.link}>
            Player Data
          </Link>
        </li>
      </ul>
    </nav>
  );
}